<?php

/**
 * @file
 * TreeConverter.
 *
 * It contains the definition to:
 * @code
final class TreeConverter;
@endcode
 *
 * @author dr.Pavka
 * @copyright Energine 2007
 *
 * @version 1.0.0
 */

//require_once('TreeNodeList.class.php');

/**
 * Convert Tree.
 *
 * @code
final class TreeConverter;
@endcode
 *
 * It casts tree-like array into Tree object.
 *
 * @note It represents a container of static methods.
 *
 * @attention This is @b final class.
 */
final class TreeConverter{
    /**
     * Key name.
     * @var string $keyName
     */
    static private $keyName;

    /**
     * Parent key name.
     * @var string $parentKeyName
     */
    static private $parentKeyName;

    /**
     * Tree's node list.
     * @var TreeNodeList $treeNodeList
     */
    static private $treeNodeList;


	private function __construct() {}

	/**
     * Run converting.
	 *
     * @throws Exception 'Неправильный формат древовидных данных'
     *
     * @param array $data Loaded data.
     * @param string $keyName Field name that holds an ID.
     * @param string $parentKeyName Field name that holds an parent ID.
	 * @return TreeNodeList
	 */
	static public function convert(array $data, $keyName, $parentKeyName) {
        self::$keyName = $keyName;
        self::$parentKeyName = $parentKeyName;

        //Проверяем данные на правильность
	    if (!self::validate($data)) {
            throw new Exception('Неправильный формат древовидных данных');
        }
        return self::iterate($data, self::$treeNodeList = new TreeNodeList());
	}

    //todo VZ: Is this realised?
    /**
     * Validate data.
     *
     * @todo реализовать
     *
     * @param array $data Data.
     * @return bool
     */
    static private function validate(array $data) {
    	foreach ($data as $value) {
    		if (!array_key_exists(self::$parentKeyName, $value) || !array_key_exists(self::$parentKeyName, $value)) {
    			return false;
    		}
    		elseif($value[self::$keyName] === $value[self::$parentKeyName]) {
    			return false;
    		}
    	}
        return true;
    }

    /**
     * Recursive iteration over tree-like array.
     *
	 * @param array $data Data array in the form @code array(array('$keyName'=>$key, '$parentKeyName'=>$parentKey)) @endcode.
	 * @param TreeNode|TreeNodeList $parent Parent object.
     * @return TreeNodeList
     */
    static private function iterate(array $data, $parent) {
        foreach ($data as $key => $value) {
        	//Если родителем является TreeNodeList  - значит мы на начальном шаге итерации и ключ - пустой, во всех других случаях - ключом является идентификатор узла родителя
        	if ($parent instanceof TreeNodeList) {
        	   $parentKey = '';
        	   $methodName = 'add';
        	}
        	else {
        	   $parentKey = $parent->getID();
        	   $methodName = 'addChild';
        	}

        	if ($value[self::$parentKeyName] == $parentKey) {
        		//добавляем узел к родителю
        		$addedNode = $parent->$methodName(new TreeNode($value[self::$keyName]));
        		//удаляем из массива данных
        		unset($data[$key]);
        		//делаем рекурсивный вызов, передавая изменившийся набор данных, и родительский узел
        		self::iterate($data, $addedNode);
        	}
        }
        return $parent;
    }
}