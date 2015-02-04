<?php

require __DIR__ . DS . 'vendor' . DS . 'HTML_To_Markdown.php';

/**
 * Medium Editor Field for Kirby Panel
 *
 * @version   1.0.0
 * @author    Jonas Döbertin <hello@jd-powered.net>
 * @link      https://github.com/storypioneers/kirby-wysiwyg
 * @copyright Jonas Döbertin
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 */
class MediumField extends BaseField {

    /**
     * Define frontend assets
     *
     * @since 1.0.0
     *
     * @var array
     */
    public static $assets = array(
        'js' => array(
            'medium-editor-2.1.0.min.js',
            'medium-button-1.1.min.js',
            'md-3.0.2.min.js',
            'medium.js',
        ),
        'css' => array(
            'medium-editor-2.1.0.css',
            'medium-editor-theme-2.1.0.css',
            'medium.css',
        ),
    );

    /**
     * Field configuration
     *
     * @since 1.0.0
     *
     * @var array
     */
    protected $config = array();

    /**
     * Default configuration values
     *
     * @since 1.0.0
     *
     * @var array
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
            'subscript',
            'superscript',
            'del',
            'ins',
            'mark',
        ),
        'heading-style' => 'atx',
    );

    /**
     * Load and prepare configuration
     *
     * @since 1.0.0
     *
     * @return \MediumField
     */
    public function __construct()
    {
        /*
            Load button configuration
         */
        $this->config['buttons'] = c::get('field.medium.buttons', false);
        if(!is_array($this->config['buttons']))
        {
            $this->config['buttons'] = $this->defaults['buttons'];
        }

        /*
            Load heading style configuration
         */
        $this->config['heading-style'] = c::get('field.medium.heading-style', $this->defaults['heading-style']);
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
        $input->addClass('input medium-editor-input');
        $input->attr(array(
            'required'     => $this->required(),
            'name'         => $this->name(),
            'readonly'     => 'readonly',
            'id'           => $this->id()
        ));
        $input->html($this->convertToHtml($this->value() ?: ''));
        $input->data('field', 'mediumeditorfield');
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
        $editor->addClass('medium-editor');
        $editor->data(array(
            'storage-input-id' => $this->id(),
            'buttons-config'   => implode(',', $this->config['buttons']),
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
     * This converts the HTML we get from the <textarea> to markdown
     * before it get's stored in the content file.
     *
     * @since 1.0.0
     *
     * @return string
     */
    public function result()
    {
        return $this->convertToMarkdown(parent::result());
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
        $converter->set_option('header_style', $this->config['heading-style']);
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
