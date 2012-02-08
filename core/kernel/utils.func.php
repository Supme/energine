<?php

/**
 * Содержит набор служебных утилит системы.
 *
 * @package energine
 * @subpackage kernel
 * @author 1m.dm
 * @copyright Energine 2006
 * @version $Id$
 */


/**
 * Выводит форматированнюу с помощью HTML информацию о переданных переменных
 * непосредственно в текущий поток вывода (output stream).
 *
 * @param mixed $var, ...
 * @return void
 */
function inspect() {
    $args = func_get_args();
    echo '<pre>';
    call_user_func_array('var_dump', $args);
    echo '</pre>';
}


/**
 * Возвращает дату, разделенную на год,
 * месяц, день месяца и время.
 *
 * @param $date
 * @return array
 */

function splitDate($date) {
    $timeInfo =
        $dateInfo = array('','','');
    $dateArray = explode(' ',$date);
    if(is_array($dateArray)){
        $dateInfo = explode('-',$dateArray[0]);
        if(isset($dateArray[1])){
            $timeInfo = explode(':',$dateArray[1]);
        }
    }
    return array(
                'year' => $dateInfo[0],
                'month' => $dateInfo[1],
                'day' => $dateInfo[2],
                'time' => array(
                    'h' => $timeInfo[0],
                    'm' => $timeInfo[1],
                    's' => $timeInfo[2]
                )
            );
}

/**
 * Аналог функции inspect, с завершением работы программы сразу после вывода.
 *
 * @param mixed $var, ...
 * @return void
 */
function stop() {
    $args = func_get_args();
    call_user_func_array('inspect', $args);
    die();
}

function simple_log($var){
	static $simpleLog;
	if(!isset($simpleLog)){
		$simpleLog = 'logs/simple.log';
		file_put_contents($simpleLog,'');
	}
	
	if(file_exists($simpleLog)){
	   $flag = 	FILE_APPEND;
	}
	$flag = (file_exists($simpleLog))? FILE_APPEND : null;
	file_put_contents(
	   $simpleLog,
	   str_replace("\n", ' ', $var)."\n",
	   $flag
	);
}

/**
 * Записывает информацию о переменной в лог-файл.
 * Флаг $append контролирует способ записи:
 *     true - добавить информацию в конец файла;
 *     false - записать информацию в начало файла, удалив прежнее содержимое (по-умолчанию);
 *
 * @param mixed $var
 * @param boolean $append
 * @return void
 */
function dump_log($var, $append = false) {
    $flags = ($append ? FILE_APPEND : null);
    ob_start();
    var_dump($var);
    $data = ob_get_contents();
    ob_end_clean();
    file_put_contents(
        'logs/debug.log',
        "\ndate: ".date('l dS of F Y h:i:s')."\n\n".$data."\n",
        $flags
    );
    chmod('logs/debug.log', 0666);
}

/**
 * Записывает информацию о переданных переменных в лог-файл и завершает
 * работу программы. Информация записывается в начало файла, при этом
 * прежнее содержимое удаляется.
 *
 * @param mixed $var, ...
 * @return void
 */
function ddump_log() {
    $result = array();
    $args = func_get_args();
    foreach ($args as $arg) {
    	$result[] = var_export($arg, true);
    }
    file_put_contents(
        'logs/debug.log',
        "\ndate: ".date("l dS of F Y h:i:s")."\n\n".implode("\n", $result)."\n"
    );
    chmod('logs/debug.log', 0666);
    E()->getResponse()->commit();
}


/**
 * Выбирает значения указанного поля из двумерного ассоциативного массива
 * результата SELECT-запроса к БД в одномерный массив. Если флаг $singleRow
 * установлен в true, возвращается значение указанного поля из первой
 * (обычно единственной) строки результата $dbResult.
 *
 * @param mixed $dbResult результат SELECT-запроса к БД
 * @param string $fieldName имя поля для выборки из результата
 * @param boolean $singleRow
 * @return mixed
 */
function simplifyDBResult($dbResult, $fieldName, $singleRow = false) {
    $result = false;
    $fieldName = strtolower($fieldName);
    if (is_array($dbResult)) {
        if ($singleRow) {
            $result = $dbResult[0][$fieldName];
        }
        else {
            foreach ($dbResult as $row) {
                if (isset($row[$fieldName])) {
                    $result[] = $row[$fieldName];
                }
            }
        }
    }
    return $result;
}

/**
 * Трансформирует массив результата SELECT-запроса к БД из представления
 * по строкам в представление по столбцам.
 *
 * На входе:
 *     array($n => array($fieldName => $fieldValue))
 *
 * На выходе:
 *     array($fieldName => array($n => $fieldValue))
 *
 * @param array $dbResult
 * @return array
 */
