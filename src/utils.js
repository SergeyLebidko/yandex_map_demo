import {MAP_APP_KEY} from './settings';

export async function loadMap() {
    return new Promise((resolve, reject) => {
        if (window.ymaps) {
            resolve(window.ymaps);
        } else {
            const src = `https://api-maps.yandex.ru/2.1/?apikey=${MAP_APP_KEY}&lang=ru_RU`;
            const mapScript = document.createElement('script');
            mapScript.src = src;
            mapScript.async = true;
            mapScript.onload = () => window.ymaps.ready(() => resolve(window.ymaps));
            mapScript.onerror = err => reject(err);
            document.body.appendChild(mapScript);
        }
    });
}

export function createRandomString(size = 8) {
    const letters = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';
    const result = [];
    for (let index = 0; index < size; index++) result.push(letters[Math.floor(Math.random() * letters.length)]);
    return result.join('');
}
