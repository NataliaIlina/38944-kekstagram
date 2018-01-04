'use strict';

(function () {
  var image = document.querySelector('.effect-image-preview');
  var scale = document.querySelector('.upload-effect-level');
  var scaleLine = scale.querySelector('.upload-effect-level-line');
  var scaleLineActive = scale.querySelector('.upload-effect-level-val');
  var scaleValue = scale.querySelector('.upload-effect-level-value');
  var pin = scale.querySelector('.upload-effect-level-pin');

  // скрываем шкалу и поле ее значения по умолчанию
  scaleValue.classList.add('hidden');
  scale.classList.add('hidden');


  // задаем обработчики dran'n'drop на бегунок
  pin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    // получаем координаты ограничения движения бегунка с его родительского элемента
    var rect = scaleLine.getBoundingClientRect();
    var minX = rect.left;
    var maxX = rect.right;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      // задаем место положение мыши в координату x
      var coordinateX = moveEvt.clientX;
      // если она меньше/больше заданного диапазона - устанавливаем ей мин/макс значение
      coordinateX = coordinateX < minX ? minX : coordinateX;
      coordinateX = coordinateX > maxX ? maxX : coordinateX;
      // получаем значение координаты x в процентах относительно родительского блока
      var percent = parseInt((coordinateX - minX) * 100 / (maxX - minX), 10);
      // передаем значение в функцию
      setAttributes(percent, changeFilter);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  });

  /**
   * setAttributes - устанавливает получаемое значение в атрибуты элементов и передает его в колбек
   *
   * @param {number} value
   * @param {function} callback
   */
  function setAttributes(value, callback) {
    pin.style.left = value + '%';
    scaleValue.value = value;
    scaleLineActive.style.width = value + '%';
    callback(value);
  }

  /**
   * changeFilter - меняет значение свойства filter элемента
   *
   * @param {number} value
   */
  function changeFilter(value) {
    // получаем значение эффекта с выбранной кнопки
    var currenEffect = document.querySelector('input[name=effect]:checked').value;
    // создаем объект значений
    var filterValue = {
      none: '',
      chrome: 'grayscale(' + value / 100 + ')',
      sepia: 'sepia(' + value / 100 + ')',
      marvin: 'invert(' + value + '%)',
      phobos: 'blur(' + value / 100 * 3 + 'px)',
      heat: 'brightness(' + value / 100 * 3 + ')'
    };
    // скрываем шкалу, если значение кнопки 'none'
    if (currenEffect === 'none') {
      scale.classList.add('hidden');
    } else {
      scale.classList.remove('hidden');
    }
    // устанавливаем значение свойства картинке
    image.style.filter = filterValue[currenEffect];
  }

  window.slider = {
    setAttributes: setAttributes,
    changeFilter: changeFilter
  };
})();

