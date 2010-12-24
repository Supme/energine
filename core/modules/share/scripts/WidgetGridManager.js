ScriptLoader.load('GridManager');
var WidgetGridManager = new Class({
    Extends: GridManager,
    initialize: function(element){
        this.parent(element);
    },
    onDoubleClick: function() {
        this.insert();
    },
    insert: function(){
        ModalBox.setReturnValue(this.grid.getSelectedRecord().widget_xml);
        ModalBox.close();
    }
});