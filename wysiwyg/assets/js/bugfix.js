/*!
 * jQuery Hotkeys Plugin BUGFIX
 *
 * SITUATION: The version of the JQuery Hotfix Plugin used in Kirby Panel does
 * not work as expected with modern "contenteditable" HTML elements. Even though
 * the hotkey event execution will be prevented while a common input element is
 * focussed it will still trigger hotkey events when typing inside a
 * "contenteditable" element.
 *
 * SOLUTION: As a quick bugfix we'll go ahead and overwrite the hotkey event
 * handler with a modified version that checks for "contenteditable" elements
 * here. Even though this solution is quite hacky, there is no other way other
 * then having the users to edit the panel core JS resources themself.
 *
 * FUTURE: This fix will be removed, as soon as the panel bundles a later
 * version of the jQuery Hotfix Plugin which will hopefully make this hack
 * unnecessary.
 */

(function(jQuery){

    function fixedKeyHandler(handleObj) {

        if(typeof handleObj.data === "string") {
            handleObj.data = {
                keys: handleObj.data
            };
        }

        // Only care when a possible input has been specified
        if(!handleObj.data || !handleObj.data.keys || typeof handleObj.data.keys !== "string") {
            return;
        }

        var origHandler = handleObj.handler,
            keys = handleObj.data.keys.toLowerCase().split(" ");

        handleObj.handler = function(event) {

            // Don't fire in text-accepting inputs that we didn't directly bind to
            if(this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
               ($(event.target).prop('contenteditable') == 'true' ) ||
               ( jQuery.hotkeys.options.filterTextInputs &&
                jQuery.inArray(event.target.type, jQuery.hotkeys.textAcceptingInputTypes) > -1))) {
                return;
            }

            var special = jQuery.hotkeys.specialKeys[ event.keyCode ],
                character = String.fromCharCode(event.which).toLowerCase(),
                modif = "",
                possible = {};

            jQuery.each([ "alt", "ctrl", "meta", "shift" ], function(index, specialKey) {
                if(event[specialKey + 'Key'] && special !== specialKey) {
                    modif += specialKey + '+';
                }
            });


            modif = modif.replace('alt+ctrl+meta+shift', 'hyper');

            if(special) {
                possible[modif + special] = true;
            }

            if(character) {
                possible[modif + character] = true;
                possible[modif + jQuery.hotkeys.shiftNums[character]] = true;

                // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
                if(modif === "shift+") {
                    possible[jQuery.hotkeys.shiftNums[character]] = true;
                }
            }

            for(var i = 0, l = keys.length; i < l; i++) {
                if(possible[keys[i]]) {
                    return origHandler.apply( this, arguments );
                }
            }
        };
    }

    jQuery.each(["keydown", "keyup", "keypress"], function() {
        jQuery.event.special[this] = {
            add: fixedKeyHandler
        };
    });

})(this.jQuery);
