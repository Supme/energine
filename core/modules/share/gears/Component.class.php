<?php
/**
 * @file
 * Component, IBuilder.
 *
 * Contain the definition to:
 * @code
class Component;
interface IBuilder;
@endcode
 *
 * @author 1m.dm
 * @copyright Energine 2006
 *
 * @version 1.0.0
 */

/**
 * Page component.
 *
 * @code
class Component;
@endcode
 */
class Component extends DBWorker implements IBlock {
    /**
     * Default state name: @code 'main' @endcode
     *
     * @var string DEFAULT_STATE_NAME
     */
    const DEFAULT_STATE_NAME = 'main';

    /**
     * Document DOM of the component.
     * @var DOMDocument $doc
     */
    protected $doc;

    /**
     * Instance of the Request object.
     * @var Request $request
     */
    protected $request;

    /**
     * Component parameters.
     * @var array $params
     */
    protected $params;

    /**
     * Page document.
     * @var Document $document
     */
    public $document;

    /**
     * Module name that owns the component.
     * @var string $module
     */
    protected $module;

    /**
     * Response object exemplar.
     * @var Response $response
     */
    protected $response;

    /**
     * Rights level required for running component's method.
     * @var int $rights
     */
    private $rights;

    /**
     * Component name.
     * @var string $name
     */
    private $name;

    /**
     * Indicator, that indicates whether the component is active.
     * @var boolean $enabled
     */
    private $enabled = true;

    /**
     * State parameters.
     * @var array $stateParams
     */
    private $stateParams = false;

    /**
     * Component properties.
     * @var array $properties
     */
    private $properties = array();

    /**
     * List of errors, that occurs by component work.
     * @var array $errors
     */
    private $errors = array();

    //todo VZ: Remove this?
    /**
     * Результат является объектом класса DOMNode или boolean:
     * true - компонент отработал успешно, но ничего не вывел;
     * false - произошла ошибка при работе компонента.
     *
     * @var mixed результат работы компонента
     */
    //private $result;

    /**
     * Name of the current component state.
     * @var string $state
     */
    private $state = self::DEFAULT_STATE_NAME;

    /**
     * Builder of the component result.
     * @var AbstractBuilder $builder
     */
    protected $builder = false;

    /**
     * Component configurations.
     * @var ComponentConfig $config
     */
    protected $config;

    /**
     * @param string $name Component name.
     * @param string $module Module name.
     * @param array $params Component parameters.
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
        //$this->config = new ComponentConfig($this->getParam('config'), get_class($this), $this->module);
        $this->determineState();
        //Определяем sample
        $ifs = class_implements($this);

        if (!empty($ifs)) {
            foreach ($ifs as $iname){
                if(strtolower(substr($iname, 0, 6)) == 'sample'){
                    $this->setProperty('sample', substr($iname, 6));
                    break;
                }
            }
        }
    }

    /**
     * Get the @c 'active' parameter of the component.
     *
     * @attention This is @b final function.
     *
     * @return bool
     */
    final protected function isActive() {
        return $this->params['active'];
    }

    /**
     * Get component configurations.
     *
     * @note This method was created for redefining configurations in the children.
     * @attention This is @b final function.
     *
     * @return ComponentConfig
     */
    protected function getConfig() {
        if (!$this->config) {
            $this->config = new ComponentConfig($this->getParam('config'), get_class($this), $this->module);
        }
        return $this->config;
    }

    /**
     * Set component builder.
     *
     * @attention This is @b final function.
     *
     * @param IBuilder $builder Builder.
     */
    final protected function setBuilder(IBuilder $builder) {
        $this->builder = $builder;
    }

    /**
     * Get component builder.
     *
     * @attention This is @b final function.
     *
     * @return AbstractBuilder
     */
    final protected function getBuilder() {
        return $this->builder;
    }

