ScriptLoader.load('Toolbar.js', 'RichEditor.js', 'ModalBox.js', 'Overlay.js');

var PageEditor = new Class({

    editorClassName: 'nrgnEditor',

    editors: [],

    initialize: function() {
        Asset.css('pagetoolbar.css');
        Asset.css('pageeditor.css');

        $$('div.' + this.editorClassName).each(function(element) {
            this.editors.push(new PageEditor.BlockEditor(this, element));
        }, this);

        document.addEvent('click', this.processClick.bindWithEvent(this));

        Window.addEvent('unload', function() {
            if (this.activeEditor) {
                this.activeEditor.saveWithConfirmation();
            }
        }.bind(this));

		this.attachToolbar(this.createToolbar());
    },
	createToolbar: function(){
		var toolbar = new Toolbar('page_toolbar');
		toolbar.appendControl(new Toolbar.Button({ id: 'save', icon: 'images/toolbar/save.gif', title: 'Save', action: 'save' }));
		toolbar.appendControl(new Toolbar.Separator({ id: 'sep2' }));
		toolbar.appendControl(new Toolbar.Button({ id: 'bold', icon: 'images/toolbar/bold.gif', title: 'Bold', action: 'bold' }));
		toolbar.appendControl(new Toolbar.Button({ id: 'italic', icon: 'images/toolbar/italic.gif', title: 'Italic', action: 'italic' }));
		toolbar.appendControl(new Toolbar.Button({ id: 'olist', icon: 'images/toolbar/olist.gif', title: 'Ordered list', action: 'olist' }));
		toolbar.appendControl(new Toolbar.Button({ id: 'ulist', icon: 'images/toolbar/ulist.gif', title: 'Unordered list', action: 'ulist' }));
		toolbar.appendControl(new Toolbar.Button({ id: 'link', icon: 'images/toolbar/link.gif', title: 'Link', action: 'link' }));
		toolbar.appendControl(new Toolbar.Separator({ id: 'sep3' }));
		toolbar.appendControl(new Toolbar.Button({ id: 'left', icon: 'images/toolbar/justifyleft.gif', title: 'Align left', action: 'alignLeft' }));
        toolbar.appendControl(new Toolbar.Button({ id: 'center', icon: 'images/toolbar/justifycenter.gif', title: 'Align center', action: 'alignCenter' }));
        toolbar.appendControl(new Toolbar.Button({ id: 'right', icon: 'images/toolbar/justifyright.gif', title: 'Align right', action: 'alignRight' }));
        toolbar.appendControl(new Toolbar.Button({ id: 'justify', icon: 'images/toolbar/justifyall.gif', title: 'Align justify', action: 'alignJustify' }));
		toolbar.appendControl(new Toolbar.Select({ id: 'selectFormat', action: 'changeFormat' },
		 {'':'', 'reset':TXT_RESET,'H4':TXT_H4, 'H5':TXT_H5, 'H6':TXT_H6, 'ADDRESS':TXT_ADDRESS}));
		toolbar.appendControl(new Toolbar.Separator({ id: 'sep4' }));
        toolbar.appendControl(new Toolbar.Button({ id: 'source', icon: 'images/toolbar/source.gif', title: 'View source', action: 'showSource' }));
		toolbar.appendControl(new Toolbar.Separator({ id: 'sep5' }));
		toolbar.appendControl(new Toolbar.Button({ id: 'imagemngr', icon: 'images/toolbar/image.gif', title: 'Images manager', action: 'imageManager' }));
		toolbar.appendControl(new Toolbar.Button({ id: 'filemngr', icon: 'images/toolbar/filemngr.gif', title: 'BTN_FILE_LIBRARY', action: 'fileLibrary' }));
		toolbar.appendControl(new Toolbar.Separator({ id: 'sep6' }));
		toolbar.appendControl(new Toolbar.Button({ id: 'viewModeSwitcher', title: TXT_PREVIEW, action: 'switchToViewMode' }));		

		toolbar.bindTo(this);
		return toolbar;
	},
    attachToolbar: function(toolbar) {
        this.toolbar = toolbar;
        this.toolbar.getElement().setProperty('id', 'pageToolbar').injectInside(document.body);
        this.toolbar.disableControls();
		this.toolbar.getControlById('viewModeSwitcher').enable();
    },

    getEditorByElement: function(element) {
        var result = false;
        this.editors.each(function(editor) {
            if (editor.area == element) {
                result = editor;
            }
        });
        return result;
    },

    processClick: function(event) {
        var element = $(event.target);

        if (element.getTag() == 'td') {
            /*
             * Если клик был на таблице, СОДЕРЖАЩЕЙ редактируемый блок,
             * тогда ищем этот <div /> внутри неё. Иначе, если клик был на таблице,
             * СОДЕРЖАЩЕЙСЯ в редактируемом блоке, тогда оставляем всё как есть.
             */
            element = element.getElement('div.' + this.editorClassName) || element;
        }

        while ($type(element) == 'element' && !element.hasClass(this.editorClassName)) {
            element = element.getParent();
        }
        if ($type(element) != 'element' || !element.hasClass(this.editorClassName)) return;

        if (this.activeEditor) {
            if (this.activeEditor.area != element) {
                var newActiveEditor = this.getEditorByElement(element);
                if (newActiveEditor) {
                    this.activeEditor.blur();
                    this.activeEditor = newActiveEditor;
                    this.activeEditor.focus();
                }
            }
        }
        else {
            this.activeEditor = this.getEditorByElement(element);
            if (this.activeEditor) this.activeEditor.focus();
        }

        if (!window.ie && this.activeEditor) {
            this.activeEditor.showSource();
        }
    },
    processKeyEvent: function() {
        if (this.activeEditor) {
            this.activeEditor.dirty = true;
        }
    },
    switchToViewMode: function() {
        if (this.saveWithConfirmation) this.saveWithConfirmation();
        window.location = window.location;
    }
});

