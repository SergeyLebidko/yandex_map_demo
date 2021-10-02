export const MAP_APP_KEY = 'd84a4169-1739-4ba8-a628-d3ca43063114&lang';

export const DEFAULT_ZOOM = 10;
export const DEFAULT_START_CENTER = {lat: 45.02, lon: 38.59};

export const PENDING_ADD = 'pa';    // Объект ожидает добавления на карту
export const ADDED_TO_MAP = 'atm';  // Объект добавлен на карту
export const ADDED_ERROR = 'ae';    // При добавлении объекта на карту возникла ошибка

export const POINT_STATUS_TITLE = {
    [PENDING_ADD]: 'Поиск координат...',
    [ADDED_TO_MAP]: 'Добавлен на карту',
    [ADDED_ERROR]: 'Не удалось добавить на карту'
}