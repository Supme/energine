/*
 * DOM structure:
 *
 *   <ul class="toolbar">
 *
 *     <!-- Button -->
 *     <li title="{tooltip}">{title}</li>
 *
 *     <!-- Button with icon -->
 *     <li class="icon" style="background-image: url({icon});" title="{title}"></li>
 *
 *   </ul>
 *
 * CSS classes:
 *
 *   icon
 *   highlighted
 *   disabled
 *   separator
 */

var Toolbar = new Class({

    imagesPath: '',

    initialize: function(toolbarName) {
        Asset.css('toolbar.css');
        this.element = new Element('ul').addClass('toolbar').addClass('clearfix');
        this.controls = [];
		this.name = toolbarName;
    },

    getElement: function() {
        return this.element;
    },

    bindTo: function(object) {
        this.boundTo = object;
        return this;
    },
	
	load: function(toolbarDescr) {
        $A(toolbarDescr.childNodes).each(function(elem) {
            if (elem.nodeType == 1) {
                var control = null;
                switch (elem.getAttribute('type')) {
                    case 'button':       control = new Toolbar.Button;       break;
                    case 'togglebutton': control = new Toolbar.ToggleButton; break;
                    case 'separator':    control = new Toolbar.Separator;    break;
                }
                if (control) {
                    control.load(elem);
                    this.appendControl(control);
                }
            }
        }.bind(this));
    },

    appendControl: function(control) {
        if (control instanceof Toolbar.Control) {
            control.toolbar = this;
            control.build();
            this.element.adopt(control.element);
            this.controls.push(control);
        }
        return this;
    },

    removeControl: function(control) {
        if ($type(control) == 'string') {
            control = this.getControlById(control);
        }
        if (control instanceof Toolbar.Control) {
            this.controls.each(function(ctrl, index) {
                if (ctrl == control) {
                    ctrl.toolbar = null;
                    ctrl.element.remove();
                    this.controls.splice(index, 1);
                }
            }, this);
        }
        return this;
    },

    getControlById: function(id) {
        for (var i = 0; i < this.controls.length; i++) {
            if (this.controls[i].properties.id == id) return this.controls[i];
        }
        return false;
    },

    disableControls: function() {
        this.controls.each(function(control) {
			if(control.properties.id != 'close')control.disable();
        });
        return this;
    },

    enableControls: function() {
        this.controls.each(function(control) {
            control.enable();
        });
        return this;
    },

    // Private methods:

    _callAction: function(action, control) {
        if (this.boundTo && $type(this.boundTo[action]) == 'function') {
            this.boundTo[action](control);
        }
    }
});

Toolbar.Control = new Class({

    toolbar: null,

    initialize: function(properties) {
        this.properties = {
            id: null,
            icon: null,
            title: '',
            tooltip: '',
            action: null,
            disabled: false
        };
        Object.extend(this.properties, $pick(properties, {}));
    },
    load: function(controlDescr) {
        this.properties.id       = controlDescr.getAttribute('id')		 || '';
        this.properties.icon      = controlDescr.getAttribute('icon')     || '';
        this.properties.title    = controlDescr.getAttribute('title')   || '';
        this.properties.action   = controlDescr.getAttribute('action')  || '';
        this.properties.tooltip  = controlDescr.getAttribute('tooltip') || '';
        this.properties.disabled = controlDescr.getAttribute('disabled') ? true : false;
    },

    build: function() {
		if (!this.toolbar || !this.properties.id) {
            return false;
        }
        this.element = new Element('li').setProperty('unselectable', 'on');
        if (this.properties.icon) {
            this.element.addClass('icon')
				.setProperty('id', this.toolbar.name + this.properties.id)
                .setProperty('title', this.properties.title + (this.properties.tooltip ? ' ('+this.properties.tooltip+')' : ''))
                .setStyle('-moz-user-select','none')
                .setStyle('background-image', 'url(' + $E('base').getProperty('href') + this.toolbar.imagesPath + this.properties.icon + ')');
                //.setHTML('&#160;');
        }
        else {
            this.element.setProperty('title', this.properties.tooltip).appendText(this.properties.title);
        }

        if (this.properties.disabled) {
            this.disable();
        }
    },

    disable: function() {
        if (!this.properties.disabled) {
            this.properties.disabled = true;
            this.element.addClass('disabled').setOpacity(0.25);        
        }
    },

    enable: function() {
        if (this.properties.disabled) {
            this.properties.disabled = false;
            this.element.removeClass('disabled').setOpacity(1);        
        }
    },

    setAction: function(action) {
        this.properties.action = action;
    }
});

Toolbar.Button = Toolbar.Control.extend({
    build: function() {
        this.parent();
        var control = this;
        this.element.addEvents({
            'mouseover': function() { if (!control.properties.disabled) { this.addClass('highlighted'); } },
            'mouseout':  function() { this.removeClass('highlighted'); },
            'click':     function() { if (!control.properties.disabled) { control.toolbar._callAction(control.properties.action); } }
        });
    }
});

Toolbar.Separator = Toolbar.Control.extend({

    build: function() {
        this.parent();
        this.element.addClass('separator');
    },

    disable: function() {
        // Separator connot be disabled.
    }
});

Toolbar.Select = Toolbar.Control.extend({
	select:null,
	toolbar:null,

	initialize: function(properties, options) {
        this.properties = {
            id: null,
            tooltip: '',
            action: null,
            disabled: false
        };
        Object.extend(this.properties, $pick(properties, {}));
		
		this.options = options || {};
    },

    build: function() {
        if (!this.toolbar || !this.properties.id) {
            return false;
        }

        this.element = new Element('li').setProperty('unselectable', 'on');
		this.select = new Element('select');

		var control = this;
		this.select.addEvent('change', function(){
			control.toolbar._callAction(control.properties.action, control);
		});

		this.element.adopt(this.select);

        if (this.properties.disabled) {
            this.disable();
        }
		
		if(window.supportContentEdit)
			$H(this.options).each(function(value, key){
				control.select.adopt(new Element('option').setProperties({'value': key}).setText(value));
			});
    },

    disable: function() {
        if (!this.properties.disabled) {
            this.properties.disabled = true;
            this.select.setProperty('disabled', 'disabled');        
        }
    },

    enable: function() {
        if (this.properties.disabled) {
            this.properties.disabled = false;
			this.select.removeProperty('disabled');        
        }
    },

    setAction: function(action) {
        this.properties.action = action;
    }

});
