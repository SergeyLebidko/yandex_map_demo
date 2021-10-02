import React from 'react';
import {POINT_STATUS_TITLE} from '../../settings';
import './Point.scss';

function Point({point, clickHandler, removeHandler}) {

    const removeButtonClickHandler = event => {
        event.stopPropagation();
        removeHandler(point);
    }

    return (
        <li className="point" onClick={() => clickHandler(point)}>
            <span>{point.name}</span>
            <span className="point__status">{POINT_STATUS_TITLE[point.mapStatus]}</span>
            <button className="point__remove_button" onClick={removeButtonClickHandler}>Удалить</button>
        </li>
    );
}

export default Point;