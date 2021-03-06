/**
 * @file Contain the description of the next classes:
 * <ul>
 *     <li>[Words]{@link Words}</li>
 *     <li>[ActiveList]{@link ActiveList}</li>
 *     <li>[DropBoxList]{@link DropBoxList}</li>
 *     <li>[AcplField]{@link AcplField}</li>
 * </ul>
 *
 * @author Pavel Dubenko
 *
 * @version 1.0.1
 */

/**
 * Words.
 *
 * @constructor
 * @param {string} initialValue String line.
 * @param {string} sep Delimiter.
 */
var Words = function(initialValue, sep) {
    /**
     * Delimiter.
     * @type {string}
     */
    this.separator = sep;

    /**
     * Delimited string line.
     * @type {Array}
     * @private
     */
    this._elements = initialValue.split(this.separator);

    /**
     * Current word index.
     * @type {number}
     */
    this.currentIndex = 0;

    /**
     * Set the word index.
     *
     * @param {number} index Word index.
     */
    this.setCurrentIndex = function(index) {
        if (this._elements[index]) {
            this.currentIndex = index;
        }
    };

    /**
     * Return the initial string line.
     *
     * @returns {string}
     */
    this.asString = function() {
        return this._elements.join(this.separator);
    };

    /**
     * Get the amount of delimited words.
     *
     * @returns {number}
     */
    this.getLength = function() {
        return this._elements.length;
    };

    /**
     * Get the word at the specified index.
     *
     * @param {number} index Word index.
     * @returns {string}
     */
    this.getAt = function(index) {
        return (index < this._elements.length && index >= 0)
            ? this._elements[index]
            : '';
    };

    /**
     * Reset the delimited word at the specific index.
     *
     * @param {number} index Word index.
     * @param {string} value New word.
     */
    this.setAt = function(index, value) {
        this._elements[index.toInt()] = value
    };

    /**
     * Find the word.
     *
     * @param {number} curPos Position of the looked word.
     * @returns {Object} Object with properties: index {number}, str {string}.
     */
    this.findWord = function(curPos) {
        var leftMargin = 0,
            rightMargin = 0;

        for (var i = 0; i < this._elements.length; i++) {
            rightMargin = leftMargin + this._elements[i].length;

            if (curPos >= leftMargin && curPos <= rightMargin) {
                return {
                    index: i,
                    str: this._elements[i]
                };
            }

            leftMargin += this._elements[i].length + 1;
        }

        return {
            index: this._elements.length,
            str: ''
        };
    }
};

/**
 * Active list. From MooTools it implements: Events.
 *
 * @constructor
 * @param {Element|string} container Active list container.
 */
