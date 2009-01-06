<?php
/**
 * Содержит класс Feed
 *
 * @package energine
 * @subpackage share
 * @author dr.Pavka
 * @copyright ColoCall 2007
 * @version $Id$
 */

/**
 * Абстрактный класс предок для компонентов основывающихся на структуре сайта
 *
 * @package energine
 * @subpackage share
 * @author dr.Pavka
 * @abstract
 */
abstract class Feed extends DBDataSet {
    /**
     * Конструктор класса
     *
     * @param string $name
     * @param string $module
     * @param Document $document
     * @param array $params
     * @access public
     */
	public function __construct($name, $module, Document $document, array $params = null) {
        parent::__construct($name, $module, $document, $params);
        $this->setProperty('title', $this->translate('TXT_'.strtoupper($this->getName())));
        $this->setProperty('exttype', 'feed');
        $this->setParam('onlyCurrentLang', true);
	}
	/**
	 * Убираем smap_id
	 *
	 * @access protected
	 * @return DataDescription
	 */
	protected function createDataDescription() {
	    $result = parent::createDataDescription();
	    if($smapField = $result->getFieldDescriptionByName('smap_id')){
	    	$result->removeFieldDescription($smapField);
	    }

	    return $result;
	}
    /**
     * Фильтруем по разделам
     *
     * @return void
     * @access protected
     */

    protected function main() {

		if(!($id = $this->getParam('id'))){
			$id = $this->document->getID();
		}

        if ($this->getParam('showAll')) {
   	        $descendants = array_keys(
   	            Sitemap::getInstance()->getTree()->getNodeById($id)->getDescendants()->asList(false)
   	        );
            $id = array_merge(array($id), $descendants);
        }
        $this->addFilterCondition(array('smap_id'=>$id));
        if ($limit = $this->getParam('limit')){
        	$this->setLimit(array(0,$limit));
        	$this->setParam('recordsPerPage', false);
        }

        parent::main();
    }

    /**
     * Добавляем крошку
     *
     * @return void
     * @access protected
     */

     protected function view() {
        parent::view();
        $this->document->componentManager->getComponentByName('breadCrumbs')->addCrumb();
     }
    /**
     * Делаем компонент активным
     *
     * @return type
     * @access protected
     */

    protected function defineParams() {
        return array_merge(
        parent::defineParams(),
        array(
        'active' => true,
        'showAll' =>false,
		'id' => false,
        'limit' => false
        )
        );
    }
}