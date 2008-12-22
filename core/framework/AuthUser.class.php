<?php

/**
 * Класс AuthUser.
 *
 * @package energine
 * @subpackage core
 * @author 1m.dm
 * @copyright ColoCall 2006
 * @version $Id$
 */

//require_once('core/framework/User.class.php');

/**
 * Аутентифицированный пользователь.
 *
 * @package energine
 * @subpackage core
 * @author 1m.dm
 * @final
 */
final class AuthUser extends User {
    /**
     * Флаг показывающий залогинился ли пользователь только что
     *
     * @var bool
     * @access private
     */
    private $isJustNowAuthenticated = false;
    /**
     * @access private
     * @static
     * @var AuthUser единый для всей системы экземпляр класса AuthUser
     */
    private static $instance;

    /**
     * Возвращает единый для всей системы экземпляр класса AuthUser.
     * См. паттерн проектирования Singleton.
     *
     * @access public
     * @static
     * @return AuthUser
     */
    public static function getInstance() {
        if (!isset(self::$instance)) {
            self::$instance = new AuthUser;
        }
        return self::$instance;
    }

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
        //Если пришел флаг  - отлогиниться
        if (isset($_POST['user']['logout']) || isset($_GET['user']['logout'])) {
            //Очищаем информацию о пользователе
            $this->clearInfo();
            return;
        }
        elseif (isset($_SESSION['userID'])) {
            $id = $_SESSION['userID'];
        }
        elseif (isset($_COOKIE['user'])) {
            $response = Response::getInstance();
            try {
                $user = unserialize($_COOKIE['user']);
                if (isset($user[0], $user[1]) && !$id = $this->authenticate($user[0], $user[1], true)) {
                    $response->deleteCookie('user', $this->getConfigValue('site.root'));
                }
            }
            catch (Exception $e){
                $response->deleteCookie('user', $this->getConfigValue('site.root'));
            }
        }
        elseif (isset($_POST['user']['login']) && isset($_POST['user']['username']) && isset($_POST['user']['password'])) {
            $id = $this->authenticate(
                $_POST['user']['username'],
                sha1($_POST['user']['password']),
                (empty($_POST['user']['remember']) ? false : true)
            );
            //stop($_POST['user']['remember']);
            $this->isJustNowAuthenticated = true;
        }
        
        $this->loadInfo($id);
    }

    /**
     * Возвращает значение isJustNowAuthenticated
     *
     * @return bool
     * @access public
     */

    public function isNowAuthenticated() {
        return $this->isJustNowAuthenticated;
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
        return ($this->getID() === false)? false : true;
    }

    /**
     * Аутентифицирует пользователя по его имени и SHA-1 хэшу пароля.
     * Если флаг $remember установлен в true, при успешной аутентификации
     * клиенту устанавливаются cookie с информацией о его аккаунте на 30 дней,
     * для автоматизации процедуры входа при последующих посещениях сайта.
     * Возвращает флаг успеха аутентификации.
     *
     * @access public
     * @param string $username имя пользовате
     * @param string $password SHA-1 хэш пароля
     * @param boolean $remember
     * @return mixed
     */
    public function authenticate($username, $password, $remember = false) {
    	$username = trim($username);
        $result = $this->dbh->select(
            'user_users', 'u_id',
            array(
                'u_name' => $username,
                'u_password' => $password,
                'u_is_active' => 1
            )
        );
        if (!is_array($result)) {
            return false;
        }
        $id = simplifyDBResult($result, 'u_id', true);
        if ($remember) {
            $response = Response::getInstance();
            $response->setCookie(
                'user',
                serialize(array($username, $password)),
                time() + (3600 * 24 * 30),
                $this->getConfigValue('site.root')
            );
        }
        $_SESSION['userID'] = $id;
        return $id;
    }

    /**
     * Очищает всю информацию о пользователе из сессии, cookie.
     *
     * @access public
     * @return boolean
     */
    public function clearInfo() {
        if (isset($_SESSION['userID'])) {
        	unset($_SESSION['userID']);
        }
        if (isset($_COOKIE['user'])) {
            $response = Response::getInstance();
            $response->deleteCookie('user', $this->getConfigValue('site.root'));
        }
    }
}
