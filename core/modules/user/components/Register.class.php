<?php
/**
 * Содержит класс Register
 *
 * @package energine
 * @subpackage user
 * @author 1m.dm
 * @copyright Energine 2006
 * @version $Id$
 */

/**
 * Форма регистрации
 *
 * @package energine
 * @subpackage user
 * @author 1m.dm
 */
class Register extends DBDataSet {

	/**
	 * Экземпляр класса User
	 *
	 * @var User
	 * @access private
	 */
	protected $user;

	/**
	 * Конструктор класса
	 *
	 * @param string $name
	 * @param string $module
	 * @param Document $document
	 * @param array $params
	 * @access public
	 */
	public function __construct($name, $module,   array $params = null) {
		parent::__construct($name, $module,  $params);
		$this->setAction('save-new-user');
		$this->setType(self::COMPONENT_TYPE_FORM_ADD);
		$this->user = new User();
		$this->setTableName(User::USER_TABLE_NAME);
		$this->addTranslation('TXT_ENTER_CAPTCHA');
	}
	/**
	 * Переопределен параметр active
	 *
	 * @return int
	 * @access protected
	 */

	protected function defineParams() {
		$result = array_merge(parent::defineParams(),
		array(
        'active'=>true,
		));
		return $result;
	}
	/**
     * Метод проверки логина
     * Вызывается AJAXом при заполнении формы регистрации
     *
     * @access protected
     * @return void
     */
	protected function checkLogin(){
		$login = trim($_POST['login']);
            $result = !(bool)simplifyDBResult(
                $this->dbh->select(
                    $this->getTableName(),
                    array('COUNT(u_id) as number'),
                    array('u_name' => $login)
                ),
                'number', 
            true
            );
            $field = 'login';
            $message = ($result)?$this->translate('TXT_LOGIN_AVAILABLE'):$this->translate('TXT_LOGIN_ENGAGED');
            $result = array(
                'result'=> $result,
                'message' => $message,
                'field' => $field,  
        );
        $builder = new JSONCustomBuilder();
        $this->setBuilder($builder);
        $builder->setProperties($result);
	}
	
	
	/**
	 * Обработка возможных ошибок сохранения + редирект на страницу результата
	 *
	 * @return void
	 * @access protected
	 */
	protected function save() {
        //inspect($_SESSION);
		try {
			if(
			 !isset($_SESSION['captchaCode'])
			 ||
			 !isset($_POST['captcha'])
			 ||
			 ($_SESSION['captchaCode'] != sha1(trim($_POST['captcha'])))
			){
			     throw new SystemException('TXT_BAD_CAPTCHA', SystemException::ERR_CRITICAL);
			}
			$this->saveData();
			$_SESSION['saved'] = true;
			$this->response->redirectToCurrentSection('success/');
		}
		catch (SystemException $e) {
			$this->failure($e->getMessage(), $_POST[$this->getTableName()]);
		}
	}
	
	protected function failure($errorMessage, $data){
		$this->getConfig()->setCurrentState('main');
	    $this->prepare();
	    $eFD = new FieldDescription('error_message');
	    $eFD->setMode(FieldDescription::FIELD_MODE_READ);
	    $eFD->setType(FieldDescription::FIELD_TYPE_STRING);
	    $this->getDataDescription()->addFieldDescription($eFD);
	    $this->getData()->load(array(array_merge(array('error_message' => $errorMessage), $data)));
        $this->getDataDescription()->getFieldDescriptionByName('error_message')->removeProperty('title');
	}
	

	/**
	 * Сохранение данных.
	 *
	 * @return array
	 * @access protected
	 */
	protected function saveData() {
		$password = $_POST[$this->getTableName()]['u_password'] = User::generatePassword();
		try {
			$result = $this->user->create($_POST[$this->getTableName()]);
			
            if(isset($_FILES[$this->getTableName()])){
            	$this->user->createAvatar(array_map(function($row){return $row['u_avatar_img'];}, $_FILES[$this->getTableName()]));
            }
			$mailer = new Mail();
			$mailer->setFrom($this->getConfigValue('mail.from'));
			$mailer->setSubject($this->translate('TXT_SUBJ_REGISTER'));
			$mailer->setText(
			$this->translate('TXT_BODY_REGISTER'),
			array(
			     'login' => $this->user->getValue('u_name'), 
			     'name' => $this->user->getValue('u_fullname'),
			     'password' => $password
			)
			);
			$mailer->addTo($this->user->getValue('u_name'));
			$mailer->send();

		}
		catch (Exception $error) {
			throw new SystemException($error->getMessage(), SystemException::ERR_WARNING);
		}
	}

	/**
	 * Получает список доступных полей из таблицы пользователей и генерит форму
	 *
	 * @return void
	 * @access protected
	 */
	protected function prepare() {
		parent::prepare();
		//u_id и u_is_active нам не нужны ни при каких раскладах
		if ($this->getDataDescription()->getFieldDescriptionByName('u_id')) {
			$this->getDataDescription()->removeFieldDescription($this->getDataDescription()->getFieldDescriptionByName('u_id'));
		}

		if ($this->getDataDescription()->getFieldDescriptionByName('u_is_active')) {
			$this->getDataDescription()->removeFieldDescription($this->getDataDescription()->getFieldDescriptionByName('u_is_active'));
		}
		//Тут таки нужно вернуться к параметру confirmationNeeded
		if ($this->getDataDescription()->getFieldDescriptionByName('u_password')) {
			$this->getDataDescription()->removeFieldDescription($this->getDataDescription()->getFieldDescriptionByName('u_password'));
		}
		$this->getDataDescription()->getFieldDescriptionByName('u_name')->setType(FieldDescription::FIELD_TYPE_EMAIL);
	}

	/**
	 * Выводит результат регистрации.
	 *
	 * @return void
	 * @access protected
	 */
	protected function success() {
		//если в сессии нет переменной saved значит этот метод пытаются вызвать напрямую. Не выйдет!
		if (!isset($_SESSION['saved'])) {
			throw new SystemException('ERR_404', SystemException::ERR_404);
		}
		//unset($_SESSION['saved']);
		if ($textBlock = $this->document->componentManager->getBlockByName('RegTextBlock')) {
			$textBlock->disable();
		}
		$this->setBuilder($this->createBuilder());

		$dataDescription = new DataDescription();
		$ddi = new FieldDescription('success_message');
		$ddi->setType(FieldDescription::FIELD_TYPE_TEXT);
		$ddi->setMode(FieldDescription::FIELD_MODE_READ);
		$ddi->removeProperty('title');
		$dataDescription->addFieldDescription($ddi);

		$data = new Data();
		$di = new Field('success_message');
		$di->setData($this->translate('TXT_USER_REGISTRED'));
		$data->addField($di);

		$this->setDataDescription($dataDescription);
		$this->setData($data);
	}


}
