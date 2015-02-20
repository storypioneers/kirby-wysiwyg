
WysiwygEditor = (function($, $field) {

    var self = this;

    this.$field  = $field;
    this.$editor = $(self.$field.data('editor'));
    this.$storage = $('#' + self.$editor.data('storage'));
    this.editor  = null;

    this.init = function() {

        var firstHeader     = self.$editor.data('first-header'),
            secondHeader    = self.$editor.data('second-header');

        /*
            Create dynamic styles
         */
        WysiwygDynamicCSS.add(self.$editor.attr('id'), firstHeader, secondHeader);

        /*
            Create MediumEditor instance
         */
        self.editor = new MediumEditor(self.$editor.get(0), {
            cleanPastedHTML:     true,
            forcePlainText:      true,
            buttonLabels:        'fontawesome',
            disableDoubleReturn: !self.$editor.is("[data-double-returns]"),
            firstHeader:         firstHeader,
            secondHeader:        secondHeader,
            buttons:             self.$editor.data('buttons').split(','),
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
            Observe changes to editor fields and update storage
            <textarea> element accordingly.
         */
        self.$editor.on('input', function(event) {
            self.$storage.text(self.$editor.html());
        });

    };

    return this.init();

});


var WysiwygDynamicCSS = (function() {

    var self = this,
        stylesheet;

    /**
     * Create dynamic stylesheet
     *
     * This allows to add dynamic CSS rules for the editor
     * heading styles later on.
     */
    this.init = function() {
        /*
            Create and prepare <style> element.
         */
        var styleElement = document.createElement('style');
        styleElement.setAttribute('media', 'all');
        styleElement.setAttribute('id', 'wysiwyg-editor-css');
        styleElement.appendChild(document.createTextNode('')); // WebKit Hack :-(

        /*
            Append element to document head and store its
            stylesheet property for later use.
         */
        document.head.appendChild(styleElement);
        self.stylesheet = styleElement.sheet;
    };

    /**
     * Generate and add dynamic CSS rules for both headings
     *
     * @param string id
     * @param string firstHeader
     * @param string secondHeader
     */
    this.add = function(id, firstHeader, secondHeader) {
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
        self.insert(firstHeadingSelector, firstHeadingRules);
        self.insert(secondHeadingSelector, secondHeadingRules);
    };

    /**
     * Insert CSS rule into our dynamic stylesheet
     *
     * @param string selector
     * @param string rules
     */
    this.insert = function(selector, rules) {
        /*
            Try to use standard insertRule() way first.
         */
        if('insertRule' in self.stylesheet) {
            self.stylesheet.insertRule(selector + '{' + rules + '}', 0);
        }

        /*
            Otherwise try to use non-standard addRule() way.
         */
        else if('addRule' in stylesheet) {
            self.stylesheet.addRule(selector, rules);
        }
    }

    /**
     * Publish public methods
     */
    return {
        init: this.init,
        add:  this.add
    };

})();

/*
    Initialize the dynamic stylesheet when loading the page.
 */
jQuery(function() {
    WysiwygDynamicCSS.init();
});

/*
    Tell the Panel to run our initialization.
    https://github.com/getkirby/panel/issues/228#issuecomment-58379016

    This callback will fire for every Medium Editor Field on the current
    panel page.
 */
(function($) {
    $.fn.wysiwygeditorfield = function() {
        var $this = $(this);

        if($this.data('WysiwygEditor')) {
            return $this.data('WysiwygEditor');
        } else {
            var wysiwygEditor = new WysiwygEditor($, $this);
            $this.data('WysiwygEditor', wysiwygEditor);
            return wysiwygEditor;
        }
    }

    // $.fn.wysiwygeditorfield = function() {
    //     WysiwygEditorField.initSingleEditor(this);
    // };
})(jQuery);
