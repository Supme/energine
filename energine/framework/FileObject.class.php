<?php

/**
 * Содержит класс FileObject и интерфейс FileSystemObject
 *
 * @package energine
 * @subpackage core
 * @author dr.Pavka
 * @copyright ColoCall 2006
 * @version $Id$
 */

//require_once('core/framework/FileSystemObject.class.php');
//require_once('core/modules/image/components/Image.class.php');

/**
 * Класс - модель файла
 *
 * @package energine
 * @subpackage core
 * @author dr.Pavka
 */
class FileObject extends FileSystemObject {
    /**
     * Полный путь к файлу
     *
     * @var string
     * @access private
     */
    private $path;
    /**
     * Конструктор класса
     *
     * @return void
     */
    public function __construct() {
        parent::__construct();
    }

    /**
	 * Статический метод загрузки возвращающий self
	 *
	 * @param string путь к файлу
	 * @return FileObject
	 * @access public
	 * @static
	 */

    public static function loadFrom($path) {
        if (!file_exists($path)) {
            throw new SystemException('ERR_DEV_NO_FILE', SystemException::ERR_DEVELOPER, $path);
        }
        if (!is_writeable($path)) {
            throw new SystemException('ERR_DEV_UPLOADS_FILE_NOT_WRITABLE', SystemException::ERR_DEVELOPER, $path);
        }

        $result = new FileObject();
        $result->loadData($path);
        $fileName = dirname($path).'/.'.basename($path);
        $data = array();
        //Для изображений добавляем высоту и ширину
        if (self::getTypeInfo($path) == FileSystemObject::IS_IMAGE) {
            try {
                $imgData = getimagesize($path);
                if (!file_exists($fileName)) {
                    $thumb = new Image();
                    $thumb->loadFromFile($path);
                    $thumb->resize(50,50);
                    $thumb->saveToFile($fileName);
                }
                $data = array('thumb'=>$fileName);
            }
            catch (Exception $e) {
                //В этом случае ничего делать не нужно

            }
            $data = array_merge($data, array('width'=>$imgData[0], 'height'=>$imgData[1]));
        }

        $result->setData($data);

        return $result;
    }

    /**
	 * Удаление файла
	 *
	 * @return boolean
	 * @access public
	 */

    public function delete() {
        if (@unlink($this->getPath())) {
            $path = dirname($this->getPath()).'/.'.basename($this->getPath());
            if (file_exists($path)) {
                @unlink($path);
            }
            parent::delete();

        }
    }

    /**
	 * Сохранение файла
	 *
	 * @param array
	 * @return boolean
	 * @access public
	 */

    public function create($data) {
        $data = $data[self::TABLE_NAME];
        $fileName = $data['upl_path'];
        //Копируем файл из временной директории на нужное место
        copy('tmp/'.basename($fileName), $fileName);
        unlink('tmp/'.basename($fileName));
        $this->dbh->modify(QAL::INSERT, self::TABLE_NAME, $data);
    }

    /**
	 * Создание файла из существующего
	 *
	 * @return void
	 * @access public
	 */

    public function createFromPath($path, $name) {
        $this->dbh->modify(QAL::INSERT, self::TABLE_NAME, array('upl_path'=>$path, 'upl_name'=>$name));
    }
}