var ActiveList = new Class(/** @lends ActiveList# */{
    Implements: Events,

    /**
     * Defines whether the active list is active.
     * @type {boolean}
     */
    active: false,

    /**
     * Defines whether the active list is selected.
     * @type {number}
     */
    selected: -1,

    /**
     * The first ul-element in the container.
     * @type {Element}
     */
    ul: null,

    /**
     * Items from the [ul-element]{@link ActiveList#ul}.
     * @type {Elements}
     */
    items: null,

    // constructor
    initialize: function(container) {
        Asset.css('acpl.css');

        /**
         * Active list container.
         * @type {Element}
         */
        this.container = $(container);
        this.container.addClass('alist');
        this.container.tabIndex = 1;
        this.container.setStyle('-moz-user-select', 'none');

        if (!this.container.getChildren('ul').length) {
            this.ul = new Element('ul');
            this.container.grab(this.ul);
        } else {
            this.ul = this.container.getChildren('ul')[0];
        }
        this.items = this.ul.getChildren();
    },

    /**
     * Activate list.
     *
     * @fires ActiveList#choose
     */
    activate: function() {
        this.items = this.ul.getChildren();
        this.active = true;
        //this.container.focus();

        this.selectItem();

        this.container.addEvent('keypress', this.keyPressed.bind(this));

        this.items.addEvent('mouseover', function(e) {
            this.selectItem(e.target.getAllPrevious().length);
        }.bind(this));
        this.items.addEvent('click', function(e) {
            /**
             * The item from [items]{@link ActiveList#items} is selected.
             * @event ActiveList#choose
             * @param {Element} item Selected item.
             */
            this.fireEvent('choose', this.items[this.selected]);
        }.bind(this));
    },

    /**
     * Event handler of the pressed key.
     *
     * @fires ActiveList#choose
     *
     * @param {Object} e Event.
     */
    keyPressed: function(e) {
        switch (e.key) {
            case 'up':
                this.selectItem(this.selected - 1);
                e.preventDefault();
                break;

            case 'down':
                this.selectItem(this.selected + 1);
                e.preventDefault();
                break;

            case 'enter':
                this.fireEvent('choose', this.items[this.selected]);
                e.stopPropagation();
                break;
        }
    },

    /**
     * Select the item by ID.
     *
     * @param {number} [id = 0] Item ID.
     */
    selectItem: function(id) {
        if (!id) {
            id = 0;
        }

        if (id < 0) {
            id = this.items.length + id;
        } else if (id >= this.items.length) {
            id -= this.items.length;
        }

        this.unselectItem(this.selected);

        this.items[id].addClass('selected');
        this.selected = id;

        var body = $(document.body);
        if (body.scrollHeight > body.getSize().y) {
            this.input.scrollIntoView();
        }
    },

    /**
     * Deselect selected item.
     *
     * @param {number} id Item ID.
     */
    unselectItem: function(id) {
        if (this.items[id]) {
            this.items[id].removeClass('selected');
        }
    }
});

/**
 * Drop box list.
 *
 * @augments ActiveList
 *
 * @constructor
 * @param {Element|string} input Drop box element.
 */
var DropBoxList = new Class(/** @lends DropBoxList# */{
    Extends: ActiveList,

    // constructor
    initialize: function(input) {
        /**
         * Drop box list element.
         * @type {Element}
         */
        this.input = $(input);

        this.parent(new Element('div', {
            'class': 'acpl_variants'
        }));

        this.input.addEvent('blur', this.hide.bind(this));

        this.hide();
    },

    /**
     * Return true if the drop box list is opened, otherwise - false.
     *
     * @returns {boolean}
     */
    isOpen: function() {
        return (this.container.getStyle('display') !== 'none');
    },

    /**
     * Get the drop box list [container]{@link DropBoxList#container}.
     *
     * @returns {Element}
     */
    get: function() {
        return this.container;
    },

    /**
     * Show the drop box list.
     */
    show: function() {
        this.container.removeClass('hidden');
        var size = this.container.getComputedSize();
        this.container.setStyle('width', this.input.getSize().x - size['border-left-width'] - size['border-right-width']);
        this.activate();
    },

    /**
     * Hide the drop box list.
     */
    hide: function() {
        this.container.addClass('hidden');
    },

    /**
     * Empty the list.
     */
    empty: function() {
        this.ul.empty();
    },

    /**
     * Create an item for the list.
     * @param {{value: string, key:string}} data Object withe the properties for the item.
     * @returns {Element}
     */
    create: function(data) {
        return new Element('li').set('text', data.value).store('key', data.key);
    },

    /**
     * Add the new item to the list.
     *
     * @param {HTMLLIElement} li New item for the list.
     */
    add: function(li) {
        this.ul.grab(li);
    }
});

/**
 * Acpl field. From MooTools it implements: Options, Events.
 *
 * @constructor
 * @param {Element|string} element The main element.
 * @param {Object} [options] [Options]{@link AcplField#options}.
 */
