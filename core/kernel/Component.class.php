<?php

/**
 * Класс Component.
 *
 * @package energine
 * @subpackage core
 * @author 1m.dm
 * @copyright Energine 2006
 */


/**
 * Компонент страницы.
 *
 * @package energine
 * @subpackage core
 * @author 1m.dm
 */
class Component extends DBWorker implements IBlock {
    /**
     * Имя состояния по-умолчанию.
     */
    const DEFAULT_STATE_NAME = 'main';
    /**
     * @access protected
     * @var DOMDocument DOM-документ компонента
     */
    protected $doc;

    /**
     * @access protected
     * @var Request экземпляр объекта Request
     */
    protected $request;

    /**
     * @access protected
     * @var array параметры компонента
     */
    protected $params;

    /**
     * @access public
     * @var Document документ страницы
     */
    public $document;

    /**
     * @access protected
     * @var string имя модуля, которому принадлежит компонент
     */
    protected $module;

    /**
     * @access protected
     * @var Response экземпляр объекта Response
     */
    protected $response;

    /**
     * @access private
     * @var int уровень прав, необходимый для запуска метода компонента
     */
    private $rights;

    /**
     * @access private
     * @var string имя компонента
     */
    private $name;

    /**
     * @var boolean Флаг, указывающий на то, является ли компонент активным
     * @access private
     */

    private $enabled = true;
    /**
     * @access private
     * @var array параметры действия
     */
    private $actionParams = false;

    /**
     * @access private
     * @var array свойства компонента
     */
    private $properties = array();

    /**
     * @access private
     * @var array список ошибок, произошедших во время работы компонента
     */
    private $errors = array();

    /**
     * Результат является объектом класса DOMNode или boolean:
     * true - компонент отработал успешно, но ничего не вывел;
     * false - произошла ошибка при работе компонента.
     *
     * @access private
     * @var mixed результат работы компонента
     */
    private $result;

    /**
     * @access private
     * @var string имя текущего состояния компонента
     */
    private $state = self::DEFAULT_STATE_NAME;

    /**
     * @access protected
     * @var AbstractBuilder построитель результата работы компонента
     */
    protected $builder = false;

    /**
     * @access protected
     * @var ComponentConfig конфигурация компонента
     */
    protected $config;

    /**
     * Конструктор класса.
     *
     * @access public
     * @param string $name
     * @param string $module

     * @param array $params
     * @return void
     */
    public function __construct($name, $module, array $params = null) {
        parent::__construct();

        $this->name = $name;
        $this->module = $module;
        $this->document = E()->getDocument();
        $this->params = $this->defineParams();
        if (is_array($params)) {
            foreach ($params as $name => $value) {
                $this->setParam($name, $value);
            }
        }
        $this->rights = $this->getParam('rights');
        $this->response = E()->getResponse();
        $this->request = E()->getRequest();
        /**
         * @todo Проверить, можно ли перенести в build
         */
        $this->doc = new DOMDocument('1.0', 'UTF-8');
        $this->document->componentManager->register($this);
        $this->setProperty('template',
            $template = $this->request->getPath(Request::PATH_TEMPLATE, true));
        $this->setProperty(
            'single_template',
            ($this->document->getProperty('single') ? $template :
                    $template . 'single/' . $this->getName() . '/')
        );
        $this->config =
                new ComponentConfig($this->getParam('config'), get_class($this), $this->module);
        $this->determineAction();
    }

    /**
     * Возвращает флаг активности компонента
     *
     * @return bool
     * @access protected
     * @final
     */

    final protected function isActive() {
        return $this->params['active'];
    }


    /**
     * Устанавливает построитель компонента.
     *
     * @access protected
     * @final
     * @param IBuilder $builder
     * @return void
     */
    final protected function setBuilder(IBuilder $builder) {
        $this->builder = $builder;
    }

    /**
     * Возвращает построитель компонента.
     *
     * @access protected
     * @final
     * @return AbstractBuilder
     */
    final protected function getBuilder() {
        return $this->builder;
    }

    /**
     * Определяет допустимые параметры компонента и их значения по-умолчанию
     * в виде массива array(paramName => defaultValue).
     *
     * @access protected
     * @return array
     */
    protected function defineParams() {
        return array(
            'state' => $this->state,
            'rights' => $this->document->getRights(),
            'config' => false,
            'active' => false,
        );
    }

