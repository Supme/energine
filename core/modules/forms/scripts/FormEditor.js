ScriptLoader.load('GridManager');
var FormEditor = new Class({
    Extends:GridManager,
    initialize: function(element){
        this.parent(element);
    },
    editProps: function(){
        ModalBox.open({
            url: this.singlePath + this.grid.getSelectedRecordKey() + '/values/'
        });
    },
    onSelect: function(){
        this.parent();
        var curr = this.grid.getSelectedRecord();

        if(curr.field_id <= 2){
            this.toolbar.disableControls();
        }
        else {
            this.toolbar.enableControls();
            var t = curr.field_type_real;
            if((t != 'select') && (t != 'multi'))
                this.toolbar.disableControls('editProps');
        }
        this.toolbar.enableControls('add');
    }
    

});
