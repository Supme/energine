<?php
/**
 * Содержит класс AdsManager
 *
 * @package energine
 * @subpackage apps
 * @author spacelord
 * @copyright spacelord.5@gmail.com
 */

/**
 * Класс по работе с рекламой
 * @package energine
 * @subpackage apps
 * @author spacelord.5@gmail.com
 */
class AdsManager extends DBWorker {
    /**
     * имя таблицы
     */
    const TABLE_NAME = 'apps_ads';

    /**
     * Модифицирует переданный ему объект DataDescription
     * добавляя к нему информацию рекламных полях
     *
     * @param DataDescription $dd
     * @return void
     */
    public function add(DataDescription $dd){
        $fds = $this->dbh->getColumnsInfo(self::TABLE_NAME);
        unset($fds['smap_id']);
        unset($fds['ad_id']);
        foreach ($fds as $key => $value)
            $fds[$key]['tabName'] = 'TXT_ADS';
        $dd->load($fds);
    }
    /**
     * Модифицирует переданные объекты Data DataDescription
     * добавляя информацию о рекламе
     *
     * @param Data $d
     * @param DataDescription $dd
     * @return void
     */
    public function edit(Data $d, DataDescription $dd){
        $fds = $this->dbh->getColumnsInfo(self::TABLE_NAME);
        unset($fds['smap_id']);
        $fds['ad_id']['key'] = false;
        foreach ($fds as $key => $value)
            $fds[$key]['tabName'] = 'TXT_ADS';
        $dd->load($fds);

        $data = $this->dbh->select(self::TABLE_NAME, array_keys($fds), array('smap_id' => $d->getFieldByName('smap_id')->getRowData(0)));

        if(is_array($data)){
            //Тут как всегда проблема с загрузкой значений в мультиязычный билдер
            foreach($data[0] as $fieldName => $fieldData){
                $f = new Field($fieldName);
                for($i=0, $l=sizeof(E()->getLanguage()->getLanguages()); $i<$l; $i++) {
                    $f->setRowData($i, $fieldData);
                }
                $d->addField($f);
            }
        }

    }
    /**
     * Сохраняет информацию о рекламе
     * 
     * @param array $data
     * @return array|bool
     */
    public function save(array $data){
        $checkIfDataExists = function($data) {
            //Что либо предпринимаем только в том случае когда хотя бы одно из значимых полей заполнено
            unset($data['ad_id'], $data['smap_id']);
            return (bool)array_filter($data);
        };
        $result = true;

        if(isset($data['ad_id']) && intval($adID = $data['ad_id'])){
            unset($data['ad_id']);
            if($checkIfDataExists($data))
                $result = $this->dbh->modify(QAL::UPDATE, self::TABLE_NAME, $data, array('ad_id' => $adID));
            else
                $result = $this->dbh->modify(QAL::DELETE, self::TABLE_NAME, null, array('ad_id' => $adID));
        } else {
            if($checkIfDataExists($data))
                $result = $this->dbh->modify(QAL::INSERT, self::TABLE_NAME, $data);
        }
        return $result;
    }
    /**
     * Если таблицы не существует
     * значит и рекламы никакой нет
     * @static
     * @return bool
     */
    public static function isActive(){
        return (bool)E()->getDB()->tableExists(self::TABLE_NAME);
    }
}