    /**
     * Устанавливает значение параметра компонента, если такой существует.
     * В противном случае возбуждается исключение.
     *
     * @access protected
     * @param string $name
     * @param mixed $value
     * @return void
     */
    protected function setParam($name, $value) {
        if (!isset($this->params[$name])) {
            throw new SystemException('ERR_DEV_NO_PARAM', SystemException::ERR_DEVELOPER, $name);
        }
        if ($name == 'active') {
            $value = (bool) $value;
        }
        /*if (in_array($name, array('state','configFilename', 'active'))) {
            throw new SystemException('ERR_DEV_INVARIANT_PARAM', SystemException::ERR_DEVELOPER, $name);
        }*/

        // если новое значение пустое - оставляем значение по-умолчанию
        if (!empty($value) || $value === false) {
            if (is_scalar($value)) {
                //ОБрабатываем случай передачи массива-строки в параметры
                $value = explode('|', $value);
                $this->params[$name] =
                        (sizeof($value) == 1) ? current($value) : $value;
            }
            elseif (is_array($value)) {
                //$this->params[$name] = array_values($value);
                $this->params[$name] = $value;
            }
            else {
                $this->params[$name] = $value;
            }
        }
    }

    /**
     * Возвращает значение параметра компонента, или null, если такого
     * параметра не существует.
     *
     * @access protected
     * @final
     * @param string $name
     * @return mixed
     */
    final protected function getParam($name) {
        return (isset($this->params[$name]) ? $this->params[$name] : null);
    }

    /**
     * Определяет текущее действие
     *
     * @return void
     * @access private
     */

    protected function determineAction() {
        //Текущее действие берем из параметров
        //По умолчанию оно равно self::DEFAULT_ACTION_NAME
        $this->state = $this->getParam('state');

        // если это основной компонент страницы, должен быть конфигурационный файл
        if ($this->isActive()) {
            if ($this->config->isEmpty()) {
                throw new SystemException('ERR_DEV_NO_COMPONENT_CONFIG', SystemException::ERR_DEVELOPER, $this->getName());
            }

            // определяем действие по запрошенному URI
            $action =
                    $this->config->getActionByURI($this->request->getPath(Request::PATH_ACTION, true));
            if ($action !== false) {
                $this->state = $action['name'];
                $this->actionParams = $action['params'];
            }

        }
            // если имя действия указано в POST-запросе - используем его
        elseif (isset($_POST[$this->getName()]['state'])) {
            $this->state = $_POST[$this->getName()]['state'];
        }
        // устанавливаем права на действие из конфигурации, если определены
        if (!$this->config->isEmpty()) {
            $this->config->setCurrentState($this->getState());

            if (!is_null($rights =
                    $this->config->getCurrentStateConfig()->getAttribute('rights'))) {
                $this->rights = (int) $rights;
            }
        }

    }

    /**
     * Определяет имя текущего состояния компонента.
     *
     * @access public
     * @return string
     * @final
     */
    final public function getState() {
        return $this->state;
    }

    /**
     * Возвращает уровень прав пользователя, необходимых для запуска
     * текущего действия компонента.
     *
     * @access public
     * @final
     * @return int
     */
    final public function getCurrentStateRights() {
        return (int) $this->rights;
    }

    /**
     * Возвращает имя компонента.
     *
     * @access public
     * @final
     * @return string
     */
    final public function getName() {
        return $this->name;
    }

    /**
     * Запускает компонент на исполнение.
     *
     * @access public
     * @final
     * @return void
     */
    final public function run() {
        if (
                $this->enabled()
                &&
                ($this->document->getRights() >= $this->getCurrentStateRights())
        ) {
            if (!method_exists($this, $this->getState())) {
                throw new SystemException(
                    'ERR_DEV_NO_ACTION',
                    SystemException::ERR_DEVELOPER,
                    array($this->getState(), $this->getName())
                );
            }
            $this->{
            $this->getState()
            }();
        }
    }

    /**
     * Действие по-умолчанию.
     *
     * @access protected
     * @return boolean
     */
    protected function main() {
        $this->prepare(); // вызываем метод подготовки данных
        return true;
    }

    /**
     * Метод подготовки данных.
     * Вызывается вначале работы метода, реализующего основное действие.
     *
     * @access protected
     * @return void
     */
    protected function prepare() {
    }

    /**
     * Отключает отображение компонента
     *
     * @return void
     * @access public
     * @final
     */

    final public function disable() {
        $this->enabled = false;
    }

    /**
     * Включает отображение компонента
     *
     * @return void
     * @access public
     * @final
     */

    final public function enable() {
        $this->enabled = true;
    }

    /**
     * Возвращает активность компонента
     *
     * @return boolean
     * @access public
     * @final
     */

    final public function enabled() {
        return $this->enabled;
    }

    /**
     * Устанавливает значение свойства компонента.
     *
     * @access protected
     * @final
     * @param string $propName
     * @param mixed $propValue
     * @return void
     */
    final protected function setProperty($propName, $propValue) {
        $this->properties[$propName] = $propValue;
    }

    /**
     * Возвращает значение свойства компонента.
     *
     * @access protected
     * @final
     * @param string $propName
     * @return mixed
     */
    final protected function getProperty($propName) {
        $result = false;
        if (isset($this->properties[$propName])) {
            $result = $this->properties[$propName];
        }
        return $result;
    }

