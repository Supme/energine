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
 *     <li>[APlaylist]{@link APlaylist}</li>
 *     <li>[Playlist.HTML]{@link Playlist.HTML}</li>
 *     <li>[Playlist.AJAX]{@link Playlist.AJAX}</li>
 *     <li>[CarouselConnector]{@link CarouselConnector}</li>
 *     <li>[Carousel]{@link Carousel} (deprecated)</li>
 *     <li>[CarouselPlaylist]{@link CarouselPlaylist} (deprecated)</li>
 * </ul>
 *
 * @author Valerii Zinchenko
 * @author Pavel Dubenko
 *
 * @version 3.0.0
 */

/**
 * Abstract carousel. The general HTML structure is showed in the example below.
 * The HTML element with class "playlist_local" is optional. If the playlist is undefined, then the carousel will try to create the playlist from that element.
 * From MooTools it implements: Options, Events.
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
    Implements: [Options, Events],

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
     * Defines how many scrolls should be combined in one scroll effect.
     * @type {number}
     */
    NScrolls: 0,

    /**
     * Single item shift value by scrolling.
     * @type {number}
     */
    dShift: 0,

    /**
     * Current scrolling direction.
     * Possible values:
     * <ul>
     *     <li><tt>1</tt> - defined direction in [options.scrollDirection]{@link ACarousel#options}.</li>
     *     <li><tt>-1</tt> - opposite direction.</li>
     * </ul>
     * @type {number}
     */
    direction: 1,

    /**
     * Defines whether the carousel controls are locked.
     * @type {boolean}
     */
    isLocked: false,

    // constructor
    initialize: function (el, opts) {
        /**
         * Main element for the carousel. It must contain the '.carousel_viewbox'.
         * @type {Element}
         */
        this.element = el;

        this.setOptions(opts);

        /**
         * View-box element of the carousel that holds an playlist items.
         * @type {Element}
         */
        this.viewbox = this.element.getElement(this.options.classes.viewbox);
        if (!this.viewbox) {
            throw 'View box of the carousel was not found.';
        }

        // This is need to save the reference to the playlist.
        if (opts != undefined && 'playlist' in opts) {
            this.options.playlist = opts.playlist;
        }
        this.createPlaylist();
        this.checkOptions();

        /**
         * Carousel ID.
         * @type {number}
         */
        this._id = ACarousel.assignID();
        this.element.store('id', this._id);

        /**
         * Cached items from playlist
         * @type {Elements}
         */
        this.items = new Elements();
        var ids = [];
        for (var n = 0; n < this.options.NVisibleItems; n++) {
            ids[n] = n;
        }
        this.checkCache(ids);
        this.setActiveItem(0);

        /**
         * Fx object.
         * @type {Fx.Elements}
         */
        this.fx = new Fx.Elements(null, {
            link: 'cancel',
            duration: this.options.fx.duration,
            transition: this.options.fx.transition,
            onComplete: function () {
                this.isEffectCompleted = true;
                this.NScrolls = 0;

                this.selectItem(this.currentActiveID);

                /**
                 * Fired when the whole scrolling is finished.
                 * @event ACarousel#scroll
                 * @param {number} direction Last scrolled direction.
                 */
                this.fireEvent('scroll', this.direction);
            }.bind(this)
        });
    },

    /**
     * Build the carousel.
     *
     * @fires ACarousel#enableScrolling
     * @fires ACarousel#disableScrolling
     */
    build: function() {
        this.calcItemSize();
        this.applyStyles();
        this.prepareItems();

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
        this.canScroll = this.options.NVisibleItems < this.options.playlist.NItems;

        if (this.canScroll) {
            /**
             * Indicates the first visible item ID in the carousel.
             * @type {number}
             */
            this.firstVisibleItemID = 0;

            /**
             * Backup of [firstVisibleItemID]{@link ACarousel#firstVisibleItemID}.
             * @type {number}
             */
            this.firstVisibleItemID_bk = 0;

            /**
             * Backup of [currentActiveID]{@link ACarousel#currentActiveID}.
             * @type {number}
             */
            this.currentActiveID_bk = 0;

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
    },

    /**
     * Scroll forward.
     */
    scrollForward: function () {
        if (this.isLocked) {
            return;
        }
        if (!this.isEffectCompleted) {
            this.firstVisibleItemID = this.firstVisibleItemID_bk;
        }

        this.NScrolls++;
        this.scroll(1, Math.abs(this.NScrolls));
    },

    /**
     * Scroll backward.
     */
    scrollBackward: function () {
        if (this.isLocked) {
            return;
        }
        if (!this.isEffectCompleted) {
            this.firstVisibleItemID = this.firstVisibleItemID_bk;
        }

        this.NScrolls--;
        this.scroll(-1, Math.abs(this.NScrolls));
    },

    /**
     * Mark item as active.
     *
     * @param {number} id Item ID.
     */
    setActiveItem: function(id) {
        var total = this.getTotal();

        id = wrapIndices(id, 0, total);
        if (this.currentActiveID === id) {
            return;
        }

        Object.each(this.items, function(el, key) {
            var id = parseInt(key);
            if (!isNaN(id)) {
                el.removeClass(this.options.activeLabel);
            }
        }.bind(this));

        for (var n = 0; n < total / this.options.playlist.NItems; n++) {
            this.items[id + this.options.playlist.NItems * n].addClass(this.options.activeLabel);
        }
        this.currentActiveID = id;
    },

    /**
     * Select item in the carousel.
     *
     * @fires ACarousel#selectItem
     *
     * @param {number} id Item ID.
     */
    selectItem: function (id) {
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
        // Check whether the desired item ID is visible in the carousel. If it is true, then do not scroll.
        for (var n = 0; n < this.options.NVisibleItems; n++) {
            if (wrapIndices(this.firstVisibleItemID + n, 0, this.options.playlist.NItems) == id) {
                this.setActiveItem(id);
                return;
            }
        }

        if (this.isEffectCompleted) {
            this.currentActiveID_bk = this.currentActiveID;
        } else {
            this.NScrolls++;
            this.currentActiveID = this.currentActiveID_bk;
        }

        var scrollsProps = this.calcScrolls(id);
        this.scroll(scrollsProps.direction, scrollsProps.NScrolls, true);
        this.setActiveItem(id);
    },

    /**
     * Stop the scrolling.
     */
    stop: function() {
        this.fx.stop();
    },

    /**
     * Lock carousel controls.
     */
    lock: function() {
        this.isLocked = true;
    },

    /**
     * Unlock carousel controls.
     */
    unlock: function() {
        this.isLocked = false;
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
                this.dShift * this.options.NVisibleItems,
                -this.dShift * this.options.scrollStep
            ];

            // Calculate effects for scrolling
            // NOTE: Do not create unique effects for both opposite style. It is complex:
            //      - each element must have only one style and not both
            //      - before applying effect we need delete one style from the visible and new items and assign other
            //      - prepare an object with proper effects for the Fx.Elements
            var N = this.options.NVisibleItems + this.options.scrollStep;
            this.effects[0] = this.createEffect(-this.dShift * this.options.scrollStep, N);
            this.effects[1] = this.createEffect(0, N);

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
                it.setStyle(this.options.scrollDirection, n * this.dShift);
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
         * @param {number} scrollNTimes Scrolling multiplier.
         * @param {number[]} ids Item indices.
         * @return {Element[]}
         */
        getNewVisibleItems: function(scrollNTimes, ids) {},

        /**
         * Get the item indices, that will become visible after scrolling.
         *
         * @memberOf ACarousel#
         * @abstract
         * @protected
         * @param {number} scrollNTimes Scrolling multiplier.
         * @return {number[]}
         */
        getNewVisibleItemIDs: function(scrollNTimes) {},

        /**
         * Method for calculation the ID of the first visible item.
         *
         * @memberOf ACarousel#
         * @abstract
         * @protected
         * @param {number} scrollNTimes Scrolling multiplier.
         */
        calcFirstItemID: function(scrollNTimes) {},

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
         * @param {number} scrollNTimes Scrolling multiplier.
         * @return {Object}
         */
        getItemEffects: function(scrollNTimes) {},
        // ====================

        /**
         * Checks types and boundaries of carousel options.
         * @memberOf ACarousel#
         * @protected
         */
        checkOptions: function() {
            if (this.options.NVisibleItems !== 'all') {
                this.options.NVisibleItems = this.checkNumbers('NVisibleItems', [this.options.NVisibleItems, 1, 1, this.options.playlist.NItems]);
                this.options.scrollStep = this.checkNumbers('scrollStep', [this.options.scrollStep, 1, 1, this.options.playlist.NItems - this.options.NVisibleItems]);
                this.options.fx.duration = this.checkNumbers('duration', [this.options.fx.duration, 700, 0]);
            } else {
                this.options.NVisibleItems = this.options.playlist.NItems;
                this.options.scrollStep = 0;
                this.options.fx.duration = 0;
            }

            // scrollDirection
            if (typeOf(this.options.scrollDirection) != 'string'
                || (this.options.scrollDirection != 'left'
                && this.options.scrollDirection != 'right'
                && this.options.scrollDirection != 'top'
                && this.options.scrollDirection != 'bottom'))
            {
                this.options.scrollDirection = 'left';
                console.warn('The option "scrollDirection" is incorrect. Its value reset to "' + this.options.scrollDirection + '"');
            }

            // autoSelect
            if (typeOf(this.options.autoSelect) != 'boolean') {
                this.options.autoSelect = !!this.options.autoSelect;
                console.warn('The option "autoSelect" was not with type of "boolean". Its value set to "' + this.options.autoSelect.toString() + '"');
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
            if (!instanceOf(this.options.playlist, Playlist.HTML)) {
                console.warn('The option for "playlist" is incorrect. The default Playlist.HTML will be tried to create.');

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
                this.dShift = this.itemSize[0];
            } else {
                this.dShift = this.itemSize[1];
            }
        },

        /**
         * Apply styles to the carousel and his elements.
         * @memberOf ACarousel#
         * @protected
         */
        applyStyles: function() {
            var opts = this.options;

            this.element.setStyles(opts.styles.element);
            this.viewbox.setStyles(opts.styles.viewbox);
            this.items.setStyles(opts.styles.item);
            delete opts.styles.element;
            delete opts.styles.viewbox;

            // Apply new width to the 'view-box'-element
            if (opts.scrollDirection == 'left' || opts.scrollDirection == 'right') {
                this.viewbox.setStyle('width', this.dShift * opts.NVisibleItems);
                this.viewbox.setStyle('height', this.itemSize[1]);
            } else {
                this.viewbox.setStyle('width', this.itemSize[0]);
                this.viewbox.setStyle('height', this.dShift * opts.NVisibleItems);
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
            this.isLocked = true;
        },

        /**
         * The core method that scrolls the items. If one of the new visible items is not marked as active, this will set
         * leftmost or rightmost item as active and after that an event will be fired, that the new item is set as active.
         * If this method will be called with <tt>isSelected == true</tt> then the selection will be ignored.
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

            if (scrollNTimes < 0) {
                throw 'scrollNTimes must be >= 0';
            }
            if (direction !== 1 && direction !== -1) {
                throw 'Scrolling direction must be -1 or 1 but received "' + direction + '".';
            }
            if (scrollNTimes == 0) {
                return;
            }
            this.direction = direction;

            itemsToScroll = this.getScrolledItems(scrollNTimes);
            effects = this.getItemEffects(scrollNTimes);

            this.firstVisibleItemID_bk = this.firstVisibleItemID;
            this.calcFirstItemID(scrollNTimes);

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
                    this.setActiveItem(wrapIndices(
                        (direction == 1)
                            ? this.firstVisibleItemID
                            : this.firstVisibleItemID + this.options.NVisibleItems - 1,
                        0, this.options.playlist.NItems));
                }
            }

            this.isEffectCompleted = false;

            this.fx.elements = itemsToScroll;
            this.fx.start(effects);
        },

        /**
         * Get the items, that will be scrolled.
         *
         * @memberOf ACarousel#
         * @protected
         * @param {number} scrollNTimes Scrolling multiplier.
         * @return {Element[]}
         */
        getScrolledItems: function(scrollNTimes) {
            var itemsToScroll = [],
                total = this.getTotal(),
                ids,
                newItems,
                first,
                n;

            // Collects all visible items
            for (n = 0; n < this.options.NVisibleItems; n++) {
                var itemID = this.firstVisibleItemID + n;
                if (itemID >= total) {
                    itemID -= total;
                }

                itemsToScroll.push(this.items[itemID]);
            }

            ids = this.getNewVisibleItemIDs(scrollNTimes);

            this.checkCache(ids);

            newItems = this.getNewVisibleItems(scrollNTimes, ids);

            if (this.direction === 1) {
                first = itemsToScroll.length-1;
            } else {
                first = 0;
                newItems = newItems.reverse();
            }

            newItems[0].setStyle(this.options.scrollDirection,
                parseInt(itemsToScroll[first].getStyle(this.options.scrollDirection)) + this.dShift * this.direction);
            for (n = 1; n < newItems.length; n++) {
                newItems[n].setStyle(this.options.scrollDirection,
                    parseInt(newItems[n-1].getStyle(this.options.scrollDirection)) + this.dShift * this.direction);
            }

            // Connects all visible and new items
            itemsToScroll = (this.direction == 1)
                ? itemsToScroll.concat(newItems)
                : newItems.reverse().concat(itemsToScroll);

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
                id,
                n;

            // Check if requested items are already uploaded.
            for (n = 0; n < ids.length; n++) {
                id = wrapIndices(ids[n], 0, this.options.playlist.NItems);
                if (!this.items[id]) {
                    uncachedIDs.push(id);
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
                this.items.length++;
                this.items[uncachedIDs[n]] = uncachedEls[n];
                this.playlistHolder.grab(this.items[uncachedIDs[n]]);
            }
        },

        /**
         * Get total amount of local items.
         *
         * @protected
         * @returns {Number}
         */
        getTotal: function() {
            return (this.options.playlist.NItems >= this.items.length)
                ? this.options.playlist.NItems
                : this.items.length;
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
         * @param {number} begin Indicates a start value of effect.
         * @param {number} count Indicates how many effects must be generated.
         * @returns {Object} Array-like object.
         *
         * @example
         * scrollDirection = 'left';
         * dShift = 10;
         * createEffect(0, 3) == { { 'left': 0  }
         *                         { 'left': 10 }
         *                         { 'left': 20 } }
         */
        createEffect: function (begin, count) {
            var obj = {};
            for (var i = 0; i < count; i++) {
                obj[i] = {};
                obj[i][this.options.scrollDirection] = begin + this.dShift * i;
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
                console.warn('The value for "' + varName + '" is incorrect. Its value reset to', values[0] + '.');
            } else if (values[3] !== undefined && values[0] > values[3]) {
                values[0] = values[3];
                console.warn('The value for "' + varName + '" is incorrect. Its value reset to', values[0] + '.');
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
     * @property {string} [controls.type = 'two-buttons'] Type of the carousel controls (can be: 'two-buttons', 'twoButtons', 'two-buttons, anotherType');
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

        this.options.carousel.type = this.options.carousel.type.replace(/\s+/g,'').capitalize();
        this.options.controls.type = this.options.controls.type.replace(/\s+/g,'').camelCase().capitalize();

        this.carousel = new CarouselFactory.Types[this.options.carousel.type](el, this.options.carousel);
        if (this.options.controls.type !== 'None') {
            var controlTypes = this.options.controls.type.split(',');
            for (var n = 0; n < controlTypes.length; n++) {
                this.controls = new CarouselFactory.Controls[controlTypes[n]](this.carousel, this.options.controls);
            }
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
             * Implementation of the abstract [getNewVisibleItems]{@link ACarousel#getNewVisibleItems} method.
             *
             * @memberOf CarouselFactory.Types.Loop#
             * @protected
             * @param {number} scrollNTimes Scrolling multiplier.
             * @param {number[]} ids Item indices.
             * @return {Element[]}
             */
            getNewVisibleItems: function(scrollNTimes, ids) {
                // new first visible item after scrolling
                var newItems = [],
                    itemShift,
                    n;

                if (this.direction === 1) {
                    itemShift = this.itemShifts[0];
                } else {
                    itemShift = this.itemShifts[1] - ((scrollNTimes == 1) ? 0 : this.dShift * (scrollNTimes - 1));
                }

                if (scrollNTimes > 1) {
                    var tmp = this.options.NVisibleItems + this.options.scrollStep * scrollNTimes;

                    var NClones = Math.floor(tmp / this.getTotal());
                    if (NClones > 0) {
                        this.cloneItems(this.items, this.playlistHolder, NClones);
                        for (n = this.options.playlist.NItems; n < this.items.length; n++) {
                            this.items[n].setStyle(this.options.scrollDirection, -this.dShift);
                        }
                    }
                }

                for (n = 0; n < ids.length; n++) {
                    newItems[n] = this.items[wrapIndices(ids[n], 0, this.getTotal())];
                    newItems[n].setStyle(this.options.scrollDirection, this.dShift * n + itemShift);
                }

                return newItems;
            },

            /**
             * Implementation of the abstract [getNewVisibleItemIDs]{@link ACarousel#getNewVisibleItemIDs} method.
             *
             * @memberOf CarouselFactory.Types.Loop#
             * @protected
             * @param {number} scrollNTimes Scrolling multiplier.
             * @return {number[]}
             */
            getNewVisibleItemIDs: function(scrollNTimes) {
                // new first visible item index after scrolling
                var newItemID,
                    itemIDs = [],
                    n;

                if (this.direction === 1) {
                    newItemID = this.firstVisibleItemID + this.options.NVisibleItems;
                } else {
                    newItemID = this.firstVisibleItemID - this.options.scrollStep * scrollNTimes;
                }

                for (n = 0; n < this.options.scrollStep * scrollNTimes; n++) {
                    itemIDs[n] = newItemID + n;
                }

                return itemIDs;
            },

            /**
             * Implementation of the abstract [calcFirstItemID]{@link ACarousel#calcFirstItemID} method.
             *
             * @memberOf CarouselFactory.Types.Loop#
             * @protected
             * @param {number} scrollNTimes Scrolling multiplier.
             */
            calcFirstItemID: function(scrollNTimes) {
                this.firstVisibleItemID += this.direction * this.options.scrollStep * scrollNTimes;
                var total = (this.options.playlist.NItems >= this.items.length)
                    ? this.options.playlist.NItems
                    : this.items.length;
                this.firstVisibleItemID = wrapIndices(this.firstVisibleItemID, 0, total);
            },

            /**
             * Implementation of the abstract [calcScrolls]{@link ACarousel#calcScrolls} method.
             *
             * @memberOf ACarousel#
             * @abstract
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
                    NTimes = diffFromLeft - (wrapIndices(this.firstVisibleItemID + this.options.NVisibleItems - this.currentActiveID, 0, this.options.playlist.NItems) - 1);
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
             * Implements the parent abstract [getItemEffects]{@link ACarousel#getItemEffects} method.
             *
             * @memberOf CarouselFactory.Types.Loop#
             * @protected
             * @param {number} scrollNTimes Scrolling multiplier.
             * @return {Object}
             */
            getItemEffects: function(scrollNTimes) {
                var effects = {};

                if (scrollNTimes > 1) {
                    var shift = 0;
                    if (this.direction == 1) {
                        shift = this.options.scrollStep * scrollNTimes;
                    }

                    effects = this.createEffect(-this.dShift * shift,
                        this.firstVisibleItemID + this.options.NVisibleItems + this.options.scrollStep * scrollNTimes);
                } else {
                    effects = this.effects[( (this.direction == 1) ? 0 : 1 )];
                }

                return effects;
            }
        }
    }),

    /**
     * Line carousel. All items scrolled in the line, that means it has two ends of the scrolling.
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

        /**
         * Defines whether the forward scrolling is allowed.
         * @type {boolean}
         */
        allowForward: true,
        /**
         * Defines whether the backward scrolling is allowed.
         * @type {boolean}
         */
        allowBackward: false,

        /**
         * Extension to the parent [scrollForward]{@link ACarousel#scrollForward} method.
         */
        scrollForward: function() {
            if (this.allowForward) {
                this.parent();
            }
        },

        /**
         * Extension to the parent [scrollBackward]{@link ACarousel#scrollBackward} method.
         */
        scrollBackward: function() {
            if (this.allowBackward) {
                this.parent();
            }
        },

            Protected: {
                /**
                 * Implementation of the abstract [specificPreparation]{@link ACarousel#specificPreparation} method.
                 *
                 * @memberOf CarouselFactory.Types.Line#
                 * @protected
                 */
                specificPreparation: function() {
                    /**
                     * Last possible scroll step for limited scrolling.
                     * @type {number}
                     */
                    this.lastScrollStep = this.options.playlist.NItems - this.options.NVisibleItems
                        - this.options.scrollStep * Math.floor((this.options.playlist.NItems - this.options.NVisibleItems) / this.options.scrollStep);
                    if (this.lastScrollStep == 0) {
                        this.lastScrollStep = this.options.scrollStep;
                    }

                    var N = this.options.NVisibleItems + this.lastScrollStep;
                    this.effects[2] = this.createEffect(-this.dShift * this.lastScrollStep, N);
                    this.effects[3] = this.createEffect(0, N);

                    this.itemShifts[2] = -this.dShift * this.lastScrollStep;
                },

                /**
                 * Implementation of the abstract [getNewVisibleItems]{@link ACarousel#getNewVisibleItems} method.
                 *
                 * @memberOf CarouselFactory.Types.Line#
                 * @protected
                 * @param {number} scrollNTimes Scrolling multiplier.
                 * @param {number[]} ids Item indices.
                 * @return {Object}
                 */
                getNewVisibleItems: function(scrollNTimes, ids) {
                    var newItems = [],
                    // new first visible ID in this.items after scrolling
                        newItemID,
                        itemShift,
                        n;

                    if (this.direction === 1) {
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
                 * @memberOf CarouselFactory.Types.Line#
                 * @protected
                 * @param {number} scrollNTimes Scrolling multiplier.
                 * @return {number[]}
                 */
                getNewVisibleItemIDs: function(scrollNTimes) {
                    // new first visible ID in this.items after scrolling
                    var newItemID,
                        itemIDs = [],
                    // helper variables
                        n;

                    this.allowForward = true;
                    this.allowBackward = true;
                    if (this.direction === 1) {
                        newItemID = this.firstVisibleItemID + this.options.NVisibleItems;
                    } else {
                        newItemID = this.firstVisibleItemID - this.options.scrollStep * scrollNTimes;
                    }

                    /**
                     * Defines whether the last scroll step should be applied.
                     * @type {boolean}
                     */
                    this.isLast = (newItemID + this.options.scrollStep * scrollNTimes) >= this.options.playlist.NItems || newItemID < 0;

                    // If new item id reaches the last item then disable clicked button
                    if (this.isLast || newItemID == 0) {
                        if (this.direction == 1) {
                            this.allowForward = false;
                        } else {
                            this.allowBackward = false;
                        }
                    }

                    // Get new item indexes
                    if (this.isLast) {
                        newItemID = wrapIndices(newItemID, 0, this.items.length, false);

                        // Get last possible new item indexes
                        for (n = 0; n < this.lastScrollStep + this.options.scrollStep * (scrollNTimes - 1); n++) {
                            itemIDs[n] = newItemID + n;
                        }
                    } else {
                        for (n = 0; n < this.options.scrollStep * scrollNTimes; n++) {
                            itemIDs[n] = wrapIndices(newItemID + n, 0, this.options.playlist.NItems, true);
                        }
                    }

                    return itemIDs;
                },

                /**
                 * Implementation of the abstract [calcFirstItemID]{@link ACarousel#calcFirstItemID} method.
                 *
                 * @memberOf CarouselFactory.Types.Line#
                 * @protected
                 * @param {number} scrollNTimes Scrolling multiplier.
                 */
                calcFirstItemID: function(scrollNTimes) {
                    this.firstVisibleItemID += this.direction * ((!this.isLast)
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
                 * @param {number} scrollNTimes Scrolling multiplier.
                 * @return {Object}
                 */
                getItemEffects: function(scrollNTimes) {
                    var effects = {};

                    if (scrollNTimes > 1) {
                        var shift = 0;
                        if (this.direction == 1) {
                            shift = this.options.scrollStep * (scrollNTimes - 1) + this.lastScrollStep;
                        }

                        effects = this.createEffect(-this.dShift * shift,
                            this.firstVisibleItemID + this.options.NVisibleItems + this.options.scrollStep * scrollNTimes);
                    } else {
                        effects = this.effects[(this.isLast)
                            ? ( (this.direction == 1) ? 2 : 3 )
                            : ( (this.direction == 1) ? 0 : 1 )
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
         * @property {object} backward Button for scrolling backward.
         * @property {Element} backward.element Element in the DOM Tree for the backward button.
         */
        controls: {
            forward: {
                element: null
            },
            backward: {
                element: null
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
                disableScrolling: this.disable.bind(this)
            });
        },

        /**
         * Implements the parent abstract [enable]{@link ACarousel.AControls#enable} method.
         */
        enable: function() {
            var self = this;
            this.controls.forward.element.addEvent(this.options.event, function (ev) {
                ev.stop();

                /**
                 * Fired when the forward button is enabled and clicked.
                 * @event CarouselFactory.Controls.TwoButtons#scrollForward
                 */
                self.fireEvent('scrollForward');
            });

            this.controls.backward.element.addEvent(this.options.event, function (ev) {
                ev.stop();

                /**
                 * Fired when the backward button is enabled and clicked.
                 * @event CarouselFactory.Controls.TwoButtons#scrollBackward
                 */
                self.fireEvent('scrollBackward');
            });
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
    holder: null,

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
            this.request.options.url = this.src;
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
        var self = this;
        for (n = 0; n < this.carousels.length; n++) {
            (function (n) {
                self.carousels[n].addEvent('selectItem', function (id) {
                    // With slicing we exclude the carousel that fires event
                    self.carousels.slice(0, n).each(function (carousel) {
                        self.carouselEventFn(carousel, id);
                    });
                    self.carousels.slice(n + 1, self.carousels.length).each(function (carousel) {
                        self.carouselEventFn(carousel, id);
                    });
                });
                self.carousels[n].fx.addEvents({
                    start: function () {
                        self.carousels.slice(0, n).each(function (carousel) {
                            carousel.lock();
                        });
                        self.carousels.slice(n + 1, self.carousels.length).each(function (carousel) {
                            carousel.lock();
                        });
                    },
                    complete: function () {
                        self.carousels.slice(0, n).each(function (carousel) {
                            carousel.unlock();
                        });
                        self.carousels.slice(n + 1, self.carousels.length).each(function (carousel) {
                            carousel.unlock();
                        });
                    }
                });
            })(n);
        }
    },

    /**
     * It stores the functions for selecting a specific item <tt>id</tt> in <tt>carousel</tt> by fired event [selectItem]{@link CarouselFactory#selectItem} from other carousel.
     *
     * @param {ACarousel} carousel Connected carousel.
     * @param {number} id Item ID in carousel that will be selected.
     */
    carouselEventFn: function (carousel, id) {
        carousel.scrollTo(id);
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