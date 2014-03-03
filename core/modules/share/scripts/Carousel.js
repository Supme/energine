/**
 * @file Library to create carousel(s) on the web-pages. Contain the description of the next classes:
 * <ul>
 *     <li>[ACarousel]{@link ACarousel}</li>
 *     <li>[ACarousel.AControls]{@link ACarousel.AControls}</li>
 *     <li>[CarouselFactory]{@link CarouselFactory}</li>
 *     <li>[CarouselFactory.Types]{@link CarouselFactory.Types}</li>
 *     <li>[CarouselFactory.Types.Loop]{@link CarouselFactory.Types.Loop}</li>
 *     <li>[CarouselFactory.Types.Line]{@link CarouselFactory.Types.Line}</li>
 *     <li>[CarouselFactory.Controls]{@link CarouselFactory.Controls}</li>
 *     <li>[CarouselFactory.Controls.TwoButtons]{@link CarouselFactory.Controls.TwoButtons}</li>
 *     <li>[CarouselPlaylist]{@link CarouselPlaylist}</li>
 *     <li>[CarouselConnector]{@link CarouselConnector}</li>
 *     <li>[Carousel]{@link Carousel}</li>
 * </ul>
 *
 * @author Valerii Zinchenko
 * @author Pavel Dubenko
 *
 * @version 2.2.0
 */

/**
 * Abstract carousel. The general HTML structure is showed in the example below.
 * The HTML element with class "playlist_local" is optional. If the playlist is undefined, then the carousel will try to create the playlist from that element.
 * From MooTools it implements: Options, Events, Chain.
 *
 * @example <caption>HTML structure for carousel.</caption>
 * &ltdiv id="carouselID" class="carousel"&gt
 *     &ltdiv class="carousel_viewbox"&gt
 *         &ltdiv class="playlist_local"&gt
 *         &lt/div&gt
 *     &lt/div&gt
 * &lt/div&gt
 *
 * @throws {string} View box of the carousel was not found.
 * @throws {string} Carousel can not be created without playlist.
 *
 * @constructor
 * @param {Element} el Main element for the carousel.
 * @param {Object} [opts] [Options]{@link ACarousel#options} for the carousel.
 */
