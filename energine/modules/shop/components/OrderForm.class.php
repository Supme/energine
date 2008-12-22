<?php
/**
 * Содержит класс OrderForm
 *
 * @package energine
 * @subpackage shop
 * @author dr.Pavka
 * @copyright ColoCall 2006
 * @version $Id$
 */

//require_once('core/modules/share/components/DBDataSet.class.php');
//require_once('core/modules/shop/components/Order.class.php');
//require_once('core/modules/shop/components/CurrencyConverter.class.php');
//require_once('core/framework/Mail.class.php');

/**
 * Предназначен для формирования заказа пользователем
 *
 * @package energine
 * @subpackage shop
 * @author dr.Pavka
 */
class OrderForm extends DBDataSet {
    /**
     * Корзина
     *
     * @var Order
     * @access protected
     */
    protected $order;
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
        $this->setType(self::COMPONENT_TYPE_FORM_ADD);
        $this->order = new Order();
        $this->setTableName(Order::ORDER_TABLE_NAME);
        $this->setDataSetAction('save-order');
        $this->setTitle($this->translate('TXT_ORDER_FORM'));
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
     * Если корзина - пуста то что заказывать?
     *
     * @return void
     * @access protected
     */

     protected function main() {
        if (!Basket::getInstance()->getContents(false)) {
            throw new SystemException('ERR_BASKET_IS_EMPTY', SystemException::ERR_CRITICAL);
        }
        parent::main();
     }

    /**
     * Подтягиваем перечень полей из таблицы пользователей
     *
     * @return mixed
     * @access protected
     */

    protected function loadDataDescription() {
        $result = parent::loadDataDescription();
        foreach (array_keys($result) as $fieldName) {
        	if (!in_array($fieldName, array('order_id', 'order_delivery_comment'))) {
        		unset($result[$fieldName]);
        	}
        }
        $result = array_merge($result, $this->dbh->getColumnsInfo('user_users'));
        unset($result['u_is_active'], $result['u_password']);
        $commentField = $result['order_delivery_comment'];
        unset($result['order_delivery_comment']);
        $result['order_delivery_comment'] = $commentField;
        return $result;
    }

    /**
	 * Если пользователь аутентифицирован загружаем его данные из объекта AuthUser
	 *
	 * @return Data
	 * @access protected
	 */

    protected function createData() {
        $result = false;
        $user = $this->document->getUser();

        if ($user->isAuthenticated()) {
            $result = new Data();
            foreach (array_keys($user->getFields()) as $fieldName) {
            	$data[$fieldName] = $user->getValue($fieldName);
            }
            $result->load(array($data));

        }
        return $result;
    }

    /**
     * Сохраняет данные о заказе
     *
     * @return void
     * @access protected
     */

    protected function save() {
        try {
            $this->dbh->beginTransaction();

            if (!isset($_POST[$this->getTableName()])) {
                throw new SystemException('ERR_DEV_NO_DATA', SystemException::ERR_WARNING);
            }
            $request = Request::getInstance();
            $data = $_POST[$this->getTableName()];
            $userData = $_POST['user_users'];
            if (!$this->document->getUser()->isAuthenticated()) {
                $newUser = new User();
                $newUser->create(array_merge($userData, array('u_password'=>User::generatePassword())));
                $this->order->setUser($newUser);
            }
            else {
                $this->order->setUser($this->document->getUser());
            }


            $data['order_id'] = $this->order->create(array_merge($userData, array('order_delivery_comment'=>$data['order_delivery_comment'])));
            $this->sendNotification(array_merge($userData, $data));
            $_SESSION['order_saved'] = true;
            $this->order->getBasket()->purify();

            $this->dbh->commit();
            $this->response->redirectToCurrentSection('success/');
        }
        catch (Exception $error) {
            $this->dbh->rollback();
            $this->failure($error->getMessage());
        }

    }

    /**
     * Метод отрабатывающий если что то не так пошло
     *
     * @return void
     * @access protected
     */

    protected function failure($errors) {
        $this->setBuilder($this->createBuilder());

        $dataDescription = new DataDescription();
        $ddi = new FieldDescription('message');
        $ddi->setType(FieldDescription::FIELD_TYPE_TEXT);
        $ddi->setMode(FieldDescription::FIELD_MODE_READ);
        $ddi->removeProperty('title');
        $dataDescription->addFieldDescription($ddi);

        $data = new Data();
        $di = new Field('message');
        $di->setData($this->translate('MSG_ORDER_FAILED').$errors);
        $data->addField($di);

        $this->setDataDescription($dataDescription);
        $this->setData($data);

        if ($component = $this->document->componentManager->getComponentByName('textBlock_order')) {
            $component->disable();
        }

        if ($component = $this->document->componentManager->getComponentByName('basket')) {
            $component->disable();
        }
    }

    /**
	 * Метод выводящий сообщение об успешном сохранении данных
	 *
	 * @return void
	 * @access protected
	 */

