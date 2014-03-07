/**
 * @file Testing class CarouselFactory.Types.Loop in Carousel.js 3.0.0
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0
 */

/**
 * Simple loop type carousel builder.
 *
 * @param {string|Element} el HTML element.
 * @param {Object} opts Carousel options.
 * @returns {CarouselFactory.Types.Loop}
 */
function buildCarouselLoop(el, opts) {
    var carousel = new CarouselFactory.Types.Loop(el, opts);
    carousel.build();
    return carousel;
}

new AsyncTestCase('CarouselFactory.Types.Loop. Successive scrolls', {
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
    test1F1B_NV1SS1: function(queue) {
        var expected,
            carousel = buildCarouselLoop(this.carouselEl, {NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            assertEquals(0, carousel.currentActiveID);
            carousel.scrollForward();

            expected = [
                [-100, 0],
                [  0,  1]
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

            expected = [
                [0, 100],
                [0,  1]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertEquals(0, carousel.currentActiveID);
                assertTrue(carousel.items[0].hasClass('active'));
            }), DELAY);
        });
    },
    test1F1B_NV4SS3: function(queue) {
        var expected,
            carousel = buildCarouselLoop(this.carouselEl, {NVisibleItems:4, scrollStep:3, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            carousel.scrollForward();
            assertEquals(3, carousel.currentActiveID);

            expected = [
                [-300, -200, -100, 0, 100, 200, 300],
                [  0,    1,    2,  3,  4,   5,   6]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[carousel.options.scrollStep].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();
            assertEquals(3, carousel.currentActiveID);

            expected = [
                [0, 100, 200, 300, 400, 500, 600],
                [0,  1,   2,   3,   4,   5,   6]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[3].hasClass('active'));
            }), DELAY);
        });
    }
});

new AsyncTestCase('CarouselFactory.Types.Loop. Separate scroll directions', {
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
            carousel = buildCarouselLoop(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});

        queue.call('scrollForward()', function(callbacks) {
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            expected = [
                [-600, -500, -400, -300, -200, -100, 0, 100, 200, 300, -100, -100, -100, -100],
                [  0,    1,    2,    3,    4,    5,  6,  7,    8,  9,    10,   11,   12,   13]
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
            carousel = buildCarouselLoop(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            expected = [
                [-200, -100, 0],
                [  0,    1,  2]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[2].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel = buildCarouselLoop(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollBackward();

            expected = [
                [0, 100, 200],
                [5,  6,   0]
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
            carousel = buildCarouselLoop(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            expected = [
                [-500, -400, -300, -200, -100, 0],
                [  0,    1,    2,    3,    4,  5]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[5].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel = buildCarouselLoop(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollBackward();

            expected = [
                [0, 100, 200, 300, 400, 500],
                [2,  3,   4,   5,   6,   0]
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
            carousel = buildCarouselLoop(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            expected = [
                [-600, -500, -400, -300, -200, -100, 0, 100, 200, 300, -100, -100, -100, -100],
                [  0,    1,    2,    3,    4,    5,  6,  7,   8,   9,    10,   11,   12,   13]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[6].hasClass('active'));
                assertTrue(carousel.items[13].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel = buildCarouselLoop(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollBackward();

            expected = [
                [-100, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, -300, -200, -100],
                [  7,  8,  9,   10,  11,  12,  13,  0,   1,   2,   3,    4,    5,    6]
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
            carousel = buildCarouselLoop(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            expected = [
                [-900, -800, -700, -600, -500, -400, -300, -200, -100, 0, 100, 200, 300, -100],
                [  0,    1,    2,    3,    4,    5,    6,    7,    8,  9,  10,  11,  12,   13]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[2].hasClass('active'));
                assertTrue(carousel.items[9].hasClass('active'));
            }), DELAY);
        });
        queue.call('4*scrollBackward()', function(callbacks) {
            carousel = buildCarouselLoop(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});
            for (n = 0; n < NScrolls; n++)
                carousel.scrollBackward();

            expected = [
                [-300, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
                [  4,  5,  6,   7,   8,   9,   10,  11,  12,  13,  0,    1,    2,    3]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[1].hasClass('active'));
                assertTrue(carousel.items[8].hasClass('active'));
            }), DELAY);
        });
    }
});

new AsyncTestCase('CarouselFactory.Types.Loop. scrollTo', {
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

    testScrollTo2_NV1SS1: function(queue) {
        var expected,
            to = 2,
            carousel = buildCarouselLoop(this.carouselEl, {NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            assertEquals(0, carousel.currentActiveID);
            carousel.scrollTo(to);

            expected = [
                [-200, -100, 0],
                [  0,    1,  2]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertEquals(to, carousel.currentActiveID);
                assertTrue(carousel.items[to].hasClass('active'));
            }), DELAY);
        });
    },
    testScrollTo5_NV1SS1: function(queue) {
        var expected,
            to = 5,
            carousel = buildCarouselLoop(this.carouselEl, {NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            assertEquals(0, carousel.currentActiveID);
            carousel.scrollTo(to);

            expected = [
                [0, 100, 200],
                [5,  6,   0]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertEquals(to, carousel.currentActiveID);
                assertTrue(carousel.items[to].hasClass('active'));
            }), DELAY);
        });
    },
    testScrollTo2_NV4SS2: function(queue) {
        var expected,
            to = 2,
            carousel = buildCarouselLoop(this.carouselEl, {NVisibleItems:4, scrollStep:2, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            assertEquals(0, carousel.currentActiveID);
            carousel.scrollTo(to);

            expected = [
                [0, 100, 200, 300],
                [0,  1,   2,   3]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertEquals(to, carousel.currentActiveID);
                assertTrue(carousel.items[to].hasClass('active'));
            }), DELAY);
        });
    },
    testScrollTo3_NV3SS2: function(queue) {
        var expected,
            to = 3,
            carousel = buildCarouselLoop(this.carouselEl, {NVisibleItems:3, scrollStep:2, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            assertEquals(0, carousel.currentActiveID);
            carousel.scrollTo(to);

            expected = [
                [200, 100, 0, -100, -200],
                [ 4,   3,  2,   1,    0]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertEquals(to, carousel.currentActiveID);
                assertTrue(carousel.items[to].hasClass('active'));
            }), DELAY);
        });
    },
    testScrollTo6_NV4SS2: function(queue) {
        var expected,
            to = 6,
            carousel = buildCarouselLoop(this.carouselEl, {NVisibleItems:4, scrollStep:2, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            assertEquals(0, carousel.currentActiveID);
            carousel.scrollTo(to);

            expected = [
                [0, 100, 200, 300, 400, 500],
                [5,  6,   0,   1,   2,   3]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertEquals(to, carousel.currentActiveID);
                assertTrue(carousel.items[to].hasClass('active'));
            }), DELAY);
        });
    }
});