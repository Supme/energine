<?php
    /**
     * Содержит класс Linker
     *
     * @package energine
     * @subpackage configurator
     * @author Tigrenok
     * @copyright Energine 2007

     */

    require_once('Model.class.php');

    /**
     * Создает копии (или симлинки) файлов
     *
     * @package energine
     * @subpackage configurator
     */
    class Linker extends Model {
        /**
         * Название папки со ядром
         *
         */
        const FOLDER_CORE = 'core';

        /**
         * Путь к модулю вывода
         *
         */
        const PATH_SITE = 'site';

        /**
         * Путь к модулям ядра
         *
         */
        const PATH_MODULES = 'modules';

        /**
         * Список обрабатываемых папок модулей
         *
         * @var array
         * @access private
         */
        private $deFoldersList = array(
            'images',
            'scripts',
            'stylesheets',
            'templates/content',
            'templates/layout',
            'templates/icons'
        );
        
        /**
         * Путь от корня сервера
         *
         * @var string
         * @access private
         */
        private $serverRoot;

        /**
         * Список удалённых при очистке файлов
         *
         * @var array
         * @access private
         */
        private $killedLog = array();

        /**
         * Список скопированных файлов
         *
         * @var array
         * @access private
         */
        private $copyLog;

        /**
         * Конструктор класса
         *
         * @return void
         */
    	public function __construct() {
    	    $this->serverRoot = str_replace(SCRIPT_NAME,'',$_SERVER['SCRIPT_FILENAME']).'/';
    	}

        /**
         * Запускает модель
         *
         * @return void
         * @access public
         */
        public function run() {

            $this->getViewer()->addBlock('',Viewer::TPL_LINKER_SCRIPT);

            $this->getViewer()->addBlock('Линкер:',Viewer::TPL_HEADER);

            $this->cleanDestinationFolders();
    		$this->getViewer()->addBlock(array('Нажмите, чтобы показать список удалённых файлов.'=>$this->killedLog),Viewer::TPL_LINKER_CONFIRM);

    		$this->createSymLinks();
    		$this->getViewer()->addBlock(array('Нажмите, чтобы показать список скопированных файлов.'=>$this->copyLog),Viewer::TPL_LINKER_CONFIRM);

    		//$this->getViewer()->addBlock('Процесс копирования успешно завершён.', Viewer::TPL_FOOTER);
    		$base = str_replace(array('setup/?state=install', 'setup/index.php?state=install', 'setup/?state=linker', 'setup/index.php?state=linker'),'',$_SERVER['REQUEST_URI']);
    		$this->getViewer()->addBlock('<a href="'.$base.'">Перейти на сайт</a>', Viewer::TPL_FOOTER);
    		if(!file_exists($htenergine = $this->serverRoot.ENERGINE_LABEL_FILENAME)){
    			file_put_contents($htenergine, @date(DATE_RFC822));
    		}
        }

       


   		/**
    	 * Очищает папки сборки
    	 *
    	 * @return void
    	 * @access private
    	 */
    	private function cleanDestinationFolders() {
    		array_walk($this->deFoldersList, array($this, 'killFiles'));
    		//die();
       	}

    	 /**
    	 * Убивает файлы и папки
    	 *
    	 * @param string Имя папки, которую следует очистить
    	 * @param array Список исключений, имена папок и файлов, которые убивать нельзя
    	 * @return void
    	 * @access private
    	 */
    	private function killFiles($dirName,$exceptions=array()) {
            foreach(new IteratorIterator(new DirectoryIterator($this->serverRoot.$dirName)) as $dir){
            	if(!$dir->isDot()){
            		if($dir->isLink()){
            			if(!@unlink($dir->getPathname())){
            				throw new Exception('Невозможно удалить ссылку ('.$dir->getPathname().')!');
            			}
            			$this->killedLog[] = $dir->getPathname(); 
            		}
            		elseif($dir->isDir()){
            		  if(!$this->rmdir($dir->getPathname())){
                            throw new Exception('Невозможно удалить директорию ('.$dir->getPathname().')!');
                      }
                      $this->killedLog[] = $dir->getPathname();
            		}
            		else{
            			if(!@unlink($dir->getPathname())){
                            throw new Exception('Невозможно удалить файл ('.$dir->getPathname().')!');
                        }
                        $this->killedLog[] = $dir->getPathname();
            		}
            	}
            }
   		}
   		
   		private function createSymLinks(){
	        foreach(
	                glob($this->serverRoot.self::FOLDER_CORE.'/'.self::PATH_MODULES.'/*', GLOB_ONLYDIR)
	                
             as $modulePath){
                foreach($this->deFoldersList as $folderName){
                    foreach(new IteratorIterator(new DirectoryIterator($modulePath.'/'.$folderName)) as $fileInfo){
                        $baseName = $fileInfo->getBasename();
                        if($baseName[0] != '.'){
                        //var_dump(str_replace($this->serverRoot.self::PATH_SITE.'/', '', $modulePath));
                        //$this->safeSymlink($modulePath.'/'.$folderName.'/'.$baseName, $this->serverRoot.$folderName.'/'.$baseName);
                        $this->safeSymlink($fileInfo->getRealPath(), $this->serverRoot.$folderName.'/'.$baseName);
                        }
                    }
                }
            }
   		   foreach(
              glob($this->serverRoot.self::PATH_SITE.'/*', GLOB_ONLYDIR) as $modulePath
           ){
                foreach($this->deFoldersList as $folderName){
                    foreach(new IteratorIterator(new DirectoryIterator($modulePath.'/'.$folderName)) as $fileInfo){
                        $baseName = $fileInfo->getBasename();
                        if($baseName[0] != '.'){
	                        //$this->safeSymlink($modulePath.'/'.$folderName.'/'.$baseName, $this->serverRoot.$folderName.'/'.$baseName);
	                        //$this->safeSymlink($fileInfo->getRealPath(), $this->serverRoot.$folderName.'/'.$baseName);
	                        $siteName = str_replace($this->serverRoot.self::PATH_SITE.'/', '', $modulePath);
	                        if(!file_exists($dir = $this->serverRoot.$folderName.'/'.$siteName)){
	                        	if(!@mkdir($dir, 0755)){
	                        		throw new Exception('Невозможно создать директорию ('.$dir.')!');
	                        	}
	                        }
                            $this->safeSymlink($fileInfo->getRealPath(), $dir.'/'.$baseName);
                        }    
                    }
                }
            }
            
   		}
   		private function rmdir($dir) {
	        //if (!file_exists($dir)) return true;
	        if (!is_dir($dir)) return @unlink($dir);
	        foreach (scandir($dir) as $item) {
	            if ($item == '.' || $item == '..') continue;
	            if (!$this->rmdir($dir.DIRECTORY_SEPARATOR.$item)) return false;
	        }
	        return rmdir($dir);
        }
   		private function safeSymlink($from, $to){
   		    if(function_exists('symlink')){
   		        //Обычный симлинк
   		        if(is_link($to)){
   		        	unlink($to);
   		        }
   		        if (!@symlink($from,$to)) {
                    throw new Exception('Невозможно создать символическую ссылку c <br/><strong>'.$from.'</strong> <br/>на <br/><strong>'.$to.'</strong>)!');
                }
   		    }
   		    else{
   		        //Копирование
   		        $fileInfo = new SplFileInfo($from);
   		        if($fileInfo->isDir()){
   		            if (!@mkdir($to)) {
                        throw new Exception('Невозможно создать директорию ('.$to.')!');
                    }
                    foreach(new IteratorIterator(new DirectoryIterator($fileInfo->getRealPath())) as $tmpFileInfo){
                        $baseName = $tmpFileInfo->getBasename();
                        if($baseName[0] != '.')
                        if (!@copy($tmpFileInfo->getRealPath(), $to.'/'.$baseName)) {
                            throw new Exception('Невозможно скопировать файл ('.$tmpFileInfo->getRealPath().' => '.$to.'/'.$baseName.')!');
                        } 
                    }
                    
   		        }
   		        else{
       		        if (!@copy($from,$to)) {
                        throw new Exception('Невозможно скопировать файл ('.$from.' => '.$to.')!');
                    }
   		        }
   		    }
   		    $this->copyLog[] = $from.' => '.$to;
   		}
    }
