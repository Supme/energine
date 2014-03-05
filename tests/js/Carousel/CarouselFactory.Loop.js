/**
 * @file Testing class CarouselFactory.Types.Loop in Carousel.js 3.0.0
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0
 */

/**
 * Function for inserting special predefined HTML fixture like playlist or carousel.
 *
 * @param {string} fixture File name in the directory ./fixtures.
 */
function loadFixture(fixture) {
    new Request({
        async: false,
        method: 'get',
        url: '/test/fixtures/' + fixture,
        onSuccess: function() {
            var context = document.body.get('html');
            document.body.set('html', context + this.response.text);
        },
        onFailure: function() {
            console.error('Failed to load ', this.url);
        }
    }).send();
}

/**
 * Simple carousel builder.
 *
 * @param {string|Element} el HTML element.
 * @param {Object} opts Carousel options.
 * @returns {ACarousel}
 */
function buildCarousel(el, opts) {
    var carousel = new CarouselFactory.Types.Loop(el, opts);
    carousel.build();
    return carousel;
}

// Amount of items in the playlist
var NITEMS = 7;
var ITEM_WIDTH = 100;

new AsyncTestCase('Scroll carousel', {
    setUp: function() {
        loadFixture('playlist.html');
        loadFixture('carousel.html');

        // Create an playlist
        var playlistEl = $('playlistID');
        var item = playlistEl.getElement('.item');
        for (var n = 1; n < NITEMS; n++) {
            item.clone().inject(playlistEl);
        }
        // Set styles to the items
        playlistEl.getElements('.item').setStyle('width', ITEM_WIDTH);

        this.playlist = new Playlist.HTML('playlistID');
        this.carouselEl = $('carouselID');
        ITEM_WIDTH = item.getStyle('width').toInt();

        this.shortAnimation = 50;
        this.longAnimation = 50;
    },

    testFalseAutoSelect: function (queue) {
        var carousel = buildCarousel(this.carouselEl, {autoSelect:false, NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            carousel.scrollForward();

            window.setTimeout(callbacks.add(function() {
                assertTrue(carousel.items[0].hasClass('active'));
            }), this.shortAnimation);
        });
    },
    testTrueAutoSelect: function (queue) {
        var carousel = buildCarousel(this.carouselEl, {autoSelect:true, NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            carousel.scrollForward();

            window.setTimeout(callbacks.add(function() {
                assertFalse(carousel.items[0].hasClass('active'));
                assertTrue(carousel.items[1].hasClass('active'));
            }), this.shortAnimation);
        });
    },
    testNV1SS1: function(queue) {
        var n,
            expected = [],
            assertItems = this.assertItems,
            carousel = buildCarousel(this.carouselEl, {NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            assertEquals(0, carousel.currentActiveID);
            carousel.scrollForward();

            // Prepare expected values
            for (n = 0; n < carousel.options.playlist.NItems; n++)
                expected[n] = -ITEM_WIDTH;
            for (n = 0; n < carousel.options.NVisibleItems; n++)
                expected[n+carousel.options.scrollStep] =  ITEM_WIDTH * n;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertEquals(1, carousel.currentActiveID);
                assertTrue(carousel.items[carousel.options.scrollStep].hasClass('active'));
            }), this.shortAnimation);
        });
        queue.call('scrollBackward()', function(callbacks) {
            assertEquals(1, carousel.currentActiveID);
            carousel.scrollBackward();

            // Prepare expected values
            for (n = 0; n < carousel.options.playlist.NItems; n++)
                expected[n] = -ITEM_WIDTH;
            for (n = 0; n < carousel.options.NVisibleItems + carousel.options.scrollStep; n++)
                expected[n] =  ITEM_WIDTH * n;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertEquals(0, carousel.currentActiveID);
                assertTrue(carousel.items[0].hasClass('active'));
            }), this.shortAnimation);
        });
    },
    testNV4SS3: function(queue) {
        var n,
            expected = [],
            assertItems = this.assertItems,
            carousel = buildCarousel(this.carouselEl, {NVisibleItems:4, scrollStep:3, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            carousel.scrollForward();

            // Prepare expected values
            for (n = 0; n < carousel.options.NVisibleItems + carousel.options.scrollStep; n++)
                expected[n] =  ITEM_WIDTH * n - ITEM_WIDTH*carousel.options.scrollStep;
            for (; n < carousel.options.playlist.NItems; n++)
                expected[n] = -ITEM_WIDTH;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[carousel.options.scrollStep].hasClass('active'));
            }), this.shortAnimation);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            // Prepare expected values
            for (n = 0; n < carousel.options.NVisibleItems + carousel.options.scrollStep; n++)
                expected[n] =  ITEM_WIDTH * n;
            for (; n < carousel.options.playlist.NItems; n++)
                expected[n] = -ITEM_WIDTH;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[carousel.options.scrollStep].hasClass('active'));
            }), this.shortAnimation);
        });
    },
    testNV4SS4: function(queue) {
        var n,
            expected = [],
            assertItems = this.assertItems,
            carousel = buildCarousel(this.carouselEl, {NVisibleItems:4, scrollStep:4, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            carousel.scrollForward();

            // Prepare expected values
            for (n = 0; n < carousel.options.NVisibleItems + carousel.options.scrollStep; n++)
                expected[n] = ITEM_WIDTH * n - ITEM_WIDTH*carousel.options.scrollStep;
            for (; n < carousel.options.playlist.NItems; n++)
                expected[n] = -ITEM_WIDTH;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[0].hasClass('active'));
                assertTrue(carousel.items[carousel.options.playlist.NItems].hasClass('active'));
            }), this.shortAnimation);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            // Prepare expected values
            for (n = 0; n < carousel.options.NVisibleItems + carousel.options.scrollStep; n++)
                expected[n] = ITEM_WIDTH * n;
            for (; n < carousel.options.playlist.NItems*2; n++)
                expected[n] = -ITEM_WIDTH;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[0].hasClass('active'));
                assertTrue(carousel.items[carousel.options.playlist.NItems].hasClass('active'));
            }), this.shortAnimation);
        });
    },
    testSuccessively2ScrollsNV1SS1: function(queue) {
        var NVisibleItems = 1,
            scrollStep = 1,
            NScrolls = 2,
            playlist = this.playlist,
            assertItems = this.assertItems,
            n,
            expected = [],
            carousel;
        queue.call('scrollForward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            // Prepare expected values
            for (n = 0; n < playlist.NItems; n++)
                expected[n] = -ITEM_WIDTH;
            for (n = 0; n < carousel.options.NVisibleItems; n++)
                expected[n] =  ITEM_WIDTH * n;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[2].hasClass('active'));
            }), this.longAnimation);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollBackward();

            // Prepare expected values
            for (n = 0; n < playlist.NItems; n++)
                expected[n] = ITEM_WIDTH;
            for (n = 0; n < carousel.options.NVisibleItems; n++)
                expected[n] = ITEM_WIDTH * n;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[5].hasClass('active'));
            }), this.longAnimation);
        });
    },
    testSuccessively5ScrollsNV1SS1: function(queue) {
        var NVisibleItems = 1,
            scrollStep = 1,
            NScrolls = 5,
            playlist = this.playlist,
            assertItems = this.assertItems,
            n,
            expected = [],
            carousel;
        queue.call('scrollForward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            // Prepare expected values
            for (n = 0; n < playlist.NItems; n++)
                expected[n] = -ITEM_WIDTH;
            for (n = 0; n < carousel.options.NVisibleItems; n++)
                expected[n] =  ITEM_WIDTH * n;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[5].hasClass('active'));
            }), this.longAnimation);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollBackward();

            // Prepare expected values
            for (n = 0; n < playlist.NItems; n++)
                expected[n] = ITEM_WIDTH;
            for (n = 0; n < carousel.options.NVisibleItems; n++)
                expected[n] = ITEM_WIDTH * n;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[2].hasClass('active'));
            }), this.longAnimation);
        });
    },
    testSuccessively2ScrollsNV4SS3: function(queue) {
        var NVisibleItems = 4,
            scrollStep = 3,
            NScrolls = 2,
            playlist = this.playlist,
            assertItems = this.assertItems,
            n,
            expected = [],
            carousel;
        queue.call('scrollForward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            // Prepare expected values
            for (n = 0; n < playlist.NItems; n++)
                expected[n] = -ITEM_WIDTH * (playlist.NItems - n);
            for (n = 0; n < carousel.options.NVisibleItems; n++)
                expected[n] =  ITEM_WIDTH * n;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[6].hasClass('active'));
            }), this.longAnimation);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollBackward();

            // Prepare expected values
            for (n = 0; n < playlist.NItems; n++)
                expected[n] = ITEM_WIDTH * n;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[4].hasClass('active'));
            }), this.longAnimation);
        });
    },
    testSuccessively4ScrollsNV4SS3: function(queue) {
        var NVisibleItems = 4,
            scrollStep = 3,
            NScrolls = 4,
            playlist = this.playlist,
            assertItems = this.assertItems,
            n,
            expected = [],
            carousel;

        queue.call('4*scrollForward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            // Prepare expected values
            for (n = 0; n < playlist.NItems; n++)
                expected[n] = ITEM_WIDTH * (n +2 - playlist.NItems);
            for (n = 0; n < 2; n++)
                expected[n] = ITEM_WIDTH * (n +2);
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[5].hasClass('active'));
            }), this.longAnimation);
        });
        queue.call('4*scrollBackward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollBackward();

            // Prepare expected values
            for (n = 0; n < playlist.NItems; n++)
                expected[n] = ITEM_WIDTH * (n -2);
            for (n = 0; n < 2; n++)
                expected[n] = ITEM_WIDTH * (n + carousel.options.NVisibleItems+1);
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[5].hasClass('active'));
            }), this.longAnimation);
        });
    },
    testLoopTwoDirections1: function(queue) {
        var NVisibleItems = 4,
            scrollStep = 2,
            playlist = this.playlist,
            assertItems = this.assertItems,
            n,
            expected = [],
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});

        queue.call('scrollForward()', function(callbacks) {
            carousel.scrollForward();

            // Prepare expected values
            for (n = 0; n < scrollStep; n++)
                expected[n] =  ITEM_WIDTH * (n - scrollStep);
            for (n = 0; n < carousel.options.NVisibleItems; n++)
                expected[n+scrollStep] =  ITEM_WIDTH * n;
            expected[6] = -ITEM_WIDTH;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[carousel.options.scrollStep].hasClass('active'));
            }), this.longAnimation);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            // Prepare expected values
            for (n = 0; n < playlist.NItems; n++)
                expected[n] = ITEM_WIDTH * n;
            expected[6] = -ITEM_WIDTH;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[carousel.options.scrollStep].hasClass('active'));
            }), this.longAnimation);
        });
    },
    testLoopTwoDirections2: function(queue) {
        var NVisibleItems = 4,
            scrollStep = 2,
            NScrolls = 3,
            playlist = this.playlist,
            assertItems = this.assertItems,
            n,
            expected = [],
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});

        queue.call('scrollForward()', function(callbacks) {
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            // Prepare expected values
            for (n = 0; n < 3; n++)
                expected[n] = ITEM_WIDTH * (n + 1);
            expected[3] = -100;
            for (n = 0; n < 3; n++)
                expected[n+4] = ITEM_WIDTH * (n-2);
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[6].hasClass('active'));
            }), this.longAnimation);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            // Prepare expected values
            for (n = 0; n < 4; n++)
                expected[n+3] = ITEM_WIDTH * (n-1);
            for (n = 0; n < 3; n++)
                expected[n] = ITEM_WIDTH * (n+3);
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[6].hasClass('active'));
            }), this.longAnimation);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            // Prepare expected values
            for(n = 0; n < 2; n++)
                expected[n] = ITEM_WIDTH * (5-n);
            for (n = 0; n < 5; n++)
                expected[n+2] = ITEM_WIDTH * n;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[5].hasClass('active'));
            }), this.longAnimation);
        });
    },
    /*
    testLoopFalseScrollLeft1: function(queue) {
        var n,
            expected = [],
            assertItems = this.assertItems,
            playlist = this.playlist,
            carousel;

        queue.call('scrollForward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {loop:false, NVisibleItems:1, scrollStep:1, effectDuration:0, playlist:playlist});
            for (n = 0; n < playlist.NItems+1; n++)
                carousel.scrollForward();

            // Prepare expected values
            for (n = 0; n < playlist.NItems-1; n++)
                expected[n] = -ITEM_WIDTH;
            expected.push(0);
            window.setTimeout(callbacks.add(function() {
                assertEquals(0, carousel.$chain.length);
                assertFalse(carousel.buttons.next.isEnabled);
                assertItems(expected, carousel);
                assertTrue(carousel.items[6].hasClass('active'));
                carousel.items.destroy();
            }), this.longAnimation);
        });
    },
    testLoopFalseScrollLeft2: function(queue) {
        var n,
            expected = [],
            assertItems = this.assertItems,
            playlist = this.playlist,
            carousel = buildCarousel(this.carouselEl, {loop:false, NVisibleItems:4, scrollStep:2, effectDuration:0, playlist:playlist});

        queue.call('scrollForward()', function(callbacks) {
            for (n = 0; n < playlist.NItems+1; n++)
                carousel.scrollForward();

            // Prepare expected values
            expected[0] = -ITEM_WIDTH*2;
            expected[1] = expected[2] = -ITEM_WIDTH;
            for (n = 0; n < carousel.options.NVisibleItems; n++)
                expected[n+3] = ITEM_WIDTH * n;

            window.setTimeout(callbacks.add(function() {
                assertEquals(0, carousel.$chain.length);
                assertFalse(carousel.buttons.next.isEnabled);
                assertItems(expected, carousel);
                assertTrue(carousel.items[3].hasClass('active'));
                carousel.items.destroy();
            }), this.longAnimation);
        });
    },
    testLoopFalseScrollRight: function(queue) {
        var n,
            expected = [],
            assertItems = this.assertItems,
            playlist = this.playlist,
            carousel;

        queue.call('scrollBackward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {loop:false, NVisibleItems:1, scrollStep:1, effectDuration:0, playlist:playlist});
            assertFalse(carousel.buttons.previous.isEnabled);
            carousel.scrollBackward();

            // Prepare expected values
            for (n = 0; n < playlist.NItems; n++)
                expected[n] = -ITEM_WIDTH;
            for (n = 0; n < carousel.options.NVisibleItems; n++)
                expected[n] =  ITEM_WIDTH * n;
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[0].hasClass('active'));
                carousel.items.destroy();
            }), this.longAnimation);
        });
    },
    testLoopFalseScrollLeftRight1: function(queue) {
        var n,
            expected = [],
            assertItems = this.assertItems,
            playlist = this.playlist,
            carousel = buildCarousel(this.carouselEl, {loop:false, NVisibleItems:1, scrollStep:1, effectDuration:0, playlist:playlist});;

        queue.call('scrollForward() then scrollBackward()', function(callbacks) {
            for (n = 0; n < playlist.NItems; n++)
                expected[n] = ITEM_WIDTH;
            for (n = 0; n < carousel.options.NVisibleItems; n++)
                expected[n] =  ITEM_WIDTH * n;

            for (n = 0; n < playlist.NItems+1; n++)
                carousel.scrollForward();
            window.setTimeout(callbacks.add(function() {
                assertFalse(carousel.buttons.next.isEnabled);
                assertTrue(carousel.buttons.previous.isEnabled);
                assertTrue(carousel.items[6].hasClass('active'));

                for (n = 0; n < playlist.NItems+1; n++)
                    carousel.scrollBackward();
                window.setTimeout(callbacks.add(function() {
                    assertItems(expected, carousel);
                    assertTrue(carousel.buttons.next.isEnabled);
                    assertFalse(carousel.buttons.previous.isEnabled);
                    assertTrue(carousel.items[0].hasClass('active'));
                }), this.longAnimation);
            }), this.longAnimation);
        });
    },
    testLoopFalseScrollLeftRight2: function(queue) {
        var n,
            expected = [],
            assertItems = this.assertItems,
            playlist = this.playlist,
            carousel = buildCarousel(this.carouselEl, {loop:false, NVisibleItems:4, scrollStep:2, effectDuration:0, playlist:playlist});

        queue.call('scrollForward() then scrollBackward()', function(callbacks) {
            for (n = 0; n < playlist.NItems+1; n++)
                carousel.scrollForward();
            window.setTimeout(callbacks.add(function() {
                assertFalse(carousel.buttons.next.isEnabled);
                assertTrue(carousel.buttons.previous.isEnabled);
                assertTrue(carousel.items[3].hasClass('active'));

                for (n = 0; n < playlist.NItems; n++)
                    expected[n] = ITEM_WIDTH * n;
                expected[0] = -ITEM_WIDTH*2;

                carousel.scrollBackward();
                window.setTimeout(callbacks.add(function() {
                    assertTrue(carousel.buttons.next.isEnabled);
                    assertTrue(carousel.buttons.previous.isEnabled);
                    assertTrue(carousel.items[3].hasClass('active'));
                    assertItems(expected, carousel);

                    for (n = 0; n < playlist.NItems; n++)
                        expected[n] = ITEM_WIDTH * (n-3);
                    expected[0] = -ITEM_WIDTH*2;

                    carousel.scrollForward();
                    window.setTimeout(callbacks.add(function() {
                        assertFalse(carousel.buttons.next.isEnabled);
                        assertItems(expected, carousel);
                        assertTrue(carousel.items[3].hasClass('active'));

                        for (n = 0; n < carousel.options.NVisibleItems; n++)
                            expected[n] = ITEM_WIDTH * n;
                        expected[4] = expected[5] = ITEM_WIDTH * 5;
                        expected[4] = ITEM_WIDTH * 6;

                        for (n = 0; n < playlist.NItems+1; n++)
                            carousel.scrollBackward();
                        window.setTimeout(callbacks.add(function() {
                            assertTrue(carousel.buttons.next.isEnabled);
                            assertFalse(carousel.buttons.previous.isEnabled);
                            assertItems(expected, carousel);
                            assertTrue(carousel.items[3].hasClass('active'));
                        }), this.longAnimation);
                    }), this.longAnimation);
                }), this.longAnimation);
            }), this.longAnimation);
        });
    },
    */

    // helper functions:
    assertItems: function(expected, carousel) {
        for (var n = 0; n < carousel.NItems; n++)
            assertEquals('item #' + n + ' \"left\" style value', expected[n], carousel.items[n].getStyle('left').toInt());
    }
});