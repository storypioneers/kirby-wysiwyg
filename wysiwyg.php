<?php
/**
 * WYSIWYG Editor Field for Kirby Panel
 *
 * @version   1.0.0
 * @author    Jonas Döbertin <hello@jd-powered.net>
 * @copyright digital storytelling pioneers <http://storypioneers.com>
 * @link      https://github.com/storypioneers/kirby-wysiwyg
 * @license   GNU GPL v3.0 <http://opensource.org/licenses/GPL-3.0>
 */

/** Require HTML to Markdown conversion class */
require __DIR__ . DS . 'vendor' . DS . 'HTML_To_Markdown.php';

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
            'medium-editor-2.4.6.min.js',
            'medium-button-1.1.min.js',
            'bugfix.js',
            'wysiwyg.js',
        ),
        'css' => array(
            'medium-editor-2.4.6.min.css',
            'medium-editor-theme-kirby-1.0.0.css',
            'wysiwyg.css',
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
            'header1',
            'header2',
            'bold',
            'italic',
            'anchor',
            'quote',
            'unorderedlist',
            'orderedlist',
            'pre',
        ),
        'heading-style'  => 'atx',
        'double-returns' => true,
        'first-header'   => 'h2',
        'second-header'  => 'h3',
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
            (4) Load first header configuration
         */
        $this->firstHeader = c::get('field.wysiwyg.first-header', 'h1');
        if(!in_array($this->firstHeader, array('h1', 'h2', 'h3', 'h4', 'h5', 'h6')))
        {
            $this->firstHeader = $this->defaults['first-header'];
        }

        /*
            (5) Load second header configuration
         */
        $this->secondHeader = c::get('field.wysiwyg.second-header', 'h2');
        if(!in_array($this->secondHeader, array('h1', 'h2', 'h3', 'h4', 'h5', 'h6')))
        {
            $this->secondHeader = $this->defaults['second-header'];
        }

        /*
            (6) Load drag/drop configuration
         */
        $this->kirbyDragDrop = c::get('field.wysiwyg.dragdrop.kirby', true);
        if(!is_bool($this->kirbyDragDrop))
        {
            $this->kirbyDragDrop = true;
        }
        $this->mediumDragDrop = c::get('field.wysiwyg.dragdrop.medium', true);
        if(!is_bool($this->mediumDragDrop))
        {
            $this->mediumDragDrop = true;
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
            'first-header'    => $this->firstHeader,
            'second-header'   => $this->secondHeader,
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
        $converter = new HTML_To_Markdown();
        $converter->set_option('strip_tags', false);
        $converter->set_option('header_style', $this->headingStyle);
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
