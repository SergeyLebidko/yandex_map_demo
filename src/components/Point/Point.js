import React from 'react';
import {POINT_STATUS_TITLE} from '../../settings';
import './Point.scss';

function Point({point, clickHandler}){
    return (
        <li className="point" onClick={() => clickHandler(point)}>
            <span>{point.name}</span>
            <span className="point__status">{POINT_STATUS_TITLE[point.mapStatus]}</span>
        </li>
    );
}

export default Point;