    protected function success() {
        //если в сессии нет переменной saved значит этот метод пытаются дернуть напрямую. Не выйдет!
        if (!isset($_SESSION['order_saved'])) {
            throw new SystemException('ERR_404', SystemException::ERR_404);
        }
        //Мавр сделал свое дело...
        unset($_SESSION['order_saved']);
        $this->setBuilder($this->createBuilder());

        $dataDescription = new DataDescription();
        $ddi = new FieldDescription('success_message');
        $ddi->setType(FieldDescription::FIELD_TYPE_TEXT);
        $ddi->setMode(FieldDescription::FIELD_MODE_READ);
        $ddi->removeProperty('title');
        $dataDescription->addFieldDescription($ddi);

        $data = new Data();
        $di = new Field('success_message');
        $di->setData($this->translate('TXT_ORDER_SEND'));
        $data->addField($di);

        $this->setDataDescription($dataDescription);
        $this->setData($data);

        if ($component = $this->document->componentManager->getComponentByName('textBlock_order')) {
            $component->disable();
        }
        if ($component = $this->document->componentManager->getComponentByName('basket')) {
            $component->disable();
        }
    }

    /**
     * Отправка уведомления о заказе
     *
     * @param array
     * @return bool
     * @access protected
     */

    protected function sendNotification($data) {
        $body = $this->buildClientMailBody($data);
        $mail = new Mail();
        $mail->setFrom($this->getConfigValue('mail.from'));
        $mail->addTo($data['u_name']);
        $mail->setSubject($this->translate('TXT_ORDER_CLIENT_SUBJECT'));
        $mail->setText($body);
        $mail->send();
        if ($managerEmail = $this->getConfigValue('mail.manager')) {
            $mail = new Mail();
            $mail->setFrom($this->getConfigValue('mail.from'));
            $managerEmails = explode(' ', $managerEmail);

            foreach ($managerEmails as $email) {
                $mail->addTo($email);
            }
            $mail->setSubject($this->translate('TXT_ORDER_MANAGER_SUBJECT'));
            $body = $this->buildManagerMailBody($data);
            $mail->setText($body);
            $mail->send();
        }

        return true;
    }

    /**
      * Возвращает текст письма отправляемого пользователю при отправке заказа
      * Вынесено в отдельный метод для облегчения переписывания с потомках
      *
      * @return string
      * @access protected
      */

    protected function buildClientMailBody($data) {
        $result = '';
        $basketHTML = $this->buildBasketHTML();
        if ($this->order->getUser()->getValue('u_password') === true) {
            $result = sprintf($this->translate('TXT_ORDER_CLIENT_MAIL_BODY'), $data['order_id'], $data['u_name'], $data['u_contact_person'], $data['u_phone'], $data['u_address'], $data['order_delivery_comment'], $basketHTML);
        }
        else {
            $result = sprintf($this->translate('TXT_ORDER_NEW_CLIENT_MAIL_BODY'), $data['u_name'], $this->order->getUser()->getValue('u_password'), $data['order_id'], $data['u_name'], $data['u_contact_person'], $data['u_phone'], $data['u_address'], $data['order_delivery_comment'], $basketHTML);
        }
        return $result;
    }


    /**
     * Возвращает текст письма администратору
     *
     *
     * @param array $data
     * @return string
     * @access protected
     */
    protected function buildManagerMailBody($data) {
        $result = '';
        $basketHTML = $this->buildBasketHTML();
        $result = sprintf($this->translate('TXT_ORDER_MANAGER_MAIL_BODY'), $data['order_id'], $data['u_name'], $data['u_contact_person'], $data['u_phone'], $data['u_address'], $data['order_delivery_comment'], $basketHTML);
        return $result;
    }

    /**
     * Возвращает содержимое корзины в HTML
     *
     * @return string
     * @access protected
     */
    protected function buildBasketHTML() {
        $converter = CurrencyConverter::getInstance();
        $discounts = Discounts::getInstance();
        $contents = $this->order->getBasket()->getContents();
        $basketHTML = '<table border="1">';
        $basketHTML .= '<thead><tr>';
        $basketHTML .= '<td>'.$this->translate('FIELD_PRODUCT_NAME').'</td><td>'.$this->translate('FIELD_BASKET_COUNT').'</td><td>'.$this->translate('FIELD_PRODUCT_PRICE').'</td><td>'.$this->translate('FIELD_PRODUCT_SUMM').'</td>';
        $basketHTML .= '</tr></thead><tbody>';
        $summ = 0;
        foreach ($contents as $key => $productInfo) {
            $basketHTML .= '<tr>';
            $basketHTML .= '<td>'.$productInfo['product_name'] .'</td>';
            $basketHTML .= '<td>'.$productInfo['basket_count'] .'</td>';
            $basketHTML .= '<td>'.$productInfo['product_price'] .'</td>';
            $basketHTML .= '<th>'.$productInfo['product_summ'] .'</th>';
            $basketHTML .= '</tr>';
            $summ += $productInfo['product_summ'];
        }
        $basketHTML .= '</tbody>';
        $basketHTML .= '<tfoot>';
        $basketHTML .= '<tr><td colspan="3">'.$this->translate('TXT_BASKET_SUMM').'</td><td>'.$converter->format($summ, $converter->getIDByAbbr('HRN')).'</td></tr>';
        if ($discounts->getDiscountForGroup() > 0) {
            $basketHTML .= '<tr><td colspan="3">'.$this->translate('TXT_BASKET_SUMM_WITH_DISCOUNT').' '.$discounts->getDiscountForGroup().'%</td><td>'.number_format($discounts->calculateCost($summ), 2, '.', ' ').'</td></tr>';
        }
        $basketHTML .= '</tfoot>';
        $basketHTML .= '</table>';
        return $basketHTML;
    }
}
