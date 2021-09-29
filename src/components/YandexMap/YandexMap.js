import React, {useState, useEffect} from 'react';
import {loadMap} from '../../utils';
import './YandexMap.scss';

function YandexMap() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        loadMap()
            .then(() => {
                const myMap = new window.ymaps.Map(
                    "map",
                    {
                        // Координаты центра карты.
                        // Порядок по умолчанию: «широта, долгота».
                        // Чтобы не определять координаты центра карты вручную,
                        // воспользуйтесь инструментом Определение координат.
                        center: [45.02, 38.59],
                        // Уровень масштабирования. Допустимые значения:
                        // от 0 (весь мир) до 19.
                        zoom: 10
                    },
                    {
                        autoFitToViewport: 'always'
                    }
                );
            })
            .catch(err => {
                setError(true);
                console.error(`Ошибка загрузки карты: ${err}`);
            })
            .finally(() => setLoading(false));
    }, []);

    if (error) return <div>Не удалось загрузить карту...</div>;

    return (
        <div>
            {loading ? 'Загружаю карту' : null}
            <div id="map" className="yandex_map"/>
        </div>

    );
}

export default YandexMap;