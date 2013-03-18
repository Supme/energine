<?php
/**
 * Created by JetBrains PhpStorm.
 * User: pavka
 * Date: 9/22/11
 * Time: 11:17 AM
 * To change this template use File | Settings | File Templates.
 */


/**
 * Основной функционал установки системы.
 *
 * @package energine
 * @subpackage setup
 * @author dr.Pavka
 */
class Setup {
    const UPLOADS_PATH = 'uploads/public/';
    const UPLOADS_TABLE = 'share_uploads';
    /**
     * @access private
     * @var bool  true - установка запущенна из консоли false - с браузера
     */
    private $isFromConsole;

    /**
     * @access private
     * @var array конфиг системы
     */
    private $config;

    /**
     * @access private
     * @var array директории для последующего создания символических ссылок
     */
    private $htdocsDirs = array(
        'images',
        'scripts',
        'stylesheets',
        'templates/content',
        'templates/icons',
        'templates/layout'
    );

    /**
     * Конструктор класса.
     *
     * @param bool $consoleRun Вид вызова сценария установки
     * @access public
     */

    function __construct($consoleRun) {
        header('Content-Type: text/plain; charset=' . CHARSET);
        $this->title('Средство настройки CMF Energine');
        $this->isFromConsole = $consoleRun;
        $this->checkEnvironment();
    }

    /**
     * Очистка переменных для предотвращения возможных атак.
     * Если входящяя строка содержит символы помимо
     * Букв, цифр, -, . , /
     * Будет возвращена строка error
     *
     * @param string $var
     * @return string
     * @access private
     */

    private function filterInput($var) {
        if (preg_match('/^[\~\-0-9a-zA-Z\/\.\_]+$/i', $var))
            return $var;
        else
            throw new Exception('Некорректные данные системных переменных, возможна атака на сервер.' . $var);
    }

    /**
     * Возвращает хост, на котором работае система.
     *
     * @return string
     * @access private
     */

    private function getSiteHost() {
        if (!isset($_SERVER['HTTP_HOST'])
                || $_SERVER['HTTP_HOST'] == ''
        )
            return $this->filterInput($_SERVER['SERVER_NAME']);
        else
            return $this->filterInput($_SERVER['HTTP_HOST']);
    }

    /**
     * Возвращает корневую директорию системы.
     *
     * @return string
     * @access private
     */

    private function getSiteRoot() {
        $siteRoot = $this->filterInput($_SERVER['PHP_SELF']);
        $siteRoot = str_replace('setup/index.php', '', $siteRoot);
        return $siteRoot;
    }

    /**
     * Функция для проверки параметров системы,
     * таких как версия PHP, наличие конфигурационного
     * файла Energine а также файла перечня модулей системы.
     *
     * @return void
     * @access public
     */

    public function checkEnvironment() {
        $this->title('Проверка системного окружения');

        //А что за PHP версия используется?
        if (floatval(phpversion()) < MIN_PHP_VERSION) {
            throw new Exception('Вашему РНР нужно еще немного подрости. Минимальная допустимая версия ' . MIN_PHP_VERSION);
        }
        $this->text('Версия РНР ', floatval(phpversion()), ' соответствует требованиям');

        //При любом действии без конфига нам не обойтись
        if (!file_exists($configName = '../system.config.php')) {
            throw new Exception('Не найден конфигурационный файл system.config.php. По хорошему, он должен лежать в корне проекта.');
        }

        $this->config = include_once($configName);

        // Если скрипт запущен не с консоли, необходимо вычислить хост сайта и его рут директорию
        if (!$this->isFromConsole) {
            $this->config['site']['domain'] = $this->getSiteHost();
            $this->config['site']['root'] = $this->getSiteRoot();
        }

        if (!is_array($this->config)) {
            throw new Exception('Странный какой то конфиг. Пользуясь ним я не могу ничего сконфигурить. Или возьмите нормальный конфиг, или - извините.');
        }

        //маловероятно конечно, но лучше убедиться
        if (!isset($this->config['site']['debug'])) {
            throw new Exception('В конфиге ничего не сказано о режиме отладки. Это плохо. Так я работать не буду.');
        }
        $this->text('Конфигурационный файл подключен и проверен');

        //Если режим отладки отключен - то и говорить дальше не о чем
        if (!$this->config['site']['debug']) {
            throw new Exception('Нет. С отключенным режимом отладки я работать не буду, и не просите. Запускайте меня после того как исправите в конфиге ["site"]["debug"] с 0 на 1.');
        }
        $this->text('Режим отладки включен');

        //А задан ли у нас перечень модулей?
        if (!isset($this->config['modules']) && empty($this->config['modules'])) {
            throw new Exception('Странно. Отсутствует перечень модулей. Я могу конечно и сам посмотреть, что находится в папке core/modules, но как то это не кузяво будет. ');
        }
        $this->text('Перечень модулей:', implode(PHP_EOL, $this->config['modules']));
    }

