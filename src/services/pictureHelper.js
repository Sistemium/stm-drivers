import { supportsPictures, loadImage as nativeLoadImage } from '@/services/native';


export function imageSrc(picture, size) {

  const srcName = size === 'thumbnail' ? 'thumbnailSrc' : 'smallSrc';

  if (picture[srcName]) {
    return picture[srcName];
  }

  if (window.location.protocol === 'file:') {
    const path = size === 'thumbnail' ? 'thumbnailPath' : 'resizedImagePath';
    if (picture[path]) {
      return `../../../../pictures/${picture[path]}`;
    }
  }

  if (picture.href) {
    return picture.href.replace(/([^/]+)(\.[^.]+$)/g, (match, name, ext) => size + ext);
  }

  return null;

}

export function pictureModelMethods() {

  return {
    srcThumbnail() {
      return imageSrc(this, 'thumbnail');
    },
    srcFull() {
      return imageSrc(this, 'smallImage');
    },
  };

}

export function loadImage(img) {

  return new Promise((resolve, reject) => {

    if (supportsPictures()) {

      nativeLoadImage(img)
        .then(image => img.find(image))
        .then(() => preLoad(img, resolve, reject));

    } else {
      preLoad(img, resolve, reject);
    }

  });

}

function preLoad(img, resolve, reject) {

  const image = Object.assign(new Image(), {

    onload() {
      if (this.complete === false || this.naturalWidth === 0) {
        reject('Image load failed');
      } else {
        resolve(image);
      }
    },

    onerror: reject,
    src: img.srcFull(),

  });

}
