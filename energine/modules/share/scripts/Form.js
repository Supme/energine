ScriptLoader.load('TabPane.js', 'Toolbar.js', 'Validator.js', 'RichEditor.js', 'Calendar.js', 'ModalBox.js');

var Form = new Class({

    initialize: function(element) {
        Asset.css('form.css');
        this.componentElement = $(element);
		this.singlePath = this.componentElement.getAttribute('single_template');

        var control = this.componentElement.getElement('input');
        if (!control) control = this.componentElement.getElement('textarea');
        if (!control) control = this.componentElement.getElement('select');
        this.form = $(control.form).addClass('form');
        this.tabPane = new TabPane(this.componentElement, {
            //onTabChange: this.onTabChange.bind(this)
        });
        this.validator = new Validator(this.form, this.tabPane);

        this.richEditors = [];
        this.form.getElements('textarea.richEditor').each(function(textarea) {
            this.richEditors.push(new Form.RichEditor(textarea, this, this.fallback_ie));
        }, this);

        this.componentElement.getElements('.pane').setStyles({ 'border': '1px dotted #777', 'overflow': 'auto' });
    },

    attachToolbar: function(toolbar) {
        this.toolbar = toolbar;
        this.componentElement.adopt(this.toolbar.getElement());
    },
    upload: function(fileField) {
        var iframe, form, newField;
		var iframeAction =  this.singlePath + 'upload/';
		var fileField = $(fileField);
		
		if (fileField.getProperty('protected')) {
			iframeAction += '?protected';
		}
				
        if (window.ie) {
            iframe = $(document.createElement('<iframe name="uploader" id="uploader">'));
			form = $(document.createElement('<form enctype="multipart/form-data" method="post" target="uploader" action="' + iframeAction + '" style="width:0; height:0; border:0; display:none;">'));
        }
        else {
            iframe = new Element('iframe').setProperties({ name: 'uploader', id: 'uploader' });
			form = new Element('form').setStyles({ width: 0, height: 0, border: 0, display:'none' });
			form.setProperties({ action: iframeAction, target: 'uploader', method:'post', enctype:'multipart/form-data' });
        }

		form.injectInside(document.body);
		newField = fileField.clone();
		newField = fileField.replaceWith(newField);
		fileField.injectInside(form);

        iframe.setStyles({ width: 0, height: 0, border: 0 }).injectBefore(this.form);
		iframe.setProperty('link', fileField.getProperty('link'));
        iframe.setProperty('field', fileField.getProperty('field'));
		iframe.setProperty('preview', fileField.getProperty('preview'));

        var progressBar = new Element('img').setProperties({ id: 'progress_bar', src: 'images/loading.gif' }).injectAfter(newField);
        /*this.form.setProperties({ action: this.singlePath+'upload/', target: 'uploader' });
        this.form.submit();
        this.form.setProperty('target', '_self');*/
		form.submit();

		//newField.remove();
		form.remove();
		form /*= newField */= null;
    },

    save: function() {
        this.richEditors.each(function(editor) { editor.onSaveForm(); });
        if (!this.validator.validate()) {
            return false;
        }
        this.request(
            this.singlePath + 'save',
            this.form.toQueryString(),
            function() { ModalBox.setReturnValue(true); this.close(); }.bind(this)
        );
    },

    close: function() {
        ModalBox.close();
    },

    openFileLib: function (button) {
        var path = $($(button).getProperty('link')).getValue();
        if (path == '') {
            path = null;
        }
        ModalBox.open({
            url: this.singlePath + 'file-library',
            extraData: path,
            onClose: function (result) {
                if (result) {
                    button = $(button);
                    $(button.getProperty('link')).value = result['upl_path'];
                    if (image = $(button.getProperty('preview'))) {
                        image.setProperty('src', result['upl_path']);
                    }
                }
            }
        });
    }
});
Form.implement(Request);

Form.calendars = {};
Form.showCalendar = function(fieldName, event) {
    if (Form.calendars[fieldName]) return;
    var field = $(fieldName);
    var calendOptions = {
        fieldName: fieldName,
        onSelect: function(date) {
            field.value = date.year+'-'+date.month+'-'+date.day;
        }
    };
    var currDate = field.getValue();
    if (currDate != '') {
        currDate = currDate.split('-', 3);
        calendOptions = Object.extend(calendOptions, {
            currYear: parseInt(currDate[0]),
            currMonth: parseInt(currDate[1]),
            currDay: parseInt(currDate[2])
        });
    }
    var calend = new Calendar(calendOptions);
    Form.calendars[fieldName] = calend;

    var target = event.target || $(window.event.srcElement);
    
    calend.element.setStyles({ position: 'absolute', top: target.getTop()+'px', left: target.getLeft()+'px' }).injectInside(document.body);
}

