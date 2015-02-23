
WysiwygEditor = (function($, $field) {

    var self = this;

    this.$field        = $field;
    this.$editor       = $(this.$field.data('editor'));
    this.$storage      = $('#' + this.$editor.data('storage'));
    this.firstHeader   = this.$editor.data('first-header');
    this.secondHeader  = this.$editor.data('second-header');
    this.doubleReturns = this.$editor.is("[data-double-returns]");
    this.buttons       = this.$editor.data('buttons').split(',')
    this.editor        = null;

    this.init = function() {

        /*
            Create dynamic styles
         */
        WysiwygDynamicCSS.add(self.$editor.attr('id'), self.firstHeader, self.secondHeader);

        /*
            Create MediumEditor instance
         */
        self.editor = new MediumEditor(self.$editor.get(0), {
            cleanPastedHTML:     true,
            forcePlainText:      true,
            buttonLabels:        'fontawesome',
            disableDoubleReturn: !self.doubleReturns,
            firstHeader:         self.firstHeader,
            secondHeader:        self.secondHeader,
            buttons:             self.buttons,
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

        /*
            Observe when the field element is destroyed (=the user leaves the
            current view) and deactivate MediumEditor accordingly.
         */
        self.$field.bind('destroyed', function() {
            self.editor.deactivate();
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


(function($) {

    /*
        Set up special "destroyed" event
     */
    $.event.special.destroyed = {
        remove: function(event) {
            if(event.handler) {
                event.handler.apply(this,arguments);
            }
        }
    };

    /*
        Tell the Panel to run our initialization.
        https://github.com/getkirby/panel/issues/228#issuecomment-58379016

        This callback will fire for every WYSIWYG Editor Field on the current
        panel page.
     */
    $.fn.wysiwygeditorfield = function() {
            return new WysiwygEditor($, this);
    };

})(jQuery);
