<?php
/**
 * Содержит класс SiteEditor
 *
 * @package energine
 * @subpackage share
 * @author d.pavka
 * @copyright d.pavka@gmail.com
 */

/**
 * Редактор сайтов
 *
 * @package energine
 * @subpackage share
 * @author d.pavka@gmail.com
 */
class SiteEditor extends Grid {
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
		$this->setTableName('share_sites');
        $this->setSaver(new SiteSaver());		
	}

	/**
	 * Изменяем типы филдов
	 *
	 * @return DataDescription
	 * @access protected
	 */
	protected function prepare(){
		parent::prepare();
		if(in_array($this->getAction(), array('add', 'edit'))){
			$fd = $this->getDataDescription()->getFieldDescriptionByName('site_protocol');
			$fd->setType(FieldDescription::FIELD_TYPE_SELECT);
			$fd->loadAvailableValues(array(array('key' => 'http', 'value' => 'http://'), array('key' => 'https', 'value' => 'https://')), 'key', 'value');
				
			$fd = $this->getDataDescription()->getFieldDescriptionByName('site_folder');
			$fd->setType(FieldDescription::FIELD_TYPE_SELECT);
			$fd->loadAvailableValues($this->loadFoldersData(), 'key', 'value');
			
			if($this->getData()->getFieldByName('site_is_default')->getRowData(0) == 1){
			 	$this->getDataDescription()->getFieldDescriptionByName('site_is_default')->setMode(FieldDescription::FIELD_MODE_READ);
			}
			$tagField = new FieldDescription('tags');
            $tagField->setType(FieldDescription::FIELD_TYPE_STRING);
            $tagField->removeProperty('pattern');
            $this->getDataDescription()->addFieldDescription($tagField);
                
			if($this->getAction() == 'add'){
				$this->getData()->getFieldByName('site_port')->setData(80, true);
				$this->getData()->getFieldByName('site_root')->setData('/', true);
				$this->getData()->getFieldByName('site_is_active')->setData(1, true);
				
				//Добавляем селект позволяющий скопировать структуру одного из существующих сайтов в новый
				$fd = new FieldDescription('copy_site_structure');
				$fd->setType(FieldDescription::FIELD_TYPE_SELECT);
				$fd->loadAvailableValues($this->dbh->selectRequest('SELECT ss.site_id, site_name FROM share_sites ss LEFT JOIN share_sites_translation sst ON ss.site_id = sst.site_id WHERE lang_id =%s ', $this->document->getLang()) , 'site_id', 'site_name');
				$this->getDataDescription()->addFieldDescription($fd);
			}
			else {
                $field = new Field('tags');
/*		        $fieldData = implode(TagManager::TAG_SEPARATOR.' ',
		            array_keys(TagManager::getInstance()->pull($this->getData()->getFieldByName($this->getPK())->getRowData(0), 'share_sites_tags'))
		        );*/
                $fieldData = implode(TagManager::TAG_SEPARATOR.' ',
		            TagManager::getInstance()->pull($this->getData()->getFieldByName($this->getPK())->getRowData(0), 'share_sites_tags')
		        );
		        for($i=0, $langs = count(Language::getInstance()->getLanguages()); $i<$langs; $i++){
		            $field->setRowData($i, $fieldData);    
		        }
		        $this->getData()->addField($field);				
			}
		}
	}

	/**
	 * Загружаем данные о папках в поле folder
	 *
	 * @return array
	 * @access private
	 */
	private function loadFoldersData(){
		$result = array();
		foreach(glob('site/*', GLOB_ONLYDIR) as $folder){
			$folder = str_replace('site/', '', $folder);
			$result[] = array('key' => $folder, 'value' => $folder);
		}
		return $result;
	}
}