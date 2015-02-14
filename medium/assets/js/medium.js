
MediumEditorField = (function($){

    var editors = [];

    /**
     * Initialization
     */
    function init($fieldElement) {

        /*
            Find related editor element
         */
        var $editorElement = $($fieldElement.data('editor'));

        /*
            Create editor instance
         */
        editors.push(new MediumEditor($editorElement.get(0), {
            cleanPastedHTML:     true,
            forcePlainText:      true,
            buttonLabels:        'fontawesome',
            disableDoubleReturn: !$editorElement.is("[data-double-returns]"),
            firstHeader:         $editorElement.data('first-header'),
            secondHeader:        $editorElement.data('second-header'),
            buttons:             $editorElement.data('buttons').split(','),
            extensions: {
                'del': new MediumButton({
                    label: '<i class="fa fa-strikethrough"></i>',
                    start: '<del>',
                    end:   '</del>'
                }),
                'ins': new MediumButton({
                    label: 'INS',
                    start: '<ins>',
                    end:   '</ins>'
                }),
                'mark': new MediumButton({
                    label: 'MARK',
                    start: '<mark>',
                    end:   '</mark>'
                }),
           }
        }));

        /*
            Observe changes to editor fields and update storage
            <textarea> element accordingly.
         */
        $editorElement.on('input', {
            $editorElement:  $editorElement,
            $storageElement: $('#' + $editorElement.data('storage'))
        }, function(event) {
            event.data.$storageElement.text(event.data.$editorElement.html());
        });

    }

    /**
     * Publish public init method
     */
    return {
        init: init
    }

})(jQuery);


/*
    Tell the Panel to run our initialization.
    https://github.com/getkirby/panel/issues/228#issuecomment-58379016

    This callback will fire for every Medium Editor Field on the current
    panel page.
 */
(function($) {
    $.fn.mediumeditorfield = function() {
        MediumEditorField.init(this);
    };
})(jQuery);