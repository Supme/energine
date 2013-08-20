<?php
/**
 * Содержит класс LoginForm
 *
 * @package energine
 * @subpackage user
 * @author dr.Pavka
 * @copyright Energine 2006
 * @version $Id$
 */


/**
 * Вывод формы авторизации
 *
 * @package energine
 * @subpackage user
 * @author dr.Pavka
 */
class LoginForm extends DataSet implements SampleLoginForm {
    /**
     * Конструктор
     *
     * @param string $name
     * @param string $module
     */
    public function __construct($name, $module, array $params = null) {
        $params['state'] = E()->getDocument()->user->isAuthenticated() ? 'showLogoutForm' : 'showLoginForm';
        parent::__construct($name, $module, $params);
        $this->setTitle($this->translate('TXT_LOGIN_FORM'));
        $base = E()->getSiteManager()->getCurrentSite()->base;
        if (strpos($currDomain = E()->getSiteManager()->getCurrentSite()->host, Object::_getConfigValue('site.domain')) === false) {
            $base = 'http://' . Object::_getConfigValue('site.domain') . '/';
        }

        $this->setAction($base . 'auth.php' . ((isset($_SERVER['HTTP_REFERER'])) ? '' : '?return=' . (($return = $this->getParam('successAction')) ? $return : E()->getRequest()->getURI())),true);
    }

    /**
     * Добавлены:
     * Параметр successAction - УРЛ на который происходит переадресация в случае успеха
     *
     * @return array
     * @access protected
     */
    protected function defineParams() {
        return array_merge(
            parent::defineParams(),
            array(
                'successAction' => false
            )
        );
    }

    /**
     * Вывод формы авторизации
     *
     * @return type
     * @access public
     */

    public function showLoginForm() {
        $this->prepare();
        if (isset($_COOKIE[UserSession::FAILED_LOGIN_COOKIE_NAME])) {
            $messageField = new FieldDescription('message');
            $messageField->setType(FieldDescription::FIELD_TYPE_STRING);
            $this->getDataDescription()->addFieldDescription($messageField);
            $messageField->setRights(FieldDescription::FIELD_MODE_READ);

            $messageField = new Field('message');
            $messageField->addRowData($this->translate('ERR_BAD_LOGIN'));
            $this->getData()->addField($messageField);
            E()->getResponse()->deleteCookie(UserSession::FAILED_LOGIN_COOKIE_NAME);
        }

        //Во избежание появления empty рекордсета
        $f = new Field('username');
        $f->setData('');
        $this->getData()->addField($f);
        //Если есть информация о авторизации через фейсбук
        foreach (array('auth.facebook', 'auth.vk') as $configSectionName) {
            list($tbr) = array_values($this->getToolbar());
            if ($ctrl = $tbr->getControlByID($configSectionName)) $ctrl->disable();

            if ($ctrl && $this->getConfigValue($configSectionName)) {
                if ($appID = $this->getConfigValue($configSectionName . '.appID')) {
                    $ctrl->setAttribute('appID', $appID);
                    $ctrl->enable();
                }

            }
        }
    }


    /**
     * Вывод формы logout
     *
     * @return type
     * @access public
     */

    public function showLogoutForm() {
        //$request = E()->getRequest();
        //$this->setTitle($this->translate('TXT_LOGOUT'));
        $this->addTranslation('TXT_USER_GREETING', 'TXT_USER_NAME', 'TXT_ROLE_TEXT');
        //$this->setAction(E()->getSiteManager()->getCurrentSite()->base, true);
        $this->prepare();
        /*foreach (E()->UserGroup->getUserGroups($this->document->user->getID()) as $roleID) {
            $tmp = E()->UserGroup->getInfo($roleID);
            $data[] = $tmp['group_name'];
        }

        $this->getData()->getFieldByName('role_name')->setData(implode(', ', $data));*/
    }

    protected function loadData() {
        $result = false;
        switch ($this->getState()) {
            case 'showLogoutForm':
                foreach ($this->getDataDescription()->getFieldDescriptionList() as $fieldName) {

                    $result[] = array($fieldName => $this->document->user->getValue($fieldName));
                }
                break;
            default:
                $result = parent::loadData();
        }
        return $result;
    }
}

/**
 * Фейковый интерфейс для формы логина
 */
interface SampleLoginForm {
}