<?php

/**
 * Класс QAL.
 *
 * @package energine
 * @subpackage core
 * @author 1m.dm
 * @copyright Energine 2006
 */

/**
 * Query Abstraction Layer.
 *
 * @package energine
 * @subpackage core
 * @author 1m.dm
 * @final
 */
final class QAL extends DBA {

    /**
     * Режимы модифицирующих операций
     */
    const INSERT = 'INSERT';
    const UPDATE = 'UPDATE';
    const DELETE = 'DELETE';
    const REPLACE = 'REPLACE';

    /**
     * Для единоообразия
     */
    const SELECT = 'SELECT';
    /**
     * Направления сортировки
     */
    const ASC = 'ASC';
    const DESC = 'DESC';

    /**
     * Пустая строка
     */
    const EMPTY_STRING = null;

    /**
     * Ошибки
     */
    const ERR_BAD_QUERY_FORMAT = 'Bad query format.';

    /**
     * Конструктор класса.
     *
     * @access public
     * @param string $dsn
     * @param string $username
     * @param string $password
     * @param object $driverOptions
     * @return void
     */
    public function __construct($dsn, $username, $password, array $driverOptions, $charset = 'utf8') {
        parent::__construct($dsn, $username, $password, $driverOptions, $charset);
    }

    /**
     * Выполняет простой SELECT-запрос к БД и возвращает результат выборки.
     *
     * Имена полей $fields задаётся одним из трёх способов:
     *     1. массив имён полей;
     *     2. имя одного поля;
     *     3. true, для выборки всех полей таблицы.
     *
     * Условие выборки $condition задаётся массивом вида array(имя_поля => значение),
     * или строкой WHERE-условия типа 'field1 = 4 AND field2 = 8'.
     *
     * Порядок сортировки результа задаётся массивом вида array(имя_поля => порядок_сортировки),
     * или строкой предложения ORDER BY типа 'field1 DESC, field2 ASC'.
     *
     * Лимит выборки задаётся массивом вида array(смещение, кол-во_строк),
     * или строкой предложения LIMIT типа '32'.
     *
     * Возвращает массив результата выборки или true, если результат пустой.
     *
     * @access public
     * @param string $tableName имя таблицы
     * @param mixed $fields массив имен полей ИЛИ имя одного поля ИЛИ true для выборки всех полей таблицы
     * @param mixed $condition условие выборки
     * @param mixed $order порядок сортировки результата
     * @param mixed $limit лимит выборки
     * @return array
     * @see DBA::selectRequest()
     */
    public function select($tableName, $fields = true, $condition = null, $order = null, $limit = null) {
        //$tableName = strtolower($tableName);

        if (is_array($fields) && !empty($fields)) {
            $fields = array_map('strtolower', $fields);
            $fields = implode(', ', $fields);
        }
        elseif (is_string($fields)) {
            $fields = strtolower($fields);
        }
        elseif ($fields === true) {
            $fields = '*';
        }
        else {
            throw new SystemException(self::ERR_BAD_QUERY_FORMAT, SystemException::ERR_DB, array($tableName, $fields, $condition, $order, $limit));
        }


        $sqlQuery = "SELECT $fields FROM ".DBA::getFQTableName($tableName);

        if (isset($condition)) {
            $sqlQuery .= $this->buildWhereCondition($condition);
        }

        if (isset($order)) {
            $sqlQuery .= $this->buildOrderCondition($order);
        }

        if (isset($limit)) {
            if (is_array($limit)) {
                $sqlQuery .= ' LIMIT '.implode(', ', $limit);
            }
            else {
                $sqlQuery .= " LIMIT $limit";
            }
        }

        return $this->selectRequest($sqlQuery);
    }

