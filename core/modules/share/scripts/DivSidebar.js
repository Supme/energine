ScriptLoader.load('DivManager');
var DivSidebar = new Class({
    Extends: DivManager,

    initialize: function(element) {
        Asset.css('div.css');

        this.element = $(element);
        new Element('ul').setProperty('id', 'divTree').addClass('treeview').inject($('treeContainer')).adopt(
                new Element('li').setProperty('id', 'treeRoot').adopt(
                        new Element('a').set('html', Energine.translations.get('TXT_DIVISIONS'))
                        )
                );
        this.langId = this.element.getProperty('lang_id');
        this.tree = new TreeView('divTree', {dblClick: this.go.bind(this)});
        this.treeRoot = this.tree.getSelectedNode();
        this.treeRoot.onSelect = this.onSelectNode.bind(this);
        this.singlePath = this.element.getProperty('single_template');
        this.site = this.element.getProperty('site');
        $$('html')[0].addClass('e-divtree-panel');
        this.loadTree();
    },
    attachToolbar: function(toolbar) {
        if (this.toolbar = toolbar) {
            this.toolbar.getElement().inject(this.element, 'top');
            this.toolbar.disableControls();
            var addBtn, selectBtn;
            if (addBtn = this.toolbar.getControlById('add')) {
                addBtn.enable();
            }
            if (selectBtn = this.toolbar.getControlById('select')) {
                selectBtn.enable();
            }
            toolbar.bindTo(this);
        }
    }
});