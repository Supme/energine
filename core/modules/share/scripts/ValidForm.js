ScriptLoader.load('Validator');

var ValidForm = new Class({
    initialize:function (element) {
        this.componentElement = $(element);
        if (this.componentElement) {
            this.form = this.componentElement.getParent('form');
            if (this.form) {
                this.singlePath = this.componentElement.getProperty('single_template');
                this.form.addClass('form').addEvent('submit', this.validateForm.bind(this));
                this.validator = new Validator(this.form);
            }
        }
    },
    validateForm:function (event) {
        var result = false;
        if (!this.validator.validate()) {
            this.cancelEvent(event);
        }
        else {
            result = true;
        }
        return result;
    },
    cancelEvent:function (event) {
        return Energine.cancelEvent(event);
    }
});
