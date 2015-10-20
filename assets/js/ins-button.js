rangy.init();

var InsButton = MediumEditor.extensions.button.extend({
    name: 'ins',
    tagNames: ['ins'],
    contentDefault: '<b>INS</b>',
    contentFA: '<i class="fa fa-plus"></i>',
    aria: 'Add',
    action: 'add',


    init: function () {
        // Initialize button
        MediumEditor.extensions.button.prototype.init.call(this);

        // Initialize ClassApplier
        this.classApplier = rangy.createClassApplier('ins', {
            elementTagName: 'ins',
            normalize: true
        });
    },

    handleClick: function (event) {
        this.classApplier.toggleSelection();
    }
});
