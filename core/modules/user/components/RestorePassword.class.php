<?php
/**
 * Содержит класс RestorePassword
 *
 * @package energine
 * @subpackage user
 * @author dr.Pavka
 * @copyright Energine 2006
 * @version $Id$
 */


/**
 * Форма восстановления пароля
 *
 * @package energine
 * @subpackage user
 * @author dr.Pavka
 */
class RestorePassword extends DataSet {
    /**
     * Конструктор класса
     *
     * @param string $name
     * @param string $module
     * @param Document $document
     * @param array $params
     * @access public
     */
    public function __construct($name, $module, Document $document,  array $params = null) {
        parent::__construct($name, $module, $document,  $params);
        $this->setDataSetAction('send');
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
     * Отправляет новый пароль на указанный email
     *
     * @return void
     * @access protected
     */

    protected function send() {
        $this->document->componentManager->getBlockByName('breadCrumbs')->addCrumb();
        if ($component = $this->document->componentManager->getBlockByName('textBlockRestorePassword')) {
         	$component->disable();
         }
        if (!isset($_POST['u_name'])) {
            $message = $this->translate('ERR_NO_U_NAME');
        }
        else {
            $uName = $_POST['u_name'];
            $UID = simplifyDBResult($this->dbh->select('user_users', 'u_id', array('u_name'=>$uName)), 'u_id', true);
            if (!$UID) {
                $message = $this->translate('ERR_NO_U_NAME');
            }
            else {
                $password = User::generatePassword();
                $this->dbh->modify(QAL::UPDATE, 'user_users', array('u_password'=>sha1($password)), array('u_id'=>$UID));
                $mailer = new Mail();
                $mailer->setFrom($this->getConfigValue('mail.from'))->
                    setSubject($this->translate('TXT_SUBJ_RESTORE_PASSWORD'))->
                    setText($this->translate('TXT_BODY_RESTORE_PASSWORD'),compact('password'))->
                    addTo($uName);
                $message = $this->translate('MSG_PASSWORD_SENT');
                try {
                    $mailer->send();
                }
                catch (Exception $e) {
                    $message = $e->getMessage();
                }
            }
        }
        $this->prepare();
        $messageField = new Field('restore_password_result');
        $messageField->setData($message);
        $this->getData()->addField($messageField);
    }
}
