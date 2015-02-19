
WysiwygEditorField = (function($){

    var editors = [],
        stylesheet;

    /**
     * Initialize a single editor element
     */
    function initSingleEditor($fieldElement) {

        /*
            Find related editor element
         */
        var $editorElement = $($fieldElement.data('editor')),
            firstHeader = $editorElement.data('first-header'),
            secondHeader = $editorElement.data('second-header');

        /*
            Create dynamic styles
         */
        addDynamicCSS($editorElement.attr('id'), firstHeader, secondHeader);

        /*
            Create editor instance
         */
        editors.push(new MediumEditor($editorElement.get(0), {
            cleanPastedHTML:     true,
            forcePlainText:      true,
            buttonLabels:        'fontawesome',
            disableDoubleReturn: !$editorElement.is("[data-double-returns]"),
            firstHeader:         firstHeader,
            secondHeader:        secondHeader,
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
     * Create dynamic stylesheet
     *
     * This allows to add dynamic CSS rules for the editor
     * heading styles later on.
     */
    function initDynamicCSS() {
        /*
            Create and prepare <style> element.
         */
        var styleElement = document.createElement('style');
        styleElement.setAttribute('media', 'all');
        styleElement.appendChild(document.createTextNode('')); // WebKit Hack :-(

        /*
            Append element to document head and store its
            stylesheet property for later use.
         */
        document.head.appendChild(styleElement);
        stylesheet = styleElement.sheet;
    }

    /**
     * Generate and add dynamic CSS rules for both headings
     *
     * @param string id
     * @param string firstHeader
     * @param string secondHeader
     */
    function addDynamicCSS(id, firstHeader, secondHeader) {
        /*
            Build ID and rules strings
         */
        var firstHeadingSelector  = '#' + id + ' ' + firstHeader,
            secondHeadingSelector = '#' + id + ' ' + secondHeader,
            firstHeadingRules     = 'font-size: 1.6em;',
            secondHeadingRules    = 'font-size: 1.2em;';

        /*
            Insert into dynamic stylesheet
         */
        insertCSSRule(firstHeadingSelector, firstHeadingRules);
        insertCSSRule(secondHeadingSelector, secondHeadingRules);
    }

    /**
     * Insert CSS rule into our dynamic stylesheet
     *
     * @param string selector
     * @param string rules
     */
    function insertCSSRule(selector, rules) {
        /*
            Try to use standard insertRule() way first.
         */
        if('insertRule' in stylesheet) {
            stylesheet.insertRule(selector + '{' + rules + '}', 0);
        }

        /*
            Otherwise try to use non-standard addRule() way.
         */
        else if('addRule' in stylesheet) {
            stylesheet.addRule(selector, rules);
        }
    }

    /**
     * Publish public init method
     */
    return {
        initSingleEditor: initSingleEditor,
        initDynamicCSS:   initDynamicCSS
    }

})(jQuery);

/*
    Initialize the dynamic stylesheet when loading the page.
 */
jQuery(function($) {
    WysiwygEditorField.initDynamicCSS();
});

/*
    Tell the Panel to run our initialization.
    https://github.com/getkirby/panel/issues/228#issuecomment-58379016

    This callback will fire for every Medium Editor Field on the current
    panel page.
 */
(function($) {
    $.fn.wysiwygeditorfield = function() {
        WysiwygEditorField.initSingleEditor(this);
    };
})(jQuery);