var AcplField = new Class(/** @lends AcplField# */{
    Implements: [Options,Events],

    /**
     * Words.
     * @type {Words}
     */
    words: null,

    /**
     * Value.
     * @type {string}
     */
    value: '',

    /**
     * Queue.
     * @type {Array}
     */
    queue: [],

    /**
     * Options.
     * @type {Object}
     *
     * @property {number} [startForm = 1] Start form number.
     */
    options: {
        startFrom: 1
    },

    // constructor
    initialize: function(element, options) {
        /**
         * The main element for the field.
         * @type {Element}
         */
        this.element = $(element);

        this.setOptions(options);

        /**
         * Container for the field.
         * @type {Element}
         */
        this.container = new Element('div', {'class': 'with_append', 'styles': {'position': 'relative'}}).wraps(this.element);

        if (this.element.get('name') == 'tags') {
            /**
             * Appended button for input field.
             * @type {Element}
             */
            this.button = new Element('button', {
                type: 'button',
                link: 'tags',
                style: 'height:18px;',
                onclick: this.element.get('component_id') + '.openTagEditor(this);',
                html: '...'
            }).inject(this.container);

            new Element('div', {'class': 'appended_block'}).wraps(this.button);
        }

        /**
         * Drop box list.
         * @type {DropBoxList}
         */
        this.list = new DropBoxList(this.element);
        this.list.addEvent('choose', this.select.bind(this));
        this.list.get().inject(this.element, 'after');

        Asset.css('acpl.css');

        /**
         * URL.
         * @type {string}
         */
        this.url = this.element.getProperty('nrgn:url');

        /**
         * Words delimiter.
         * @type {string}
         */
        this.separator = this.element.getProperty('nrgn:separator');

        //Вешаем на keyup для того чтобы у нас было реальное value поля
        this.element.addEvent('keyup', this.enter.bind(this));
    },

    /**
     * Event handler. Enter.
     *
     * @param {Object} e Event.
     */
    enter: function(e) {
        if (!this.url) {
            return;
        }

        var val = this.element.value;

        switch (e.key) {
            case 'esc':
                this.list.hide();
                this.list.empty();
                break;

            case 'up':
            case 'down':
            case 'enter':
                this.list.keyPressed.call(this.list, e);
                break;

            default :
                this.value = val;
                this.words = new Words(this.value, this.separator);

                var word = this.words.findWord((function(el) {
                    if (el.selectionStart) {
                        return el.selectionStart;
                    } else if (document.selection) {
                        var r = document.selection.createRange();
                        if (r == null) {
                            return 0;
                        }

                        var re = el.createTextRange(),
                            rc = re.duplicate();

                        re.moveToBookmark(r.getBookmark());
                        rc.setEndPoint('EndToStart', re);

                        return rc.text.length;
                    }
                    return 0;
                })(this.element));

                if (word.str.length > this.options.startFrom) {
                    this.words.setCurrentIndex(word.index);
                    this.putInQueue(word.str, this.value);
                }
        }
    },

    /**
     * Prepare the data.
     *
     * @param {Object} result Result object.
     */
    _prepareData: function(result) {
        this.setValues(result.data);
    },

    /**
     * Put in queue.
     *
     * @param {string} str One word.
     * @param {string} val The whole string.
     */
    putInQueue: function(str, val) {
        if (this.value == val) {
            this.requestValues(str);
        }
    },

    /**
     * Send the POST request.
     *
     * @param {string} str Data string.
     */
    requestValues: function(str) {
        new Request.JSON({
            url: this.url,
            onSuccess: this._prepareData.bind(this)
        }).send({
            method: 'post',
            data: 'value=' + str
        });
    },

    /**
     * Reset the items in the [list]{@link AcplField#list}.
     *
     * @param {Array} data Data array.
     */
    setValues: function(data) {
        this.list.empty();
        if (data && data.length) {
            data.each(function(row) {
                this.list.add(this.list.create(row));
            }, this);

            this.list.show();
        }
    },

    /**
     * Select an item from the [list]{@link AcplField#list}.
     *
     * @param {HTMLLIElement} li Element that will be selected.
     */
    select: function(li) {
        var text = li.get('text');

        if ((this.list.selected !== false) && this.list.items[this.list.selected]) {
            this.words.setAt(this.words.currentIndex, text);
            this.element.set('value', this.words.asString());
        }

        this.list.hide();
    }
});