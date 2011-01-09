<?php

/**
 * Класс AuthUser.
 *
 * @package energine
 * @subpackage core
 * @author 1m.dm
 * @copyright Energine 2006
 */


/**
 * Аутентифицированный пользователь.
 *
 * @package energine
 * @subpackage core
 * @author 1m.dm
 */
class AuthUser extends User {
    /**
     * Путь к корню сайта, чтоб по 10 раз за ним не обращаться через сайт менеджер
     *
     * @access private
     * @var string
     */
    private $siteRoot;
    /**
     * Флаг показывающий залогинился ли пользователь только что
     *
     * @var bool
     * @access private
     */
    private $isJustNowAuthenticated = false;


    /**
     * Конструктор класса.
     * параметр введен только для избежания strict ошибки
     *
     * @param false
     * @access private
     * @return void
     * @todo избавиться от hardcoded имен полей формы?
     */
    public function __construct($id = false) {
        parent::__construct(false);
        $this->siteRoot = SiteManager::getInstance()->getCurrentSite()->root;
        //Если пришел флаг  - отлогиниться
        if (isset($_POST['user']['logout']) || isset($_GET['logout'])) {
            //Очищаем информацию о пользователе
            $this->clearInfo();
            return;
        }
        elseif (isset($_SESSION['userID'])) {
            $id = $_SESSION['userID'];
        }

        if ($id)
            $this->loadInfo($id);
    }

    /**
     * Возвращает флаг успеха аутентификации:
     *     true - пользователь успешно аутентифицирован;
     *     false - пользователь является гостем.
     *
     * @access public
     * @return boolean
     */
    public function isAuthenticated() {
        return ($this->getID() === false) ? false : true;
    }


    /**
     * Аутентифицирует пользователя по его имени и SHA-1 хэшу пароля.
     *      *
     * @access public
     * @param string $username имя пользовате
     * @param string $password SHA-1 хэш пароля
     * @return bool | int
     * @static
     */
    public static function authenticate($username, $password) {
        $username = trim($username);
        $password = sha1(trim($password));
        //Проверяем совпадает ли имя/пароль в SHA1 с данными в таблице
        if($id = simplifyDBResult(E()->getDB()->select(
            'user_users', array('u_id'),
            array(
                'u_name' => $username,
                'u_password' => $password,
                'u_is_active' => 1
            )
        ), 'u_id', true)) {
            return (int)$id; 
        }
        else {
            return false;
        }
    }

    public static function createSession($UID){
        $setECookie = function($cookieValue, $cookieExpires, $cookieName = UserSession::DEFAULT_SESSION_NAME){
            if ($domain = Object::_getConfigValue('site.domain')) {
                $path = '/';
                $domain = '.' . $domain;
            }
            else {
                $path = SiteManager::getInstance()->getCurrentSite()->root;
                $domain = '';
            }

            E()->getResponse()->addCookie(
                $cookieName,
                $cookieValue,
                $cookieExpires,
                $path,
                $domain
            );
        };

        if($UID){
            
        }
        else{
            //В случае если !$UID
            //бросаем
            //1.Просроченную куку для удаления аутентификационной инфы
            $setECookie('', 0);
            //2.куки с ифнормацией о том что вход не удался
            $setECookie('Ошибка авторизации', time() + 60, 'login_attempt');
            //- сессия в БД не создается

        }
    }


    /**
     * Очищает всю информацию о пользователе из сессии, cookie.
     *
     * @access public
     * @return boolean
     */
    public function clearInfo() {
        $response = E()->getResponse();
        $UID = false;
        if (isset($_SESSION['userID'])) {
            $UID = $_SESSION['userID'];
            unset($_SESSION['userID']);
        }

        if (isset($_COOKIE[UserSession::DEFAULT_SESSION_NAME])) {
            $response->deleteCookie(UserSession::DEFAULT_SESSION_NAME, $this->siteRoot);
        }

        if (isset($_COOKIE['user'])) {
            $response->deleteCookie('user', $this->siteRoot);
        }
        if ($UID)
            $this->dbh->modify(QAL::DELETE, 'share_session', null, array('u_id' => $UID));
        if (isset($_SESSION))
            session_destroy();
    }
}
