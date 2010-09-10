<?php

/**
 * Содержит класс Sitemap
 *
 * @package energine
 * @subpackage core
 * @author dr.Pavka
 * @copyright Energine 2006
 */


/**
 * Класс - синглтон
 * Содержит методы по работе со структурой сайта
 *
 * @todo проблема с конечными страницами
 *
 * @package energine
 * @subpackage core
 * @author dr.Pavka
 * @final
 */
final class Sitemap extends DBWorker {
	/**
	 * @var TreeNodeList Экземпляр класса реализующего работу с древовидными структурами
	 * @access private
	 */
	private $tree;

	/**
	 * @var array of Sitemap
	 * @access private
	 * @static
	 */
	private static $instance;

	/**
	 * Информация о тех разделах, на которіе у юзера есть права
	 * @var array
	 * @access private
	 */
	private $info = array();

	/**
	 * Идентификатор дефолтной страницы
	 * Вынесено в переменную чтоб не дергать запрос постоянно
	 *
	 * @var int
	 * @access private
	 */
	private $defaultID = false;

	/**
	 * Дефолтные meta keywords
	 * Используется для всех страниц у которых не указано
	 * Вынесено в отдельную переменную, чтобы не дергать каждый раз запрос
	 *
	 * @var string
	 * @access private
	 */
	private $defaultMetaKeywords;

	/**
	 * Дефолтное meta description
	 *
	 * @var string
	 * @access private
	 * @see Sitemap::defaultMetaKeywords
	 */
	private $defaultMetaDescription;

	/**
	 * Идентификатор текущего языка
	 *
	 * @var int
	 * @access private
	 */
	private $langID;

	/**
	 * Кеширование уровней доступа
	 *
	 * @var array
	 * @access private
	 */
	private $cacheAccessLevels = array();

	/**
	 * Идентификатор текущего сайта 
	 *
	 * @access private
	 * @var int
	 */
	private $siteID;

