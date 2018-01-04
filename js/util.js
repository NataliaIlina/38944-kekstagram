'use strict';
// модуль с утилитными функциями

(function () {
  var SUCCESS_COLOR = 'springgreen';
  var ERROR_COLOR = 'tomato';
  var INTERVAL = 500;
  var currentTimeout;

  /**
   * debounce - устанавливает setTimeout для заданной функции, устраняя слишком частые ее вызовы
   *
   * @param {function} action
   */
  function debounce(action) {
    if (currentTimeout) {
      window.clearTimeout(currentTimeout);
    }
    currentTimeout = window.setTimeout(action, INTERVAL);
  }

  function createPopup(message, backgroundColor) {
    var popup = document.createElement('div');
    popup.classList.add('popup');
    popup.style.background = backgroundColor;
    popup.textContent = message;
    document.body.insertAdjacentElement('afterbegin', popup);
    // события для закрытия попапа
    document.addEventListener('click', onPageClick);
    document.addEventListener('keydown', onPageEscPress);

    function onPageClick(evt) {
      evt.preventDefault();
      closePopup();
    }

    function onPageEscPress(evt) {
      evt.preventDefault();
      window.handlers.isEscPressed(evt, closePopup);
    }

    function closePopup() {
      popup.remove();
      document.removeEventListener('click', onPageClick);
      document.removeEventListener('keydown', onPageEscPress);
    }
  }

  function renderSuccessPopup() {
    createPopup('Данные отправлены успешно!', SUCCESS_COLOR);
  }

  function renderErrorPopup(message) {
    createPopup(message, ERROR_COLOR);
  }

  window.util = {
    renderSuccessPopup: renderSuccessPopup,
    renderErrorPopup: renderErrorPopup,
    debounce: debounce
  };
})();