PageEditor.BlockEditor = RichEditor.extend({

    initialize: function(pageEditor, area) {
        this.pageEditor = pageEditor;
        this.parent(area);

        this.name  = this.area.getProperty('componentName');
        this.path  = this.area.getProperty('componentPath');
        this.docId = this.area.getProperty('docID') ? this.area.getProperty('docID') : false;
        this.num   = this.area.getProperty('num');
        if (window.ie && !this.fallback_ie) {
            document.addEvent('keydown', this.pageEditor.processKeyEvent.bind(this));
            this.pasteArea = new Element('div').setStyles({ 'visibility': 'hidden', 'width': '0', 'height': '0', 'font-size': '0', 'line-height': '0' }).injectInside(document.body);
			//addEvent('paste' работать не захотело
            this.area.onpaste = this.processPaste.bindWithEvent(this);
        }
        this.switchToViewMode = this.pageEditor.switchToViewMode;
		this.overlay = new Overlay();
    },

    focus: function() {
        this.area.addClass('activeEditor');
        var toolbar = this.pageEditor.toolbar.bindTo(this);
        if (!window.ie) {
            if (this.dirty) toolbar.getControlById('save').enable();
            return;
        }
        toolbar.enableControls();
        this.area.contentEditable = 'true';
    },

    blur: function() {
        //this.saveWithConfirmation();
        this.area.removeClass('activeEditor');
        var toolbar = this.pageEditor.toolbar.bindTo(this.pageEditor).disableControls();
        toolbar.getControlById('viewModeSwitcher').enable();
        if (!window.ie) {
            return;
        }
        this.area.contentEditable = 'false';
    },

    showSource: function() {
        this.blur();
        ModalBox.open({
            url: this.area.getProperty('componentPath') + 'source',
            extraData: this.cleanMarkup('dummy', this.area.innerHTML),
            onClose: function(returnValue) {
                if (returnValue || (returnValue === '')) {
                    this.area.setHTML(this.cleanMarkup('dummy', returnValue));
                    this.dirty = true;
                }
                this.focus();
            }.bind(this)
        });
    },

    save: function() {
        this.dirty = false;
		var data = 'num='+this.num+'&data='+encodeURIComponent(this.area.innerHTML);
		if (this.docId) data += '&docID='+this.docId;
		this.overlay.show(document.body.getCoordinates());
		
		var ajax = new Ajax(this.path + 'save-text', {
            method: 'post',
            postBody: data,
            onSuccess: function(response){
				this.area.innerHTML = response;
				this.overlay.hide();
			}.bind(this)
        }).request();
    },

    saveWithConfirmation: function() {
        if (this.dirty && confirm('Хотите сохранить изменённый блок?')) {
            this.save();
        }
    },
    cleanMarkup: function(dummyPath, data, aggressive) {
        return this.parent(this.path, data, aggressive);
    }
});
