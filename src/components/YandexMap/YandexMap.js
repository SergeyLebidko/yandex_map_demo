import React, {useState, useEffect, useRef} from 'react';
import {loadMap, createRandomString} from '../../utils';
import './YandexMap.scss';

const DEFAULT_ZOOM = 10;
const DEFAULT_START_CENTER = {lat: 45.02, lon: 38.59};

const PENDING_ADD = 'pa';    // Объект ожидает добавления на карту
const ADDED_TO_MAP = 'atm';  // Объект добавлен на карту
const ADDED_ERROR = 'ae';    // При добавлении объекта на карту возникла ошибка

const POINT_STATUS_TITLE = {
    [PENDING_ADD]: 'Поиск координат...',
    [ADDED_TO_MAP]: 'Добавлен на карту',
    [ADDED_ERROR]: 'Не удалось добавить на карту'
}

function YandexMap({idSuffix}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [startCenter, setStartCenter] = useState(null);
    const [points, setPoints] = useState([]);

    const ymapsRef = useRef(null);
    const myMapRef = useRef(null);
    const pointNameRef = useRef(null);

    // Подготавливаем стартовые координаты для центра карты
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => setStartCenter({lat: position.coords.latitude, lon: position.coords.longitude}),
            () => setStartCenter(DEFAULT_START_CENTER)
        );
    }, []);

    // Загружаем карту
    useEffect(() => {
        if (!startCenter) return;
        loadMap()
            .finally(() => setLoading(false))
            .then(ymaps => {
                ymapsRef.current = ymaps;
                myMapRef.current = new ymaps.Map(
                    `map_${idSuffix}`,
                    {
                        // Координаты центра карты.
                        // Порядок по умолчанию: «широта, долгота».
                        // Чтобы не определять координаты центра карты вручную,
                        // воспользуйтесь инструментом Определение координат.
                        center: [startCenter.lat, startCenter.lon],
                        // Уровень масштабирования. Допустимые значения:
                        // от 0 (весь мир) до 19.
                        zoom: DEFAULT_ZOOM,
                        controls: ['smallMapDefaultSet']
                    },
                    {
                        autoFitToViewport: 'always'
                    }
                );
            })
            .catch(err => {
                setError(true);
                console.error(`Ошибка загрузки карты: ${err}`);
            });
    }, [startCenter]);

    // Обрабатываем изменение списка точек
    useEffect(() => {
        if (points.length === 0 || !ymapsRef.current || !myMapRef.current) return;

        const replacePoint = point => setPoints(
            oldPoints => oldPoints.map(oldPoint => oldPoint.id === point.id ? point : oldPoint)
        );

        points.forEach(point => {
            if (point.mapStatus !== PENDING_ADD) return;

            const geocoder = ymapsRef.current.geocode(point.name);
            geocoder
                .then(res => {
                    const coords = res.geoObjects.get(0).geometry._coordinates;
                    const mark = new ymapsRef.current.Placemark(coords);
                    mark.events.add('click', () => rewindMapToCoords(coords));
                    myMapRef.current.geoObjects.add(mark);

                    replacePoint({...point, coords, mapStatus: ADDED_TO_MAP});
                })
                .catch(err => {
                    console.log(`Не удалось определить координаты для ${point.name} Ошибка: ${err}`);
                    replacePoint({...point, mapStatus: ADDED_ERROR})
                });
        });
    }, [points.length]);

    const searchButtonHandler = () => {
        if (!pointNameRef.current) return;
        const value = pointNameRef.current.value.trim();
        if (!value) return;
        if (points.some(point => point.name.toLowerCase() === value.toLowerCase())) return;
        setPoints(oldPoints => [...oldPoints, {
            id: createRandomString(),
            name: value,
            coords: null,
            mapStatus: PENDING_ADD
        }]);
        pointNameRef.current.value = '';
    }

    const rewindMapToCoords = coords => {
        if (!myMapRef.current || !coords) return;
        myMapRef.current.panTo(coords).then(() => myMapRef.current.setZoom(DEFAULT_ZOOM, {duration: 200}));
    }

    // В случае ошибки загрузки карты возвращаем заглушку
    if (error) return (
        <div className="yandex_map">
            <span>Не удалось загрузить карту...</span>
        </div>
    );

    return (
        <div className="yandex_map">
            {loading ?
                <span>Загружаю карту...</span>
                :
                <>
                    <div className="yandex_map__search_container">
                        <input ref={pointNameRef}/>
                        <button onClick={searchButtonHandler}>Найти координаты</button>
                    </div>
                    {points.length > 0 &&
                    <ul className="yandex_map__coords_container">
                        {points.map(
                            point =>
                                <li key={point.id} onClick={() => rewindMapToCoords(point.coords)}>
                                    <span>{point.name}</span>
                                    <span>{POINT_STATUS_TITLE[point.mapStatus]}</span>
                                </li>
                        )}
                    </ul>
                    }
                    <div id={`map_${idSuffix}`} className="yandex_map__map_container"/>
                </>
            }
        </div>
    );
}

export default YandexMap;