var ACarousel = new Class(/** @lends ACarousel# */{
    Implements: [Options, Events, Chain],

    Static: {
        /**
         * Counter of Carousel objects.
         *
         * @memberOf ACarousel
         * @static
         * @type {number}
         */
        count: 0,

        /**
         * Assigns id.
         *
         * @memberOf ACarousel
         * @function
         * @static
         * @returns {number}
         */
        assignID: function () {
            return this.count++;
        }
    },

    /**
     * Carousel options.
     * @type {object}
     *
     * @property {number|string} [NVisibleItems = 1] Number of visible items. It can be also 'all' to show all items in the playlist.
     * @property {number} [scrollStep = 1] Default scrolling step.
     * @property {number} [scrollDirection = 'left'] Default scrolling direction. Here can be used 'left', 'right', 'top', 'bottom'.
     * @property {CarouselPlaylist} [playlist = null] Reference to the playlist. If the playlist is not defined, then the playlist will be created from the element class <tt>'.playlist_local'</tt>.
     * @property {boolean} [autoSelect = true] Defines whether the items can be auto selected.
     * @property {string} [activeLabel = 'active'] Value of an element's parameter 'class' at the active item in the carousel.
     * @property {Object} fx Scrolling effect options.
     * @property {number} [fx.duration = 700] Effect duration.
     * @property {string} [fx.transition = 'cubic:in:out'] Effect transition. Possible values see [here]{@link http://mootools.net/docs/core/Fx/Fx.Transitions}.
     * @property {Object} [classes] It contains the element's class names for each component.
     * @property {string} [classes.viewbox = '.carousel_viewbox'] Class name for the carousel's view box.
     * @property {string} [classes.item = '.item'] Class name for the carousel's items.
     * @property {Object} [styles] Array like object with styles for the carousel.
     * @property {Object} [styles.element = {position: 'relative'}] Styles for the main [element]{@link ACarousel#element}.
     * @property {Object} [styles.viewbox = {position: 'relative', overflow: 'hidden', margin: 'auto'}] Styles for the [view box]{@link ACarousel#viewbox}.
     * @property {Object} [styles.item = {position: 'absolute', textAlign: 'center', verticalAlign: 'middle'}] Styles for scrolled [items]{@link ACarousel#items}.
     */
    options: {
        NVisibleItems: 1,
        scrollStep: 1,
        scrollDirection: 'left',
        playlist: null,
        autoSelect: true,
        activeLabel: 'active',
        fx: {
            duration: 700,
            transition: 'cubic:in:out'
        },
        classes: {
            viewbox: '.carousel_viewbox',
            item: '.item'
        },
        /* NOTE:
         * This is need for the elimination the using of Asset.css('carousel.css') in the carousel's constructor,
         * because we do not know how long the file 'carousel.css' must be parsed and applied to the HTML document
         * before the using of stylized elements.
         */
        styles: {
            element: {
                position: 'relative'
            },
            viewbox: {
                position: 'relative',
                overflow: 'hidden',
                margin: 'auto'
            },
            item: {
                position: 'absolute',
                textAlign: 'center',
                verticalAlign: 'middle'
            }
        }
    },

    /**
     * Holder element for the local playlist.
     * @type {Element}
     */
    playlistHolder: null,

    /**
     * Array of objects with effects, that will be applied to the items by scrolling.
     * @type {Array}
     */
    effects: [],

    /**
     * Indicates whether scrolling is finished.
     * @type {boolean}
     */
    isEffectCompleted: true,

    /**
     * Indicates current active item in playlist.
     * @type {number}
     */
    currentActiveID: -1,

    /**
     * Item size. It holds the maximal width and height.
     * @type {number[]}
     */
    itemSize: [0,0],

    /**
     * Cached items from playlist
     * @type {Elements}
     */
    items: new Elements(),

    // constructor
    initialize: function (el, opts) {
        /**
         * Main element for the carousel. It must contain the '.carousel_viewbox'.
         * @type {Element}
         */
        this.element = el;

        this.setOptions(opts);
        // This is need to save the reference to the playlist.
        if (opts != undefined && 'playlist' in opts) {
            this.options.playlist = opts.playlist;
        }
        this.checkOptions();

        /**
         * View-box element of the carousel that holds an playlist items.
         * @type {Element}
         */
        this.viewbox = this.element.getElement(this.options.classes.viewbox);
        if (!this.viewbox) {
            throw 'View box of the carousel was not found.';
        }

        /**
         * Carousel ID.
         * @type {number}
         */
        this._id = ACarousel.assignID();
        this.element.store('id', this._id);

        this.createPlaylist();
        if (this.options.NVisibleItems == 'all') {
            this.options.NVisibleItems = this.options.playlist.NItems;
        }

        var ids = [];
        for (var n = 0; n < this.options.NVisibleItems; n++) {
            ids[n] = n;
        }
        this.checkCache(ids);
        this.setActiveItem(0);
    },

    /**
     * Build the carousel.
     *
     * @fires ACarousel#enableScrolling
     * @fires ACarousel#disableScrolling
     */
    build: function() {
        this.calcItemSize();

        // Add 'click'-event to all items
        this.items.each(function (it) {
            var self = this;
            it.addEvent('click', function(ev) {
                var el = $(ev.target);
                if (el !== it
                    && ( el.tagName.toLowerCase() === 'a' || it.contains(el.getParent('a')) ))
                {
                    return;
                }

                ev.stop();

                self.selectItem(it.retrieve('id'));
            });
        }, this);

        /**
         * Indicates whether the scrolling can be done.
         * @type {boolean}
         */
        this.canScroll = this.options.NVisibleItems != 'all' && this.options.NVisibleItems < this.options.playlist.NItems;

        if (this.canScroll) {
            /**
             * Indicates the first visible item ID in the carousel.
             * @type {number}
             */
            this.firstVisibleItemID = 0;

            if (this.options.scrollStep > this.options.NVisibleItems) {
                console.warn('The option "scrollStep" (' + this.options.scrollStep
                    + ') > "NVisibleItems" (' + this.options.NVisibleItems
                    + '). It is reset to ' + this.options.NVisibleItems + '.');
                this.options.scrollStep = this.options.NVisibleItems;
            }

            this.prepareScrolling();

            /**
             * Fired when the carousel can scroll.
             * @event ACarousel#enableScrolling
             */
            this.fireEvent('enableScrolling');
        } else {
            this.disable();

            /**
             * Fired when the carousel can not scroll.
             * @event ACarousel#disableScrolling
             */
            this.fireEvent('disableScrolling');
        }

        this.applyStyles();
        this.prepareItems();
    },

    /**
     * Scroll forward by one step. Multiple calls will be chained.
     */
    scrollForward: function () {
        if (this.isEffectCompleted) {
            this.scroll(1, 1);
        } else {
            this.chain(this.scrollForward.bind(this));
        }
    },

    /**
     * Scroll backward by one step. Multiple calls will be chained.
     */
    scrollBackward: function () {
        if (this.isEffectCompleted) {
            this.scroll(-1, 1);
        } else {
            this.chain(this.scrollBackward.bind(this));
        }
    },

    /**
     * Select item in the carousel and mark him as active.
     *
     * @fires ACarousel#selectItem
     *
     * @param {number} id Item ID.
     */
    selectItem: function (id) {
        if (this.currentActiveID === id) {
            return;
        }

        this.setActiveItem(id);

        /**
         * Fired when the new item ID was selected.
         * @event ACarousel#selectItem
         * @param {number} n New item ID.
         */
        this.fireEvent('selectItem', this.currentActiveID);
    },

    /**
     * Scrolls to the specific item ID.
     *
     * @param {number} id Item ID.
     */
    scrollTo: function (id) {
        // Check whether the desired item ID is visible in the carousel. If it is, then do not scroll.
        for (var n = 0; n < this.options.NVisibleItems; n++) {
            if (wrapIndices(this.firstVisibleItemID + n, 0, this.options.playlist.NItems) == id) {
                this.setActiveItem(id);
                return;
            }
        }

        var scrollsProps = this.calcScrolls(id);
        this.scroll(scrollsProps.direction, scrollsProps.NScrolls, true);
        this.setActiveItem(id);
    },

    /**
     * Stop the scrolling.
     */
    stop: function() {
        this.$chain = [];
    },

    /**
     * Mark item as active.
     *
     * @param {number} id Item ID.
     */
    setActiveItem: function(id) {
        if (this.currentActiveID === id) {
            return;
        }

        Object.each(this.items, function(el, key) {
            var id = parseInt(key);
            if (!isNaN(id)) {
                el.removeClass(this.options.activeLabel);
            }
        }.bind(this));

        var total = (this.options.playlist.NItems >= this.items.length)
            ? this.options.playlist.NItems
            : this.items.length;

        for (var n = 0; n < total / this.options.playlist.NItems; n++) {
            this.items[id + this.options.playlist.NItems * n].addClass(this.options.activeLabel);
        }
        this.currentActiveID = id;
    },

    Protected: {
        /**
         * Prepare the carousel to the scrolling.
         *
         * @memberOf ACarousel#
         * @protected
         */
        prepareScrolling: function() {
            /**
             * Shift steps by scrolling the items.
             * @type {number[]}
             */
            this.itemShifts = [
                this.length * this.options.NVisibleItems,
                -this.length * this.options.scrollStep
            ];

            // Calculate effects for scrolling
            // NOTE: Do not create unique effects for both opposite style. It is complex:
            //      - each element must have only style and not both
            //      - before applying effect we need delete one style from the visible and new items and assign other
            //      - prepare an object with proper effects for the Fx.Elements
            var N = this.options.NVisibleItems + this.options.scrollStep;
            this.effects[0] = this.createEffect(this.options.scrollDirection, -this.length * this.options.scrollStep, this.length, N);
            this.effects[1] = this.createEffect(this.options.scrollDirection, 0, this.length, N);

            this.specificPreparation();
        },

        /**
         * Prepare items for scrolling.
         *
         * @memberOf ACarousel#
         * @protected
         */
        prepareItems: function() {
            this.items.each(function (it, n) {
                it.setStyle(this.options.scrollDirection, n * this.length);
            }, this);
        },

        // Abstract
        // ====================
        /**
         * Additional specific preparation to the scrolling relative to specific carousel type.
         *
         * @see ACarousel#prepareScrolling
         *
         * @memberOf ACarousel#
         * @abstract
         * @protected
         */
        specificPreparation: function() {},

        /**
         * Get and prepare the item elements, that will become visible after scrolling.
         *
         * @memberOf ACarousel#
         * @abstract
         * @protected
         * @param {number} direction Scrolling direction.
         * @param {number} scrollNTimes Scrolling multiplier.
         * @param {number[]} ids Item indices.
         * @return {Element[]}
         */
        getNewVisibleItems: function(direction, scrollNTimes, ids) {},

        /**
         * Get the item indices, that will become visible after scrolling.
         *
         * @memberOf ACarousel#
         * @abstract
         * @protected
         * @param {number} direction Scrolling direction.
         * @param {number} scrollNTimes Scrolling multiplier.
         * @return {number[]}
         */
        getNewVisibleItemIDs: function(direction, scrollNTimes) {},

        /**
         * Method for calculation the ID of the first visible item.
         *
         * @memberOf ACarousel#
         * @abstract
         * @protected
         * @param {number} direction Scrolling direction.
         * @param {number} scrollNTimes Scrolling multiplier.
         */
        calcFirstItemID: function(direction, scrollNTimes) {},

        /**
         * Calculate how many scroll steps and in which direction should the carousel scroll to reach the desired item ID.
         *
         * @memberOf ACarousel#
         * @abstract
         * @protected
         * @param {number} id Desired item ID.
         * @return {{NScrolls: number, direction: number}}
         */
        calcScrolls: function(id) {},

        /**
         * Get the effects, that will be applied to scrolled items.
         *
         * @memberOf ACarousel#
         * @abstract
         * @protected
         * @param {number} direction Scrolling direction.
         * @param {number} scrollNTimes Scrolling multiplier.
         * @return {Object}
         */
        getItemEffects: function(direction, scrollNTimes) {},
        // ====================

        /**
         * Checks types and boundaries of carousel options.
         * @memberOf ACarousel#
         * @protected
         */
        checkOptions: function() {
            if (this.options.NVisibleItems !== 'all') {
                this.options.NVisibleItems = this.checkNumbers('NVisibleItems', [this.options.NVisibleItems, 1, 1]);
            }
            this.options.scrollStep = this.checkNumbers('scrollStep', [this.options.scrollStep, 1, 1, this.options.NVisibleItems]);

            // fx
            this.options.fx.duration = this.checkNumbers('duration', [this.options.fx.duration, 700, 0]);

            // scrollDirection
            if (typeOf(this.options.scrollDirection) != 'string'
                || (this.options.scrollDirection != 'left'
                && this.options.scrollDirection != 'right'
                && this.options.scrollDirection != 'top'
                && this.options.scrollDirection != 'bottom'))
            {
                this.options.scrollDirection = 'left';
                console.warn('The option \"scrollDirection\" is incorrect. Its value reset to \"' + this.options.scrollDirection + '\"');
            }

            // playlist
            if (this.options.playlist != null && !instanceOf(this.options.playlist, CarouselPlaylist)) {
                this.options.playlist = null;
                console.warn('The option for \"playlist\" is incorrect. Its value reset to \"null\"');
            }

            // autoSelect
            if (typeOf(this.options.autoSelect) != 'boolean') {
                this.options.autoSelect = !!this.options.autoSelect;
                console.warn('The option \"autoSelect\" was not with type of \"boolean\". Its value set to \"' + this.options.autoSelect.toString() + '\"');
            }
        },

        /**
         * Create the playlist.
         *
         * @throws {string} Carousel can not be created without playlist.
         *
         * @memberOf ACarousel#
         * @protected
         */
        createPlaylist: function() {
            // If the playlist is not explicitly specified, than try to get a playlist from the carousel.
            if (this.options.playlist === null) {
                try {
                    this.playlistHolder = this.viewbox.getElement('.playlist_local');
                    this.options.playlist = new Playlist.HTML(this.playlistHolder);
                } catch (err) {
                    console.warn(err);
                    throw 'Carousel can not be created without playlist.';
                }
            }

            this.playlistHolder = new Element(this.options.playlist.getHolder().clone());
            this.viewbox.grab(this.playlistHolder);
        },

        /**
         * Get the the maximal item size.
         * @memberOf ACarousel#
         * @protected
         */
        calcItemSize: function() {
            // Get the size of the biggest item.
            this.items.getDimensions({
                computeSize:true,
                styles: ['padding','border','margin']
            }).each(function(dims) {
                if (this.itemSize[0] < dims.totalWidth) {
                    this.itemSize[0] = dims.totalWidth;
                }
                if (this.itemSize[1] < dims.totalHeight) {
                    this.itemSize[1] = dims.totalHeight;
                }
            }, this);

            // Apply new width to the 'view-box'-element
            if (this.options.scrollDirection == 'left' || this.options.scrollDirection == 'right') {
                /**
                 * Item length.
                 * @type {number}
                 */
                this.length = this.itemSize[0];
            } else {
                this.length = this.itemSize[1];
            }
        },

        /**
         * Apply styles to the carousel and his elements.
         * @memberOf ACarousel#
         * @protected
         */
        applyStyles: function() {
            var opts = this.options,
                el = this.element;

            el.setStyles(opts.styles.element);
            delete opts.styles.element;
            for (var selector in opts.styles) {
                (selector in opts.classes)
                    ? el.getElements(opts.classes[selector]).setStyles(opts.styles[selector])
                    : el.getElements(selector).setStyles(opts.styles[selector]);
            }
            delete opts.styles.viewbox;

            // Apply new width to the 'view-box'-element
            if (opts.scrollDirection == 'left' || opts.scrollDirection == 'right') {
                this.viewbox.setStyle('width', this.length * opts.NVisibleItems);
                this.viewbox.setStyle('height', this.itemSize[1]);
            } else {
                this.viewbox.setStyle('width', this.itemSize[0]);
                this.viewbox.setStyle('height', this.length * opts.NVisibleItems);
            }
        },

        /**
         * Disable carousel.
         * @memberOf ACarousel#
         * @protected
         */
        disable: function() {
            this.options.NVisibleItems = this.options.playlist.NItems;
            this.options.scrollStep = 0;
        },

        /**
         * The core method that scrolls the items. If one of the new visible items is not marked as active, this will set
         * leftmost or rightmost item as active and after that an event will be fired, that the new item is set as active.
         * If this method will be called with <tt>isSelected == true</tt> then the selection will be ignored.
         *
         * @fires ACarousel#scroll
         * @fires ACarousel#singleScroll
         *
         * @throws {string} Scrolling direction must be -1 or 1 but received "{number}"!
         * @throws {string} scrollNTimes must be > 0
         *
         * @memberOf ACarousel#
         * @protected
         * @param {number} direction Defines the scroll direction. It can be 1 or -1 to scroll forward and backward respectively.
         * @param {number} [scrollNTimes = 1] Defines how many scrolls must be done by one call of scrolling.
         * @param {boolean} [isSelected = false] Indicates whether one of the new visible items is already selected.
         */
        scroll: function (direction, scrollNTimes, isSelected) {
            var itemsToScroll,
                effects;

            if (!this.canScroll) {
                return;
            }

            if (direction !== 1 && direction !== -1) {
                throw 'Scrolling direction must be -1 or 1 but received "' + direction + '"!';
            }

            if (scrollNTimes < 0) {
                throw 'scrollNTimes must be >= 0';
            }
            if (scrollNTimes == 0) {
                return;
            }

            itemsToScroll = this.getScrolledItems(direction, scrollNTimes);

            effects = this.getItemEffects(direction, scrollNTimes);

            this.calcFirstItemID(direction, scrollNTimes);

            if (this.options.autoSelect && !isSelected) {
                // Checks whether the selected item is visible
                var isSelectedVisible = false;
                for (var n = 0; n < this.options.NVisibleItems; n++) {
                    if (wrapIndices(this.firstVisibleItemID + n, 0, this.options.playlist.NItems) == this.currentActiveID) {
                        isSelectedVisible = true;
                        break;
                    }
                }
                // If the selected item is not visible, then the leftmost or rightmost visible item will be selected
                if (!isSelectedVisible) {
                    this.selectItem(wrapIndices(
                        (direction == 1)
                            ? this.firstVisibleItemID
                            : this.firstVisibleItemID + this.options.NVisibleItems - 1,
                        0, this.options.playlist.NItems));
                }
            }

            this.isEffectCompleted = false;

            new Fx.Elements(itemsToScroll, {
                duration: this.options.fx.duration,
                transition: this.options.fx.transition,
                onChainComplete: function () {
                    this.isEffectCompleted = true;

                    if (this.$chain.length == 0) {
                        /**
                         * Fired when the whole scrolling is finished.
                         * @event ACarousel#scroll
                         * @param {number} direction Last scrolled direction.
                         */
                        this.fireEvent('scroll', direction);
                    }
                    this.callChain();

                    /**
                     * Fired when the single scroll is finished.
                     * @event ACarousel#singleScroll
                     * @param {number} direction Last scrolled direction.
                     */
                    this.fireEvent('singleScroll', direction);
                }.bind(this)
            }).start(effects);
        },

        /**
         * Get the items, that will be scrolled.
         *
         * @memberOf ACarousel#
         * @protected
         * @param {number} direction Scrolling direction.
         * @param {number} scrollNTimes Scrolling multiplier.
         * @return {Element[]}
         */
        getScrolledItems: function(direction, scrollNTimes) {
            var itemsToScroll = [],
                ids,
                newItems,
                n;

            ids = this.getNewVisibleItemIDs(direction, scrollNTimes);

            this.checkCache(ids);

            newItems = this.getNewVisibleItems(direction, scrollNTimes, ids);

            // Collects all visible items
            for (n = 0; n < this.options.NVisibleItems; n++) {
                var itemID = this.firstVisibleItemID + n;
                if (itemID >= this.options.playlist.NItems) {
                    itemID -= this.options.playlist.NItems;
                }

                itemsToScroll.push(this.items[itemID]);
            }

            // Connects all visible and new items
            itemsToScroll = (direction == 1)
                ? itemsToScroll.concat(newItems)
                : newItems.concat(itemsToScroll);

            return itemsToScroll;
        },

        /**
         * Check internal cache of items.
         * This cache is also the elements, that exist and visible in DOM.
         *
         * @memberOf ACarousel#
         * @protected
         * @param {number[]} ids Item indices.
         */
        checkCache: function(ids) {
            var uncachedIDs = [],
                uncachedEls,
                n;

            // Check if requested items are already uploaded.
            for (n = 0; n < ids.length; n++) {
                if (!this.items[ids[n]]) {
                    uncachedIDs.push(ids[n]);
                }
            }

            if (uncachedIDs.length == 0) {
                return;
            }

            uncachedEls = this.options.playlist.loadItems(uncachedIDs);
            uncachedEls.each(function(it) {
                var self = this;
                it.setStyles(this.options.styles.item);
                it.addEvent('click', function(ev) {
                    var el = $(ev.target);
                    if (el !== it
                        && ( el.tagName.toLowerCase() === 'a' || it.contains(el.getParent('a')) ))
                    {
                        return;
                    }

                    ev.stop();

                    self.selectItem(it.retrieve('id'));
                });
            }, this);

            for (n = 0; n < uncachedIDs.length; n++) {
                this.items[uncachedIDs[n]] = uncachedEls[n];
                this.items.length++;
                this.playlistHolder.grab(this.items[uncachedIDs[n]]);
            }
        },

        /**
         * Clone each item in '<tt>items</tt>' and place them to '<tt>where</tt>'.
         *
         * @memberOf ACarousel#
         * @protected
         * @param {Array} items Items that will be cloned.
         * @param {HTMLElement} holder Element that stores <tt>items</tt>.
         * @param {number} [NTimes = 1] Specifies how many clones will be created. You must use explicit value 1 if you want to use last argument <tt>'where'</tt>.
         * @param {string} [where = 'bottom'] The place to inject each clone. It can be '<tt>top</tt>', '<tt>bottom</tt>', '<tt>after</tt>', or '<tt>before</tt>'.
         */
        cloneItems: function (items, holder, NTimes, where) {
            NTimes = NTimes || 1;
            where = where || 'bottom';
            var N = items.length;
            for (var i = 1; i <= NTimes; i++) {
                for (var n = 0; n < N; n++) {
                    items.push(items[n].clone().inject(holder, where));
                    items[n + N * i].cloneEvents(items[n]);
                    if (items[n].hasClass(this.options.activeLabel)) {
                        items[n + N * i].addClass(this.options.activeLabel);
                    }
                }
            }
        },

        /**
         * Create an object with effects.
         *
         * @memberOf ACarousel#
         * @protected
         * @param {string} key Key for value.
         * @param {number} begin Indicates a start value of effect.
         * @param {number} step Indicates a step values between effects.
         * @param {number} count Indicates how many effects must be generated.
         * @returns {Object} Object with '<tt>count</tt>' objects like {key: effectValue}
         *
         * @example
         * createEffect('left', 0, 10, 3) == { { 'left': 0  }
         *                                     { 'left': 10 }
         *                                     { 'left': 20 } }
         */
        createEffect: function (key, begin, step, count) {
            var obj = {};
            for (var i = 0; i < count; i++) {
                obj[i] = (function () {
                    var subobj = {};
                    subobj[key] = begin + step * i;
                    return subobj;
                })();
            }
            return obj;
        },

        /**
         * Checks if the variable in the input object is with type of number and lower than some default value.
         *
         * @memberOf ACarousel#
         * @protected
         * @param {string} varName Variable name.
         * @param {number[]} values Array with size 4: [0] value that will be checked; [1] default value; [2] min value; [3] max value;
         * @return {Object} Object with checked values.
         */
        checkNumbers: function (varName, values) {
            if (typeOf(values[0]) != 'number') {
                values[0] = Number.from(values[0]);
            }

            if (values[0] == null || isNaN(values[0]) || values[0] < values[2]) {
                values[0] = values[1];
                console.warn('The value for \"' + varName + '\" is incorrect. Its value reset to', values[0] + '.');
            } else if (values[3] !== undefined && values[0] > values[3]) {
                values[0] = values[3];
                console.warn('The value for \"' + varName + '\" is incorrect. Its value reset to', values[0] + '.');
            }
            return values[0];
        }
    }
});