function inverseDBResult(array $dbResult) {
    $result = array();
    foreach ($dbResult as $row) {
        foreach ($row as $fieldName => $fieldValue) {
            $result[$fieldName][] = $fieldValue;
        }
    }
    return $result;
}

/**
 *
 *
 * @param mixed $dbResult
 * @param mixed $pkName
 * @param boolean $deletePK
 * @return array
 * @see QAL::select()
 * @todo написать подробное описание!
 */
function convertDBResult($dbResult, $pkName, $deletePK = false) {
    $result = false;
    if (is_array($dbResult) && !empty($dbResult)) {
        if (is_string($pkName)) {
            foreach ($dbResult as $key => $row) {
                if (isset($row[$pkName])) {
                    $result[$row[$pkName]] = $row;
                    if ($deletePK) {
                        unset($result[$row[$pkName]][$pkName]);
                    }
                }
                else {
                    throw new SystemException('ERR_DEV_BAD_DATA', SystemException::ERR_DEVELOPER);
                }
            }
        }
        elseif (is_array($pkName) && sizeof($pkName) == 2) {
            foreach ($dbResult as $key => $row) {
                $result[$row[$pkName[0]]][$row[$pkName[1]]] = $row;
                if ($deletePK) {
                    unset($result[$row[$pkName[0]]][$row[$pkName[1]]][$pkName[0]]);
                    unset($result[$row[$pkName[0]]][$row[$pkName[1]]][$pkName[1]]);
                }
            }
        }
    }
    return $result;
}

/**
 * Приводит имена полей массива $fields в так называемую Camel Notation,
 * где каждое слово после первого написано с большой буквы. Необязательный
 * аргумент $prefix позволяет задать префикс, который будет удаляться из имени
 * поля при конвертации.
 *
 * @param array $fields
 * @param string $prefix префикс имени подлежащий удалению
 * @return array
 */
function convertFieldNames(array $fields, $prefix = '') {
    $result = array();
    foreach ($fields as $fieldName => $fieldValue) {
        if (($plen = strlen($prefix)) > 0 && strpos($fieldName, $prefix) === 0) {
            $fieldName = substr($fieldName, $plen);
        }
        $fieldName = preg_replace('/_(\w)/e', 'strtoupper(\'$1\')', $fieldName);
        $result[$fieldName] = $fieldValue;
    }
    return $result;
}

/**
 * Добавляет элемент $var в конец массива $array и возвращает индекс
 * добавленного элемента. С помощью аргумента $key возможно принудительно
 * задать индекс для добавляемого элемента.
 *
 * @param ref $array
 * @param mixed $var
 * @param int $key
 * @return int
 * @see array_push()
 */
function arrayPush(array &$array, $var, $key = null) {
    $newkey = 0;
    $keys = array_keys($array);
    if (!empty($keys)) {
        if (is_null($key)) {
            rsort($keys);
            $newkey = $keys[0] + 1;
        }
        else {
            $newkey = $key;
        }
    }
    $array[$newkey] = $var;
    return $newkey;
}

/**
 * Добавляет элемент(ы) в массив перед указанной позицией и возвращает результат
 * в виде нового массива.
 *
 * @param array $array
 * @param mixed $var
 * @param int $pos
 * @return array
 */
function array_push_before(array $array, $var, $pos) {
    $result = array();
    if (!is_array($var)) {
        $var = array($var);
    }
    if (is_int($pos)) {
        $result = array_merge(
            array_slice($array, 0, $pos),
            $var,
            array_slice($array, $pos)
        );
    }
    else {
        foreach ($array as $key => $value){
            if ($key == $pos) {
                $result = array_merge($result, $var);
            }
            $result[$key] = $value;
        }
    }
    return $result;
}
/**
 * @return array
 * @param array $src
 * @param array $in
 * @param int|string $pos
*/
function array_push_after($src,$in,$pos){
    if(is_int($pos)) $R=array_merge(array_slice($src,0,$pos+1), $in, array_slice($src,$pos+1));
    else{
        foreach($src as $k=>$v){
            $R[$k]=$v;
            if($k==$pos)$R=array_merge($R,$in);
        }
    }return $R;
}

/*function is_assoc($array) {
    return (is_array($array) && (0 !== count(array_diff_key($array, array_keys(array_keys($array)))) || count($array)==0));
}*/
/**
 * Возвращает очищенное содержание файла 
 * @param  $fileName string
 * @return string
 */
function file_get_contents_stripped($fileName){
    return stripslashes(trim(file_get_contents($fileName)));
}