    /**
     * Обновляет Host и Root сайта в таблице share_sites.
     *
     * @return void
     * @access private
     */

    private function updateSitesTable() {
        $this->text('Обновляем таблицу share_sites...');
        $this->dbConnect->query("UPDATE share_sites SET site_host = '" . $this->config['site']['domain'] . "',"
                . "site_root = '" . $this->config['site']['root'] . "'");
    }

    /**
     * Проверка возможности соединения с БД.
     *
     * @return void
     * @access private
     */

    private function checkDBConnection() {
        $this->title('Настройки базы данных');
        if (!isset($this->config['database']) || empty($this->config['database'])) {
            throw new Exception('В конфиге нет информации о подключении к базе данных');
        }
        $dbInfo = $this->config['database'];

        //валидируем все скопом
        foreach (array('host' => 'адрес хоста', 'db' => 'имя БД', 'username' => 'имя пользователя', 'password' => 'пароль') as $key => $description) {
            if (!isset($dbInfo[$key]) && empty($dbInfo[$key])) {
                throw new Exception('Удивительно, но не указан параметр: ' . $description . '  (["database"]["' . $key . '"])');
            }
        }
        try {
            //Поскольку ошибка при конструировании ПДО объекта генерит кроме исключения еще и варнинги
            //используем пустой обработчик ошибки с запретом всплывания(return true)
            //все это сделано только для того чтобы не выводился варнинг

            set_error_handler(create_function('', 'return true;'));
            $connect = new PDO(
                sprintf(
                    'mysql:host=%s;port=%s;dbname=%s',

                    $dbInfo['host'],
                    (isset($dbInfo['port']) && !empty($dbInfo['port'])) ? $dbInfo['port'] : 3306,
                    $dbInfo['db']
                ),
                $dbInfo['username'],
                $dbInfo['password'],
                array(
                    PDO::ATTR_PERSISTENT => false,
                    PDO::ATTR_EMULATE_PREPARES => true,
                    PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true
                ));

            $this->dbConnect = $connect;
        }
        catch (Exception $e) {
            throw new Exception('Не удалось соединиться с БД по причине: ' . $e->getMessage());
        }
        restore_error_handler();
        $connect->query('SET NAMES utf8');

        $this->text('Соединение с БД ', $dbInfo['db'], ' успешно установлено');
    }

    /**
     * Функция для вызова метода класса.
     * Фактически, запускает один из режимов
     * установки системы.
     *
     * @param string $action
     * @param array $arguments
     * @return void
     * @access public
     */

    public function execute($action, $arguments) {
        if (!method_exists($this, $methodName = $action . 'Action')) {
            throw new Exception('Подозрительно все это... Либо программисты че то не учли, либо.... произошло непоправимое.');
        }
        call_user_func_array(array($this, $methodName), $arguments);
        //$this->{$methodName}();
    }


