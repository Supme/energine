/**
 * @file Global functions and variables for tests.
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0.0
 */

var NITEMS = 7,
    ITEM_WIDTH = 100,
    DELAY = 50; // in ms

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
 * Helper function to assert items position.
 *
 * @param {Array[]} expected Expected positions. This is two dimensional array. <tt>expected[0]</tt> holds the position values and <tt>expected[1]</tt> holds the item index.
 * @param {ACarousel} carousel Carousel object.
 */
function assertItems(expected, carousel) {
    var pass = true;
    for (var n = 0; n < carousel.items.length; n++) {
        assertTrue(n + ': item #' + expected[1][n], !!carousel.items[expected[1][n]]);
        var v = carousel.items[expected[1][n]].getStyle('left').toInt();
        if (expected[0][n] !== v) {
            console.log(n + ': item #' + expected[1][n] + ' expected: ' + expected[0][n] + ' but was ' + v);
            pass = false;
        }
    }
    assertTrue(pass);
}