    /**
     * Выполняет простую модифицирующую (INSERT, UPDATE, DELETE) операцию в БД.
     *
     * Режим операции задаётся одной из трёх констант:
     *     1. QAL::INSERT - вставка;
     *     2. QAL::UPDATE - обновление;
     *     3. QAL::DELETE - удаление.
     *
     * Данные для операций типа QAL::INSERT и QAL::UPDATE задаются массивом
     * вида array(имя_поля => значение).
     *
     * Условие операции задаётся массивом вида array(имя_поля => значение),
     * или строкой WHERE-условия типа 'field1 = 4 AND field2 = 8'.
     *
     * В режиме QAL::INSERT метод возвращает последний сгенерированный ID для
     * поля типа AUTO_INCREMENT, или true если такого поля в таблице нет.
     *
     * В режимах QAL::UPDATE и QAL::DELETE при успешном выполнении запроса
     * всегда возвращается true.
     *
     * При ошибке выполнения любого типа операций возвращается false.
     *
     * @access public
     * @param int $mode режим операции
     * @param string $tableName имя таблицы
     * @param array $data данные для операции
     * @param mixed $condition условие операции
     * @return array
     * @see DBA::modifyRequest()
     */
    public function modify($mode, $tableName, array $data = null, $condition = null) {
        if (empty($mode) || empty($tableName)) {
            throw new SystemException(self::ERR_BAD_QUERY_FORMAT, SystemException::ERR_DB);
        }
        $tableName = DBA::getFQTableName($tableName);
        
        $sqlQuery = '';

        switch ($mode) {
            case self::INSERT:
            case self::REPLACE:
                if (!empty($data)) {
                    $fieldNames = array();
                    $fieldValues = array();
                    $fieldNames = array_keys($data);
                    foreach ($data as $fieldValue) {
                        if ($fieldValue === self::EMPTY_STRING) {
                            $fieldValue = $this->quote('');
                        }
                        elseif ($fieldValue == '') {
                            $fieldValue = 'NULL';
                        }
                        else {
                            $fieldValue = $this->quote($fieldValue);
                        }
                        $fieldValues[] = $fieldValue;
                    }
                    $sqlQuery = $mode.' INTO '.$tableName.' ('.implode(', ', $fieldNames).') VALUES ('.implode(', ', $fieldValues).')';
                }
                else {
                    $sqlQuery = 'INSERT INTO '.$tableName.' VALUES ()';
                }
                break;
            case self::UPDATE:
                if (!empty($data)) {
                    $fields = array();
                    foreach ($data as $fieldName => $fieldValue) {
                        if ($fieldValue === self::EMPTY_STRING) {
                            $fieldValue = $this->quote('');
                        }
                        elseif ($fieldValue === '') {
                            $fieldValue = 'NULL';
                        }
                        else {
                            $fieldValue = $this->quote($fieldValue);
                        }
                        $fields[] = "$fieldName = $fieldValue";
                    }
                    $sqlQuery = 'UPDATE '.$tableName.' SET '.implode(', ', $fields);
                }
                else {
                    throw new SystemException(self::ERR_BAD_QUERY_FORMAT, SystemException::ERR_DB);
                }
                break;
            case self::DELETE:
                $sqlQuery = 'DELETE FROM '.$tableName;
                break;
            default:
                throw new SystemException(self::ERR_BAD_QUERY_FORMAT, SystemException::ERR_DB);
        }

        if (isset($condition) && $mode != self::INSERT) {
            $sqlQuery .= $this->buildWhereCondition($condition);
        }

        return $this->modifyRequest($sqlQuery);
    }

    /**
     * Строит WHERE-условие для SQL-запроса.
     *
     * @access public
     * @param mixed $condition
     * @return string
     * @see QAL::selectRequest()
     */
    public function buildWhereCondition($condition) {
        $result = '';

        if (!empty($condition)) {
            $result = ' WHERE ';

            if (is_array($condition)) {
                $cond = array();
                foreach ($condition as $fieldName => $value) {
                    //$fieldName = strtolower($fieldName);
                    if (is_null($value)) {
                        $cond[] = "$fieldName IS NULL";
                    }
                    elseif (is_numeric($fieldName)) {
                        $cond[] = $value;
                    }
                    elseif (is_array($value)) {
                    	$value = array_filter($value);

                        $value = implode(',', array_map(create_function('$row', 'return \'"\'.$row.\'"\';'), $value));

                        if(!empty($value))
                            $cond[] = $fieldName.' IN ('.$value.')';
                        else $cond[] = ' FALSE ';    
                    }
                    else {
                        $cond[] = "$fieldName = ".$this->quote($value);
                    }
                }
                $result .= implode(' AND ', $cond);
            }
            else {
                $result .= $condition;
            }
        }

        return $result;
    }

