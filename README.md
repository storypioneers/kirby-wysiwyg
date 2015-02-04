# Kirby Medium Editor

This additional panel field, called `medium` allows you to use a medium.com like WYSIWYG editor in the Panel.

## Installation


## Usage


## Options

* **field.medium.header-style**: Define your preferred heading style. Choose between `setext` (underlined) or `atx` (# Heading 1 and ## Heading 2). Please note that this only affects H1 and H2 headings. All headings of lower priority will always use the ATX style.

## Known Issues

**Panel Keyboard Shortcuts**

Right now, the panels keyboard shortcuts (*f* to upload a file, *g* for global search) interfere with the Medium Editor Field. Of course, the execution of the shortcuts will be omitted when you (= the user) have you focus on an input element, like `<input>`, `<textarea>`, etc. However, the Medium Editor Field uses a brand new HTML5 technology called "contenteditable" elements so you don't write your content inside one of those known `<input>` elements and the panel doesn't know it should not fire the shortcut actions.

We already submitted a bug report to the makes of Kirby and hopefully, this issue will be fixed with the next update. **But in the meantime, there's a quick fix to make the Medium Editor Field work as expected**:

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
