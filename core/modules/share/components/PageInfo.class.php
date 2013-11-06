<?php

/**
 * Содержит класс PageInfo
 *
 * @package energine
 * @subpackage share
 * @author andy.karpov@gmail.com
 * @copyright Energine 2013
 */

/**
 * Выводит на странице контейнер с доп характеристиками страницы +
 * медиаконтейнер из медиа-файлов, присоединенных к данной странице
 *
 * @package energine
 * @subpackage share
 * @author andy.karpov@gmail.com
 */
class PageInfo extends DataSet {

    /**
     * Конструктор класса
     *
     * @param string $name
     * @param string $module
     * @param array $params
     */
    public function __construct($name, $module, array $params = null) {
        parent::__construct($name, $module, $params);
    }

    /**
     * Основной метод вывода
     *
     */
    protected function main() {

        $this->setType(self::COMPONENT_TYPE_LIST);
        $this->setBuilder(new SimpleBuilder());
        $dd = $this->createDataDescription();
        if ($dd->isEmpty()) {
            $dd->load(
                array(
                    'smap_id' => array(
                        'type' => FieldDescription::FIELD_TYPE_INT,
                        'key' => true,
                        'index' => 'PRI'
                    ),
                    'smap_name' => array(
                        'type' => FieldDescription::FIELD_TYPE_STRING,
                    ),
                    'smap_description_rtf' => array(
                        'type' => FieldDescription::FIELD_TYPE_HTML_BLOCK,
                    ),
                )
            );
        }

        $this->setDataDescription($dd);
        $d = new Data();
        $query = 'SELECT
        s.smap_id,
        st.smap_name,
        st.smap_description_rtf
        FROM share_sitemap s
        LEFT JOIN share_sitemap_translation st USING (smap_id)
        WHERE (smap_id = %s) AND (lang_id = %s) LIMIT 1';

        $this->js = $this->buildJS();

        $toolbars = $this->createToolbar();
        if (!empty($toolbars)) {
            $this->addToolbar($toolbars);
        }

        $this->setData($d);
        $data = $this->dbh->select($query, $this->document->getID(), $this->document->getLang());

        if (is_array($data) && !empty($data)) {
            $d->load($data);
        }

        //Поле добавлено чтобы Data не был пустым
        $this->getData()->addField(new Field('fake'));
        $m = new AttachmentManager(
            $this->getDataDescription(),
            $this->getData(),
            'share_sitemap'
        );
        $m->createFieldDescription();
        $m->createField('smap_id', false, $this->document->getID());
    }
}