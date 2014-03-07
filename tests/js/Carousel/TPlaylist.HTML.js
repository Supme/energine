/**
 * @file Test Playlist.HTML in Carousel.js 3.0.0
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0
 */

new TestCase('Playlist.HTML initialisation', {
    setUp: function() {
        loadFixture('playlist.html');
        this.playlistElement = $('playlistID');
    },

    testGetPlaylistByID: function() {
        var NThrows = 0;
        assertEquals(this.playlistElement.getChildren()[0], new Playlist.HTML('playlistID').items[0]);
        try {
            new Playlist.HTML('playlistI');
        } catch (err) {
            assertEquals('Element for CarouselPlaylist was not found in DOM Tree!', err);
            NThrows++;
        }
        assertEquals(1, NThrows);
    },
    testGetPlaylistByClass: function() {
        var NThrows = 0;
        assertEquals(this.playlistElement.getChildren()[0], new Playlist.HTML('.playlist').items[0]);
        try {
            new Playlist.HTML('.playlis');
        } catch (err) {
            assertEquals('Element for CarouselPlaylist was not found in DOM Tree!', err);
            NThrows++;
        }
        assertEquals(1, NThrows);
    },
    testNoItemSelector: function() {
        // Amount of items in the playlist
        var item = this.playlistElement.getElement('.item');
        for (var n = 1; n < NITEMS; n++) {
            item.clone().inject(this.playlistElement);
        }
        assertEquals(NITEMS, new Playlist.HTML('.playlist').NItems);
    },
    testWithItemSelector: function() {
        // Amount of items in the playlist
        var item = this.playlistElement.getElement('.item');
        for (var n = 1; n < NITEMS; n++) {
            item.clone().inject(this.playlistElement);
        }
        assertEquals(NITEMS, new Playlist.HTML('.playlist', '.item').NItems);
    },
    testNotExistedItemSelector: function() {
        // Amount of items in the playlist
        var item = this.playlistElement.getElement('.item'),
            NThrows = 0;
        for (var n = 1; n < NITEMS; n++) {
            item.clone().inject(this.playlistElement);
        }

        try {
            new Playlist.HTML('.playlist', '.other');
        } catch (err) {
            assertEquals('No items were found in the playlist.', err);
            NThrows++;
        }
        assertEquals(1, NThrows);
    },
    testItemSelector: function() {
        // Amount of items in the playlist
        var item = this.playlistElement.getElement('.item'),
            n;

        for (n = 1; n < NITEMS; n++) {
            item.clone().inject(this.playlistElement);
        }

        var items = this.playlistElement.getElements('.item');
        for (n = 0; n < NITEMS; n += 2)
            items[n].removeClass('item').addClass('other');

        var pl = new Playlist.HTML('.playlist', '.item');
        assertEquals(3, pl.NItems);
        assertEquals(3, pl.items.length);
        assertEquals(4, pl.holder.getElements('.other').length);
    }
});