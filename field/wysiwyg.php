<?php

// Require vendor autoloader
require __DIR__ . DS . 'vendor' . DS . 'autoload.php';

/**
 * WYSIWYG Editor Field
 *
 * @since 1.0.0
 */
class WysiwygField extends BaseField {

    /**
     * Matches only opening and closing <span> tags with all
     * their attributes. This will be used to strip them from
     * the editor output on saving the field.
     *
     * @since 1.0.0
     */
    const SPAN_REMOVAL_REGEX = '/<\s*\/?\s*span[^>]*>/i';

    /**
     * Define frontend assets
     *
     * @var array
     * @since 1.0.0
     */
    public static $assets = array(
        'js' => array(
            'vendor/medium-editor.min.js',
            'vendor/rangy-core.min.js',
            'vendor/rangy-classapplier.min.js',
            'del-button.js',
            'ins-button.js',
            'mark-button.js',
            'wysiwyg.js',
        ),
        'css' => array(
            'wysiwyg.css',
            'vendor/medium-editor.min.css',
            'medium-editor-theme-kirby.css',
        ),
    );

    /**
     * Array of buttons to display in the editor toolbar
     *
     * @var array
     * @since 1.0.0
     */
    public $buttons;

    /**
     * Heading markdown style to use in output
     *
     * @var string
     * @since 1.0.0
     */
    protected $headingStyle;

    /**
     * Default configuration values
     *
     * @var array
     * @since 1.0.0
     */
    protected $defaults = array(
        'buttons' => array(
            'h1',
            'h2',
            'bold',
            'italic',
            'anchor',
            'quote',
            'unorderedlist',
            'orderedlist',
            'pre',
        ),
        'heading-style'  => 'atx',
        'double-returns' => false,
    );

    /**
     * Load and prepare configuration
     *
     * @since 1.0.0
     *
     * @return \WysiwygField
     */
    public function __construct()
    {
        /*
            (1) Load button configuration
         */
        $this->buttons = c::get('field.wysiwyg.buttons', false);
        if(!is_array($this->buttons) or (count($this->buttons) <= 0))
        {
            $this->buttons = $this->defaults['buttons'];
        }

        /*
            (2) Load heading style configuration
         */
        $this->headingStyle = c::get('field.wysiwyg.heading-style', false);
        if(!in_array($this->headingStyle, array('atx', 'setext')))
        {
            $this->headingStyle = $this->defaults['heading-style'];
        }

        /*
            (3) Load double returns configuration
         */
        $this->doubleReturns = c::get('field.wysiwyg.double-returns', null);
        if(!is_bool($this->doubleReturns))
        {
            $this->doubleReturns = $this->defaults['double-returns'];
        }

        /*
            (4) Load drag/drop configuration
         */
        $this->kirbyDragDrop = c::get('field.wysiwyg.dragdrop.kirby', false);
        if(!is_bool($this->kirbyDragDrop))
        {
            $this->kirbyDragDrop = false;
        }
        $this->mediumDragDrop = c::get('field.wysiwyg.dragdrop.medium', false);
        if(!is_bool($this->mediumDragDrop))
        {
            $this->mediumDragDrop = false;
        }
    }

    /**
     * Create input element
     *
     * @since 1.0.0
     *
     * @return \Brick
     */
    public function input()
    {
        $input = new Brick('textarea');
        $input->addClass('input wysiwyg-editor-input');
        $input->attr(array(
            'required'     => $this->required(),
            'name'         => $this->name(),
            'readonly'     => 'readonly',
            'id'           => $this->id()
        ));
        $input->html($this->convertToHtml($this->value() ?: ''));
        $input->data(array(
            'field'           => 'wysiwygeditorfield',
            'editor'          => '#' . $this->id() . '-editor',
            'dragdrop-kirby'  => $this->kirbyDragDrop,
        ));
        return $input;
    }

    /**
     * Create content element
     *
     * This appends our main editor <div> to the fields markup.
     *
     * @since 1.0.0
     *
     * @return \Brick
     */
    public function content()
    {
        $content = parent::content();
        $content->append($this->editor());
        return $content;
    }

    /**
     * Create editor element
     *
     * This creates our main editor <div>.
     *
     * @since 1.0.0
     *
     * @return \Brick
     */
    protected function editor()
    {
        /*
            Prepare editor element
         */
        $editor = new Brick('div');
        $editor->addClass('input');
        $editor->addClass('wysiwyg-editor');
        $editor->attr('id', $this->id() . '-editor');
        $editor->data(array(
            'storage'         => $this->id(),
            'buttons'         => implode(',', $this->buttons),
            'double-returns'  => $this->doubleReturns,
            'dragdrop-medium' => $this->mediumDragDrop,
        ));

        /*
            Parse markdown and set editor content
         */
        $editor->html($this->convertToHtml($this->value() ?: ''));
        return $editor;
    }

    /**
     * Convert result to markdown
     *
     * (1) This converts the HTML we get from the <textarea> to markdown
     *     before it get's stored in the content file.
     * (2) Strip all wild <span> tags from the content as they might be inserted
     *     by the JS editor.
     *
     * @since 1.0.0
     *
     * @return string
     */
    public function result()
    {
        /*
            (1) Convert to markdown
         */
        $result = $this->convertToMarkdown(parent::result());

        /*
            (2) Strip <span> elements
         */
        return preg_replace(self::SPAN_REMOVAL_REGEX, '', $result);
    }

    /**
     * Convert HTML to markdown
     *
     * @since 1.0.0
     *
     * @param  string $html
     * @return string
     */
    protected function convertToMarkdown($html)
    {
        $converter = new League\HTMLToMarkdown\HtmlConverter(array(
            'strip_tags' => false,
            'header_style' => $this->headingStyle
        ));
        return $converter->convert($html);
    }

    /**
     * Convert markdown to HTML
     *
     * @since 1.0.0
     *
     * @param  string $markdown
     * @return string
     */
    protected function convertToHtml($markdown)
    {
        $Parsedown = new Parsedown();
        return $Parsedown->text($markdown);
    }

}
