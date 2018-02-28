<?php

namespace League\HTMLToMarkdown\Converter;

use League\HTMLToMarkdown\ElementInterface;

class PreformattedConverter implements ConverterInterface
{
    /**
     * @param ElementInterface $element
     *
     * @return string
     */
    public function convert(ElementInterface $element)
    {
        $markdown = '';

        $pre_content = html_entity_decode($element->getChildrenAsString());
        $pre_content = str_replace(array('<pre>', '</pre>'), '', $pre_content);

        /*
         * Checking for the code tag.
         * Usually pre tags are used along with code tags. This conditional will check for already converted code tags,
         * which use backticks, and if those backticks are at the beginning and at the end of the string it means
         * there's no more information to convert.
         */

        $firstBacktick = strpos(trim($pre_content), '`');
        $lastBacktick = strrpos(trim($pre_content), '`');
        if ($firstBacktick === 0 && $lastBacktick === strlen(trim($pre_content)) - 1) {
            return $pre_content;
        }

        // If the execution reaches this point it means it's just a pre tag, with no code tag nested

        // Empty lines are a special case
        if ($pre_content === '') {
            return "```\n```\n";
        }

        // Normalizing new lines
        $pre_content = preg_replace('/\r\n|\r|\n/', PHP_EOL, $pre_content);

        // Is it a single line?
        if (strpos($pre_content, PHP_EOL) === false) {
            // One line of code, wrapping it on one backtick.
            return '`' . $pre_content . '`';
        }

        // Ensure there's a newline at the end
        if (strrpos($pre_content, PHP_EOL) !== strlen($pre_content) - 1) {
            $pre_content .= PHP_EOL;
        }

        // Use three backticks
        return "```\n" . $pre_content . "```\n";
    }

    /**
     * @return string[]
     */
    public function getSupportedTags()
    {
        return array('pre');
    }
}
