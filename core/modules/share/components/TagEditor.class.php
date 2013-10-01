<?php
/**
 * Содержит класс TagEditor
 *
 * @package energine
 * @subpackage share
 * @author andy.karpov
 * @copyright Energine 2013
 */

/**
 * Редактор тегов
 *
 * @package energine
 * @subpackage share
 * @author andy.karpov
 */
class TagEditor extends Grid {
    /**
     * Конструктор класса
     *
     * @param string $name
     * @param string $module
     * @param array $params
     * @access public
     */
    public function __construct($name, $module, array $params = null) {
        parent::__construct($name, $module, $params);
        $this->setTableName(TagManager::TAG_TABLENAME);
    }

    protected function main() {
        parent::main();
        $params = $this->getStateParams(true);
        $this->setProperty('tag_id', urldecode($params['tag_id']));
        $tag_ids = explode(TagManager::TAG_SEPARATOR, $params['tag_id']);
        if ($tag_ids) {
            $this->addFilterCondition(array(TagManager::TAG_TABLENAME . '.tag_id' => $tag_ids));
        }
    }

    protected function getRawData() {
        $params = $this->getStateParams(true);
        $tag_ids = explode(TagManager::TAG_SEPARATOR, urldecode($params['tag_id']));
        if ($tag_ids) {
            $this->addFilterCondition(array(TagManager::TAG_TABLENAME . '.tag_id' => $tag_ids));
        }
        parent::getRawData();
    }

    protected function getTagIds() {
        $builder = new JSONCustomBuilder();
        $this->setBuilder($builder);

        $tags = (!empty($_REQUEST['tags'])) ? $_REQUEST['tags'] : '';
        $tags = array_filter(
            array_map(
                create_function('$tag', 'return mb_convert_case(trim($tag), MB_CASE_LOWER, "UTF-8");'),
                explode(TagManager::TAG_SEPARATOR, $tags)
            )
        );

        $response = array();

        foreach($tags as $tag) {
            $tag_item = TagManager::getID($tag);
            if (!$tag_item) {
                $tag_id = TagManager::insert($tag);
            } else {
                $tag_id = array_keys($tag_item)[0];
            }
            if ($tag_id) {
                $response[] = $tag_id;
            }
        }

        $builder->setProperties(array('data' => $response));
    }

    protected function getTags() {
        $builder = new JSONCustomBuilder();
        $this->setBuilder($builder);

        $tag_id = (!empty($_REQUEST['tag_id'])) ? $_REQUEST['tag_id'] : '';
        $tag_id = array_filter(
            array_map(
                create_function('$tag', 'return intval(trim($tag));'),
                explode(TagManager::TAG_SEPARATOR, $tag_id)
            )
        );

        $tags = TagManager::getTags($tag_id);
        if ($tags) {
            $tags = array_values($tags);
        }
        $builder->setProperties(array('data' => $tags));
    }
}