/**
 * Abstract controls for the carousel. The control elements must be located inside the carousel.
 * From MooTools it implements: Options, Events.
 *
 * @constructor
 * @param {ACarousel} carousel Carousel that will be controlled.
 * @param {Object} [opts] [Options]{@link ACarousel.AControls#options} for the controls.
 */
ACarousel.AControls = new Class(/** @lends ACarousel.AControls# */{
    Implements: [Options, Events],

    /**
     * Control options
     *
     * @property {Object} [classes = {}] It contains the element's class names for each component.
     * @property {Object} [styles = {}] Array like object with styles.
     * @property {Object} [styles.all = {}] Styles for all controls.
     */
    options: {
        classes: {},
        styles: {
            all: {}
        }
    },

    /**
     * Array like object of controls.
     * @type {Object}
     */
    controls: {},

    // constructor
    initialize: function(carousel, opts) {
        /**
         * Connected carousel.
         * @type {ACarousel}
         */
        this.carousel = carousel;

        this.setOptions(opts);

        this.applyStyles();
    },

    // Abstract
    // ====================
    /**
     * Enable controls.
     * @abstract
     */
    enable: function() {},

    /**
     * Disable controls.
     * @abstract
     */
    disable: function() {},
    // ====================

    Protected: {
        /**
         * Apply the styles to the controls.
         * @memberOf ACarousel#
         * @protected
         */
        applyStyles: function() {
            var opts = this.options,
                el = this.carousel.element,
                allCSS = '';

            for (var selector in opts.classes) {
                allCSS += opts.classes[selector] + ', ';
            }
            opts.styles[allCSS] = opts.styles.all;
            delete opts.styles.all;

            for (var selector in opts.styles) {
                (selector in opts.classes)
                    ? el.getElements(opts.classes[selector]).setStyles(opts.styles[selector])
                    : el.getElements(selector).setStyles(opts.styles[selector]);
            }
            delete opts.styles;
        }
    }
});

