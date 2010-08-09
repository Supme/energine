<?php

/**
 * Содержит класс FileObject и интерфейс FileSystemObject
 *
 * @package energine
 * @subpackage core
 * @author dr.Pavka
 * @copyright Energine 2006
 * @version $Id$
 */


/**
 * Класс - модель файла
 *
 * @package energine
 * @subpackage core
 * @author dr.Pavka
 */
class FileObject extends FileSystemObject {
	const TEMPORARY_DIR = 'uploads/temp/';
	const UPLOAD_DIR = 'uploads/public/';
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
	 * @param string путь к файл
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
		$result->load($path);
		
		return $result;
	}
	
    /**
     * Создание файла из существующего
     *
     * @return FileObject
     * @access public
     * @static
     */

    public static function createFrom($path, $name = false) {
        $result = new FileObject();
        $result->insert(array('upl_path'=>$path, 'upl_name'=>(!$name)?basename($path):$name));
        $result->load($path);
        
        return $result;
    }
    /**
      * Вносит информацию о файле в БД
      * 
      * @param array
      * @return void
      * @access public
      */
    protected function insert($data){
        $this->dbh->modify(QAL::INSERT, self::TABLE_NAME, $data);
    }
	/**
     * Для медиа файлов добавляем информацию о thumbnail
     * 
     * @param $path string
     * @access protected
     */
	protected function load($path){
		parent::load($path);
		$fileName = self::getThumbFilename($path, 50, 50);        
        $data = array();
        //Для изображений добавляем высоту и ширину
        $fInfo = FileInfo::getInstance()->analyze($path);
        if ($fInfo->type == FileInfo::META_TYPE_IMAGE) {
            try {
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
            $data = array_merge($data, array('width'=>$fInfo->width, 'height'=>$fInfo->height));
        }
        elseif($fInfo->type == FileInfo::META_TYPE_VIDEO){
            $data = array('thumb'=>$fileName);
        }

        $this->setData($data);
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
		$sourceFileName = $data['upl_path'];
		//Копируем файл из временной директории на нужное место
		@copy($tmpFile = self::getTmpFilePath($sourceFileName), $sourceFileName);
		@unlink($tmpFile);

		$this->insert($data);
		/*
		if((FileInfo::getInstance()->analyze($sourceFileName)->type == FileInfo::META_TYPE_IMAGE) && $this->getConfigValue('thumbnails')){
			foreach($this->getConfigValue('thumbnails.thumbnail') as $thumbnail){
				$image = new Image();
                $image->loadFromFile($sourceFileName);
                $image->resize($width = (int)$thumbnail->width, $height = (int)$thumbnail->height);
                $image->saveToFile(self::getThumbFilename($sourceFileName, $width, $height));
			}
		}*/
	}
	
	public static function getThumbFilename($sourceFileName, $width, $height){
		list($dirname, $basename, $extension, $filename) = array_values(pathinfo($sourceFileName));
        return $dirname.'/'.'.'.$filename.'.'.$width.'-'.$height.'.png';
	}

	public static function getTmpFilePath($filename){
		return self::TEMPORARY_DIR.basename($filename);
	}

	public static function generateFilename($dirPath, $fileExtension){
		/*
		 * Генерируем уникальное имя файла.
		 */
		$c = ''; // первый вариант имени не будет включать символ '0'
		do {
			$filename = time().rand(1, 10000)."$c.{$fileExtension}";
			$c++; // при первом проходе цикла $c приводится к integer(1)
		} while(file_exists($dirPath.$filename));

		return $filename;
	}
}