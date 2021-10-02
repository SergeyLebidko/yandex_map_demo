import React, {useState, useEffect, useRef} from 'react';
import SearchBlock from '../SearchBlock/SearchBlock';
import {loadMap, createRandomString, createRandomColor} from '../../utils';
import {PENDING_ADD, ADDED_TO_MAP, ADDED_ERROR, DEFAULT_ZOOM, DEFAULT_START_CENTER} from '../../settings';
import './YandexMap.scss';
import PointList from "../PointList/PointList";

function YandexMap() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [startCenter, setStartCenter] = useState(null);
    const [points, setPoints] = useState([]);

    const mapContainer = useRef(null);
    const ymapsRef = useRef(null);
    const myMapRef = useRef(null);

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
                    mapContainer.current,
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
                    const mark = new ymapsRef.current.Placemark(
                        coords,
                        {},
                        {
                            preset: 'islands#icon',
                            iconColor: createRandomColor()
                        }
                    );
                    mark.events.add('click', () => rewindMapToCoords(coords));
                    myMapRef.current.geoObjects.add(mark);

                    replacePoint({...point, coords, mark, mapStatus: ADDED_TO_MAP});
                })
                .catch(err => {
                    console.log(`Не удалось определить координаты для ${point.name} Ошибка: ${err}`);
                    replacePoint({...point, mapStatus: ADDED_ERROR})
                });
        });
    }, [points.length]);

    const searchHandler = searchValue => {
        if (points.some(point => point.name.toLowerCase() === searchValue.toLowerCase())) return false;
        setPoints(oldPoints => [{
            id: createRandomString(),
            name: searchValue,
            coords: null,
            mark: null,
            mapStatus: PENDING_ADD
        }, ...oldPoints]);
    }

    // Функция, осуществляющая "перемотку" карты до нужных координат
    const rewindMapToCoords = coords => {
        if (!myMapRef.current || !coords) return;
        myMapRef.current.panTo(coords).then(() => myMapRef.current.setZoom(DEFAULT_ZOOM, {duration: 200}));
    }

    // Обработчик клика на элементе списка точек
    const pointClickHandler = point => {
        if (point.coords) rewindMapToCoords(point.coords);
    }

    // Обработчик удаления точки
    const pointRemoveHandler = point => {
        if (!myMapRef.current || !point.mark) return;
        myMapRef.current.geoObjects.remove(point.mark);
        setPoints(oldPoints => oldPoints.filter(oldPoint => oldPoint.id !== point.id));
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
                    <SearchBlock searchValueHandler={searchHandler}/>
                    {points.length > 0 &&
                    <PointList
                        points={points}
                        pointClickHandler={pointClickHandler}
                        pointRemoveHandler={pointRemoveHandler}
                    />
                    }
                    <div className="yandex_map__map_container" ref={mapContainer}/>
                </>
            }
        </div>
    );
}

export default YandexMap;