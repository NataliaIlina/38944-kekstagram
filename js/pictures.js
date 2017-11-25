'use strict';

var LIKES_MIN = 15;
var LIKES_MAX = 200;
var NUMBERS = createNumbersArray(1, 25);
var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var PHOTO_LENGTH = 25;

var photo = [];
var copyNumbers = NUMBERS.slice();
var copyComments = COMMENTS.slice();
var pictureElement = document.querySelector('#picture-template').content;
var fragmentElement = document.createDocumentFragment();
var pictures = document.querySelector('.pictures');
var mainPicture = document.querySelector('.gallery-overlay');
var mainPictureImage = mainPicture.querySelector('.gallery-overlay-image');
var mainPictureLikes = mainPicture.querySelector('.likes-count');
var mainPictureComments = mainPicture.querySelector('.comments-count');

// заполняем массив объектами, заполняем фрагмент шаблонами
for (var i = 0; i < PHOTO_LENGTH; i++) {
  photo[i] = createPhotoObject(copyNumbers, copyComments);
  fragmentElement.appendChild(createPictureElement(pictureElement, photo[i]));
}
// добавляем фрагмент в основной блок
pictures.appendChild(fragmentElement);
// оформляем главную картинку
mainPicture.classList.remove('hidden');
fillElementAttributes(mainPictureImage, mainPictureLikes, mainPictureComments, photo[0]);


/**
 * createNumbersArray - создает массив чисел
 *
 * @param  {number} a первый элемент массива
 * @param  {number} b последний элемент массива
 * @return {Array} массив
 */
function createNumbersArray(a, b) {
  var arr = [];
  for (a; a <= b; a++) {
    arr.push(a);
  }
  return arr;
}

/**
 * getRandomNumber - возвращает случайное число из диапазона min - max (не включая max)
 *
 * @param  {number} min минимальное число
 * @param  {number} max максимальное число
 * @return {number} случайное число
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * getRandomElement - возвращает случайный элемент массива, удаляя его из массива
 *
 * @param  {Array} arr массив
 * @return {*} случайный элемент
 */
function getRandomElement(arr) {
  var index = getRandomNumber(0, arr.length);
  return arr.splice(index, 1);
}

/**
 * createPhotoObject - создает объект, заполненный данными из массивов
 *
 * @param  {Array} numbersArr массив чисел
 * @param  {Array} stringsArr массив строк
 * @return {Object} объект с данными из массивов
 */
function createPhotoObject(numbersArr, stringsArr) {
  var obj = {};
  var index = getRandomNumber(0, stringsArr.length);
  var secondIndex = getRandomNumber(0, stringsArr.length);
  while (secondIndex === index) {
    secondIndex = getRandomNumber(0, stringsArr.length);
  }
  obj.url = 'photos/' + getRandomElement(numbersArr) + '.jpg';
  obj.likes = getRandomNumber(LIKES_MIN, LIKES_MAX);
  if (getRandomNumber(1, 3) > 1) {
    obj.comments = [stringsArr[index], stringsArr[secondIndex]];
  } else {
    obj.comments = [stringsArr[getRandomNumber(0, stringsArr.length)]];
  }
  return obj;
}

/**
 * setTextContent - устанавливает свойство элемента textContent заданным значением
 *
 * @param  {Object} elem  элемент
 * @param  {string} value значение свойства textContent
 */
function setTextContent(elem, value) {
  elem.textContent = value;
}

/**
 * setSrc - устанавливает значение атрибута src элемента
 *
 * @param  {Object} elem  элемент
 * @param  {string} value значение атрибута src
 */
function setSrc(elem, value) {
  elem.setAttribute('src', value);
}


/**
 * fillElementAttributes - заполняет данными свойства/атрибуты элементов
 *
 * @param  {Object} img элемент фотографии
 * @param  {Object} likes элемент лайков
 * @param  {Object} comments элемент комментариев
 * @param  {Object} obj объект с данными
 */
function fillElementAttributes(img, likes, comments, obj) {
  setSrc(img, obj.url);
  setTextContent(likes, obj.likes);
  setTextContent(comments, obj.comments.length);
}

/**
 * createPictureElement - создает копию элемента по шаблону
 *
 * @param  {Object} template шаблон
 * @param  {Object} obj объект со значениями свойств элемента
 * @return {Object} копия элемента
 */
function createPictureElement(template, obj) {
  var cloneElement = template.cloneNode(true);
  var cloneElementImage = cloneElement.querySelector('a img');
  var cloneElementLikes = cloneElement.querySelector('.picture-likes');
  var cloneElementComments = cloneElement.querySelector('.picture-comments');
  fillElementAttributes(cloneElementImage, cloneElementLikes, cloneElementComments, obj);
  return cloneElement;
}
