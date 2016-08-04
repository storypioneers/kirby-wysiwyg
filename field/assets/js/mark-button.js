var MarkButton = MediumEditor.extensions.button.extend({
    name: 'mark',
    tagNames: ['mark'],
    contentDefault: '<b>MARK</b>',
    contentFA: '<i class="fa fa-paint-brush"></i>',
    aria: 'Hightlight / Mark',
    action: 'highlight',


    init: function () {
        // Initialize button
        MediumEditor.extensions.button.prototype.init.call(this);

        // Initialize ClassApplier
        this.classApplier = rangy.createClassApplier('mark', {
            elementTagName: 'mark',
            normalize: true
        });
    },

    handleClick: function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.classApplier.toggleSelection();
    }
});
