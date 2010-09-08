<?php 
/**
 * Содержит класс ForumTheme
 *
 * @package energine
 * @subpackage forum
 * @author sign
 */

 /**
  * Темы форума
  *
  * @package energine
  * @subpackage forum
  * @author sign
  */
class ForumTheme extends DBDataSet {
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
        $params['active'] = true;
        parent::__construct($name, $module, $document,  $params);
        $this->setTableName('forum_theme');
    }

    /**
     * Список тем по  smap_id  с последним комментом и инфой об авторе коммента
     * @param  int $smapId
     * @param  array $limit int[]{2}
     * @return mixed
     */
    private function loadThemeBySmapid($smapId, array $limit = null){
        $limitStr = $limit ? 'LIMIT '. implode(',', $limit) : '';
        $sql =
            'SELECT t.*, c.comment_created, c.comment_name, u.u_id,
                IF(LENGTH(TRIM(u.u_nick)), u.u_nick, u.u_name) u_name,
                u.u_avatar_img
            FROM forum_theme t
                LEFT JOIN forum_theme_comment c ON c.comment_id = t.comment_id
                LEFT JOIN user_users u ON u.u_id = c.u_id
            WHERE t.smap_id = %s
        ';
        return $this->dbh->selectRequest($sql, $smapId);
    }

    /**
     * @return void
     */
    protected function prepare(){
        parent::prepare();
        if(in_array($this->getAction(), array('main', 'view'))){
            $this->getDataDescription()->getFieldDescriptionByName('smap_id')->setType(FieldDescription::FIELD_TYPE_INT);
            $this->getDataDescription()->getFieldDescriptionByName('u_id')->setType(FieldDescription::FIELD_TYPE_INT);

            $this->addDescription();

            if(AuthUser::getInstance()->isAuthenticated()){
                $this->setProperty('is_can_create_theme', 1);
            }

            if($this->getAction() == 'main'){
                $this->addTranslation('FORUM_SUBCATEGORY');
                $this->addTranslation('FORUM_CREATE_THEME');
                $this->addTranslation('FORUM_LAST_POST');
                $this->addTranslation('FORUM_CREATED');
            }
            elseif($this->getAction() == 'view'){
                $this->addTranslation('FORUM_DELETE_THEME');
                $this->addTranslation('FORUM_EDIT_THEME');
                $this->addTranslation('FORUM_ANSWERS');
            }
        }
        elseif(in_array($this->getAction(), array('modify'))){
            $this->getDataDescription()->getFieldDescriptionByName('theme_text')->setType(FieldDescription::FIELD_TYPE_TEXT);
        }
    }

    /**
     * @return SimpleBuilder
     */
    protected function createBuilder() {
		return new SimpleBuilder($this->getTitle());
	}


    protected function view(){
        $this->addPropertyCurrUser();
        parent::view();

        // добавляем комментарии
        if($comments = CommentsHelper::createInstanceFor($this->getTableName())) {
            $comments->createAndAddField(
                $this->getDataDescription(),
                $this->getData(),
                $this->getData()->getFieldByName('theme_id')->getData()
            );
        }
    }

    protected function loadData(){
        $data = false;
        if($this->getAction() == 'view'){
            $themeId = $this->getActionParams();
        	list($themeId) = $themeId;
            $data = $this->loadTheme($themeId);
        }
        if($this->getAction() == 'main'){
            $smapId = $this->document->getID();
            $data = $this->loadThemeBySmapid($smapId);
        }
        else{
            $data = parent::loadData();
        }
        return $data;
    }

    /**
     * Одна тема с последним комментом и инфой об авторе коммента
     * @param  int $themeId
     * @return array|bool
     */
    private function loadTheme($themeId){
        $langId = Language::getInstance()->getCurrent();
        $sql = 'SELECT t.*, c.comment_created, c.comment_name,
            st.smap_name category_name,
            u.u_id,
            IF(LENGTH(TRIM(u.u_nick)), u.u_nick, u.u_name) u_name,
            u.u_avatar_img
        FROM forum_theme t
            JOIN share_sitemap_translation  st ON st.smap_id = t.smap_id
            LEFT JOIN forum_theme_comment c ON c.comment_id = t.comment_id
            LEFT JOIN user_users u ON u.u_id = c.u_id
        WHERE t.theme_id = %s and st.lang_id = %s
        ';
        return $this->dbh->selectRequest($sql, $themeId, $langId);
    }

    /**
     * Добавляем к теме дополнительные поля
     * @return void
     */
    private function addDescription(){
        $descriptions =  array(
            'u_id' =>           FieldDescription::FIELD_TYPE_INT,
            'category_name' =>     FieldDescription::FIELD_TYPE_STRING,
            'comment_num' =>    FieldDescription::FIELD_TYPE_INT,
//            'comment_id' =>     FieldDescription::FIELD_TYPE_INT,
            'comment_created' =>FieldDescription::FIELD_TYPE_DATETIME,
            'comment_name' =>   FieldDescription::FIELD_TYPE_TEXT,
            'u_name' =>         FieldDescription::FIELD_TYPE_STRING,
            'u_avatar_img' =>   FieldDescription::FIELD_TYPE_IMAGE,
        );

        foreach($descriptions as $name => $fieldType){
            $fd = new FieldDescription($name);
            $fd->setType($fieldType);
            $this->getDataDescription()->addFieldDescription($fd);
        }
    }


	protected function create(){
        if(!AuthUser::getInstance()->isAuthenticated()){
			// @todo add SystemException::ERR_401
			throw new SystemException('ERR_404', SystemException::ERR_404);
		}

        $this->setType(self::COMPONENT_TYPE_FORM_ADD);
        $this->prepare();
        $this->setDataSetAction("save-theme/");

        $this->getDataDescription()->getFieldDescriptionByName('theme_text')->setType(FieldDescription::FIELD_TYPE_HTML_BLOCK);
	}

    protected function save(){
        // нечего сохранять
		if(!isset($_POST['forum_theme'])){
			// @todo redirect to edit|create
			throw new SystemException('ERR_404', SystemException::ERR_404);
		}
        $data = $_POST['forum_theme'];

        // не авторизованый юзер
        if(!AuthUser::getInstance()->isAuthenticated()){
			// @todo add SystemException::ERR_401
			throw new SystemException('ERR_404', SystemException::ERR_404);
		}

        if(isset($data['theme_id']) and $themeId = intval($data['theme_id'])){
            $condition = array('theme_id' => $themeId);
            if(!$this->isCanEditTheme($themeId)){
                // @todo add SystemException::ERR_401
                throw new SystemException('ERR_404', SystemException::ERR_404);
            }
            unset($data['smap_id']);
        }
        else{
            // создаём тему
            $themeId = 0;
            $data['smap_id'] = $this->document->getID();
            $data['theme_created'] = date('Y-m-d H:i:s');
            $condition = null;
            $data['u_id'] = AuthUser::getInstance()->getID();
        }

		$data['theme_id'] = (int)$themeId;

		$res = $this->dbh->modify(
			$themeId ? QAL::UPDATE : QAL::INSERT,
			$this->getTableName(),
			$data,
            $condition
		);

		if(!$themeId){
			$themeId = (int)$res;
		}
		$this->response->redirectToCurrentSection("$themeId/");
	}

    /**
     * Редактируем тему
     *
     * @throws SystemException если тема не задана
     * @return void
     */
	protected function modify(){

        $themeId = $this->getActionParams();
       	list($themeId) = $themeId;

        if(!$this->isCanEditTheme($themeId)){
            // @todo add SystemException::ERR_401
			throw new SystemException('ERR_404', SystemException::ERR_404);
        }

        $this->addFilterCondition(array('theme_id' => $themeId));
        $this->setType(self::COMPONENT_TYPE_FORM_ALTER);
        $this->setDataSetAction("$themeId/save-theme/");

		$this->prepare();
        $this->getDataDescription()->getFieldDescriptionByName('theme_id')->setType(FieldDescription::FIELD_TYPE_HIDDEN);
	}

    /**
     * Информация о текущем пользователеле (автор, админ?)
     * @see forum.xslt
     * @return void
     */
    private function addPropertyCurrUser(){
        if(AuthUser::getInstance()->isAuthenticated()){
    		$this->setProperty('curr_user_id', AuthUser::getInstance()->getID());
    	}
        // признак админа - выводим ему ссылки edit/delete во всех блогах
        if(in_array('1', AuthUser::getInstance()->getGroups())){
    		$this->setProperty('curr_user_is_admin', '1');
    	}
    }

    /**
     * Удаляем тему
     * @throws SystemException
     * @return void
     */
    protected function remove(){
        $themeId = $this->getActionParams();
        list($themeId) = $themeId;

        if(!$this->isCanEditTheme($themeId)){
            // @todo add SystemException::ERR_401
			throw new SystemException('ERR_404', SystemException::ERR_404);
        }

        $this->dbh->modify(QAL::DELETE, $this->getTableName(), null, array('theme_id'=>$themeId));

        $this->response->redirectToCurrentSection("/../../");
    }

    /**
     * Может ли текущий юзер редактировать/удалять тему
     *
     * @param  $themeId
     * @return bool
     */
    private function isCanEditTheme($themeId){
        $access = false;

        if(!$themeId or !AuthUser::getInstance()->isAuthenticated())
		    return false;

        // администратор
        if(in_array('1', AuthUser::getInstance()->getGroups())){
    		$access = true;
    	}
        else{
            // создатель темы?
            $uid = AuthUser::getInstance()->getID();
            if($themeUId = $this->dbh->select($this->getTableName(),'u_id', array('theme_id' => $themeId))){
                if($themeUId[0]['u_id'] == $uid){
                    $access =  true;
                }
            }
        }
        return $access;
    }
}