<?php 
/**
 * Содержит класс PageMedia
 *
 * @package energine
 * @subpackage share
 * @author d.pavka
 * @copyright d.pavka@gmail.com
 */

 /**
  * Выводит на странице медиаконтейнер из меди файлов присоединенных к данной странице
  *
  * @package energine
  * @subpackage share
  * @author d.pavka@gmail.com
  */
 class PageMedia extends DataSet {
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
    }
    
    /**
      * Выводит галлерею
      * 
      * @return void
      * @access protected
      */
    protected function main(){
        $this->prepare();
        $this->getDataDescription()->addFieldDescription(
            AttachmentManager::getInstance()->createFieldDescription()
        );
        $this->getData()->addField(
            AttachmentManager::getInstance()->createField(
                $this->document->getID(),
                'smap_id',
                'share_sitemap_uploads'
            )
        );
    }
}