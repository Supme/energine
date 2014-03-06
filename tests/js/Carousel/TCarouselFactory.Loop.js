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

function assertItems(expected, carousel) {
    for (var n = 0; n < carousel.items.length; n++) {
        assertTrue(n + ': item #' + expected[1][n], !!carousel.items[expected[1][n]]);
        assertEquals(n + ': item #' + expected[1][n], expected[0][n], carousel.items[expected[1][n]].getStyle('left').toInt());
    }
}

// Amount of items in the playlist
var NITEMS = 7,
    ITEM_WIDTH = 100,
    DELAY = 50; // in ms

new TestCase('CarouselFactory.Types.Loop static', {
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
    },

    testScrollStep: function() {
        assertEquals(3, buildCarousel(this.carouselEl, {NVisibleItems:4, scrollStep:3, playlist:this.playlist}).options.scrollStep);
        assertEquals(3, buildCarousel(this.carouselEl, {NVisibleItems:4, scrollStep:4, playlist:this.playlist}).options.scrollStep);
    }
});

new AsyncTestCase('CarouselFactory.Types.Loop. Successive scrolls.', {
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
    },

    testFalseAutoSelect: function (queue) {
        var carousel = buildCarousel(this.carouselEl, {autoSelect:false, NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            carousel.scrollForward();

            window.setTimeout(callbacks.add(function() {
                assertTrue(carousel.items[0].hasClass('active'));
            }), DELAY);
        });
    },
    testTrueAutoSelect: function (queue) {
        var carousel = buildCarousel(this.carouselEl, {autoSelect:true, NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            carousel.scrollForward();

            window.setTimeout(callbacks.add(function() {
                assertFalse(carousel.items[0].hasClass('active'));
                assertTrue(carousel.items[1].hasClass('active'));
            }), DELAY);
        });
    },
    test1ScrollNV1SS1: function(queue) {
        var expected,
            carousel = buildCarousel(this.carouselEl, {NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            assertEquals(0, carousel.currentActiveID);
            carousel.scrollForward();

            // Prepare expected values
            expected = [
                [-100, 0],
                [0, 1]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertEquals(1, carousel.currentActiveID);
                assertTrue(carousel.items[carousel.options.scrollStep].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            assertEquals(1, carousel.currentActiveID);
            carousel.scrollBackward();

            // Prepare expected values
            expected = [
                [0, 100],
                [0, 1]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertEquals(0, carousel.currentActiveID);
                assertTrue(carousel.items[0].hasClass('active'));
            }), DELAY);
        });
    },
    test1ScrollNV4SS3: function(queue) {
        var expected,
            carousel = buildCarousel(this.carouselEl, {NVisibleItems:4, scrollStep:3, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            carousel.scrollForward();

            // Prepare expected values
            expected = [
                [-300, -200, -100, 0, 100, 200, 300],
                [0,1,2,3,4,5,6]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[carousel.options.scrollStep].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            // Prepare expected values
            expected = [
                [0, 100, 200, 300, 400, 500, 600],
                [0,1,2,3,4,5,6]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[carousel.options.scrollStep].hasClass('active'));
            }), DELAY);
        });
    }
});

new AsyncTestCase('CarouselFactory.Types.Loop. Separate scroll directions.', {
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
    },

    testCloning: function(queue) {
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
                [-600, -500, -400, -300, -200, -100, 0, 100, 200, 300, -100, -100, -100, -100],
                [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[6].hasClass('active'));
            }), DELAY);
        });
    },
    test2ScrollsNV1SS1: function(queue) {
        var NVisibleItems = 1,
            scrollStep = 1,
            NScrolls = 2,
            playlist = this.playlist,
            n,
            expected = [],
            carousel;
        queue.call('scrollForward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            // Prepare expected values
            expected = [
                [-200, -100, 0],
                [0, 1, 2]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[2].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollBackward();

            // Prepare expected values
            expected = [
                [0, 100, 200],
                [5, 6, 0]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[5].hasClass('active'));
            }), DELAY);
        });
    },
    test5ScrollsNV1SS1: function(queue) {
        var NVisibleItems = 1,
            scrollStep = 1,
            NScrolls = 5,
            playlist = this.playlist,
            n,
            expected = [],
            carousel;
        queue.call('scrollForward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            // Prepare expected values
            expected = [
                [-500, -400, -300, -200, -100, 0],
                [0,1,2,3,4,5]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[5].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollBackward();

            // Prepare expected values
            expected = [
                [0, 100, 200, 300, 400, 500],
                [2,3,4,5,6,0]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[2].hasClass('active'));
            }), DELAY);
        });
    },
    test2ScrollsNV4SS3: function(queue) {
        var NVisibleItems = 4,
            scrollStep = 3,
            NScrolls = 2,
            playlist = this.playlist,
            n,
            expected = [],
            carousel;
        queue.call('scrollForward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            // Prepare expected values
            expected = [
                [-600, -500, -400, -300, -200, -100, 0, 100, 200, 300, -100, -100, -100, -100],
                [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[6].hasClass('active'));
                assertTrue(carousel.items[13].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollBackward();

            // Prepare expected values
            expected = [
                [-100, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, -300, -200, -100],
                [7, 8, 9, 10, 11, 12, 13, 0, 1, 2, 3, 4, 5, 6]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[4].hasClass('active'));
                assertTrue(carousel.items[11].hasClass('active'));
            }), DELAY);
        });
    },
    test3ScrollsNV4SS3: function(queue) {
        var NVisibleItems = 4,
            scrollStep = 3,
            NScrolls = 3,
            playlist = this.playlist,
            n,
            expected = [],
            carousel;

        queue.call('4*scrollForward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            // Prepare expected values
            expected = [
                [-900, -800, -700, -600, -500, -400, -300, -200, -100, 0, 100, 200, 300, -100],
                [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[2].hasClass('active'));
                assertTrue(carousel.items[9].hasClass('active'));
            }), DELAY);
        });
        queue.call('4*scrollBackward()', function(callbacks) {
            carousel = buildCarousel(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollBackward();

            // Prepare expected values
            expected = [
                [-300, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
                [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 1, 2, 3]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[1].hasClass('active'));
                assertTrue(carousel.items[8].hasClass('active'));
            }), DELAY);
        });
    }
});