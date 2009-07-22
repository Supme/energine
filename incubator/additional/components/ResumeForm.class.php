<?php
/**
 * Содержит класс ResumeForm.
 *
 * @package energine
 * @subpackage misc
 * @author d.pavka
 * @copyright d.pavka@gmal.com
 * @version $Id$
 */

 /**
 * Класс для отправки и хранения резюме, а также просмотра отправленных резюме
 *
 * @package energine
 * @subpackage misc
 * @author d.pavka
 * @final
 */
final class ResumeForm extends DataSet {
    const RESUME_TABLE_NAME = 'aux_resumes';
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
        $this->setDataSetAction('send-resume');
        $this->setTitle($this->translate('TXT_'.strtoupper($this->getName())));
    }
    /**
     * Метод вывода формы добавления резюме
     *
     * @access protected
     * @return void
     */
    protected function main() {
        parent::main();
    }

    /**
     * Подхватываем перечень полей из таблицы
     *
     * @access protected
     * @return DataDescription
     */
    protected function loadDataDescription() {
        $result = $this->dbh->getColumnsInfo(self::RESUME_TABLE_NAME);
        unset($result['resume_date']);
        return $result;
    }

    /**
     * добавлена обработка ключей
     *
     * @return DataDescription
     * @access protected
     *
     * @todo дублирование ф-ности доступной в DBDataSet
     */

    protected function createDataDescription() {
        $result = parent::createDataDescription();

        foreach ($result->getFieldDescriptions() as $fieldName => $fieldMetaData) {
            $keyInfo = $fieldMetaData->getPropertyValue('key');
            //Если это внешний ключ
            if (is_array($keyInfo) && in_array($fieldMetaData->getType(), array(FieldDescription::FIELD_TYPE_SELECT, FieldDescription::FIELD_TYPE_MULTI))) {
                $fkTableName = $keyInfo['tableName'];
                $fkKeyName = $keyInfo['fieldName'];
                //загружаем информацию о возможных значениях
                call_user_func_array(array($fieldMetaData, 'loadAvailableValues'), $this->dbh->getForeignKeyData($fkTableName, $fkKeyName, $this->document->getLang()));
            }
        }
        return $result;
    }

    /**
     * Отправка резюме
     *
     * @access protected
     * @return мщшв
     */
    protected function send() {
        $data = $_POST[self::RESUME_TABLE_NAME ];
        $data['resume_date'] = date('r');
        $mail = new Mail();
        $mail->setFrom($this->getConfigValue('mail.from'));
        $mail->addTo($this->getConfigValue('insight.vacancy_email'));
        $mail->setSubject($this->translate('TXT_SUBJ_NEW_RESUME'));
        $mail->addReplyTo($data['resume_candidate_email'], $data['resume_candidate_name']);
        $mail->setText($this->translate('TXT_BODY_NEW_RESUME'), $data);
        $mail->addAttachment($_FILES[self::RESUME_TABLE_NAME]['tmp_name']['resume_main_pfile'], $_FILES[self::RESUME_TABLE_NAME]['name']['resume_main_pfile']);
        $mail->send();

        $this->prepare();

        $data = new Data();
        $this->setData($data);
        $field = new Field('result');
        $field->setData($this->translate('MSG_RESUME_SENT'));
        $data->addField($field);
    }

}