    /**
     * Удаляет свойство компонента.
     *
     * @access protected
     * @final
     * @param string
     * @return void
     */
    final protected function removeProperty($propName) {
        unset($this->properties[$propName]);
    }

    /**
     * Строит результат работы компонента используя определённый построитель.
     *
     * @access public
     * @return DOMDocument
     */
    public function build() {
        $result = false;
        if (
                $this->enabled()
                &&
                ($this->document->getRights() >= $this->getCurrentStateRights())
        ) {
            $result = $this->doc->createElement('component');
            $result->setAttribute('name', $this->getName());
            $result->setAttribute('module', $this->module);
            $result->setAttribute('componentAction', $this->getState());
            $result->setAttribute('class', get_class($this));

            foreach ($this->properties as $propName => $propValue) {
                $result->setAttribute($propName, $propValue);
            }

            /*
            * Существует ли построитель и правильно ли он отработал?
            * Построитель может не существовать, если мы создаем компонент в котором нет данных.
            */
            if ($this->getBuilder() && $this->getBuilder()->build()) {
                $builderResult = $this->getBuilder()->getResult();
                if ($builderResult instanceof DOMNode) {
                    $result->appendChild(
                        $this->doc->importNode(
                            $builderResult,
                            true
                        )
                    );
                }
                else {
                    $el = $this->doc->createElement('result', $builderResult);
                    $el->setAttribute('xml:id', 'result');
                    $result->appendChild($el);
                }
            }
            $this->doc->appendChild($result);
            $result = $this->doc;
        }
        return $result;
    }


    /**
     * Генерирует ошибку и добавляет её в список ошибок компонента.
     *
     * @access protected
     * @param int $errorType тип ошибки
     * @param string $errorMessage сообщение об ошибке
     * @param mixed $errorCustomInfo дополнительная информация об ошибке
     * @return void
     */
    /*protected function generateError($errorType, $errorMessage, $errorCustomInfo = false) {
        $errorInfo = array(
            'type' => $errorType,
            'message' => $errorMessage,
            'custom' => $errorCustomInfo
        );

        array_push($this->errors, $errorInfo);

        // если ошибка не позволяет продолжить работу компонента, возбуждаем фиктивное исключение
        if ($errorType == SystemException::ERR_WARNING) {
            throw new DummyException;
        }
    }
*/
    /**
     * Обрабатывает ошибки, произошедшие во время работы компонента.
     * Возвращает DOMDocument, представляющий ошибки компонента, или
     * false, если никаких ошибок не произошло.
     *
     * @access public
     * @final
     * @return mixed
     */
    /*final public function handleErrors() {
        $result = false;
        if (sizeof($this->errors) > 0) {
            $dom_errorDoc = new DOMDocument('1.0', 'UTF-8');
            $dom_errors = $dom_errorDoc->createElement('errors');
            $dom_errors->setAttribute('title', $this->translate('TXT_ERRORS'));
            foreach ($this->errors as $errorInfo) {
                $dom_error =
                        $dom_errorDoc->createElement('error', $errorInfo['message']);
                $dom_error->setAttribute('type', $errorInfo['type']);

                if (isset($errorInfo['custom'])) {
                    if (is_array($errorInfo['custom'])) {
                        $customMessage = implode('. ', $errorInfo['custom']);
                    }
                    else {
                        $customMessage = $errorInfo['custom'];
                    }

                    if (!empty($customMessage)) {
                        $dom_error->nodeValue =
                                "{$errorInfo['message']} [ $customMessage ]";
                    }
                    else {
                        $dom_error->nodeValue = $errorInfo['message'];
                    }
                }
                $dom_errors->appendChild($dom_error);
            }
            $dom_errorDoc->appendChild($dom_errors);
            $result = $dom_errorDoc;
        }
        return $result;
    }*/

    /**
     * Возвращает параметры состояния.
     *
     * @param bool  - возвращает ассоциативный/обычный массив
     * @access public
     * @return array
     *
     * @todo Тут какой то беспорядок, то false то пустой array
     */
    public function getStateParams($returnAsAssocArray = false) {
        if (!$returnAsAssocArray && ($this->actionParams !== false)) {
            return array_values($this->actionParams);
        }

        return $this->actionParams;

    }
    /**
     * Устанавливает параметр состояния
     * Обычно такое требуется при динамическом создании компонента и передаче ему параметров стостяния из другого компонента
     *
     * @param  $paramName string
     * @param  $paramValue mixed
     * @return void
     */
    public function setStateParam($paramName, $paramValue) {
        $this->actionParams[$paramName] = $paramValue;
    }

}


interface IBuilder {
    public function getResult();

    public function build();
}