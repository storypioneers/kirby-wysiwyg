
MediumEditorField = (function($){

    /**
     * Initialization
     */
    function init() {

        var editorSelector  = '.medium-editor',
            $editorElements = $(editorSelector),
            editors         = [];

        /*
            Create an instance of the editor for each field
         */
        $editorElements.each(function() {

            $editorElement = $(this);

            /*
                Create editor instance
             */
            editors.push(new MediumEditor(this, {
                cleanPastedHTML:     true,
                forcePlainText:      true,
                buttonLabels:        'fontawesome',
                disableDoubleReturn: !$editorElement.is("[data-double-returns]"),
                firstHeader:         'h2',
                secondHeader:        'h3',
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
                Observe changes to editor fields
             */
            $editorElement.on('input', {
                $editorElement:  $editorElement,
                $storageElement: $('#' + $editorElement.data('storage'))
            }, updateStorage);

        });

    }

    /**
     * Copy contents of editor element into the editor "storage" <textarea>
     */
    function updateStorage(event) {

        event.data.$storageElement.text($editorElement.html());

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
 */
(function($) {
    $.fn.mediumeditorfield = function() {
        MediumEditorField.init();
    };
})(jQuery);