/**
 * The main carousel builder.
 * To use the carousel with controls simply supply <tt>controls: {type:'none'}<tt> to the options. If the options for controls are not supplied then the [TwoButtons]{@link CarouselFactory.Controls.TwoButtons} control will be not created.
 * If no options were supplied the builder will try to get the options from the element property 'data-carousel'. The property value should be in JSON format.
 * The type of the carousel and controls can be in the followed format: <tt>SomeType<tt>, <tt>someType<tt>, <tt>Some-Type<tt>, <tt>Some-type<tt>, <tt>some-Type<tt>, <tt>some-type<tt>.
 * From MooTools it implements: Options.
 *
 * @throws {string} Constructor of Carousel expected 1 or 2 arguments, but received {number}!
 * @throws {string} Element for Carousel was not found in DOM Tree!
 *
 * @constructor
 * @param {string | Element} el Can be the id of an element in DOM Tree, or CSS Selector, or an Element. In case with CSS Selector it will get only the first element.
 * @param {Object} [opts] [Options]{@link CarouselFactory#options} for the CarouselFactory.
 */
var CarouselFactory = new Class(/** @lends CarouselFactory# */{
    Implements: Options,

    /**
     * CarouselFactory options.
     * @type {object}
     *
     * @property {Object} [carousel] [Options for the carousel]{@link ACarousel#options}.
     * @property {string} [carousel.type = 'loop'] Carousel type (can be: 'loop', 'line').
     * @property {Object} [controls] [Options for the controls]{@link ACarousel.AControls#options}.
     * @property {string} [controls.type = 'twoButtons'] Type of the carousel controls (can be: 'twoButtons');
     */
    options: {
        carousel: {
            type: 'loop'
        },

        controls: {
            type: 'two-buttons'
        }
    },

    /**
     * The carousel.
     * @type {*}
     */
    carousel: null,

    /**
     * The carousel controls.
     * @type {*}
     */
    controls: null,

    // constructor
    initialize: function (el, opts) {
        if (arguments.length < 1 || arguments.length > 2) {
            throw 'Constructor of CarouselFactory expected 1 or 2 arguments, but received ' + arguments.length + '!';
        }

        el = $(el) || $$(el)[0];
        if (el == null) {
            throw 'Element for Carousel was not found in the DOM Tree!';
        }

        if (opts == undefined) {
            opts = JSON.decode(el.getProperty('data-carousel')) || {};
        }
        this.setOptions(opts);

        // This is need to save the reference to the playlist.
        if (opts != undefined && opts.carousel != undefined && 'playlist' in opts.carousel) {
            this.options.carousel.playlist = opts.carousel.playlist;
        }

        this.options.carousel.type = this.options.carousel.type.capitalize();
        this.options.controls.type = this.options.controls.type.camelCase().capitalize();

        this.carousel = new CarouselFactory.Types[this.options.carousel.type](el, this.options.carousel);
        if (this.options.controls.type !== 'none') {
            this.controls = new CarouselFactory.Controls[this.options.controls.type](this.carousel, this.options.controls);
        }

        this.carousel.build();
    }
});

