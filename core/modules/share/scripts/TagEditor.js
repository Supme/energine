ScriptLoader.load('GridManager');

var TagEditor = new Class({
    Extends:GridManager,

    initialize:function (element) {
        this.parent(element);
        this.tag_id = this.element.getProperty('tag_id');
    },

    loadPage:function (pageNum) {
        this.pageList.disable();
        this.toolbar.disableControls();
        this.overlay.show();
        this.grid.clear();
        var postBody = '', url = this.singlePath + this.tag_id + '/get-data/page-' + pageNum;
        if (this.langId) postBody += 'languageID=' + this.langId + '&';
        postBody += this.filter.getValue();
        if (this.grid.sort.order) {
            url = this.singlePath + this.tag_id + '/get-data/' + this.grid.sort.field + '-' +
                this.grid.sort.order + '/page-' + pageNum
        }
        this.request(url,
            postBody,
            this.processServerResponse.bind(this),
            null,
            this.processServerError.bind(this)
        );
    },

    close:function () {

        var overlay = this.overlay;
        overlay.show();
        new Request.JSON({
            'url': this.singlePath + 'tags/get-tags/',
            'method': 'post',
            'data': {
                json: 1,
                tag_id: this.tag_id
            },
            'evalResponse': true,
            'onComplete': function(data) {
                overlay.hide();
                if (data && data.data && data.data.length) {
                    ModalBox.setReturnValue(data.data.join(','));
                } else {
                    ModalBox.setReturnValue('');
                }
                ModalBox.close();
            }.bind(this),
            'onFailure': function (e) {
                overlay.hide();
            }
        }).send();
    },

    select: function() {
        var r = this.grid.getSelectedRecord();
        if (r) {
            this.tag_id = r.tag_id;
            this.close();
        }
    },

    onDoubleClick: function () {
        this.select();
    },

    onSelect: function () {
        var r = this.grid.getSelectedRecord();
        this.toolbar.enableControls();
        var selectBtn = this.toolbar.getControlById('select');
        var addBtn = this.toolbar.getControlById('add');
        if (r && !this.tag_id) {
            addBtn.enable(true);
            selectBtn.enable(true);
        }
    }
});
