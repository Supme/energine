/**
 * @file Testing class ACarousel in Carousel.js 3.0.0
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0
 */

/**
 * Simple ACarousel builder.
 *
 * @param {string|Element} el HTML element.
 * @param {Object} opts Carousel options.
 * @returns {ACarousel}
 */
function buildACarousel(el, opts) {
    var carousel = new ACarousel(el, opts);
    carousel.build();
    return carousel;
}

new TestCase('ACarousel. Static tests', {
    setUp: function() {
        loadFixture('playlist.html');
        loadFixture('carousel.html');

        // Create an playlist
        var playlistEl = $('playlistID');
        var item = playlistEl.getElement('.item');
        for (var n = 1; n < NITEMS; n++)
            item.clone().inject(playlistEl);
        // Set styles to the items
        playlistEl.getElements('.item').setStyle('width', 100);

        this.playlist = new Playlist.HTML('playlistID');
        this.carouselEl = $('carouselID');
    },

    testThrows: function() {
        var NThrows = 0;

        NThrows <<= 1;
        try {
            new ACarousel(this.carouselEl, {classes: {viewbox: 'box'}});
        } catch (e) {
            assertEquals('View box of the carousel was not found.', e);
            NThrows |= 1;
        }

        NThrows <<= 1;
        try {
            new ACarousel(this.carouselEl);
        } catch (e) {
            assertEquals('Carousel can not be created without playlist.', e);
            NThrows |= 1;
        }

        assertEquals(3, NThrows);
    },
    testCheckingOptionsNVisibleItems: function() {
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:-1}).options.NVisibleItems);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:0}).options.NVisibleItems);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:'abc'}).options.NVisibleItems);
        assertEquals(5, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:'5abc'}).options.NVisibleItems);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:[]}).options.NVisibleItems);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:{}}).options.NVisibleItems);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:false}).options.NVisibleItems);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:true}).options.NVisibleItems);
        assertEquals(NITEMS, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:this.playlist.NItems+1}).options.NVisibleItems);
        assertEquals(NITEMS, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:'all'}).options.NVisibleItems);
    },
    testCheckingOptionsScrollStep: function() {
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, scrollStep:-1}).options.scrollStep);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, scrollStep:0}).options.scrollStep);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, scrollStep:2}).options.scrollStep);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, scrollStep:[]}).options.scrollStep);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, scrollStep:{}}).options.scrollStep);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, scrollStep:false}).options.scrollStep);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, scrollStep:true}).options.scrollStep);
        assertEquals(3, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:3, scrollStep:4}).options.scrollStep);
        assertEquals(3, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:4, scrollStep:3}).options.scrollStep);
        assertEquals(3, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:4, scrollStep:4}).options.scrollStep);
        assertEquals(1, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:3, scrollStep:'abc'}).options.scrollStep);
        assertEquals(2, buildACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:3, scrollStep:'2abc'}).options.scrollStep);
    },
    testCheckingOptionsScrollDirection: function() {
        assertEquals('left',    buildACarousel(this.carouselEl, {playlist:this.playlist, scrollDirection: 'left'}).options.scrollDirection);
        assertEquals('right',   buildACarousel(this.carouselEl, {playlist:this.playlist, scrollDirection: 'right'}).options.scrollDirection);
        assertEquals('top',     buildACarousel(this.carouselEl, {playlist:this.playlist, scrollDirection: 'top'}).options.scrollDirection);
        assertEquals('bottom',  buildACarousel(this.carouselEl, {playlist:this.playlist, scrollDirection: 'bottom'}).options.scrollDirection);
        assertEquals('left',    buildACarousel(this.carouselEl, {playlist:this.playlist, scrollDirection: 'abc'}).options.scrollDirection);
        assertEquals('left',    buildACarousel(this.carouselEl, {playlist:this.playlist, scrollDirection: 5}).options.scrollDirection);
        assertEquals('left',    buildACarousel(this.carouselEl, {playlist:this.playlist, scrollDirection: {}}).options.scrollDirection);
        assertEquals('left',    buildACarousel(this.carouselEl, {playlist:this.playlist, scrollDirection: []}).options.scrollDirection);
        assertEquals('left',    buildACarousel(this.carouselEl, {playlist:this.playlist, scrollDirection: true}).options.scrollDirection);
    },
    testCheckingOptionsFxDuration: function() {
        assertEquals(700, buildACarousel(this.carouselEl, {playlist:this.playlist, fx: {duration:-1}}).options.fx.duration);
        assertEquals(0,   buildACarousel(this.carouselEl, {playlist:this.playlist, fx: {duration:0}}).options.fx.duration);
        assertEquals(2,   buildACarousel(this.carouselEl, {playlist:this.playlist, fx: {duration:2}}).options.fx.duration);
        assertEquals(700, buildACarousel(this.carouselEl, {playlist:this.playlist, fx: {duration:[]}}).options.fx.duration);
        assertEquals(700, buildACarousel(this.carouselEl, {playlist:this.playlist, fx: {duration:{}}}).options.fx.duration);
        assertEquals(700, buildACarousel(this.carouselEl, {playlist:this.playlist, fx: {duration:false}}).options.fx.duration);
        assertEquals(700, buildACarousel(this.carouselEl, {playlist:this.playlist, fx: {duration:true}}).options.fx.duration);
        assertEquals(700, buildACarousel(this.carouselEl, {playlist:this.playlist, fx: {duration:'abc'}}).options.fx.duration);
        assertEquals(2,   buildACarousel(this.carouselEl, {playlist:this.playlist, fx: {duration:'2abc'}}).options.fx.duration);
    },
    testCheckingOptionsAutoSelect: function() {
        assertEquals(true,  buildACarousel(this.carouselEl, {playlist:this.playlist, autoSelect:true}).options.autoSelect);
        assertEquals(true,  buildACarousel(this.carouselEl, {playlist:this.playlist, autoSelect:1}).options.autoSelect);
        assertEquals(true,  buildACarousel(this.carouselEl, {playlist:this.playlist, autoSelect:'t'}).options.autoSelect);
        assertEquals(true,  buildACarousel(this.carouselEl, {playlist:this.playlist, autoSelect:[]}).options.autoSelect);
        assertEquals(true,  buildACarousel(this.carouselEl, {playlist:this.playlist, autoSelect:{}}).options.autoSelect);
        assertEquals(false, buildACarousel(this.carouselEl, {playlist:this.playlist, autoSelect:false}).options.autoSelect);
        assertEquals(false, buildACarousel(this.carouselEl, {playlist:this.playlist, autoSelect:0}).options.autoSelect);
        assertEquals(false, buildACarousel(this.carouselEl, {playlist:this.playlist, autoSelect:''}).options.autoSelect);
        assertEquals(false, buildACarousel(this.carouselEl, {playlist:this.playlist, autoSelect:null}).options.autoSelect);
    },
    testCheckingOptionsPlaylist: function() {
        this.playlist.items.inject($$('#carouselID .carousel_viewbox .playlist_local')[0]);
        assertEquals(this.playlist, buildACarousel(this.carouselEl, {playlist:this.playlist}).options.playlist);
    },
    testEventEnableScrolling: function() {
        var c = new ACarousel(this.carouselEl, {playlist:this.playlist});
        var ev = false;
        c.addEvent('enableScrolling', function() {
            ev = true;
        });
        c.build();

        assertTrue(ev);
    },
    testEventDisableScrolling: function() {
        var c = new ACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:'all'});
        var ev = false;
        c.addEvent('disableScrolling', function() {
            ev = true;
        });
        c.build();

        assertTrue(ev);
    },
    testItemPosition: function(N) {
        var expected = [],
            carousel,
            itemWidth,
            n;

        N = N || this.playlist.NItems;

        // Prepare expected positions
        carousel = buildACarousel(this.carouselEl, {playlist: this.playlist, NVisibleItems:N});
        itemWidth = carousel.items[0].getSize().x;
        for (n = 0; n < carousel.options.NVisibleItems; n++)
            expected.push(n*itemWidth);
        expected.push(-itemWidth);

        for (n = 0; n < carousel.options.NVisibleItems; n++)
            assertEquals('"left" style value of item #' + n, expected[n], carousel.items[n].getStyle('left').toInt());
        for (; n < carousel.items.length; n++)
            assertEquals('"left" style value of item #' + n, expected[carousel.options.NVisibleItems], carousel.items[n].getStyle('left').toInt());

        if (N > 1)
            this.testItemPosition(--N);
    },
    testSelectItem: function() {
        var carousel = buildACarousel(this.carouselEl, {playlist: this.playlist, NVisibleItems:5});
        carousel.selectItem(3);
        assertFalse(carousel.items[0].hasClass('active'));
        assertTrue(carousel.items[3].hasClass('active'));
    },
    testFalseAutoSelect: function () {
        var carousel = buildCarouselLoop(this.carouselEl, {autoSelect:false, NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});
        carousel.scrollForward();

        assertTrue(carousel.items[0].hasClass('active'));
    },
    testTrueAutoSelect: function (queue) {
        var carousel = buildCarouselLoop(this.carouselEl, {autoSelect:true, NVisibleItems:1, scrollStep:1, playlist:this.playlist, fx: {duration:0}});
        carousel.scrollForward();

        assertFalse(carousel.items[0].hasClass('active'));
        assertTrue(carousel.items[1].hasClass('active'));
    },
    testEventSelectItem: function() {
        var SELECT_ITEM = 3,
            c = new ACarousel(this.carouselEl, {playlist:this.playlist, NVisibleItems:'all'}),
            selected = 0;

        c.addEvent('selectItem', function(ev) {
            selected = ev;
        });
        c.build();
        c.selectItem(SELECT_ITEM);

        assertEquals(SELECT_ITEM, selected);
    },

    testCarouselWithoutPlaylist: function() {
        var NThrows = 0;
        try {
            new ACarousel(this.carouselEl);
        } catch (err) {
            assertEquals('Carousel can not be created without playlist.', err);
            NThrows++;
        }
        assertEquals(1, NThrows);
    },
    testExternalPlaylist: function() {
        var carousel = new ACarousel(this.carouselEl, {playlist: this.playlist});
        assertEquals(NITEMS, this.playlist.NItems);
        assertEquals(NITEMS, this.playlist.items.length);
        assertEquals(1, carousel.items.length);
        assertNotEquals(this.playlist.items, carousel.items);
    },
    testImplicitPlaylist: function() {
        this.playlist.items.inject(this.carouselEl.getElement('.playlist_local'));

        var carousel = new ACarousel(this.carouselEl);
        assertTrue(instanceOf(carousel.options.playlist, Playlist.HTML));
        assertEquals(1, carousel.items.length);
    }
});