/**
 * This namespace holds the implementations of the abstract carousel [ACarousel]{@link ACarousel}.
 * @namespace
 */
CarouselFactory.Types = {
    /**
     * Loop carousel. All items are scrolled in the loop, that means there are no end of the scrolling.
     *
     * @augments ACarousel
     *
     * @constructor
     * @param {Element} el Main element for the carousel.
     * @param {Object} [opts] [Options]{@link ACarousel#options} for the carousel.
     */
    Loop: new Class(/** @lends CarouselFactory.Types.Loop# */{
        Extends: ACarousel,

        effects: [{},{}],

        Protected: {
            /**
             * Implementation of the abstract [specificPreparation]{@link ACarousel#specificPreparation} method.
             * @memberOf CarouselFactory.Types.Loop#
             * @protected
             */
            specificPreparation: function() {
                // If the amount of items that will be scrolled in loop is greater than the total number of items,
                // then make clones of all items.
                if (this.options.NVisibleItems + this.options.scrollStep > this.options.playlist.NItems) {
                    this.cloneItems(this.items, this.playlistHolder);
                }
            },

            /**
             * Implementation of the abstract [getNewVisibleItems]{@link ACarousel#getNewVisibleItems} method.
             *
             * @memberOf CarouselFactory.Types.Loop#
             * @protected
             * @param {number} direction Scrolling direction.
             * @param {number} scrollNTimes Scrolling multiplier.
             * @param {number[]} ids Item indices.
             * @return {Element[]}
             */
            getNewVisibleItems: function(direction, scrollNTimes, ids) {
                // new first visible item after scrolling
                var newItems = [],
                    itemShift,
                    n;

                if (direction === 1) {
                    itemShift = this.itemShifts[0];
                } else {
                    itemShift = this.itemShifts[1] - ((scrollNTimes == 1) ? 0 : this.length * (scrollNTimes - 1));
                }

                for (n = 0; n < ids.length; n++) {
                    newItems[n] = this.items[ids[n]].setStyle(this.options.scrollDirection, this.length * n + itemShift);
                }

                return newItems;
            },

            /**
             * Implementation of the abstract [getNewVisibleItemIDs]{@link ACarousel#getNewVisibleItemIDs} method.
             *
             * @memberOf CarouselFactory.Types.Loop#
             * @protected
             * @param {number} direction Scrolling direction.
             * @param {number} scrollNTimes Scrolling multiplier.
             * @return {number[]}
             */
            getNewVisibleItemIDs: function(direction, scrollNTimes) {
                // new first visible item index after scrolling
                var newItemID,
                    itemIDs = [],
                    n;

                if (direction === 1) {
                    newItemID = this.firstVisibleItemID + this.options.NVisibleItems;
                } else {
                    newItemID = this.firstVisibleItemID - this.options.scrollStep * scrollNTimes;
                }

                if (scrollNTimes > 1) {
                    var tmp = this.options.NVisibleItems + this.options.scrollStep * scrollNTimes,
                        total = (this.options.playlist.NItems >= this.items.length)
                            ? this.options.playlist.NItems
                            : this.items.length;

                    var NClones = Math.floor(tmp / total);
                    if (NClones > 0) {
                        this.cloneItems(this.items, this.playlistHolder, NClones);
                        for (n = this.options.playlist.NItems; n < this.items.length; n++) {
                            this.items[n].setStyle(this.options.scrollDirection, -this.length);
                        }
                    }
                }

                for (n = 0; n < this.options.scrollStep * scrollNTimes; n++) {
                    itemIDs[n] = wrapIndices(newItemID + n, 0, this.options.playlist.NItems, true);
                }

                return itemIDs;
            },

            /**
             * Implementation of the abstract [calcFirstItemID]{@link ACarousel#calcFirstItemID} method.
             *
             * @memberOf CarouselFactory.Types.Loop#
             * @protected
             * @param {number} direction Scrolling direction.
             * @param {number} scrollNTimes Scrolling multiplier.
             */
            calcFirstItemID: function(direction, scrollNTimes) {
                this.firstVisibleItemID += direction * this.options.scrollStep * scrollNTimes;
                var total = (this.options.playlist.NItems >= this.items.length)
                    ? this.options.playlist.NItems
                    : this.items.length;
                this.firstVisibleItemID = wrapIndices(this.firstVisibleItemID, 0, total, true);
            },

            /**
             * Implementation of the abstract [calcScrolls]{@link ACarousel#calcScrolls} method.
             *
             * @memberOf CarouselFactory.Types.Loop#
             * @protected
             * @param {number} id Desired item ID.
             * @returns {{NScrolls: number, direction: number}}
             */
            calcScrolls: function(id) {
                var NTimes,
                    direction = 1,
                    diffFromLeft = wrapIndices(id - this.currentActiveID, 0, this.options.playlist.NItems),
                    diffFromRight = this.options.playlist.NItems - diffFromLeft;

                if (diffFromLeft <= diffFromRight) {
                    NTimes = diffFromLeft - (wrapIndices(this.firstVisibleItemID + this.options.NVisibleItems, 0, this.options.playlist.NItems) - 1 - this.currentActiveID);
                } else {
                    NTimes = diffFromRight - (this.currentActiveID - this.firstVisibleItemID);
                    direction = -1;
                }
                NTimes = Math.ceil(NTimes / this.options.scrollStep);

                return {
                    NScrolls: NTimes,
                    direction: direction
                };
            },

            /**
             * Implementation of the abstract [getItemEffects]{@link ACarousel#getItemEffects} method.
             *
             * @memberOf CarouselFactory.Types.Loop#
             * @protected
             * @param {number} direction Scrolling direction.
             * @param {number} scrollNTimes Scrolling multiplier.
             * @return {Object}
             */
            getItemEffects: function(direction, scrollNTimes) {
                var effects = {};

                if (scrollNTimes > 1) {
                    var shift = 0;
                    if (direction == 1) {
                        shift = this.options.scrollStep * scrollNTimes;
                    }

                    effects = this.createEffect(this.options.scrollDirection, -this.length * shift, this.length,
                        this.firstVisibleItemID + this.options.NVisibleItems + this.options.scrollStep * scrollNTimes);
                } else {
                    effects = this.effects[( (direction == 1) ? 0 : 1 )];
                }

                return effects;
            }
        }
    }),

    /**
     * Line carousel. All items scrolled in the line, that means it has two ends of the scrolling.
     * By reaching each end will corresponding event fired: [beginReached]{@link CarouselFactory.Line#beginReached} and [endReached]{@link CarouselFactory.Line#endReached}
     *
     * @augments ACarousel
     *
     * @constructor
     * @param {Element} el Main element for the carousel.
     * @param {Object} [opts] [Options]{@link ACarousel#options} for the carousel.
     */
    Line: new Class(/** @lends CarouselFactory.Types.Line# */{
            Extends: ACarousel,

            effects: [{},{},{},{}],

            Protected: {
                /**
                 * Implementation of the abstract [specificPreparation]{@link ACarousel#specificPreparation} method.
                 *
                 * @fires CarouselFactory.Types.Line#beginReached
                 *
                 * @memberOf CarouselFactory.Types.Line#
                 * @protected
                 */
                specificPreparation: function() {
                    /**
                     * Last possible scroll step for limited scrolling.
                     * @type {number}
                     */
                    this.lastScrollStep = this.items.length - this.options.NVisibleItems
                        - this.options.scrollStep * Math.floor((this.items.length - this.options.NVisibleItems) / this.options.scrollStep);
                    if (this.lastScrollStep == 0) {
                        this.lastScrollStep = this.options.scrollStep;
                    }

                    /**
                     * Fired when the carousel has the begin reached.
                     * @event CarouselFactory.Types.Line#beginReached
                     */
                    this.fireEvent('beginReached');

                    var N = this.options.NVisibleItems + this.lastScrollStep;
                    this.effects[2] = this.createEffect(this.options.scrollDirection, -this.length * this.lastScrollStep, this.length, N);
                    this.effects[3] = this.createEffect(this.options.scrollDirection, 0, this.length, N);

                    this.itemShifts[2] = -this.length * this.lastScrollStep;
                },

                /**
                 * Implementation of the abstract [getNewVisibleItems]{@link ACarousel#getNewVisibleItems} method.
                 *
                 * @memberOf CarouselFactory.Types.Line#
                 * @protected
                 * @param {number} direction Scrolling direction.
                 * @param {number} scrollNTimes Scrolling multiplier.
                 * @param {number[]} ids Item indices.
                 * @return {Object}
                 */
                getNewVisibleItems: function(direction, scrollNTimes, ids) {
                    var newItems = [],
                    // new first visible ID in this.items after scrolling
                        newItemID,
                        itemShift,
                        n;

                    if (direction === 1) {
                        newItemID = this.firstVisibleItemID + this.options.NVisibleItems;
                        itemShift = this.itemShifts[0];
                    } else {
                        newItemID = this.firstVisibleItemID - this.options.scrollStep * scrollNTimes;
                        itemShift = this.itemShifts[1] - ((scrollNTimes == 1) ? 0 : this.length * (scrollNTimes - 1));
                    }

                    // Get new items
                    if (this.isLast) {
                        newItemID = wrapIndices(newItemID, 0, this.items.length, false);
                        if (newItemID == 0) {
                            itemShift = this.itemShifts[2] - this.length * this.options.scrollStep * (scrollNTimes - 1);
                        }

                        // Get last possible new items
                        for (n = 0; n < this.lastScrollStep + this.options.scrollStep * (scrollNTimes - 1); n++) {
                            newItems[n] = this.items[ids[n]].setStyle(this.options.scrollDirection, this.length * n + itemShift);
                        }
                    } else {
                        for (n = 0; n < this.options.scrollStep * scrollNTimes; n++) {
                            newItems[n] = this.items[ids[n]].setStyle(this.options.scrollDirection, this.length * n + itemShift);
                        }
                    }

                    return newItems;
                },

                /**
                 * Implementation of the abstract [getNewVisibleItemIDs]{@link ACarousel#getNewVisibleItemIDs} method.
                 *
                 * @fires CarouselFactory.Types.Line#beginReached
                 * @fires CarouselFactory.Types.Line#endReached
                 *
                 * @memberOf CarouselFactory.Types.Line#
                 * @protected
                 * @param {number} direction Scrolling direction.
                 * @param {number} scrollNTimes Scrolling multiplier.
                 * @return {number[]}
                 */
                getNewVisibleItemIDs: function(direction, scrollNTimes) {
                    // new first visible ID in this.items after scrolling
                    var newItemID,
                        itemIDs = [],
                    // helper variables
                        n;

                    if (direction === 1) {
                        newItemID = this.firstVisibleItemID + this.options.NVisibleItems;
                    } else {
                        newItemID = this.firstVisibleItemID - this.options.scrollStep * scrollNTimes;
                    }

                    // If new item id reaches the last item then disable clicked button
                    if (newItemID <= 0 || newItemID + this.options.scrollStep * scrollNTimes >= this.items.length) {
                        (direction == 1)
                        /**
                         * Fired when the carousel has the end reached.
                         * @event CarouselFactory.Types.Line#endReached
                         */
                            ? this.fireEvent('endReached')
                            : this.fireEvent('beginReached');
                    }
                    // Check if last item effects are needed to be applied.
                    /**
                     * Defines whether the last scroll will made.
                     * @type {boolean}
                     */
                    this.isLast = (newItemID + this.options.scrollStep * scrollNTimes) > this.items.length || newItemID < 0;

                    // Get new item indexes
                    if (this.isLast) {
                        newItemID = wrapIndices(newItemID, 0, this.items.length, false);

                        // Get last possible new item indexes
                        for (n = 0; n < this.lastScrollStep + this.options.scrollStep * (scrollNTimes - 1); n++) {
                            itemIDs[n] = newItemID + n;
                        }
                    } else {
                        for (n = 0; n < this.options.scrollStep * scrollNTimes; n++) {
                            itemIDs[n] = wrapIndices(newItemID + n, 0, options.playlist.NItems, true);
                        }
                    }

                    return itemIDs;
                },

                /**
                 * Implementation of the abstract [calcFirstItemID]{@link ACarousel#calcFirstItemID} method.
                 *
                 * @memberOf CarouselFactory.Types.Line#
                 * @protected
                 * @param {number} direction Scrolling direction.
                 * @param {number} scrollNTimes Scrolling multiplier.
                 */
                calcFirstItemID: function(direction, scrollNTimes) {
                    this.firstVisibleItemID += direction * ((!this.isLast)
                        ? this.options.scrollStep * scrollNTimes
                        : this.lastScrollStep + this.options.scrollStep * (scrollNTimes - 1));
                    this.firstVisibleItemID = wrapIndices(this.firstVisibleItemID, 0, this.options.playlist.NItems, false);
                },

                /**
                 * Implementation of the abstract [calcScrolls]{@link ACarousel#calcScrolls} method.
                 *
                 * @memberOf CarouselFactory.Types.Line#
                 * @protected
                 * @param {number} id Desired item ID.
                 * @returns {{NScrolls: number, direction: number}}
                 */
                calcScrolls: function(id) {
                    var NTimes = Math.abs(id - this.currentActiveID),
                        direction = (id > this.currentActiveID) ? 1 : -1;

                    if (NTimes >= this.options.playlist.NItems) {
                        NTimes = this.options.playlist.NItems - 1;
                    }
                    if (direction == 1) {
                        NTimes -= wrapIndices(this.firstVisibleItemID + this.options.NVisibleItems, 0, this.options.playlist.NItems) - 1 - this.currentActiveID;
                    } else {
                        NTimes -= this.currentActiveID - this.firstVisibleItemID;
                    }
                    NTimes = Math.ceil(NTimes / this.options.scrollStep);

                    return {
                        NScrolls: NTimes,
                        direction: direction
                    };
                },

                /**
                 * Implementation of the abstract [getItemEffects]{@link ACarousel#getItemEffects} method.
                 *
                 * @memberOf CarouselFactory.Types.Line#
                 * @protected
                 * @param {number} direction Scrolling direction.
                 * @param {number} scrollNTimes Scrolling multiplier.
                 * @return {Object}
                 */
                getItemEffects: function(direction, scrollNTimes) {
                    var effects = {};

                    if (scrollNTimes > 1) {
                        var shift = 0;
                        if (direction == 1) {
                            shift = this.options.scrollStep * (scrollNTimes - 1) + this.lastScrollStep + 1;
                        }

                        effects = this.createEffect(this.options.scrollDirection, -this.length * shift, this.length,
                            this.firstVisibleItemID + this.options.NVisibleItems + this.options.scrollStep * scrollNTimes);
                    } else {
                        effects = this.effects[(this.isLast)
                            ? ( (direction == 1) ? 2 : 3 )
                            : ( (direction == 1) ? 0 : 1 )
                            ];
                    }

                    return effects;
                }
            }
        })
};

