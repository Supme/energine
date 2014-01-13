<?php
/**
 * @file
 * ComponentContainer.
 *
 * It contains the definition to:
 * @code
class ComponentContainer
@endcode
 *
 * @author dr.Pavka
 * @copyright Energine 2010
 *
 * @version 1.0.0
 */

/**
 * Container of components.
 *
 * @code
class ComponentContainer
@endcode
 */
class ComponentContainer extends Object implements IBlock, Iterator{
    /**
     * Defines whether the component container is enabled.
     * @var bool $enabled
     */
    private  $enabled= true;
    /**
     * Properties.
     * @var array $properties
     */
    private $properties = array();
    /**
     * Container name.
     * @var string $name
     */
    private $name;
    /**
     * Array of IBlock.
     * @var array $blocks
     */
    private $blocks = array();
    /**
     * Iterator index.
     * @var int $iteratorIndex
     */
    private $iteratorIndex = 0;
    /**
     * Array of child names.
     * @var array $childNames
     */
    private $childNames = array();
    /**
     * @var Document $document
     */
    private $document;
    /**
     * @param string $name Component name.
     * @param array $properties Component properties.
     */
    public function __construct($name, array $properties = array()) {
        $this->name = $name;
        $this->document = E()->getDocument();

        $this->properties = $properties;
        if (!isset($this->properties['tag'])) {
            $this->properties['tag'] = 'container';
        }
        $this->document->componentManager->register($this);
    }

    /**
     * Add block.
     * @param IBlock $block New block.
     */
    public function add(IBlock $block) {
        $this->blocks[$block->getName()] = $block;
    }
    /**
     * Create component container from description.
     *
     * @throws SystemException ERR_NO_CONTAINER_NAME
     *
     * @param SimpleXMLElement $containerDescription Container description.
     * @param array $additionalAttributes Additional attributes.
     * @return ComponentContainer
     */
    static public function createFromDescription(SimpleXMLElement $containerDescription, array $additionalAttributes = array()) {
        $attributes = $containerDescription->attributes();
        if (in_array($containerDescription->getName(), array('page', 'content'))) {
            $properties['name'] = $containerDescription->getName();
        }
        elseif (!isset($attributes['name'])) {
            throw new SystemException('ERR_NO_CONTAINER_NAME', SystemException::ERR_DEVELOPER);
        }
        foreach ($attributes as $propertyName => $propertyValue) {
            $properties[(string) $propertyName] = (string) $propertyValue;
        }
        $name = $properties['name'];
        unset($properties['name']);
        $properties = array_merge($properties, $additionalAttributes);

        $result = new ComponentContainer($name, $properties);

        foreach ($containerDescription->children() as $blockDescription) {
            $result->add(ComponentManager::createBlockFromDescription($blockDescription));
        }

        return $result;
    }

    /**
     * Check if the container is empty.
     * @return bool
     */
    public function isEmpty() {
        return (boolean) sizeof($this->childs);
    }
    /**
     * Get the ComponentContainer::$name.
     * @return string
     */
    public function getName() {
        return $this->name;
    }

    /**
     * Set property to the ComponentContainer::$properties.
     * @param string $propertyName Property name.
     * @param string $propertyValue Property value.
     */
    public function setProperty($propertyName, $propertyValue) {
        $this->properties[(string) $propertyName] = (string) $propertyValue;
    }

    /**
     * Get property value from ComponentContainer::$properties by property name.
     * @param string $propertyName Property name.
     * @return string or null
     */
    public function getProperty($propertyName) {
        $result = null;
        if (isset($this->properties[$propertyName])) {
            $result = $this->properties[$propertyName];
        }
        return $result;
    }

    /**
     * Remove property from ComponentContainer::$properties.
     * @param string $propertyName Property name.
     */
    public function removeProperty($propertyName) {
        unset($this->properties[$propertyName]);
    }

    /**
     * Build DOM document.
     *
     * @return DOMElement | DOMElement[]
     */
    public function build() {
        $doc = new DOMDocument('1.0', 'UTF-8');
        $containerDOM = $doc->createElement($this->properties['tag']);
        $containerDOM->setAttribute('name', $this->getName());
        $doc->appendChild($containerDOM);
        foreach ($this->properties as $propertyName => $propertyValue) {
            if ($propertyName != 'tag') {
                $containerDOM->setAttribute($propertyName, $propertyValue);
            }
        }
        foreach ($this->blocks as $block) {
            if (
                $block->enabled()
                &&
                ($this->document->getRights() >= $block->getCurrentStateRights())
            ) {
                $blockDOM = $block->build();
                if ($blockDOM instanceof DOMDocument) {
                    $blockDOM =
                        $doc->importNode($blockDOM->documentElement, true);
                    $containerDOM->appendChild($blockDOM);
                }
            }
        }

        return $doc;
    }
    /**
     * Call @c run() method for all @link ComponentContainer::$blocks blocks@endlink.
     */
    public function run() {
        foreach ($this->blocks as $block) {
            if (
                $block->enabled()
                &&
                ($this->document->getRights() >= $block->getCurrentStateRights())
            ) {
                $block->run();
            }
        }
    }

    /**
     * Rewind the Iterator to the first element.
     * @link http://php.net/manual/en/iterator.rewind.php
     */
    public function rewind() {
        $this->childNames = array_keys($this->blocks);
        $this->iteratorIndex = 0;
    }

    /**
     * Checks if current position is valid.
     * @link http://php.net/manual/en/iterator.valid.php
     * @return bool
     */
    public function valid() {
        return isset($this->childNames[$this->iteratorIndex]);
    }

    /**
     * Return the current child name.
     * @link http://php.net/manual/en/iterator.key.php
     * @return string
     */
    public function key() {
        return $this->childNames[$this->iteratorIndex];
    }

    /**
     * Move forward to next element.
     * @link http://php.net/manual/en/iterator.next.php
     */
    public function next() {
        $this->iteratorIndex++;
    }

    /**
     * Return the current block.
     * @link http://php.net/manual/en/iterator.current.php
     * @return IBlock
     */
    public function current() {
        return $this->blocks[$this->childNames[$this->iteratorIndex]];
    }

    /**
     * Disable ComponentContainer.
     */
    public function disable(){
        $this->enabled = false;

        foreach ($this->blocks as $block) {
            $block->disable();
        }
    }
    //todo VZ: I do not understand your description.
    /**
     * Get whether the ComponentContainer is enabled.
     *
     * Метод всегда возвращает true
     * Используется для единообразного вызова наследников Block
     *
     * @see ComponentContainer::$enabled
     *
     * @return bool
     */
    public function enabled() {
        return $this->enabled;
    }

    //todo VZ: For what is this?
    /**
     * Всегда возвращает минимальное значение прав
     * Используется для единообразного вызова наследников Block
     *
     * @return int
     */
    public function getCurrentStateRights() {
        return 0;
    }
}
