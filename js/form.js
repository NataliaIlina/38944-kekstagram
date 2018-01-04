'use strict';
// отвечает за редактирование и валидацию формы
(function () {
  var SIZE_STEP = 25;
  var SIZE_MIN = 25;
  var SIZE_MAX = 100;
  var DEFAULT_PERCENT_VALUE = 20;
  var DEFAULT_RESIZE_VALUE = 100;
  var DEFAULT_EFFECT = document.querySelector('#upload-effect-none');

  var form = document.querySelector('#upload-select-image');
  var popupInput = form.querySelector('#upload-file');
  var popupClose = form.querySelector('#upload-cancel');
  var popupPhoto = form.querySelector('.upload-overlay');
  var popupComment = form.querySelector('.upload-form-description');
  // переменные блока смены эффектов
  var effectsField = form.querySelector('.upload-effect-controls');
  var image = form.querySelector('.effect-image-preview');
  var scale = form.querySelector('.upload-effect-level');
  var effectPreviews = form.querySelectorAll('.upload-effect-preview');

  // блок смены размера
  var resizeControl = form.querySelector('.upload-resize-controls');
  var resizeField = form.querySelector('.upload-resize-controls-value');
  var sizePrev = form.querySelector('.upload-resize-controls-button-dec');
  var sizeNext = form.querySelector('.upload-resize-controls-button-inc');

  // открываем/закрываем форму редактирования фото
  popupInput.addEventListener('change', function () {
    uploadFiles(popupInput);
    popupPhoto.classList.remove('hidden');
    // ставим обработчики
    popupClose.addEventListener('click', onPopupCloseClick);
    popupClose.addEventListener('keydown', onPopupCloseEnterPress);
    document.addEventListener('keydown', onPopupEscPress);
    effectsField.addEventListener('change', onEffectFieldChange);
    resizeControl.addEventListener('click', onResizeControlClick);
    form.addEventListener('submit', onFormSubmit);
  });

  /**
   * uploadFiles - добавляет загруженные файлы в FileReader и показывает превью изображений
   *
   * @param {Node} input инпут для загрузки изображений
   */
  function uploadFiles(input) {
    // загружаем файлы
    var file = input.files[0];
    // проверка на тип файла
    if (!file.type.match(/image.*/)) {
      window.util.renderErrorPopup('Загружать можно только картинки!');
      return;
    }
    if (file) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        // адрес картинки добавляем в главную картинку и превью эффектов
        image.src = reader.result;
        Array.from(effectPreviews).forEach(function (item) {
          item.style.backgroundImage = 'url(' + reader.result + ')';
        });
      });
      reader.readAsDataURL(file);
    }
  }

  /**
   * onPopupCloseClick - обработчик события клика мыши на кнопке close
   *
   * @param {Event} evt
   */
  function onPopupCloseClick(evt) {
    evt.preventDefault();
    closePopup();
  }

  /**
   * onPopupEscPress - обработчик нажатия кнопки Esc при открытом окне редактирования фото
   *
   * @param {Event} evt
   */
  function onPopupEscPress(evt) {
    if (evt.target !== popupComment) {
      window.handlers.isEscPressed(evt, closePopup);
    }
  }

  /**
   * onPopupCloseEnterPress - обработчик события нажатия Enter при фокусе кнопки close
   *
   * @param {Event} evt
   */
  function onPopupCloseEnterPress(evt) {
    if (evt.target !== popupComment) {
      window.handlers.isEnterPressed(evt, closePopup);
    }
  }

  /**
   * onPopupEscPress - закрывает окно редактирования фото
   *
   */
  function closePopup() {
    setDefaultValues();
    popupPhoto.classList.add('hidden');
    popupClose.removeEventListener('click', onPopupCloseClick);
    popupClose.removeEventListener('keydown', onPopupCloseEnterPress);
    document.removeEventListener('keydown', onPopupEscPress);
    effectsField.removeEventListener('change', onEffectFieldChange);
    resizeControl.removeEventListener('click', onResizeControlClick);
  }

  /**
   * onEffectFieldChange - обработчик изменения поля выбора эффекта
   *
   */
  function onEffectFieldChange() {
    window.slider.setAttributes(DEFAULT_PERCENT_VALUE, window.slider.changeFilter);
  }

  /**
   * onResizeControlClick - обработчик клика на кнопки изменения размера
   *
   * @param {Event} evt
   */
  function onResizeControlClick(evt) {
    // ловим клики на кнопках, меняем значение поля
    if (evt.target === sizePrev) {
      resizeField.value = parseInt(resizeField.value, 10) - SIZE_STEP + '%';
    }
    if (evt.target === sizeNext) {
      resizeField.value = parseInt(resizeField.value, 10) + SIZE_STEP + '%';
    }
    // дизейблим кнопки при определенном значении поля
    sizeNext.disabled = parseInt(resizeField.value, 10) === SIZE_MAX ? true : false;
    sizePrev.disabled = parseInt(resizeField.value, 10) === SIZE_MIN ? true : false;
    // для картинки сразу прописываем размер
    var size = parseInt(resizeField.value, 10) / 100;
    image.style.transform = 'scale(' + size + ')';
  }

  /**
   * setDefaultValues - возвращает элементам значения по умолчанию
   *
   */
  function setDefaultValues() {
    image.style = '';
    scale.classList.add('hidden');
    resizeField.value = DEFAULT_RESIZE_VALUE + '%';
    DEFAULT_EFFECT.checked = true;
  }

  /**
   * onFormSubmit - обработчик события отправки формы, отправляет данные формы на сервер
   *
   * @param {Event} evt
   */
  function onFormSubmit(evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), window.util.renderSuccessPopup, window.util.renderErrorPopup);
    resetForm();
  }

  /**
   * resetForm - сбрысывает значения полей формы на значения по умолчанию
   *
   */
  function resetForm() {
    form.reset();
    setDefaultValues();
    closePopup();
  }
})();