Form.RichEditor = RichEditor.extend({

    initialize: function(textarea, form, fallback_ie) {
        this.fallback_ie = fallback_ie;
        if (!window.ie && !window.gecko) return;
        this.textarea = $(textarea);
        this.form = form;
        if (window.ie && !this.fallback_ie) {
            this.hidden = new Element('input').setProperty('name', this.textarea.name).setProperties({ 'type': 'hidden', 'value': '', 'pattern':this.textarea.getProperty('pattern'), 'message':this.textarea.getProperty('message')}).injectBefore(this.textarea);
            this.area = new Element('div').setProperties({ componentPath: this.form.singlePath }).addClass('richEditor').setStyles({ clear: 'both', overflow: 'auto' }).setHTML(this.textarea.value);
            this.textarea.replaceWith(this.area);
            
            //document.addEvent('keydown', this.processKeyEvent.bind(this));
            this.pasteArea = new Element('div').setStyles({ 'visibility': 'hidden', 'width': '0', 'height': '0', 'font-size': '0', 'line-height': '0' }).injectInside(document.body);

            this.area.onpaste =this.processPaste.bindWithEvent(this);

            this.area.contentEditable = 'true';
        }
        else {
            this.area = this.textarea.setProperty('componentPath', this.form.singlePath);
        }

        this.toolbar = new Toolbar(this.textarea.name);
        this.toolbar.appendControl(new Toolbar.Button({ id: 'bold', icon: 'images/toolbar/bold.gif', title: 'Bold', action: 'bold' }));
        this.toolbar.appendControl(new Toolbar.Button({ id: 'italic', icon: 'images/toolbar/italic.gif', title: 'Italic', action: 'italic' }));
        this.toolbar.appendControl(new Toolbar.Button({ id: 'olist', icon: 'images/toolbar/olist.gif', title: 'Ordered list', action: 'olist' }));
        this.toolbar.appendControl(new Toolbar.Button({ id: 'ulist', icon: 'images/toolbar/ulist.gif', title: 'Unordered list', action: 'ulist' }));
        this.toolbar.appendControl(new Toolbar.Button({ id: 'link', icon: 'images/toolbar/link.gif', title: 'Insert link', action: 'link' }));
        this.toolbar.appendControl(new Toolbar.Separator({ id: 'sep1' }));
        this.toolbar.appendControl(new Toolbar.Button({ id: 'left', icon: 'images/toolbar/justifyleft.gif', title: 'Justify left', action: 'alignLeft' }));
        this.toolbar.appendControl(new Toolbar.Button({ id: 'center', icon: 'images/toolbar/justifycenter.gif', title: 'Justify center', action: 'alignCenter' }));
        this.toolbar.appendControl(new Toolbar.Button({ id: 'right', icon: 'images/toolbar/justifyright.gif', title: 'Justify right', action: 'alignRight' }));
        this.toolbar.appendControl(new Toolbar.Button({ id: 'justify', icon: 'images/toolbar/justifyall.gif', title: 'Justify all', action: 'alignJustify' }));
        if (window.ie && !this.fallback_ie) {
            this.toolbar.appendControl(new Toolbar.Separator({ id: 'sep2' }));
            this.toolbar.appendControl(new Toolbar.Button({ id: 'source', icon: 'images/toolbar/source.gif', title: 'Edit source', action: 'showSource' }));
        }
        this.toolbar.appendControl(new Toolbar.Separator({ id: 'sep3' }));
        this.toolbar.appendControl(new Toolbar.Button({ id: 'filelib', icon: 'images/toolbar/filemngr.gif', title: 'File library', action: 'fileLibrary' }));
        this.toolbar.appendControl(new Toolbar.Button({ id: 'imgmngr', icon: 'images/toolbar/image.gif', title: 'Image manager', action: 'imageManager' }));
        $pick(this.area, this.textarea).getParent().adopt(this.toolbar.getElement());
        this.toolbar.element.setStyle('width', '550px');
        this.toolbar.bindTo(this);
    },

    onSaveForm: function() {
        if (!window.ie || this.fallback_ie) return;
        this.hidden.value = this.area.innerHTML;
    },

    showSource: function() {
        this.sourceMode = !this.sourceMode;
        if (this.sourceMode) {
			this.fallback_ie = true;
            this.textarea.value = this.area.innerHTML;
            this.area.replaceWith(this.textarea);
        }
        else {
			this.fallback_ie = false;
            this.area.setHTML(this.textarea.value);
            this.textarea.replaceWith(this.area);
        }
    },

    disable: function() {
        if (window.ie) this.area.contentEditable = 'false';
        else this.area.disabled = true;
        this.toolbar.disableControls();
    },

    enable: function() {
        if (window.ie) this.area.contentEditable = 'true';
        else this.area.disabled = false;
        this.toolbar.enableControls();
    }
});