/**
 * This namespace holds the implementations of the abstract controls [ACarousel.AControls]{@link ACarousel.AControls} for the carousel.
 * @namespace
 */
CarouselFactory.Controls = {
    /**
     * Control the carousel with tow buttons.
     *
     * @augments ACarousel.AControls
     *
     * @constructor
     * @param {Element|string} el Main carousel element.
     * @param {Object} [opts] [Options]{@link ACarousel.AControls#options} for the controls.
     */
    TwoButtons: new Class(/** @lends CarouselFactory.Controls.TwoButtons# */{
        Extends: ACarousel.AControls,

        /**
         * Control options
         * @property {string} [event = 'click'] Defines an event for the buttons, that will scroll the carousel.
         * @property {Object} [classes] It contains the element's class names for each component.
         * @property {string} [classes.forward = '.next'] Class name for the forward button.
         * @property {string} [classes.backward = '.previous'] Class name for the backward button.
         * @property {Object} [styles] Array like object with styles.
         * @property {Object} [styles.forward = {marginLeft: '100%'}] Styles for the forward button.
         * @property {Object} [styles.backward = {}] Styles for the backward button.
         * @property {Object} [styles.all = {display: 'block', overflow: 'hidden', position: 'absolute', top: '50%', zIndex: '2', '-moz-user-select': 'none'}] Styles for all controls.
         */
        options: {
            event: 'click',
            classes: {
                forward: '.next',
                backward: '.previous'
            },
            styles: {
                all: {
                    display: 'block',
                    overflow: 'hidden',
                    position: 'absolute',
                    top: '50%',
                    zIndex: '2',
                    '-moz-user-select': 'none'
                },
                forward: {
                    marginLeft: '100%'
                },
                backward: {}
            }
        },

        /**
         * Button controls.
         * @type {object}
         *
         * @property {object} forward Button for scrolling forward.
         * @property {Element} forward.element Element in the DOM Tree for the button.
         * @property {boolean} [forward.IsEnabled = true] Defines whether the forward button is enabled.
         * @property {object} backward Button for scrolling backward.
         * @property {Element} backward.element Element in the DOM Tree for the backward button.
         * @property {boolean} [backward.IsEnabled = true] Defines whether the backward button is enabled.
         */
        controls: {
            forward: {
                element: null,
                isEnabled: true
            },
            backward: {
                element: null,
                isEnabled: true
            }
        },

        // constructor
        initialize: function(carousel, opts) {
            this.parent(carousel, opts);

            this.controls.forward.element = this.carousel.element.getElement(this.options.classes.forward).setProperty('unselectable', 'on');
            this.controls.backward.element = this.carousel.element.getElement(this.options.classes.backward).setProperty('unselectable', 'on');

            if (!this.controls.forward.element) {
                throw 'Forward control button for the carousel was not found.';
            }
            if (!this.controls.backward.element) {
                throw 'Backward control button for the carousel was not found.';
            }

            this.addEvents({
                scrollForward: this.carousel.scrollForward.bind(this.carousel),
                scrollBackward: this.carousel.scrollBackward.bind(this.carousel)
            });
            this.carousel.addEvents({
                enableScrolling: this.enable.bind(this),
                disableScrolling: this.disable.bind(this),
                singleScroll: function(direction) {
                    if (!this[(direction == 1) ? 'backward' : 'forward' ].isEnabled) {
                        this[ (direction == 1) ? 'backward' : 'forward' ].isEnabled = true;
                    }
                }.bind(this.controls),
                endReached: function() {
                    this.controls.forward.isEnabled = false;
                    this.carousel.stop();
                }.bind(this),
                beginReached: function() {
                    this.controls.backward.isEnabled = false;
                    this.carousel.stop();
                }.bind(this)
            });
        },

        /**
         * Implements the parent abstract [enable]{@link ACarousel.AControls#enable} method.
         */
        enable: function() {
            this.controls.forward.element.addEvent(this.options.event, function (ev) {
                ev.stop();

                if (this.controls.forward.isEnabled) {
                    /**
                     * Fired when the forward button is enabled and clicked.
                     * @event CarouselFactory.Controls.TwoButtons#scrollForward
                     */
                    this.fireEvent('scrollForward');
                }
            }.bind(this));

            this.controls.backward.element.addEvent(this.options.event, function (ev) {
                ev.stop();

                if (this.controls.backward.isEnabled) {
                    /**
                     * Fired when the backward button is enabled and clicked.
                     * @event CarouselFactory.Controls.TwoButtons#scrollBackward
                     */
                    this.fireEvent('scrollBackward');
                }
            }.bind(this));
        },

        /**
         * Implements the parent abstract [disable]{@link ACarousel.AControls#disable} method.
         */
        disable: function() {
            if (this.controls.backward.element) {
                this.controls.backward.element.setStyle('display', 'none');
            }
            if (this.controls.forward.element) {
                this.controls.forward.element.setStyle('display', 'none');
            }
        }
    })
};

