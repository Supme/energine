<?php

/**
 * Класс FileRepositoryRO
 *
 * @package energine
 * @subpackage kernel
 * @author Andy Karpov <andy.karpov@gmail.com>
 * @copyright Energine 2013
 */


/**
 * Реализация интерфейса загрузчика файлов для репозитариев типа Read-Only.
 * Используется в случаях, когда загрузка файлов в репозитарий осуществляется сторонними скриптами,
 * а интерфейс служит лишь для навигации по репозитарию
 *
 * @package energine
 * @subpackage kernel
 * @author Andy Karpov <andy.karpov@gmail.com>
 */
class FileRepositoryRO extends Object implements IFileRepository {

    /**
     * Внутренний идентификатор репозитария
     *
     * @var int
     */
    protected $id;

    /**
     * Метод получения внутреннего имени реализации
     *
     * @return string
     */
    public function getName() {
        return 'ro';
    }

    /**
     * Метод установки идентификатора репозитария (upl_id)
     *
     * @param int $id
     * @return IFileRepository
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * Метод получения идентификатора репозитария (upl_id)
     *
     * @return int
     */
    public function getId() {
        return $this->id;
    }

    /**
     * Возвращает true, если разрешено создание папок в репозитарии
     *
     * @return boolean
     */
    public function allowsCreateDir() {
        return false;
    }

    /**
     * Возвращает true, если разрешена загрузка файлов в репозитарий
     *
     * @return boolean
     */
    public function allowsUploadFile() {
        return false;
    }

    /**
     * Возвращает true, если разрешено редактирование папки в репозитарии
     *
     * @return boolean
     */
    public function allowsEditDir() {
        return false;
    }

    /**
     * Возвращает true, если разрешено редактирование файла в репозитарии
     *
     * @return boolean
     */
    public function allowsEditFile() {
        return false;
    }

    /**
     * Возвращает true, если разрешено удаление папки из репозитария
     *
     * @return boolean
     */
    public function allowsDeleteDir() {
        return false;
    }

    /**
     * Возвращает true, если разрешено удаление файла из репозитария
     *
     * @return boolean
     */
    public function allowsDeleteFile() {
        return false;
    }

    /**
     * Метод загрузки файла в хранилище
     *
     * @param string $filename имя файла
     * @param string $data данные
     * @return boolean
     * @throws SystemException
     */
    public function uploadFile($filename, $data) {
        throw new SystemException('ERR_REPOSITORY_READ_ONLY', SystemException::ERR_WARNING);
    }

    /**
     * Метод обновления ранее загруженного файла в хранилище
     *
     * @param string $filename имя файла
     * @param string $data данные
     * @return boolean
     * @throws SystemException
     */
    public function updateFile($filename, $data) {
        throw new SystemException('ERR_REPOSITORY_READ_ONLY', SystemException::ERR_WARNING);
    }

    /**
     * Метод удаления файла из хранилища
     *
     * @param string $filename имя файла
     * @return boolean
     * @throws SystemException
     */
    public function deleteFile($filename) {
        throw new SystemException('ERR_REPOSITORY_READ_ONLY', SystemException::ERR_WARNING);
    }
}
