<?php

/**
 * Класс Group.
 *
 * @package energine
 * @subpackage core
 * @author 1m.dm
 * @copyright Energine 2006
 * @version $Id$
 */

//require_once('core/framework/DBWorker.class.php');

/**
 * Группы пользователей.
 *
 * @package energine
 * @subpackage core
 * @author 1m.dm
 * @final
 */
final class UserGroup extends Singleton {

    /**
     * @access private
     * @var int идентификатор группы для гостей
     */
    private $defaultGuestGroup = false;

    /**
     * @access private
     * @var int идентификатор группы для аутентифицированных пользователей
     */
    private $defaultUserGroup = false;

    /**
     * @access private
     * @var array информация о всех существующих группах пользователей
     * @see UserGroup::__construct()
     */
    private $groups;


    /**
     * Конструктор класса.
     *
     * @access public
     * @return void
     */
    public function __construct() {
        parent::__construct();
        /*
         * Загружаем инфомацию о группах пользователей в структуру вида:
         *     array(
         *         $group_id => array(group info)
         *     );
         */
        $this->groups = convertDBResult($this->dbh->select('user_groups'), 'group_id', true);
    }
    /**
     * Возвращает перечень групп
     *
     * @return array
     * @access public
     */

    public function asArray() {
        return $this->groups;
    }

    /**
     * Возвращает идентификатор группы для гостей.
     *
     * @access public
     * @return int
     */
    public function getDefaultGuestGroup() {
        if (!$this->defaultGuestGroup) {
            $result = false;
            foreach ($this->groups as $groupId => $groupInfo) {
                if ($groupInfo['group_default'] == 1) {
                    $result = $groupId;
                    break;
                }
            }
            if ($result == false) {
            	throw new SystemException('ERR_DEV_NO_DEFAULT_GROUP', SystemException::ERR_CRITICAL);
            }
            $this->defaultGuestGroup = $result;
        }
        return (int)$this->defaultGuestGroup;
    }

    /**
     * Возвращает идентификатор группы для аутентифицированных пользователей.
     *
     * @access public
     * @return int
     */
    public function getDefaultUserGroup() {
        if (!$this->defaultUserGroup) {
            $result = false;
            foreach ($this->groups as $groupId => $groupInfo) {
                if ($groupInfo['group_user_default'] == 1) {
                    $result = $groupId;
                    break;
                }
            }
            if ($result == false) {
            	throw new SystemException('ERR_DEV_NO_DEFAULT_USER_GROUP', SystemException::ERR_CRITICAL);
            }
            $this->defaultUserGroup = $result;
        }
        return $this->defaultUserGroup;
    }

    /**
     * Возвращает набор групп, к которым принадлежит пользователь.
     *
     * @param int идентификатор пользователя
     * @access public
     * @return array
     */
    public function getUserGroups($userId = false) {
        static $cachedGroups = array();
        if (!isset($cachedGroups[$userId])) {
            $cachedGroups[$userId] = array($this->getDefaultGuestGroup());
            if (!empty($userId)) {
                $res = $this->dbh->select('user_user_groups', array('group_id'), array('u_id' => $userId));
                if (is_array($res)) {
                    $cachedGroups[$userId] = simplifyDBResult($res, 'group_id');
                }
            }
        }

        return $cachedGroups[$userId];
    }

    /**
     * Возвращает информацию о группе.
     *
     * @access public
     * @return array
     */
    public function getInfo($groupId) {
        $result = array();
        if (isset($this->groups[$groupId])) {
            $result = $this->groups[$groupId];
        }
        return $result;
    }

    /**
      * Возвращает перечень идентификаторов пользователей в группе
      *
      * @return array
      * @access public
      */

    public function getMembers($groupID){
        $result = array();
    	$members = simplifyDBResult($this->dbh->select('user_user_groups', array('u_id'), array('group_id'=>$groupID)), 'u_id');
    	if (is_array($members)) {
    		foreach ($members as $memberID) {
    		    $member = new User($memberID);
    		    if ($member->getValue('u_is_active') == 1) {
    		      $result[] = $member;
    		    }

    		}
    	}
    	return $result;
    }
}
