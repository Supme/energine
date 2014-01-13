<?php
/**
 * @file
 * FileRepositoryLocal.
 *
 * It contains the definition to:
 * @code
class FileRepositoryLocal;
@endcode
 *
 * @author Andy Karpov <andy.karpov@gmail.com>
 * @copyright Energine 2013
 *
 * @version 1.0.0
 */


/**
 * Implementation of file loader interface IFileRepository for local FTP repositories.
 *
 * This is useful for the cases when the repository is local and the file is downloaded over FTP by using admin tools.
 *
 * @code
class FileRepositoryFTP;
@endcode
 */
class FileRepositoryLocal extends Object implements IFileRepository {
    /**
     * Path to the cache for alternative images.
     *
     * @var string IMAGE_ALT_CACHE
     */
    const IMAGE_ALT_CACHE = 'uploads/alts/resizer/w[width]-h[height]/[upl_path]';

    /**
     * Internal repository ID.
     *
     * @var int $id
     */
    protected $id;

    /**
     * Base path to the repository.
     *
     * @var string $base
     */
    protected $base;

    public function __construct($id, $base) {
        $this->setId($id);
        $this->setBase($base);
    }

    public function getName() {
        return 'local';
    }

    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    public function getId() {
        return $this->id;
    }

    public function setBase($base) {
        $this->base = $base;
        return $this;
    }

    public function getBase() {
        return $this->base;
    }

    public function allowsCreateDir() {
        return true;
    }

    public function allowsUploadFile() {
        return true;
    }

    public function allowsEditDir() {
        return true;
    }

    public function allowsEditFile() {
        return true;
    }

    public function allowsDeleteDir() {
        return true;
    }

    public function allowsDeleteFile() {
        return true;
    }

    /**
     * Upload a file to the repository.
     *
     * @throws SystemException 'ERR_DIR_WRITE'
     * @throws SystemException 'ERR_COPY_UPLOADED_FILE'
     *
     * @param string $sourceFilename Source filename.
     * @param string $destFilename Destination filename.
     * @return boolean
     */
    public function uploadFile($sourceFilename, $destFilename) {

        $dir = dirname($destFilename);
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }
        if(!is_writable($dir)){
            throw new SystemException('ERR_DIR_WRITE', SystemException::ERR_CRITICAL, $dir);
        }
        if (!copy($sourceFilename, $destFilename)) {
            throw new SystemException('ERR_COPY_UPLOADED_FILE', SystemException::ERR_CRITICAL, $destFilename);
        }

        return $this->analyze($destFilename);
    }

    public function uploadAlt($sourceFilename, $destFilename, $width, $height) {
        $destFilename = str_replace(
            array('[width]', '[height]', '[upl_path]'),
            array($width, $height, $destFilename),
            self::IMAGE_ALT_CACHE
        );
        return $this->uploadFile($sourceFilename, $destFilename);
    }

    public function updateFile($sourceFilename, $destFilename) {
        if (!copy($sourceFilename, $destFilename)) {
            return false;
        }
        return true;
    }

    public function updateAlt($sourceFilename, $destFilename, $width, $height) {
        $destFilename = str_replace(
            array('[width]', '[height]', '[upl_path]'),
            array($width, $height, $destFilename),
            self::IMAGE_ALT_CACHE
        );
        return $this->updateFile($sourceFilename, $destFilename);
    }

    public function deleteFile($filename) {
        if (!@unlink($filename)) {
            return false;
        }
        return true;
    }

    public function deleteAlt($filename, $width, $height) {
        return $this->deleteFile($filename);
    }

    public function analyze($filename) {
        $fi = E()->FileRepoInfo->analyze($filename, true);
        if (is_object($fi)) {
            $fi->ready = true;
        }
        return $fi;

    }

    /**
     * Create new directory in the repository.
     *
     * @throws SystemException 'ERR_DIR_CREATE'
     *
     * @param string $dir Directory name.
     * @return boolean
     */
    public function createDir($dir) {
        if (file_exists($dir)) return true;
        $dirs = array_filter(explode('/', $dir));
        array_pop($dirs);
        $parentDir = implode('/', $dirs);
        if(!file_exists($parentDir) || !is_writable($parentDir)){
            throw new SystemException('ERR_DIR_CREATE', SystemException::ERR_CRITICAL, $parentDir);
        }
        return mkdir($dir);
    }

    /**
     * Rename directory in the repository.
     *
     * @throws SystemException 'ERR_UNIMPLEMENTED_YET'
     *
     * @attention This is not yet implemented!
     */
    public function renameDir($dir) {
        throw new SystemException('ERR_UNIMPLEMENTED_YET');
    }

    /**
     * Delete directory from the repository.
     *
     * @throws SystemException 'ERR_UNIMPLEMENTED_YET'
     *
     * @attention This is not yet implemented!
     */
    public function deleteDir($dir) {
        throw new SystemException('ERR_UNIMPLEMENTED_YET');
    }
}
