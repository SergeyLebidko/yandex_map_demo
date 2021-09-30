import React, {useState, useEffect} from 'react';
import {loadMap} from '../../utils';
import './YandexMap.scss';

function YandexMap({idSuffix}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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
                <div id={`map_${idSuffix}`} className="yandex_map__map_container"/>
            }
        </div>

    );
}

export default YandexMap;