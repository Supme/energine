ScriptLoader.load('Toolbar.js', 'ModalBox.js');

var FeedToolbar = Toolbar.extend({

    initialize: function(Container) {
        Asset.css('feedtoolbar.css');
        this.parent();
        this.element.setProperty('id', 'feedToolbar').injectInside(document.body);
        this.bindTo(this);
		this.load(Container);
		this.singlePath = Container.getProperty('single_template');
		this._prepareDataSet(Container.getProperty('linkedTo'));
		Container.remove();
		this.selected = false;
		this.previous = false;
		
		var component;
		this.disableControls();
		if(component = this.getControlById('add')){
			component.enable();
		}
    },
	add: function() {
		ModalBox.open({
            url: this.singlePath + 'add/',
            onClose: this._reload.bind(this)
        });		
	},
	edit: function() {
        ModalBox.open({
            url: this.singlePath+this.selected+'/edit/',
            onClose: this._reload.bind(this)
        });
	},
	del: function() {
        var MSG_CONFIRM_DELETE = window.MSG_CONFIRM_DELETE || 'Do you really want to delete selected record?';
		if (confirm(MSG_CONFIRM_DELETE)) {
            this.request(this.singlePath + this.selected + '/delete/', null, this._reload);
		}
    },	
	up: function(){
		this.request(this.singlePath + this.selected + '/up/', null, this._aftermove.pass('up', this));
	},
	down: function(){
		this.request(this.singlePath + this.selected + '/down/', null, this._aftermove.pass('down', this));
	},
	_aftermove: function(direction){
		try {
			if (direction == 'up') {
				var sibling = this.previous.getPrevious();
				
				if (!sibling.getProperty('record')) {
					throw 'error';
				}
				$(this.previous).injectBefore(sibling);
			}
			else {
				$(this.previous).injectAfter(this.previous.getNext());			
			}			
		}
		catch (exception) {
			this._reload(true);
		}
		
		
	},
	_select:function(event, element){
		if (this.previous){
			this.previous.removeClass('record_select');
		}

		if (this.previous == element){
			this.selected = this.previous = false;
			this.disableControls();
			if(component = this.getControlById('add')){
				component.enable();
			}
		}
		else {
			this.previous = element;
			element.addClass('record_select');
			this.selected = element.getProperty('record');
			this.enableControls();
		}
	},
	_prepareDataSet: function (linkID){
		var linkID;
		if (linkID = $(linkID)) {
			linkID.addClass('active_component');
			new Fx.Style(linkID, 'opacity').set(0.6);
			$ES('[record]', linkID).each(function(element){
				element.addEvent('mouseover', function(){this.addClass('record_highlight')});
				element.addEvent('mouseout', function(){this.removeClass('record_highlight')});
				element.addEvent('click', this._select.bindWithEvent(this, element));
			}, this);
		}
	},
	_reload: function(data){
		if (data) {
			var form = new Element('form').setProperties({'action':'', 'method':'POST'});
			form.adopt(new Element('input').setProperty('name', 'editMode').setProperty('type', 'hidden'));
			document.body.adopt(form);
			form.submit();
		}
	}

});

FeedToolbar.implement(Request);