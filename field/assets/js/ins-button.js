var InsButton = MediumEditor.extensions.button.extend({
  name: 'ins',

  tagNames: ['INS'], // nodeName which indicates the button should be 'active' when isAlreadyApplied() is called
  contentDefault: '<b>+</b>', // default innerHTML of the button
  contentFA: '<i class="fa fa-plus"></i>', // innerHTML of button when 'fontawesome' is being used
  aria: 'Inserted', // used as both aria-label and title attributes
  action: 'ins', // used as the data-action attribute of the button

  init: function () {
    MediumEditor.extensions.button.prototype.init.call(this);

    this.classApplier = rangy.createClassApplier('ins', {
      elementTagName: 'ins',
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
