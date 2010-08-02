<?php 
/**
 * Содержит класс ForumThemeEditor
 *
 * @package energine
 * @subpackage forum
 * @author sign
 */

 /**
  * Редактор категорий форумов
  *
  * @package energine
  * @subpackage forum
  * @author sign
  */
 class ForumThemeEditor extends Grid {
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
        $this->setTableName('forum_theme');
    }
}