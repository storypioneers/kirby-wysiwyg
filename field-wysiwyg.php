<?php
/**
 * Kirby WYSIWYG
 *
 * Inline Editor Field for Kirby 2
 *
 * @version   1.2.0
 * @author    digital storytelling pioneers <digital@storypioneers.com>
 * @author    feat. Jonas Döbertin <hello@jd-powered.net> and others (see AUTHORS)
 * @copyright digital storytelling pioneers <http://storypioneers.com>
 * @link      https://github.com/storypioneers/kirby-wysiwyg
 * @license   GNU GPL v3.0 <http://opensource.org/licenses/GPL-3.0>
 */

// register the builder field
$kirby->set('field', 'wysiwyg', __DIR__ . DS . 'field');
