var DelButton = MediumEditor.extensions.button.extend({
  name: 'del',

  tagNames: ['DEL'], // nodeName which indicates the button should be 'active' when isAlreadyApplied() is called
  contentDefault: '<b>-</b>', // default innerHTML of the button
  contentFA: '<i class="fa fa-strikethrough"></i>', // innerHTML of button when 'fontawesome' is being used
  aria: 'Deleted', // used as both aria-label and title attributes
  action: 'del', // used as the data-action attribute of the button

  init: function () {
    MediumEditor.extensions.button.prototype.init.call(this);

    this.classApplier = rangy.createClassApplier('del', {
      elementTagName: 'del',
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