    /**
     * ВОзвращает данные из таблицы связанной по внешнему ключу
     *
     * @param string Имя таблицы
     * @param string имя ключа
     * @param int идентификатор текущего языка
     * @param mixed ограничение на выборку
     * @access public
     * @return array
     *
     * @todo Исключать поля типа текст из результатов выборки для таблицы с переводами
     * @todo Подключить фильтрацию
     */
    public function getForeignKeyData($fkTableName, $fkKeyName, $currentLangID, $filter = null) {
        $fkValueName = substr($fkKeyName, 0, strrpos($fkKeyName, '_')).'_name';
        $columns = $this->getColumnsInfo($fkTableName);

        //Если не существует поля с name берем в качестве поля со значением то же самое поле что и с id
        if(!isset($columns[$fkValueName])) $fkValueName = $fkKeyName;
        
        $order = '';
        foreach(array_keys($columns) as $columnName) {
            if(strpos($columnName, '_order_num')){
                $order = $columnName.' '.QAL::ASC;
                break;
            }
        }
        //если существует таблица с переводами для связанной таблицы
        //нужно брать значения оттуда
        if ($transTableName = $this->getTranslationTablename($fkTableName)) {
        	if($filter){
        	   $filter = ' AND '.str_replace('WHERE', '', $this->buildWhereCondition($filter));	
        	}
        	else{
        		$filter = '';
        	}
        	
            $request = sprintf(
                'SELECT 
                    %2$s.*, %3$s.%s 
                    FROM %s %2$s 
                    LEFT JOIN %s %3$s on %3$s.%s = %2$s.%s 
                    WHERE lang_id =%s'.$filter.(($order)?' ORDER BY '.$order:''),
                $fkValueName, 
                $fkTableName, 
                $transTableName, 
                $fkKeyName, 
                $fkKeyName, 
                $currentLangID
            );
            $res = $this->selectRequest($request);
        }
        else {
            //$columns = $this->getColumnsInfo($fkTableName);
            $columns = array_filter($columns,
                function($value){
                    return !($value["type"] == QAL::COLTYPE_TEXT);    
                }
            );
            $res = $this->select($fkTableName, array_keys($columns), $filter, $order);
            //$res = $this->selectRequest('SELECT '.implode(',', array_keys($columns)).' FROM '.$fkTableName.)
        }

        return array($res, $fkKeyName, $fkValueName);
    }

    /**
     * Строит предложение ORDER BY для SQL-запроса.
     *
     * @access public
     * @param mixed $order
     * @return string
     * @see QAL::selectRequest()
     */
    public function buildOrderCondition($clause) {
        $orderClause = '';
        if(!empty($clause)) {
            $orderClause = ' ORDER BY ';

            if (is_array($clause)) {
                $cls = array();
                foreach ($clause as $fieldName => $direction) {
                    $direction = strtoupper($direction);
                    $cls[] = "$fieldName ".constant("self::$direction");
                }
                $orderClause .= implode(', ', $cls);
            }
            else {
                $orderClause .= $clause;
            }
        }
        return $orderClause;
    }

    /**
     * Строит предложение LIMIT для SQL-запроса.
     *
     * @access public
     * @param mixed $limit
     * @return string
     * @see QAL::selectRequest()
     */
    public function buildLimitStatement($clause) {
        $limitClause = '';
        if (is_array($clause)) {
            $limitClause = " LIMIT {$clause[0]}";
            if (isset($clause[1])) {
                $limitClause .= ", {$clause[1]}";
            }
        }

        return $limitClause;
    }
}
