/**
 * @file Testing class CarouselFactory.Types.Line in Carousel.js 3.0.0
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

new AsyncTestCase('CarouselFactory.Types.Line', {
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

    test3F1B1BScrollsNV4SS2: function(queue) {
        var NVisibleItems = 4,
            scrollStep = 2,
            NScrolls = 3,
            playlist = this.playlist,
            n,
            expected = [],
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});

        queue.call('scrollForward()', function(callbacks) {
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            // Prepare expected values
            expected = [
                [-600, -500, -400, -300, -200, -100, 0, 100, 200, 300],
                [0,1,2,3,4,5,6,7,8,9]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[6].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            // Prepare expected values
            expected = [
                [-300, -200, 0, 100],
                [0,1,2,3]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[6].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            // Prepare expected values
            expected = [
                [-300, 0, 100, 200],
                [0,1,2,3]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[5].hasClass('active'));
            }), DELAY);
        });
    },

    // helper functions:
    assertItems: function(expected, carousel) {
        for (var n = 0; n < carousel.items.length; n++)
            assertEquals('item #' + n + ' \"left\" style value', expected[n], carousel.items[n].getStyle('left').toInt());
    }
});