var MarkButton = MediumEditor.extensions.button.extend({
  name: 'mark',

  tagNames: ['mark'], // nodeName which indicates the button should be 'active' when isAlreadyApplied() is called
  contentDefault: '<b>H</b>', // default innerHTML of the button
  contentFA: '<i class="fa fa-paint-brush"></i>', // innerHTML of button when 'fontawesome' is being used
  aria: 'Hightlight', // used as both aria-label and title attributes
  action: 'mark', // used as the data-action attribute of the button

  init: function () {
    MediumEditor.extensions.button.prototype.init.call(this);

    this.classApplier = rangy.createClassApplier('mark', {
      elementTagName: 'mark',
      normalize: true
    });
  },

  handleClick: function (event) {
    event.preventDefault();
    event.stopPropagation();

    this.classApplier.toggleSelection();
    this.base.checkContentChanged();
    this.button.classList.toggle('medium-editor-button-active');
  },
});