	/**
	 * Конструктор класса
	 *
	 * @param int идентификатор сайта
	 * @return void
	 */
	public function __construct($siteID) {
		parent::__construct();
		$this->siteID = $siteID;
		$this->langID = Language::getInstance()->getCurrent();
		$userGroups = array_keys(UserGroup::getInstance()->asArray());

		//Загружаем идентификаторы для последующего формирования древовидной стркутуры
		//Получаем только идентификаторы разделов

		$res = $this->dbh->selectRequest(
            'SELECT s.smap_id, s.smap_pid FROM share_sitemap s '.
            'LEFT JOIN share_sitemap_translation st ON st.smap_id = s.smap_id '.
            'WHERE st.smap_is_disabled = 0 AND s.site_id = %s AND st.lang_id = %s '.
		    'AND s.smap_id IN( '.
		      ' SELECT smap_id '.
		      ' FROM share_access_level '.
		      ' WHERE group_id IN ('.implode(',', AuthUser::getInstance()->getGroups()).')) '. 
            'ORDER BY smap_order_num',
		$this->siteID,
		$this->langID
		);

		if ($res === true) {
			throw new SystemException('ERR_NO_TRANSLATION', SystemException::ERR_CRITICAL);
		}
		//Кешируем уровни доступа к страницам сайта
		//Формируем матрицу вида
		//[идентификатор раздела][идентификатор роли] = идентификатор уровня доступа
		$rightsMatrix = $this->dbh->select('share_access_level', true, array('smap_id' => array_map(create_function('$a', 'return $a["smap_id"];'), $res)));

		if(!is_array($rightsMatrix)){
			throw new SystemException('ERR_404', SystemException::ERR_404);
		}

		foreach ($rightsMatrix as $data) {
			foreach ($userGroups as $groupID) {
				//todo проверить вариант с пересечением array_diff
				if (!isset($this->cacheAccessLevels[$data['smap_id']][$groupID]))
				$this->cacheAccessLevels[$data['smap_id']][$groupID] = ACCESS_NONE;
			}
			$this->cacheAccessLevels[$data['smap_id']][$data['group_id']] = (int)$data['right_id'];
		}

		//Загружаем перечень идентификаторов в объект дерева
		$this->tree = TreeConverter::convert($res, 'smap_id', 'smap_pid');

		$res = $this->dbh->selectRequest('
		  SELECT s.smap_id,ss.site_meta_keywords, ss.site_meta_description  
            FROM share_sitemap s
            LEFT JOIN share_sites_translation ss ON ss.site_id=s.site_id
            WHERE ss.site_id = %s AND s.smap_pid IS NULL and ss.lang_id = %s
		', $this->siteID, $this->langID);
		list($res) = $res;
		$this->defaultID = $res['smap_id']; 
		$this->defaultMetaKeywords = $res['site_meta_keywords'];
		$this->defaultMetaDescription = $res['site_meta_description'];
		
		$this->getSitemapData(array_keys($this->tree->asList()));

	}

	/**
	 * Возвращает экземпляр  объекта Sitemap
	 *
	 * @param mixed идентификатор сайта
	 * @access public
	 * @return Sitemap
	 * @static
	 */
	public static function getInstance($siteID = false) {
		if(!$siteID){
			$siteID = SiteManager::getInstance()->getCurrentSite()->id;
		}
		if (!isset(self::$instance[$siteID])) {
			self::$instance[$siteID] = new Sitemap($siteID);
		}
		return self::$instance[$siteID];
	}
	
	/**
	 * Возвращает идентификатор сайта по идентификатору раздела
	 * 
	 * @return int
	 * @access public
	 * @static
	 */
	public static function getSiteID($pageID){
		$result = null;

	    foreach (self::$instance as $siteID => $sitemap){
	    	$siteInfo = $sitemap->getInfo($pageID);
	    	if(isset($siteInfo[$pageID])){
	    		return $siteID;
	    	}
	    }
	    
	    return $result;
	}

	/**
	 * Метод возвращающий информацию о разделах
	 *
	 * @param mixed идентификатор раздела или массив идентификаторов
	 * @return array
	 * @access private
	 */

	private function getSitemapData($id) {
		if (!is_array($id)) {
			$id = array($id);
		}
		$diff = array();

		if($diff = array_diff($id, array_keys($this->info))){
			$ids = implode(',', $diff);
			$result = convertDBResult(
			$this->dbh->selectRequest(
	                'SELECT s.smap_id, s.smap_pid, s.site_id as site, s.smap_content, s.smap_layout, s.smap_segment as Segment, st.smap_name, smap_redirect_url, smap_description_rtf, smap_html_title, smap_meta_keywords, smap_meta_description '.
	                'FROM share_sitemap s '.
	                'LEFT JOIN share_sitemap_translation st ON s.smap_id = st.smap_id '.
	                'WHERE st.lang_id = %s AND s.site_id = %s AND s.smap_id IN ('.$ids.')', $this->langID, $this->siteID),
	            'smap_id', true);
				
			$result = array_map(array($this, 'preparePageInfo'), $result);
			$this->info += $result;
		}
		else{
			$result = array();
			foreach ($this->info as $key=>$value){
				if(in_array($key, $diff))
				$result[$key] = $value;

			}
		}

		return $result;
	}


	/**
	 * Внутренний метод по преобразования информации о документе. Сводит все ключи к camel notation и для линка изменяет значение идентификатора шаблона
	 *
	 * @param array
	 * @return array
	 * @access private
	 */

	private function preparePageInfo($current) {
		//inspect($current);
		//здесь что то лишнее
		//@todo А нужно ли вообще обрабатывать все разделы? 
		$result = convertFieldNames($current,'smap');
		if(is_null($result['MetaKeywords'])) $result['MetaKeywords'] = $this->defaultMetaKeywords;
		if(is_null($result['MetaDescription'])) $result['MetaDescription'] = $this->defaultMetaDescription;
		//if($result['RedirectUrl']) $result['RedirectUrl'] = (URI::validate($result['RedirectUrl']))?$result['RedirectUrl']:SiteManager::getInstance()->getCurrentSite()->base.$result['RedirectUrl'];

		return $result;
	}


	/**
	 * Возвращает идентификатор страницы по умолчанию
	 *
	 * @return int
	 * @access public
	 */

	public function getDefault() {
		return $this->defaultID;
	}

	/**
	 * Возвращает часть строки УРЛ по идентификатор
	 *
	 * @todo Ошибка с вычислением URL для конечных разделов
	 *
	 * @param int
	 * @return string
	 * @access public
	 */

	public function getURLByID($smapID) {
		$result = array();
		$node = $this->tree->getNodeById($smapID);
		if (!is_null($node)) {
			$parents = array_reverse(array_keys($node->getParents()->asList(false)));
			foreach ($parents as $id) {
				if (isset($this->info[$id]) && $this->info[$id]['Segment']) {
					$result[] = $this->info[$id]['Segment'];
				}
				else {
					$res = $this->getDocumentInfo($id, false);
					$result[] = $res['Segment'];
				}
			}
		}

		$currentSegment = $this->getDocumentInfo($smapID);
		$currentSegment = $currentSegment['Segment'];
		$result[] = $currentSegment;
		$result = array_filter($result);
		if(!empty($result))
		  $result = implode('/', $result).'/';
		else {
			$result = ''; 
		}
		return $result;
	}

	/**
	 * Возвращает идентификатор страницы по его URL
	 *
	 * @param array
	 * @return int
	 * @access public
	 */

	public function getIDByURI(array $segments) {
		$request = Request::getInstance();
        $id = $this->getDefault();
		if (empty($segments)){
		    return $id;
		}
		
		foreach ($segments as $key => $segment) {
		    $found = false;
			foreach($this->info as $pageID => $pageInfo){
				if(($segment == $pageInfo['Segment']) && ($id == $pageInfo['Pid'])){
				  		$id = $pageID;
				  		$request->setPathOffset($key+1);
				  		$found = true;
				  		break;
				}
			}
			if(!$found){
				break;
			}
		}
		return ($id != $this->getDefault())?$id:false;
	}

	/**
	 * Определение прав набора групп на страницу
	 *
	 * @param int идентификатор документа
	 * @param mixed группа/набор групп, если не указан, берется группа/группы текущего пользовател
	 * @return int
	 * @access public
	 */
	public function getDocumentRights($docID, $groups = false) {
		if (!$groups) {
			$groups = AuthUser::getInstance()->getGroups();
		}
		elseif (!is_array($groups)) {
			$groups = array($groups);
		}

		$groups = array_combine($groups, $groups);

		return max(array_intersect_key($this->cacheAccessLevels[$docID], $groups));
	}

	/**
	 * Возвращает все дочерние разделы
	 *
	 * @param int идентификатор раздела
	 * @return array
	 * @access public
	 */

	public function getChilds($smapID, $returnAsTreeNodeList = false) {
		$result = array();
		if ($node = $this->tree->getNodeById($smapID)) {
            if(!$returnAsTreeNodeList){
			    $result = $this->buildPagesMap(array_keys($node->getChildren()->asList(false)));
            }
            else {
                $result = $node->getChildren();
            }
		}
		return $result;
	}
	/**
	 * Возвращает всех потомков
	 *
	 * @param int идентификатор раздела
	 * @return array
	 * @access public
	 */

	public function getDescendants($smapID) {
		$result = array();
		if ($node = $this->tree->getNodeById($smapID)) {
            $result = $this->buildPagesMap(array_keys($node->getChildren()->asList()));
		}
		return $result;
	}

	/**
	 * Возвращает родителя
	 *
	 * @return int
	 * @access public
	 */

	public function getParent($smapID) {
		$node = $this->tree->getNodeById($smapID);
		$result = false;
		if (!is_null($node)) {
			$result = key($node->getParents()->asList(false));
		}

		return $result;
	}

	/**
	 * Возвращает массив родителей
	 *
	 * @param int Идентфикатор раздела
	 * @return array
	 * @access public
	 */

	public function getParents($smapID) {
		$node = $this->tree->getNodeById($smapID);
		$result = array();
		if (!is_null($node)) {
			$result = $this->buildPagesMap(array_reverse(array_keys($node->getParents()->asList(false))));
		}
		return $result;
	}

	/**
	 * По переданному массиву идентификаторов разделов и массиву перечня полей формирует  cтруктуру array('$идентификатор_раздела'=>array())
	 *
	 * @param array идентификаторы разделов
	 * @return array
	 * @access private
	 */

	private function buildPagesMap($ids) {
		$result = array();
		if (is_array($ids)) {
			foreach ($ids as $id) {
				$info = $this->getDocumentInfo($id);
				$info['Segment'] = $this->getURLByID($id);
				$result[$id] = $info;
			}
		}

		return $result;
	}

	/**
	 * Возвращает информацию о документе
	 * Ищем документ с нужным идентификатором в $this->info
	 *
	 * @param int Идентификатор раздела
	 * @return array
	 * @access public
	 */

	public function getDocumentInfo($id) {
		if(isset($this->info[$id]))
		$result = $this->info[$id];
		else{
			$result = $this->getSitemapData($id);
			$result = $result[$id];
		}
		return $result;
	}


	/**
	 * Возвращает объект Tree
	 *
	 * @return TreeNodeList
	 * @access public
	 */

	public function getTree() {
		return $this->tree;
	}

	/**
	 * Возвращает всю информацию о раздеах в не структурированном виде
	 *
	 * @return array
	 * @access public
	 */

	public function getInfo() {
		return $this->info;
	}
}

