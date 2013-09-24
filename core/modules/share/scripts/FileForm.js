ScriptLoader.load('Form', 'ModalBox');

var FileForm = new Class({
	Extends: Form,
    initialize: function(element){
        this.parent(element);
    },
    saveDir: function() {
        if (!this.validator.validate()) {
            return false;
        }

        this.request(
            this.componentElement.getProperty('single_template')+'save-dir',
            Object.toQueryString(this.form)+'&path='+ModalBox.getExtraData(),
            function() { ModalBox.setReturnValue(true); this.close(); }.bind(this)
        );
    },
    save: function() {
        if (!this.validator.validate()) {
            return false;
        }
        this.request(
            this.singlePath + 'save',
            Object.toQueryString(this.form),
            function() { ModalBox.setReturnValue(true); this.close(); }.bind(this)
        );
    },
    saveZip: function(){
		if (!this.validator.validate()) {
            return false;
        }
        this.request(
            this.singlePath + 'save-zip',
            Object.toQueryString(this.form) + '&path='+ModalBox.getExtraData(),
            function() { ModalBox.setReturnValue(true); this.close(); }.bind(this)
        );
    },
    _buildUpload: function(fileField, savePath){
    	var iframe = $('uploader');
        if(!iframe){
            if (Browser.ie && (Browser.version < 9)) {
                iframe = $(document.createElement('<iframe name="uploader" id="uploader">'));
            }
            else {
                iframe = new Element('iframe').setProperties({ name: 'uploader', id: 'uploader' });
            }
            iframe.setStyles({ width: 0, height: 0, border: 0, position: 'absolute'});
            iframe.inject(this.form, 'before');
        }
        
        iframe.filename = $(fileField.getAttribute('link'));
        iframe.preview = $(fileField.getAttribute('preview'));
        var path = new Element('input').setProperty('name', 'path').setProperties({ 'id': 'path', 'type': 'hidden', 'value': ModalBox.getExtraData() }).inject(this.form);
        var progressBar = new Element('img').setProperties({ id: 'progress_bar', src: 'images/loading.gif' }).inject(fileField, 'after');
        this.form.setProperties({ action: this.componentElement.getProperty('single_template') + savePath, target: 'uploader' });

        this.form.submit();

        this.form.setProperty('target', '_self');
    }

});