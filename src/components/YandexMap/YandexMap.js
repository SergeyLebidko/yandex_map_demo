import React, {useState, useEffect, useRef} from 'react';
import {loadMap} from '../../utils';
import './YandexMap.scss';

function YandexMap({idSuffix}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [coords, setCoords] = useState([]);
    const searchRef = useRef();

    useEffect(() => {
        loadMap()
            .finally(() => setLoading(false))
            .then(ymaps => {
                const myMap = new ymaps.Map(
                    `map_${idSuffix}`,
                    {
                        // Координаты центра карты.
                        // Порядок по умолчанию: «широта, долгота».
                        // Чтобы не определять координаты центра карты вручную,
                        // воспользуйтесь инструментом Определение координат.
                        center: [45.02, 38.59],
                        // Уровень масштабирования. Допустимые значения:
                        // от 0 (весь мир) до 19.
                        zoom: 10,
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
    }, []);

    const searchButtonHandler = () => {
        if (!searchRef.current) return;
        const value = searchRef.current.value.trim();
        if (!value) return;
        if (coords.some(coord => coord.name === value)) return;
        setCoords(oldCoords => [...oldCoords, {name: value}]);
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
                        <input ref={searchRef}/>
                        <button onClick={searchButtonHandler}>Найти координаты</button>
                    </div>
                    {coords.length > 0 &&
                    <ul className="yandex_map__coords_container">
                        {coords.map(coord => <li key={coord.name}>{coord.name}</li>)}
                    </ul>
                    }
                    <div id={`map_${idSuffix}`} className="yandex_map__map_container"/>
                </>
            }
        </div>
    );
}

export default YandexMap;