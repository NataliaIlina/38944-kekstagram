'use strict';
// генерирует и сортирует фотографии

(function () {
  var filter = document.querySelector('.filters');
  var randomFilter = document.querySelector('.filters-item:last-child');
  var pictureTemplate = document.querySelector('#picture-template').content.querySelector('.picture');
  var dataPhotos;
  var pictures = [];

  // загружаем информацию с сервера и показываем фотографии при успешной загрузке
  window.backend.load(showPhotos, window.util.renderErrorPopup);

  // при смене значения фильтра обновляем фотографии
  filter.addEventListener('change', function () {
    window.util.debounce(updatePhotos);
  });

  // при клике на кнопку "случайные" обновляем картинки
  randomFilter.addEventListener('click', function () {
    window.util.debounce(updatePhotos);
  });

  /**
   * showPhotos - сохраняет полученные данные в переменную и отрисовывает фотографии
   *
   * @param {Array} data
   */
  function showPhotos(data) {
    dataPhotos = data;
    renderPictures(data);
  }

  /**
   * updatePhotos - получает текущее значение фильтра и в зависимости от него выполняет сортировку и отрисовку фотографий
   *
   */
  function updatePhotos() {
    // текущее значение фильтра
    var currentValue = filter.querySelector('.filters-radio:checked').value;
    // удаляем все отрисованные фотографии
    pictures.forEach(function (item) {
      item.remove();
    });
    // копируем массив в новую переменную
    var photos = dataPhotos.slice(0);
    // сортируем массив в зависимости от выбранного значения
    var popularPhotos = photos.sort(function (a, b) {
      return b.likes - a.likes;
    });
    var discussedPhotos = photos.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    var randomPhotos = photos.sort(function () {
      return Math.random() - 0.5;
    });
    // значение фильтра и результат сортировки объединяем в объект
    var result = {
      'recommend': photos,
      'popular': popularPhotos,
      'discussed': discussedPhotos,
      'random': randomPhotos
    };
    // вызываем функцию отрисовки фотографий с полученным значением
    renderPictures(result[currentValue]);
  }


  /**
   * renderPictures - показывает фото, отрисованные с данных массива
   *
   * @param {Array} photos массив данных
   */
  function renderPictures(photos) {
    // создаем фрагмент
    var fragment = document.createDocumentFragment();
    // для каждого элемента массива создаем HTML-элемент и добавляем его во фрагмент
    photos.forEach(function (photo) {
      fragment.appendChild(createPictureElement(pictureTemplate, photo));
    });
    // фрагмент вставляем в блок-контейнер
    document.querySelector('.pictures').appendChild(fragment);
    // показываем фильтры
    filter.classList.remove('filters-inactive');
  }

  /**
   * createPictureElement - создает копию элемента по шаблону
   *
   * @param  {Node} template шаблон
   * @param  {Object} photo объект со значениями свойств элемента
   * @return {Object} копия элемента
   */
  function createPictureElement(template, photo) {
    // копируем шаблон
    var clone = template.cloneNode(true);
    var image = clone.querySelector('a img');
    var likes = clone.querySelector('.picture-likes');
    var comments = clone.querySelector('.picture-comments');
    // заполняем данными
    fillAttributes(image, likes, comments, photo);
    // задаем обработчик клика
    clone.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.preview.show(photo);
    });
    // добавляем элемент в массив фотографий
    pictures.push(clone);
    return clone;
  }

  /**
   * fillElementAttributes - заполняет данными свойства/атрибуты элементов
   *
   * @param  {Object} img элемент фотографии
   * @param  {Object} likes элемент лайков
   * @param  {Object} comments элемент комментариев
   * @param  {Object} photo объект с данными
   */
  function fillAttributes(img, likes, comments, photo) {
    img.setAttribute('src', photo.url);
    likes.textContent = photo.likes;
    comments.textContent = photo.comments.length;
  }

  window.gallery = {
    fill: fillAttributes
  };
})();

