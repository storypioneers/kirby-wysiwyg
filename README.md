# Kirby WYSIWYG

This additional panel field for [Kirby 2](http://getkirby.com) allows you to use a medium.com like visual inline editor in the Panel.

**Authors**: [digital storytelling pioneers](https://github.com/storypioneers) feat. [Jonas Doebertin](https://github.com/JonasDoebertin)

**License**: [GNU GPL v3.0](http://opensource.org/licenses/GPL-3.0)

![screenshot](https://raw.github.com/storypioneers/kirby-wysiwyg/master/screenshot.png)

## Installation

Copy or link the `wysiwyg` directory to `site/plugins/` **or** use the [Kirby CLI](https://github.com/getkirby/cli) `kirby plugin:install storypioneers/kirby-wysiwyg`.


*Optional: Set some configuration options for Kirby WYSIWYG Editor in your sites `config.php` file. You can get an overview of all available options further down.*


## Usage

Post installation you can use it in your blueprints: simply replace the `textarea` fields with `wysiwyg` fields (where applicable).

```yaml
fields:
	richtext:
		label: Text
		type:  wysiwyg
```

As content you create using Kirby WYSIWYG Editor is converted into valid markdown, there's nothing you have to change in your templates. Just use the `wysiwyg` content fields like your previous `textarea` fields:

```php
<article>
	<h1><?= $page->title()->html() ?></h1>

	<!-- Just render your WYSIWYG Editor fields
	     like any other Kirbytext field. -->
	<?= $page->richtext()->kirbytext() ?>

</acticle>
```

## Global Options

The Kirby WYSIWYG Editor Field has some global options that you might want to use to alter the fields functionality to suit your specific needs. Below you'll find a list of all available options which can be set from your projects global `config.php` file.

### field.wysiwyg.buttons

Define a list of buttons to display in the editor toolbar. Currently supported button types are: `bold`, `italic`, `underline`, `strikethrough`, `subscript`, `superscript`, `anchor`, `quote`, `pre`, `orderedlist`, `unorderedlist`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, and `removeFormat`. Please note that the order in which you list the button names relates to the display order in the toolbar.

### field.wysiwyg.heading-style

Define your preferred heading style. Choose between `setext` (underlined) or `atx` (# Heading 1 and ## Heading 2). Please note that this only affects H1 and H2 headings. All headings of lower priority will always use the ATX style.

## Per Field Options

In addition to the global options explained above, the field offers some options that can be set from a per field basis directly from your blueprints. Please note that these per field options always overwrite global options you might have specified.

### buttons

Define a list of buttons to display in the editor toolbar. Currently supported button types are: `bold`, `italic`, `underline`, `strikethrough`, `subscript`, `superscript`, `anchor`, `quote`, `pre`, `orderedlist`, `unorderedlist`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, and `removeFormat`. Please note that the order in which you list the button names relates to the display order in the toolbar.

```yaml
fields:
	richtext:
		label: Text
		type:  wysiwyg
		buttons:
			- bold
			- italic
			- anchor
```

### headingstyle

Define your preferred heading style. Choose between `setext` (underlined) or `atx` (# Heading 1 and ## Heading 2). Please note that this only affects H1 and H2 headings. All headings of lower priority will always use the ATX style.

```yaml
fields:
	richtext:
		label: Text
		type:  wysiwyg
		headingstyle: setext
```
