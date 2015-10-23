var DelButton = MediumEditor.extensions.button.extend({
    name: 'del',
    tagNames: ['del'],
    contentDefault: '<b>DEL</b>',
    contentFA: '<i class="fa fa-strikethrough"></i>',
    aria: 'Deleted',
    action: 'del',


    init: function () {
        // Initialize button
        MediumEditor.extensions.button.prototype.init.call(this);

        // Initialize ClassApplier
        this.classApplier = rangy.createClassApplier('del', {
            elementTagName: 'del',
            normalize: true
        });
    },

    handleClick: function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.classApplier.toggleSelection();
    }
});
