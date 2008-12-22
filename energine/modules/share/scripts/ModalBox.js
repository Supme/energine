var ModalBox = window.top.ModalBox || {

    boxes: [],

    init: function() {
        Asset.css('modalbox.css');
        this.overlay = new Element('div').setProperty('id', 'mb_overlay').injectInside(document.body);
        this.overlay.fx = this.overlay.effect('opacity').hide();
        //this.eventKeyDown = this.keyboardListener.bindWithEvent(this);
        this.eventPosition = this.position.bind(this);
        this.initialized = true;
    },

    open: function(options) {
		var box = new Element('div').addClass('modalbox').injectInside(document.body);
		box.options = {
            url: null,
            width: 640,
            height: 520,
            onClose: Class.empty,
            extraData: null
		};
		Object.extend(box.options, $pick(options, {}));
		box.setStyles({
		    'width': box.options.width + 'px',
		    'height': box.options.height + 'px',
		    'left': (Window.getWidth() / 2) - (box.options.width / 2) + 'px'
		});
		box.iframe = new Element('iframe').setProperties({ 'src': box.options.url, 'frameBorder': '0', 'scrolling': 'no' }).injectInside(box);
		//box.iframe.addEvent('keydown', this.keyboardListener.bindWithEvent(this));
        box.closeButton = new Element('div').addClass('closeButton').injectInside(box);
        box.closeButton.addEvents({
            'click': this.close.bind(this),
            'mouseover': function() { this.addClass('highlighted'); },
            'mouseout': function() { this.removeClass('highlighted'); }
        });

        this.boxes.push(box);
        if (this.boxes.length == 1) {
            this.position();
            this.setup(true);
            this.overlay.fx.start(0.8);
        }
    },

    getCurrent: function() {
        return this.boxes[this.boxes.length - 1];
    },

    getExtraData: function() {
        return this.getCurrent().options.extraData;
    },

    setReturnValue: function(value) {
        this.getCurrent().returnValue = value;
    },

    close: function() {
        if (!this.boxes.length) {
            return;
        }
        var box = this.boxes.pop();
        box.remove().options.onClose(box.returnValue);
		if (!this.boxes.length) {
			this.overlay.fx.chain(this.setup.pass(false, this)).start(0);
		}
    },

    keyboardListener: function(event) {
		switch (event.key) {
			case 'esc': this.close(); break;
		}
	},

	position: function() {
		this.overlay.setStyles({ 'height': Window.getHeight() + 'px' });
    },

    setup: function(open) {
        var elements = $A(document.getElementsByTagName('object'));
        elements.extend(document.getElementsByTagName(window.ie ? 'select' : 'embed'));
        elements.each(function(element) { element.style.visibility = open ? 'hidden' : ''; });
        var fn = open ? 'addEvent' : 'removeEvent';
        window[fn]('resize', this.eventPosition);
        //document[fn]('keydown', this.eventKeyDown);
    }
};

if (!ModalBox.initialized) {
    Window.onDomReady(ModalBox.init.bind(ModalBox));
}