/**
 * Abstract playlist.
 *
 * @constructor
 * @param {*} src Playlist source.
 */
var APlaylist = new Class(/** @lends APlaylist# */{
    /**
     * Playlist items.
     * @type {Elements}
     */
    items: new Elements(),

    /**
     * Playlist holder element.
     * @type {Element}
     */
    holder: new Element(),

    /**
     * Amount of items in the playlist.
     * @type {Number}
     */
    NItems: 0,

    /**
     * Playlist source.
     * @type {*}
     */
    src: null,

    // constructor
    initialize: function (src) {
        this.src = src;
        this.initItems();
    },

    /**
     * Initialise playlist items.
     * @abstract
     */
    initItems: function() {},

    /**
     * Get the playlist's source.
     *
     * @returns {*}
     */
    getSource: function() {
        return this.src;
    },

    /**
     * Get the playlist's holder element.
     *
     * @returns {Element}
     */
    getHolder: function() {
        return this.holder;
    },

    /**
     * Load N items.
     * @param {number[]} ids Array of element indices.
     * @return {Elements}
     */
    loadItems: function(ids) {
        var items = new Elements();

        for (var n = 0; n < ids.length; n++) {
            items.push(this.items[ids[n]].clone());
            items[n].store('id', ids[n]);
        }

        return items;
    }
});