    /**
     * Очищает папку Cache от ее содержимого.
     * @TODO определится с именем папки
     * @return void
     * @access private
     */
    private function clearCacheAction() {
        $this->title('Очищаем кеш');
        $this->cleaner('../../cache');
    }

    /**
     * Запуск полной установки системы,
     * включающей генерацию symlinks,
     * проверку соединения с БД и обновление
     * таблицы share_sites.
     *
     * @return void
     * @access private
     */

    private function installAction() {
        $this->checkDBConnection();
        $this->updateSitesTable();
        $this->linkerAction();
        $this->robotsAction();
    }

    /**
     * Проверка конфигурации модуля СЕО
     * Для правильной работы он должен иметь
     * следующие параметры:
     * sitemapSegment - имя сегмента карты сайта (по умолчанию google-sitemap)
     * sitemapTemplate - имя файла шаблона карты сайта (по умолчанию google_sitemap)
     * maxVideosInMap - максимальное количество записей
     * в карте расположения видео сайта (по умолчанию 5000)
     * @return void
     * @access private
     */
    private function isSeoConfigured() {
        if (!array_key_exists('seo', $this->config)) {
            return false;
        }
        foreach (array('sitemapSegment', 'sitemapTemplate', 'maxVideosInMap') as $seoParam) {
            if (!array_key_exists($seoParam, $this->config['seo'])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Генерация файла robots.txt
     * Создаем ссылки на sitemap всех поддоменов
     *
     * @return void
     * @access private
     */
    private function robotsAction() {
        if (!$this->isSeoConfigured()) {
            $this->title('Не сконфигурирован СЕО модуль. Robots.txt генерируется для запрета индексации сайта.');
            $this->generateRobotsTxt(false);
            return;
        }
        $this->checkDBConnection();
        $this->title('Генерация файла robots.txt');
        $this->generateRobotsTxt();
        $this->title('Добавление информации о сегменте ' . $this->config['seo']['sitemapSegment']);
        $this->createSitemapSegment();
    }

    /**
     * Создаем сегмент google sitemap в share_sitemap
     * и даем на него права на просмотр для не авторизированных
     * пользователей. Имя сегмента следует указать в конфиге.
     *
     * @return void
     * @access private
     */
    private function createSitemapSegment() {
        $this->dbConnect->query('INSERT INTO share_sitemap(site_id,smap_layout,smap_content,smap_segment,smap_pid) '
                . 'SELECT sso.site_id,\'' . $this->config['seo']['sitemapTemplate'] . '.layout.xml\','
                . '\'' . $this->config['seo']['sitemapTemplate'] . '.content.xml\','
                . '\'' . $this->config['seo']['sitemapSegment'] . '\','
                . '(SELECT smap_id FROM share_sitemap ss2 WHERE ss2.site_id = sso.site_id AND smap_pid IS NULL LIMIT 0,1) '
                . 'FROM share_sites sso '
                . 'WHERE site_is_indexed AND site_is_active '
                . 'AND (SELECT COUNT(ssi.site_id) FROM share_sites ssi '
                . 'INNER JOIN share_sitemap ssm ON ssi.site_id = ssm.site_id '
                . 'WHERE ssm.smap_segment = \'' . $this->config['seo']['sitemapSegment'] . '\' AND ssi.site_id = sso.site_id) = 0');
        $smIdsInfo = $this->dbConnect->query('SELECT smap_id FROM share_sitemap WHERE '
                . 'smap_segment = \'' . $this->config['seo']['sitemapSegment'] . '\'');
        while ($smIdInfo = $smIdsInfo->fetch()) {
            $this->dbConnect->query('INSERT INTO share_access_level SELECT ' . $smIdInfo[0] . ',group_id,'
                    . '(SELECT right_id FROM `user_group_rights` WHERE right_const = \'ACCESS_READ\') FROM `user_groups` ');
            $this->dbConnect->query('INSERT INTO share_sitemap_translation(smap_id,lang_id,smap_name,smap_is_disabled) '
                    . 'VALUES (' . $smIdInfo[0] . ',(SELECT lang_id FROM `share_languages` WHERE lang_default),\'Google sitemap\',0)');
        }
    }


    /**
     * Заполняем файл robots.txt
     * Ссылками на sitemaps
     * Sitemap: http://example.com/sm.xml
     * Если не сконфигурирован модуль СЕО, то запрещаем
     * индексацию сайта.
     *
     * @param $allowRobots
     * @return void
     * @access private
     */
    private function generateRobotsTxt($allowRobots = true) {
        $file = '../robots.txt';
        if (!is_writable('../')) {
            throw new Exception('Невозможно создать файл robots.txt');
        }
        if (!$allowRobots) {
            file_put_contents($file, 'User-agent: *' . PHP_EOL . 'Disallow: /' . PHP_EOL);
            return;
        }
        file_put_contents($file, 'User-agent: *' . PHP_EOL . 'Allow: /' . PHP_EOL);
        $domainsInfo = $this->dbConnect->query('SELECT ss.site_id,sd.domain_protocol,sd.domain_host,sd.domain_root FROM share_sites ss '
                . 'INNER JOIN share_domain2site d2s ON ss.site_id = d2s.site_id '
                . 'INNER JOIN share_domains sd ON  sd.domain_id = d2s.domain_id WHERE ss.site_is_indexed');
        while ($domainInfo = $domainsInfo->fetch()) {
            file_put_contents($file, 'Sitemap: ' . $domainInfo['domain_protocol'] . '://' . $domainInfo['domain_host']
                    . $domainInfo['domain_root'] . $this->config['seo']['sitemapSegment']
                    . PHP_EOL, FILE_APPEND);
        }
    }

    /**
     * Запуск установки системы,
     * включающей генерацию symlinks.
     *
     * @return void
     * @access private
     */

    private function linkerAction() {

        $this->title('Создание символических ссылок');


        foreach ($this->htdocsDirs as $dir) {
            $dir = '../' . $dir;

            if (!file_exists($dir)) {
                if (!@mkdir($dir, 0755, true)) {
                    throw new Exception('Невозможно создать директорию:' . $dir);
                }
            }
            else {
                $this->cleaner($dir);
            }
        }
        //На этот момент у нас есть все необходимые директории в htdocs и они пустые
        foreach ($this->htdocsDirs as $dir) {

            //сначала проходимся по модулям ядра
            foreach (array_reverse($this->config['modules']) as $module) {
                $this->linkCore(
                    '../' . CORE . DIRECTORY_SEPARATOR . MODULES . DIRECTORY_SEPARATOR . $module . DIRECTORY_SEPARATOR . $dir . DIRECTORY_SEPARATOR . '*',
                        '../' . $dir,
                    sizeof(explode(DIRECTORY_SEPARATOR, $dir)));

            }
            $this->linkSite(
                '../' . SITE . DIRECTORY_SEPARATOR . MODULES . DIRECTORY_SEPARATOR . '*' . DIRECTORY_SEPARATOR . $dir . DIRECTORY_SEPARATOR . '*',
                    '../' . $dir
            );
        }

        $this->text('Символические ссылки расставлены');
    }

    private function iterateUploads($directory, $PID = null) {
        //static $counter = 0;


        $iterator = new DirectoryIterator($directory);
        foreach ($iterator as $fileinfo) {
            if (!$fileinfo->isDot() && (substr($fileinfo->getFilename(), 0, 1) != '.')) {

                $uplPath = str_replace('../', '', $fileinfo->getPathname());
                $filename = $fileinfo->getFilename();

                echo $uplPath . PHP_EOL;
                $res = $this->dbConnect->query('SELECT upl_id, upl_pid FROM ' . self::UPLOADS_TABLE . ' WHERE upl_path = "' . $uplPath . '"');
                if(!$res) throw new Exception('ERROR');

                $data = $res->fetch(PDO::FETCH_ASSOC);

                if (empty($data)) {
                    $uplWidth = $uplHeight = 'NULL';
                    if (!$fileinfo->isDir()) {
                        $childsCount = 'NULL';
                        $finfo = new finfo(FILEINFO_MIME_TYPE);
                        $mimeType = $finfo->file($fileinfo->getPathname());

                        switch ($mimeType) {
                            case 'image/jpeg':
                            case 'image/png':
                            case 'image/gif':
                                $tmp = getimagesize($fileinfo->getPathname());
                                $internalType = 'image';
                                $uplWidth = $tmp[0];
                                $uplHeight = $tmp[1];
                                break;
                            case 'video/x-flv':
                            case 'video/mp4':
                                $internalType = 'video';
                                break;
                            case 'text/csv':
                                $internalType = 'text';
                                break;
                            case 'application/zip':
                                $internalType = 'zip';
                                break;
                            default:
                                $internalType = 'unknown';
                                break;
                        }
                        $title = $fileinfo->getBasename('.'.$fileinfo->getExtension());
                    }
                    else {
                        $mimeType = 'unknown/mime-type';
                        $internalType = 'folder';
                        $childsCount = 0;
                        $title = $fileinfo->getBasename();
                    }

                    $PID = (empty($PID))?'NULL':$PID;

                    $r = $this->dbConnect->query($q = sprintf('INSERT INTO ' . self::UPLOADS_TABLE . ' (upl_pid, upl_childs_count, upl_path, upl_filename, upl_name, upl_title,upl_internal_type, upl_mime_type, upl_width, upl_height) VALUES(%s, %s, "%s", "%s", "%s", "%s", "%s", "%s", %s, %s)', $PID, $childsCount, $uplPath, $filename, $title, $title, $internalType, $mimeType, $uplWidth, $uplHeight));
                    if(!$r) throw new Exception('ERROR INSERTING');
                    //$this->text($uplPath);
                    if($fileinfo->isDir()){
                        $newPID = $this->dbConnect->lastInsertId();
                    }

                    //$this->dbConnect->lastInsertId();
                }
                else {
                    $newPID = $data['upl_pid'];
                    $r = $this->dbConnect->query('UPDATE ' . self::UPLOADS_TABLE . ' SET upl_is_active=1 WHERE upl_id="' . $data['upl_id'] . '"');
                    if(!$r) throw new Exception('ERROR UPDATING');
                }
                if ($fileinfo->isDir()) {
                    $this->iterateUploads($fileinfo->getPathname(), $newPID);
                }

            }
        }
    }

    private function syncUploadsAction($uploadsPath = self::UPLOADS_PATH) {
        $this->checkDBConnection();
        $this->title('Синхронизация папки с загрузками');
        $this->dbConnect->beginTransaction();
        if(substr($uploadsPath, -1) == '/'){
            $uploadsPath = substr($uploadsPath, 0, -1);
        }
        $r = $this->dbConnect->query('SELECT upl_id FROM '.self::UPLOADS_TABLE.' WHERE upl_path LIKE "'.$uploadsPath.'"');
        if(!$r){
            throw new Exception('Репозиторий по такому пути не существует');
        }
        $PID = $r->fetchColumn();
        if(!$PID){
            throw new Exception('Странный какой то идентификатор родительский.');
        }
        $uploadsPath .= '/';

        try {
            $this->dbConnect->query('UPDATE ' . self::UPLOADS_TABLE . ' SET upl_is_active=0 WHERE upl_path LIKE "'.$uploadsPath.'%"');
            $this->iterateUploads('../' . $uploadsPath, $PID);
            $this->dbConnect->commit();
        }
        catch (Exception $e) {
            $this->dbConnect->rollBack();
            throw new Exception($e->getMessage());
        }

    }

    /**
     * Очищаем папку от того что в ней было.
     *
     * @param $dir
     * @return void
     * @access private
     */

    private function cleaner($dir) {
        if (is_dir($dir)) {
            if ($dh = opendir($dir)) {
                while ((($file = readdir($dh)) !== false)) {
                    if (!in_array($file, array('.', '..'))) {
                        if (is_dir($file = $dir . DIRECTORY_SEPARATOR . $file)) {
                            if(is_link($file)){
                                unlink($file);
                            }
                            else {
                                $this->cleaner($file);
                                rmdir($file);
                            }
                            $this->text('Удаляем директорию ', $file);
                        }
                        else {
                            $this->text('Удаляем файл ', $file);
                            unlink($file);
                        }
                    }
                }
                closedir($dh);
            }
        }
    }

    /**
     * Расставляем симлинки для модулей ядра
     *
     * @param string $globPattern - паттерн для выбора файлов
     * @param string $module путь к модулю ядра
     * @param int $level - финт ушами для формирования относительных путей для симлинков, при рекурсии инкрементируется
     * @return void
     * @access private
     */

    private function linkCore($globPattern, $module, $level = 1) {

        $fileList = glob($globPattern);

        if (!empty($fileList)) {
            foreach ($fileList as $fo) {
                if (is_dir($fo)) {
                    mkdir($dir = $module . DIRECTORY_SEPARATOR . basename($fo));
                    $this->linkCore($fo . DIRECTORY_SEPARATOR . '*', $dir, $level + 1);
                }
                else {
                    //Если одним из низших по приоритету модулей был уже создан симлинк
                    //то затираем его нафиг
                    if (file_exists($dest = $module . DIRECTORY_SEPARATOR . basename($fo))) {
                        unlink($dest);
                    }
                    $this->text('Создаем симлинк ', str_repeat('..' . DIRECTORY_SEPARATOR, $level) . $fo, ' --> ', $dest);
                    if (!@symlink(str_repeat('..' . DIRECTORY_SEPARATOR, $level - 1) . $fo, $dest)) {
                        throw new Exception('Не удалось создать символическую ссылку с ' . str_repeat('..' . DIRECTORY_SEPARATOR, $level - 1) . $fo . ' на ' . $dest);
                    }

                }
            }
        }
    }

    /**
     * Создание symlinks для модулей сайта.
     *
     * @param string $globPattern
     * @param string $dir
     * @return void
     * @access private
     */

    private function linkSite($globPattern, $dir) {

        $fileList = glob($globPattern);
        //Тут тоже хитрый финт ушами с относительным путем вычисляющимся как количество уровней вложенности исходной папки + еще один
        $relOffset = str_repeat('..' . DIRECTORY_SEPARATOR, sizeof(explode(DIRECTORY_SEPARATOR, $dir)) - 1);
        if (!empty($fileList)) {
            foreach ($fileList as $fo) {
                list(, , , $module) = explode(DIRECTORY_SEPARATOR, $fo);
                if (!file_exists($dir . DIRECTORY_SEPARATOR . $module)) {
                    mkdir($dir . DIRECTORY_SEPARATOR . $module);
                }
                $this->text('Создаем симлинк ', $srcFile = $relOffset.$fo, ' на ', $linkPath = $dir . DIRECTORY_SEPARATOR . $module . DIRECTORY_SEPARATOR . basename($fo));
                if (file_exists($linkPath)) {
                    unlink($linkPath);
                }
                symlink($srcFile, $linkPath);
            }
        }
    }

    /**
     * Вывод заголовок текущего действия установки.
     *
     * @param string $text
     * @return void
     * @access private
     */

    private function title($text) {
        echo str_repeat('*', 80), PHP_EOL, $text, PHP_EOL, PHP_EOL;
    }

    /**
     * Выводит все переданные ей параметры в виде строки.
     *
     * @param string $text
     * @return void
     * @access private
     */

    private function text() {
        foreach (func_get_args() as $text) {
            echo $text;
        }
        echo PHP_EOL;
    }

}
