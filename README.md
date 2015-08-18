# WYSIWYG – Kirby WYSIWYG Editor Field

[![Release](https://img.shields.io/github/release/storypioneers/kirby-wysiwyg.svg)](https://github.com/storypioneers/kirby-wysiwyg/releases)  [![Issues](https://img.shields.io/github/issues/storypioneers/kirby-wysiwyg.svg)](https://github.com/storypioneers/kirby-wysiwyg/issues) [![License](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://raw.githubusercontent.com/storypioneers/kirby-wysiwyg/master/LICENSE)

[![Release](https://img.shields.io/github/release/storypioneers/kirby-selector.svg)](https://github.com/storypioneers/kirby-selector/releases)  [![Issues](https://img.shields.io/github/issues/storypioneers/kirby-selector.svg)](https://github.com/storypioneers/kirby-selector/issues) [![License](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://raw.githubusercontent.com/storypioneers/kirby-selector/master/LICENSE)

This additional panel field for [Kirby 2](http://getkirby.com) allows you to use a medium.com like visual editor in the Panel.

**Concept**: [@storypioneers](https://github.com/storypioneers)

**Authors**: [@JonasDoebertin](https://github.com/JonasDoebertin/) for [@storypioneers](https://github.com/storypioneers)

**License**: [GNU GPL v3.0](http://opensource.org/licenses/GPL-3.0)

**Uses**: [@yabwe/medium-editor](https://github.com/yabwe/medium-editor), [@nickcernis/html-to-markdown](https://github.com/nickcernis/html-to-markdown), [medium-button](https://stillhart.biz/project/MediumButton/)

![screenshot](https://raw.github.com/storypioneers/kirby-wysiwyg/master/screenshot.png)

## Installation

If not already existing, add a new `fields` folder to your `site` directory. Then copy or link the entire `wysiwyg` folder there. Afterwards, your directory structure should look like this:

```
site/
	fields/
		wysiwyg/
			assests/
			vendor/
			wysiwyg.php
```

*Optional: Set some configuration options for Kirby WYSIWYG Editor in your sites `config.php` file. You can get an overview of all available options further down.*

## Usage

As soon as you dropped the field extension into your fields folder you can use it in your blueprints: simply replace the `textarea` fields with `wysiwyg` fields (where applicable).

```
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

Define a list of buttons to display in the editor toolbar. Currently supported button types are: `header1`, `header2`, `bold`, `italic`, `anchor`, `quote`, `unorderedlist`, `orderedlist`, `subscript`, `superscript`, `del`, `ins` and `mark`. Please note that the order in which you list the button names relates to the display order in the toolbar.

### field.wysiwyg.heading-style

Define your preferred heading style. Choose between `setext` (underlined) or `atx` (# Heading 1 and ## Heading 2). Please note that this only affects H1 and H2 headings. All headings of lower priority will always use the ATX style.

## Per Field Options

In addition to the global options explained above, the field offers some options that can be set from a per field basis directly from your blueprints. Please note that these per field options always overwrite global options you might have specified.

### buttons

Define a list of buttons to display in the editor toolbar. Currently supported button types are: `header1`, `header2`, `bold`, `italic`, `anchor`, `quote`, `unorderedlist`, `orderedlist`, `subscript`, `superscript`, `del`, `ins` and `mark`. Please note that the order in which you list the button names relates to the display order in the toolbar.

```
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

```
fields:
	richtext:
		label: Text
		type:  wysiwyg
		headingstyle: setext
```

### doublereturns

Choose to allow or disallow two (or more) subsequent empty new lines.

```
fields:
	richtext:
		label: Text
		type:  wysiwyg
		doublereturns: false
```

### firstheader

Choose the heading priority to use as Heading 1 (H1 in the editor toolbar). This can be any HTML heading tag priority (possible values are `h1` to `h6`).

```
fields:
	richtext:
		label: Text
		type:  wysiwyg
		firstheader: h2
```

### secondheader

Choose the heading priority to use as Heading 2 (H2 in the editor toolbar). This can be any HTML heading tag priority (possible values are `h1` to `h6`) though you should obviously choose a value lower then your *firstheader* setting.

```
fields:
	richtext:
		label: Text
		type:  wysiwyg
		secondheader: h3
```
