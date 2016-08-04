WysiwygEditor = (function($, $field) {

    var self = this;

    this.$field         = $field;
    this.$editor        = $(this.$field.data('editor'));
    this.$storage       = $('#' + this.$editor.data('storage'));
    this.$draggable     = $('.sidebar').find('.draggable');

    this.doubleReturns  = this.$editor.is('[data-double-returns]');
    this.buttons        = this.$editor.data('buttons').split(',');
    this.kirbyDragDrop  = this.$field.is('[data-dragdrop-kirby]');
    this.mediumDragDrop = this.$editor.is('[data-dragdrop-medium]');
    this.editor         = null;

    /**
     * Initialize editor field
     *
     * @since 1.0.0
     */
    this.init = function() {

        /**
         * Create dynamic styles
         *
         * @since 1.0.0
         */
        // WysiwygDynamicCSS.add(self.$editor.attr('id'), self.firstHeader, self.secondHeader);

        /**
         * Create MediumEditor instance
         *
         * @since 1.0.0
         */
        self.editor = new MediumEditor(self.$editor.get(0), {
            buttonLabels: 'fontawesome',
            disableReturn: false,
            disableDoubleReturn: !self.doubleReturns,
            imageDragging: self.mediumDragDrop,


            toolbar: {
                buttons: self.buttons,
            },

            paste: {
                cleanPastedHTML: false,
                forcePlainText: true,
            },

            anchorPreview: false,

            extensions: {
                'mark': new MarkButton(),
                'del': new DelButton(),
                'ins': new InsButton(),
            }
        });

        /**
         * Make the editor field accept Kirby typical
         * file/page drag and drop events.
         *
         * @since 1.0.0
         */
        if(self.kirbyDragDrop) {
            self.$editor.droppable({
                hoverClass: 'over',
                accept:     self.draggable,
                drop:       function(event, element) {
                    self.insertAtCaret(element.draggable.data('text'));
                }
            });
        }


        /**
         * Observe changes to editor fields and update storage <textarea>
         * element accordingly.
         *
         * @since 1.0.0
         */
        self.$editor.on('DOMSubtreeModified', function(event) {
            self.$storage.text(self.$editor.html());
        });

        /**
         * Observe when the field element is destroyed (=the user leaves the
         * current view) and deactivate MediumEditor accordingly.
         *
         * @since 1.0.0
         */
        self.$field.bind('destroyed', function() {
            self.editor.destroy();
        });


        /**
         * Remove panel default event delegation for all clicks on links
         *
         * @since 1.2.0
         */
        $('div.medium-editor-element a').off('click').on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
        });

    };

    /**
     * Insert HTML (or plaintext) content at the curent caret position
     *
     * @since 1.0.0
     * @param string html
     */
    this.insertAtCaret = function(html) {

        var sel,
            range;

        if(window.getSelection) {

            // IE9 and non-IE
            sel = window.getSelection();
            if(sel.getRangeAt && sel.rangeCount) {

                range = sel.getRangeAt(0);
                range.deleteContents();

                var el = document.createElement("div");
                el.innerHTML = html;

                var frag = document.createDocumentFragment(),
                    node,
                    lastNode;

                while((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if(lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }
        else if(document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    };

    /**
     * Run initialization
     */
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
     *
     * @since 1.0.0
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
     * @since 1.0.0
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
     * @since 1.0.0
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
    };

    /**
     * Publish public methods
     *
     * @since 1.0.0
     */
    return {
        init: this.init,
        add:  this.add
    };

})();


/**
 * Initialize the dynamic stylesheet when loading the page.
 *
 * @since 1.0.0
 */
jQuery(function() {
    WysiwygDynamicCSS.init();
});


(function($) {

    /**
     * Set up special "destroyed" event.
     *
     * @since 1.0.0
     */
    $.event.special.destroyed = {
        remove: function(event) {
            if(event.handler) {
                event.handler.apply(this,arguments);
            }
        }
    };

    /**
     * Tell the Panel to run our initialization.
     *
     * This callback will fire for every WYSIWYG Editor
     * Field on the current panel page.
     *
     * @see https://github.com/getkirby/panel/issues/228#issuecomment-58379016
     * @since 1.0.0
     */
    $.fn.wysiwygeditorfield = function() {
        rangy.init();
        return new WysiwygEditor($, this);
    };

})(jQuery);