    /**
     * Defines allowable component parameters and their default values as an array like <tt>array(paramName => defaultValue)</tt>
     *
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
     * Set component parameter if such exist.
     *
     * If this parameter is not exist SystemException will be generated.
     *
     * @throws SystemException 'ERR_DEV_NO_PARAM'
     *
     * @param string $name Parameter name.
     * @param mixed $value parameter value.
     */
    protected function setParam($name, $value) {
        if (!isset($this->params[$name])) {
            throw new SystemException('ERR_DEV_NO_PARAM', SystemException::ERR_DEVELOPER, $name);
        }
        if ($name == 'active') {
            $value = (bool)$value;
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
            } elseif (is_array($value)) {
                //$this->params[$name] = array_values($value);
                $this->params[$name] = $value;
            } else {
                $this->params[$name] = $value;
            }
        }
    }

    /**
     * Get component parameter.
     *
     * If such parameter is not exist @b @c null will be returned.
     *
     * @attention This is @b final function.
     *
     * @param string $name Parameter name.
     * @return mixed
     */
    final protected function getParam($name) {
        return (isset($this->params[$name]) ? $this->params[$name] : null);
    }

    /**
     * Determine current state.
     *
     * @todo Если компонент активный - то передача значения в параметре state - ни на что не влияет,
     * @todo все равно используется состояние определяемое конфигом
     * @todo непонятно то ли это фича то ли бага
     *
     * @attention This is @b final function.
     */
    final private function determineState() {
        //Текущее действие берем из параметров
        //По умолчанию оно равно self::DEFAULT_STATE_NAME
        $this->state = $this->getParam('state');

        // если это основной компонент страницы, должен быть конфигурационный файл
        if ($this->isActive()) {
            if ($this->getConfig()->isEmpty()) {
                throw new SystemException('ERR_DEV_NO_COMPONENT_CONFIG', SystemException::ERR_DEVELOPER, $this->getName());
            }

            // определяем действие по запрошенному URI
            $action =
                $this->getConfig()->getActionByURI($this->request->getPath(Request::PATH_ACTION, true));
            if ($action !== false) {
                $this->state = $action['name'];
                $this->stateParams = $action['params'];
            }

        } // если имя действия указано в POST-запросе - используем его
        elseif (isset($_POST[$this->getName()]['state'])) {
            $this->state = $_POST[$this->getName()]['state'];
        }

        // устанавливаем права на действие из конфигурации, если определены
        if (!$this->getConfig()->isEmpty()) {
            $this->getConfig()->setCurrentState($this->getState());
            $sc = $this->getConfig()->getCurrentStateConfig();

            if (isset($sc['rights'])) {
                $this->rights = (int)$sc['rights'];
            }

            if ($csp = $this->getConfig()->getCurrentStateParams()) {
                if($this->stateParams){
                    $this->stateParams = array_merge($this->stateParams, $csp);
                }
                else {
                    $this->stateParams = $csp;
                }
            }
        }

    }

    /**
     * Get current state of the component.
     *
     * @attention This is @b final function.
     *
     * @return string
     */
    final public function getState() {
        return $this->state;
    }

    /**
     * Get current rights level of the user needed for running current component action.
     *
     * @attention This is @b final function.
     *
     * @return int
     */
    final public function getCurrentStateRights() {
        return (int)$this->rights;
    }

    /**
     * Get component name.
     *
     * @attention This is @b final function.
     *
     * @return string
     */
    final public function getName() {
        return $this->name;
    }

    public function run() {
        if (!method_exists($this, $this->getState())) {
            throw new SystemException(
                'ERR_DEV_NO_ACTION',
                SystemException::ERR_DEVELOPER,
                array($this->getState(), $this->getName())
            );
        }
        $params = $this->getStateParams();
        if (empty($params)) {
            $this->{$this->getState()}();
        } else {
            call_user_func_array(array($this, $this->getState()), $params);
        }

    }

    //todo VZ: Why true is returned?
    /**
     * Default action.
     *
     * @return boolean
     */
    protected function main() {
        $this->prepare(); // вызываем метод подготовки данных
        return true;
    }

    /**
     * Prepare data.
     *
     * It calls at the beginning of the method, that realize main action.
     */
    protected function prepare() {}

    /**
     * Disable component.
     *
     * @attention This is @b final function.
     */
    final public function disable() {
        $this->enabled = false;
    }

    /**
     * Enable component.
     *
     * @attention This is @b final function.
     */
    final public function enable() {
        $this->enabled = true;
    }

    /**
     * Get if the component enabled.
     *
     * @attention This is @b final function.
     *
     * @return boolean
     */
    final public function enabled() {
        return $this->enabled;
    }

    /**
     * Set/update property value.
     *
     * @attention This is @b final function.
     *
     * @param string $propName Property name.
     * @param mixed $propValue Property value.
     * @return void
     */
    final protected function setProperty($propName, $propValue) {
        $this->properties[$propName] = $propValue;
    }

    //todo VZ: It is better to throw an exception instead of return false. What if the property value has boolean type?
    /**
     * Get property value.
     *
     * @attention This is @b final function.
     *
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
     * Remove property.
     *
     * @attention This is @b final function.
     *
     * @param string $propName Property name.
     */
    final protected function removeProperty($propName) {
        unset($this->properties[$propName]);
    }

    public function build() {
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
            } else {
                $el = $this->doc->createElement('result', $builderResult);
                $el->setAttribute('xml:id', 'result');
                $result->appendChild($el);
            }
        }
        $this->doc->appendChild($result);
        $result = $this->doc;

        return $result;
    }


    /**
     * Get state parameters.
     *
     * @todo Тут какой то беспорядок, то false то пустой array
     *
     * @param bool $returnAsAssocArray Defines whether an associative or normal array should be returned.
     * @return array
     */
    public function getStateParams($returnAsAssocArray = false) {
        if (!$returnAsAssocArray && ($this->stateParams !== false)) {
            return array_values($this->stateParams);
        }

        return $this->stateParams;
    }

    /**
     * Set state parameter.
     * Usually this is required by dynamic component creation and assigning him state parameter from other component.
     *
     * @param string $paramName Parameter name.
     * @param mixed $paramValue Parameter value.
     */
    public function setStateParam($paramName, $paramValue) {
        $this->stateParams[$paramName] = $paramValue;
    }
}

//todo VZ: What is the difference between IBuilder and IDocument?
/**
 * Builder interface.
 *
 * @code
interface IBuilder;
@endcode
 */
interface IBuilder {
    /**
     * Get build result.
     * @return mixed
     */
    public function getResult();

    /**
     * Run building.
     * @return mixed
     */
    public function build();
}

