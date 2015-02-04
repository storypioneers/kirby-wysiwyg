
MediumEditorField = (function($){

    /**
     * Initialization
     */
    function init() {

        var editorSelector  = '.medium-editor',
            $editorElements = $(editorSelector),
            editorButtons   = $editorElements.first().data('buttons-config').split(','),
            editor;

        /*
            Set up medium editor
         */
        editor = new MediumEditor(editorSelector, {
            cleanPastedHTML: true,
            firstHeader:     'h2',
            secondHeader:    'h3',
            buttonLabels:    'fontawesome',
            buttons:         editorButtons,
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
        });

        /*
            Observe changes to editor fields
         */
        $editorElements.on('input', updateStorage);
    }

    /**
     * Copy contents of editor element into the editor "storage" <textarea>
     */
    function updateStorage(e) {

        var editorElement        = $(e.target),
            editorStorageId      = editorElement.data('storage-input-id'),
            editorStorageElement = $('#' + editorStorageId);

        editorStorageElement.text(editorElement.html());
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
