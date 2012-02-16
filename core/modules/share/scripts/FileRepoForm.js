ScriptLoader.load('Form');
var FileRepoForm = new Class({
    Extends:Form,
    initialize:function (el) {
        this.parent(el);
        var uploader;
        if (uploader = this.componentElement.getElementById('uploader')) {
            this.reader = new FileReader();
            uploader.addEvent('change', this.showPreview.bind(this))
        }
        if (this.thumbs = this.componentElement.getElements('img.thumb')) {
            this.thumbReader = new FileReader();
            this.componentElement.getElements('input.thumb').addEvent('change', this.showThumbPreview.bind(this));
        }
    },
    showThumbPreview:function (evt) {
        var el = $(evt.target);
        var files = evt.target.files;
        //var binaryReader = new FileReader();

        for (var i = 0, f; f = files[i]; i++) {
            this.thumbReader.onload = (function (file) {
                return function (e) {
                    if (file.type.match('image.*')) {
                        var previewElement = $(el.getProperty('preview')), dataElement = $(el.getProperty('data'));

                        if (previewElement) previewElement.removeClass('hidden').setProperty('src', e.target.result);
                        if (dataElement) dataElement.set('value', e.target.result);
                    }
                }
            })(f);
            this.thumbReader.readAsDataURL(f);
        }


    },
    generatePreviews:function (tmpFileName) {
        if (this.thumbs)
            this.thumbs.each(function (el) {
                el.removeClass('hidden');
                el.setProperty('src', Energine.base + 'resizer/w' + el.getProperty('width') + '-h' + el.getProperty('height') + '/' + tmpFileName);
            });
    },
    showPreview:function (evt) {
        var previewElement = document.getElementById('preview')
        previewElement.removeProperty('src').addClass('hidden');
        if (this.thumbs)this.thumbs.removeProperty('src').addClass('hidden');
        previewElement.removeClass('hidden').setProperty('src', Energine.base + 'images/loading.gif');

        var files = evt.target.files;
        var createTemporaryFile = function (data, filename, type) {
            this.request(this.singlePath + 'temp-file/', Object.toQueryString({
                'data':data,
                'name':filename
            }), function (response) {
                if (response.result && (type.match('image.*') || type.match('video.*'))) {
                    if(type.match('video.*')){
                        document.getElementById('preview').removeClass('hidden').setProperty('src', Energine.base + 'resizer/w0-h0/' + response.data);
                    }

                    this.generatePreviews(response.data)
                }
            }.bind(this));
        }.bind(this);

        for (var i = 0, f; f = files[i]; i++) {
            this.reader.onload = (function (theFile) {
                return function (e) {
                    document.getElementById('upl_name').set('value', theFile.name);
                    document.getElementById('upl_filename').set('value', theFile.name);
                    //document.getElementById('file_type').set('value', theFile.type);
                    document.getElementById('data').set('value', e.target.result);
                    document.getElementById('upl_title').set('value', theFile.name.split('.')[0]);

                    if (theFile.type.match('image.*')) {
                        previewElement.removeClass('hidden').setProperty('src', e.target.result);
                        createTemporaryFile(e.target.result, theFile.name, theFile.type);
                    }
                    else if (theFile.type.match('video.*')) {
                        createTemporaryFile(e.target.result, theFile.name, theFile.type);
                    }
                };
            })(f);
            this.reader.readAsDataURL(f);
        }
    },
    save:function () {
        if (!this.validator.validate()) {
            return false;
        }
        this._getOverlay().show();

        var errorFunc = function (responseText) {
            this._getOverlay().hide();
        }.bind(this);
        this.request(Energine.base + this.form.getProperty('action'), this.form.toQueryString(), this.processServerResponse.bind(this), errorFunc, errorFunc);
    }
});