/**
 * Different implementations of the [abstract playlist]{@link APlaylist}.
 * @namespace
 */
var Playlist = /** @lends Playlist */{
    /**
     * HTML type of the playlist.
     *
     * @example <caption>HTML container for playlist.</caption>
     * &ltdiv id="playlistID" class="playlist"&gt
     *     &ltdiv class="item"&gtitem1&lt/div&gt
     *     &ltdiv class="item"&gtitem2&lt/div&gt
     *     ...
     * &lt/div&gt
     *
     * @augments APlaylist
     *
     * @throws {string} No items were found in the playlist.
     *
     * @constructor
     * @param {string|Element} src Playlist source. It can be the id of an element in DOM Tree, or CSS Selector, or an Element that holds playlist's items. In case with CSS Selector it will get only the first element.
     * @param {string} [itemSelector] CSS Selector of the playlist's items. If this argument is not defined, then all children of the holder will be selected as playlist's items.
     */
    HTML: new Class(/** @lends Playlist.HTML# */{
        Extends: APlaylist,

        // constructor
        initialize: function (src, itemSelector) {
            /**
             * CSS Selector of the playlist's items.
             * @type {string|undefined}
             */
            this.itemSelector = itemSelector;

            this.parent(src);
        },

        /**
         * Implementation of the abstract [initItems]{@link APlaylist#initItems} method.
         */
        initItems: function() {
            this.holder = $(this.src) || $$(this.src)[0];
            if (this.holder == null) {
                throw 'Element for CarouselPlaylist was not found in DOM Tree!';
            }

            if (this.itemSelector === undefined) {
                this.items = this.holder.getChildren();
            } else {
                this.items = this.holder.getElements(this.itemSelector);
            }

            this.NItems = this.items.length;
            if (this.NItems == 0) {
                throw 'No items were found in the playlist.';
            }

            this.items.dispose();
            this.holder.dispose();
        }
    }),

    /**
     * Playlist, that gets the items asynchronously from the server.
     *
     * @augments APlaylist
     *
     * @constructor
     * @param {string} src Playlist source.
     */
    AJAX: new Class(/** @lends Playlist.AJAX# */{
        Extends: APlaylist,

        /**
         * Request object.
         * @type {Request}
         */
        request: new Request({
            async: false,
            link: 'chain'
        }),

        /**
         * Implementation of the abstract [initItems]{@link APlaylist#initItems} method.
         */
        initItems: function() {
            this.request.url = this.src;
            this.request.addEvents({
                success: function(response) {
                    if (instanceOf(response, Array)) {
                        for (var n = 0; n < response.length; n++) {
                            this.items.push(response[n]);
                        }
                    } else if (instanceOf(response, Number)) {
                        this.NItems = this.items.length = response;
                    } else if (instanceOf(response, Element)) {
                        this.holder = response;
                    }
                }.bind(this),
                failure: function(err) {
                    console.error(err);
                }
            });

            this.request.send('getTotalAmount');
            this.request.send('getHolderElement');
        },

        /**
         * Load N items.
         * @param {number[]} ids Array of element indices.
         * @return {Elements}
         */
        loadItems: function(ids) {
            var uncached = [];
            // Check if requested items are already uploaded.
            for (var n = 0; n < ids.length; n++) {
                if (!this.items[ids[n]]) {
                    uncached.push(ids[n]);
                }
            }
            if (uncached.length > 0) {
                this.request.send(uncached);
            }

            return this.parent(ids);
        }
    })
};

/**
 * Connects an Carousel objects and attach events to them. From MooTools it implements: Events.
 *
 * @throws {string} Not enough arguments!
 * @throws {string} First argument must be an Array of Carousel objects!
 * @throws {string} Element #{number} in the array is not instance of Carousel!
 * @throws {string} Carousels can not be connected, because of different amount of items in the playlists!
 *
 * @constructor
 * @param {CarouselFactory[]} carousels Array of Carousel objects that will be connected.
 */
var CarouselConnector = new Class(/** @lends CarouselConnector# */{
    Implements: Events,

    // constructor
    initialize: function (carousels) {
        // Check input arguments
        if (arguments.length != 1) {
            throw 'Not enough arguments!';
        }
        if (!(carousels instanceof Array)) {
            throw 'First argument must be an Array of Carousel objects!';
        }
        for (n = 0; n < carousels.length; n++) {
            if (!(carousels[n] instanceof CarouselFactory)) {
                throw 'Element #' + n + ' in the array is not instance of CarouselFactory!';
            }
            carousels[n] = carousels[n].carousel;
        }
        for (var n = 0; n < carousels.length - 1; n++) {
            if (carousels[n].options.playlist.NItems !== carousels[n + 1].options.playlist.NItems) {
                throw 'Carousels can not be connected, because of different amount of items in the playlists!';
            }
        }

        /**
         * Array of connected carousels.
         * @type {CarouselFactory[]}
         */
        this.carousels = carousels;

        // Add events to the connected carousels
        for (n = 0; n < this.carousels.length; n++) {
            (function (n) {
                var self = this;
                self.carousels[n].addEvent('selectItem', function (id) {
                    // With slicing we exclude the carousel that fires event
                    self.carousels.slice(0, n).each(function (carousel) {
                        self.carouselEventFn(carousel, id);
                    });
                    self.carousels.slice(n + 1, self.carousels.length).each(function (carousel) {
                        self.carouselEventFn(carousel, id);
                    });
                });
            }.bind(this))(n);
        }
    },

    /**
     * It stores the functions for selecting a specific item <tt>id</tt> in <tt>carousel</tt> by fired event [selectItem]{@link CarouselFactory#selectItem}.
     *
     * @param {CarouselFactory} carousel Connected carousel.
     * @param {number} id Item ID in carousel that will be selected.
     */
    carouselEventFn: function (carousel, id) {
        carousel.scrollTo(id);
        carousel.selectItem(id);
    }
});

/**
 * Old carousel builder.
 *
 * @deprecated Use CarouselFactory
 */
var Carousel = CarouselFactory;

/**
 * Old playlist builder.
 *
 * @deprecated Use Playlist.HTML
 */
var CarouselPlaylist = Playlist.HTML;

/**
 * Wrap an index between lower and upper limits.
 *
 * @throws {string} Arguments must be: maxID != 0 minID >= 0 maxID > minID
 *
 * @param {number} id Index that must be wrapped.
 * @param {number} minID Lower limit.
 * @param {number} maxID Upper limit.
 * @param {boolean} [toWrap = true] Defines, whether the index will be wrapped (true) or cropped (false) by limits.
 * @returns {number} Wrapped id.
 *
 * @example
 * wrapIndices(-2, 0, 8, true)  == 6
 * wrapIndices(-2, 0, 8, false) == 0
 */
function wrapIndices(id, minID, maxID, toWrap) {
    if (maxID === 0 || minID < 0 || maxID < minID) {
        throw 'Arguments must be: maxID != 0 minID >= 0 maxID > minID';
    }
    if (toWrap === undefined) {
        toWrap = true;
    }
    if (toWrap) {
        return (id >= maxID)
            ? id - maxID * Math.floor(id / maxID)
            : (id < minID)
                ? id + maxID * Math.ceil(Math.abs(id) / maxID)
                : id;
    } else {
        return (id >= maxID)
            ? maxID
            : (id < minID)
                ? minID
                : id;
    }
}