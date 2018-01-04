'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  /**
   * isEnterPressed - при нажатой клавише Enter вызывает функцию
   *
   * @param {Event} evt
   * @param {function} action
   */
  function isEnterPressed(evt, action) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
    }
  }

  /**
   * isEscPressed - при нажатой клавише Esc вызывает функцию
   *
   * @param {Event} evt
   * @param {function} action
   */
  function isEscPressed(evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  }

  window.handlers = {
    isEnterPressed: isEnterPressed,
    isEscPressed: isEscPressed
  };
})();


