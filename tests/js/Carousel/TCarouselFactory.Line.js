/**
 * @file Testing class CarouselFactory.Types.Line in Carousel.js 3.0.0
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0
 */

/**
 * Simple line type carousel builder.
 *
 * @param {string|Element} el HTML element.
 * @param {Object} opts Carousel options.
 * @returns {CarouselFactory.Types.Line}
 */
function buildCarouselLine(el, opts) {
    var carousel = new CarouselFactory.Types.Line(el, opts);
    carousel.build();
    return carousel;
}

new AsyncTestCase('CarouselFactory.Types.Line. Separate scroll directions', {
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
        var expected = [],
            playlist = this.playlist,
            carousel;

        queue.call('scrollForward()', function(callbacks) {
            carousel = buildCarouselLine(this.carouselEl, {NVisibleItems:1, scrollStep:1, playlist:playlist, fx: {duration:0}});
            carousel.scrollForward();

            expected = [
                [0, -100],
                [1,  0]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[1].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel = buildCarouselLine(this.carouselEl, {NVisibleItems:1, scrollStep:1, playlist:playlist, fx: {duration:0}});
            carousel.scrollBackward();

            expected = [
                [0],
                [0]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[0].hasClass('active'));
            }), DELAY);
        });
    },
    test1F1B_NV4SS2: function(queue) {
        var expected = [],
            playlist = this.playlist,
            carousel;

        queue.call('scrollForward()', function(callbacks) {
            carousel = buildCarouselLine(this.carouselEl, {NVisibleItems:4, scrollStep:2, playlist:playlist, fx: {duration:0}});
            carousel.scrollForward();

            expected = [
                [-200, -100, 0, 100, 200, 300],
                [  0,    1,  2,  3,   4,   5]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[2].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel = buildCarouselLine(this.carouselEl, {NVisibleItems:4, scrollStep:2, playlist:playlist, fx: {duration:0}});
            carousel.scrollBackward();

            expected = [
                [0, 100, 200, 300],
                [0,   1,   2,   3]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[0].hasClass('active'));
            }), DELAY);
        });
    }
});

new AsyncTestCase('CarouselFactory.Types.Line. Successive scrolls', {
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

    test1B1F1B_NV1SS1: function(queue) {
        var expected = [],
            playlist = this.playlist,
            carousel = buildCarouselLine(this.carouselEl, {NVisibleItems:1, scrollStep:1, playlist:playlist, fx: {duration:0}});

        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            expected = [
                [0],
                [0]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[0].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollForward()', function(callbacks) {
            carousel.scrollForward();

            expected = [
                [0, -100],
                [1,    0]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[1].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            expected = [
                [0, 100],
                [0,  1]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[0].hasClass('active'));
            }), DELAY);
        });
    },
    test1B1F1B_NV4SS2: function(queue) {
        var expected = [],
            playlist = this.playlist,
            carousel = buildCarouselLine(this.carouselEl, {NVisibleItems:4, scrollStep:2, playlist:playlist, fx: {duration:0}});

        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            expected = [
                [0, 100, 200, 300],
                [0,  1,   2,   3]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[0].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollForward()', function(callbacks) {
            carousel.scrollForward();

            expected = [
                [-200, -100, 0, 100, 200, 300],
                [  0,    1,  2,  3,   4,   5]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[2].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            expected = [
                [0, 100, 200, 300, 400, 500],
                [0,  1,   2,   3,   4,   5]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[2].hasClass('active'));
            }), DELAY);
        });
    },
    test3F1B1B_NV4SS2: function(queue) {
        var NVisibleItems = 4,
            scrollStep = 2,
            NScrolls = 3,
            playlist = this.playlist,
            n,
            expected = [],
            carousel = buildCarouselLine(this.carouselEl, {fx: {duration:0}, playlist:playlist, NVisibleItems:NVisibleItems, scrollStep:scrollStep});

        queue.call('scrollForward()', function(callbacks) {
            for (n = 0; n < NScrolls; n++)
                carousel.scrollForward();

            // Prepare expected values
            expected = [
                [-300, -200, -100, 0, 100, 200, 300],
                [  0,    1,    2,  3,  4,   5,   6]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[3].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            // Prepare expected values
            expected = [
                [-300, 0, 100, 200, 300, 400, 500],
                [  0,  1,  2,   3,   4,   5,   6]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[3].hasClass('active'));
            }), DELAY);
        });
        queue.call('scrollBackward()', function(callbacks) {
            carousel.scrollBackward();

            // Prepare expected values
            expected = [
                [0, 100, 200, 300, 400, 400, 500],
                [0,  1,   2,   3,   4,   5,   6]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertTrue(carousel.items[3].hasClass('active'));
            }), DELAY);
        });
    }
});

new AsyncTestCase('CarouselFactory.Types.Line. scrollTo', {
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
            carousel = buildCarouselLine(this.carouselEl, {NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});

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
            carousel = buildCarouselLine(this.carouselEl, {NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            assertEquals(0, carousel.currentActiveID);
            carousel.scrollTo(to);

            expected = [
                [0, -100, -200, -300, -400, -500],
                [5,   4,    3,    2,    1,    0]
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
            carousel = buildCarouselLine(this.carouselEl, {NVisibleItems:4, scrollStep:2, playlist:this.playlist, fx: {duration:0}});

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
            carousel = buildCarouselLine(this.carouselEl, {NVisibleItems:3, scrollStep:2, playlist:this.playlist, fx: {duration:0}});

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
            carousel = buildCarouselLine(this.carouselEl, {NVisibleItems:4, scrollStep:2, playlist:this.playlist, fx: {duration:0}});

        queue.call('scrollForward()', function(callbacks) {
            assertEquals(0, carousel.currentActiveID);
            carousel.scrollTo(to);

            expected = [
                [-300, -200, -100, 0, 100, 200, 300],
                [  0,    1,    2,  3,   4,   5,  6]
            ];
            window.setTimeout(callbacks.add(function() {
                assertItems(expected, carousel);
                assertEquals(to, carousel.currentActiveID);
                assertTrue(carousel.items[to].hasClass('active'));
            }), DELAY);
        });
    }
});