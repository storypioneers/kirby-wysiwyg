# Kirby WYSIWYG Editor

This additional panel field for [Kirby 2](http://getkirby.com) allows you to use a medium.com like WYSIWYG editor in the Panel.

**Version**: 1.0.0  
**Requires**: [@daviferreira/medium-editor](https://github.com/daviferreira/medium-editor)  
**Authors**: [@storypioneers/kirby](https://github.com/orgs/storypioneers/teams/kirby)  
**License**: [GNU GPL v3.0](http://opensource.org/licenses/GPL-3.0)  

![screenshot](https://raw.github.com/storypioneers/kirby-wysiwyg/master/screenshot.png)

## Installation

1. If not already exists, add a 'fields' folder to your `site/panel` folder and copy or link the entire 'medium' field folder there. Your structure should look like this: 

	site
		fields
			medium
				assests
				vendor
				medium.php

2. *Optional: Set some configuration options for Kirby WYSIWYG Editor in your sites `config.php` file. You can get an overview of all available options further down.*

## Usage

As soon as you dropped the tags field into your panel folder you can use it in your blueprints: replace the `textarea` fields with `medium` field (where applicable).

	fields:
		richtext: 
			label: Text
			type:  medium

## Options

The Kirby Media Field has some global options that you might want to use to alter the fields functionality to suit your specific needs. Below you'll find a list of all available options which can be set from your projects global `config.php` file.

* **field.medium.buttons**: Define a list of buttons to display in the editor toolbar. Currently supported button types are: `header1`, `header2`, `bold`, `italic`, `anchor`, `quote`, `unorderedlist`, `orderedlist`, `subscript`, `superscript`, `del`, `ins` and `mark`. Please note that the order in which you list the button names relates to the display order in the toolbar.

* **field.medium.header-style**: Define your preferred heading style. Choose between `setext` (underlined) or `atx` (# Heading 1 and ## Heading 2). Please note that this only affects H1 and H2 headings. All headings of lower priority will always use the ATX style.

## Known Issues

**Panel Keyboard Shortcuts**

Right now, the panels keyboard shortcuts (*f* to upload a file, *g* for global search) interfere with the Medium Editor Field. Of course, the execution of the shortcuts will be omitted when you (= the user) have an input element, like `<input>`, `<textarea>`, etc focussed. However, the Medium Editor Field uses a brand new HTML5 technology called "contenteditable" elements. This way, you don't write your content inside one of those known `<input>` elements and the panel doesn't know it should not fire the shortcut actions.

We already submitted a [bug report](https://github.com/getkirby/panel/issues/347) and a [pull request](https://github.com/getkirby/panel/pull/353) to the makers of Kirby and hopefully, this issue will be fixed with the next update. **But in the meantime, there's a quick fix to make the Medium Editor Field work as expected**:

* Navigate to the panel js directory of your Kirby setup (`<project>/panel/assets/js/`).
* Open the panel main js resource file `panel.js`.
* Find this `if` statement beginning in line 80:
```js
// Don't fire in text-accepting inputs that we didn't directly bind to
if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
  ( jQuery.hotkeys.options.filterTextInputs &&
    jQuery.inArray(event.target.type, jQuery.hotkeys.textAcceptingInputTypes) > -1 ) ) ) {
  return;
}
```
* Change it to this:
```js
// Don't fire in text-accepting inputs that we didn't directly bind to
if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
  ($(event.target).prop('contenteditable') == 'true' ) ||
  ( jQuery.hotkeys.options.filterTextInputs &&
    jQuery.inArray(event.target.type, jQuery.hotkeys.textAcceptingInputTypes) > -1 ) ) ) {
  return;
}
```
* **That's it!** You should now be able to use the Medium Editor Field without being bugged by wild shortcuts.
