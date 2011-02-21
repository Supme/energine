ScriptLoader.load(
        'Grid',
        'TabPane',
        'PageList',
        'Toolbar',
        'Overlay',
        'ModalBox'
        );

var GridManager = new Class({
    Implements:Energine.request,
    initialize: function(element) {
        this.element = element;

        this.filter = new GridManager.Filter(this);

        this.tabPane =
                new TabPane(this.element, { onTabChange: this.onTabChange.bind(this) });

        this.grid = new Grid(this.element.getElement('.grid'), {
            onSelect: this.onSelect.bind(this),
            onSortChange: this.changeSort.bind(this),
            onDoubleClick: this.onDoubleClick.bind(this)
        });
        this.pageList =
                new PageList({ onPageSelect: this.loadPage.bind(this) });
        var toolbarContainer = this.tabPane.element.getElement('.e-pane-b-toolbar');
        if (toolbarContainer) {
            toolbarContainer.adopt(this.pageList.getElement());
            this.tabPane.element.removeClass('e-pane-has-b-toolbar1');
            this.tabPane.element.addClass('e-pane-has-b-toolbar2');
        }
        else {
            this.tabPane.element.adopt(this.pageList.getElement());
        }
        this.overlay = new Overlay(this.element);
        this.singlePath = this.element.getProperty('single_template');
    },

    attachToolbar: function(toolbar) {
        this.toolbar = toolbar;
        var toolbarContainer = this.tabPane.element.getElement('.e-pane-b-toolbar');
        if (toolbarContainer) {
            toolbarContainer.adopt(this.toolbar.getElement());
        }
        else {
            this.tabPane.element.adopt(this.toolbar.getElement());
        }
        this.toolbar.disableControls();
        toolbar.bindTo(this);
        /*
         * Панель инструментов прикреплена, загружаем первую страницу.
         *
         * Делаем секундную задержку для надёжности:
         * пусть браузер распарсит стили и просчитает размеры элементов.
         */
        //this.reloadGrid.delay(1000, this);
    },

    onTabChange: function(tabData) {
        this.langId = tabData.lang;
        // Загружаем первую страницу только если панель инструментов уже прикреплена.
        if (this.filter.exists) this.removeFilter(true);
        else /*if (this.toolbar)*/{
            this.reloadGrid();
        }
    },

    onSelect: function() {

    },
    onDoubleClick: function() {
        this.edit();
    },
    changeSort: function() {
        this.loadPage.delay(10, this, 1);
    },

    reloadGrid: function() {
        this.loadPage.delay(10, this, 1);
    },

    loadPage: function(pageNum) {
        this.pageList.disable();

        this.toolbar.disableControls();
        this.overlay.show();
        this.grid.clear();
        var postBody = '', url = this.singlePath + 'get-data/page-' + pageNum;
        if (this.langId) postBody += 'languageID=' + this.langId + '&';
        if (this.filter.active && this.filter.query.value.length > 0) {
            var fieldName = this.filter.fields.options[this.filter.fields.selectedIndex].value;
            postBody +=
                    'filter' + fieldName + '=' + this.filter.query.value + '&';
        }
        if (this.grid.sort.order) {
            url = this.singlePath + 'get-data/' + this.grid.sort.field + '-' +
                    this.grid.sort.order + '/page-' + pageNum
        }
        this.request(url,
                postBody,
                this.processServerResponse.bind(this),
                null,
                this.processServerError.bind(this)
                );
    },
    processServerResponse: function(result) {
        if (!this.initialized) {
            this.grid.setMetadata(result.meta);
            this.initialized = true;
        }
        this.grid.setData(result.data || []);
        this.grid.build();
        
        if(result.pager)
            this.pageList.build(result.pager.count, result.pager.current);

        this.overlay.hide();

        if (this.grid.isEmpty()) {
            if (control = this.toolbar.getControlById('add')) control.enable();
        }
        else {
            this.toolbar.enableControls();
            this.pageList.enable();
        }
    },
    processServerError: function(responseText){
        alert(responseText);
        this.overlay.hide();
    },
    applyFilter: function() {
        if (this.filter.query.value.length > 0) {
            this.filter.element.addClass('active');
            this.filter.active = true;
            this.reloadGrid();
        }
        else if (this.filter.active) {
            this.removeFilter();
        }
    },

    removeFilter: function(force) {
        this.filter.query.value = '';
        this.filter.element.removeClass('active');
        if (this.filter.active || force) {
            this.filter.active = false;
            this.reloadGrid();
        }
    },

    // Actions:

    view: function() {
        ModalBox.open({ url: this.singlePath +
                this.grid.getSelectedRecordKey() });
    },

    add: function() {
        ModalBox.open({
            url: this.singlePath + 'add/',
            onClose: function(returnValue) {
                if (returnValue) {
                    if (returnValue.afterClose == 'add') {
                        this.add();
                    }
                    else {
                        this.reloadGrid();
                    }
                }
            }.bind(this)
        });
    },

    edit: function() {
        ModalBox.open({
            url: this.singlePath + this.grid.getSelectedRecordKey() + '/edit',
            onClose: this.loadPage.pass(this.pageList.currentPage, this)
        });
    },

    del: function() {
        var MSG_CONFIRM_DELETE = Energine.translations.get('MSG_CONFIRM_DELETE') ||
                'Do you really want to delete selected record?';
        if (confirm(MSG_CONFIRM_DELETE)) {
            this.request(this.singlePath + this.grid.getSelectedRecordKey() +
                    '/delete/', null, this.loadPage.pass(this.pageList.currentPage, this));
        }
    },

    close: function() {
        ModalBox.close();
    },
    up: function() {
        this.request(this.singlePath + this.grid.getSelectedRecordKey() +
                '/up/', '', this.loadPage.pass(this.pageList.currentPage, this));
    },

    down: function() {
        this.request(this.singlePath + this.grid.getSelectedRecordKey() +
                '/down/', '', this.loadPage.pass(this.pageList.currentPage, this));
    },
    print: function() {
        window.open(this.element.getProperty('single_template') + 'print/');
    },
    csv: function() {
        document.location.href =
                this.element.getProperty('single_template') + 'csv/';
    }
});

GridManager.Filter = new Class({
    initialize:function(gridManager){
        this.element = gridManager.element.getElement('.filter');
        this.fields = false;
        this.query = false;
        if (this.element) {
            this.fields = this.element.getElement('select');
            this.query = this.element.getElement('input');
            this.query.addEvent('keydown', function(event) {
                event = new Event(event);
                if ((event.key == 'enter') && (event.control.value != '')) {
                    event.stop();
                    var button = element.getElement('.filter button');
                    button.click();
                }
            });
        }
    },
    exists: function(){
        return (this.element)?true:false;
    },
    remove: function(force){

    },
    'apply': function(){

    }
});