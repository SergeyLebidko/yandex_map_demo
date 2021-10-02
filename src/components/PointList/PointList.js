import React from 'react';
import Point from '../Point/Point';
import './PointList.scss';

function PointList({points, pointClickHandler}) {
    return (
        <ul className="point_list">
            {points.map(point => <Point key={point.id} point={point} clickHandler={pointClickHandler}/>)}
        </ul>
    );
}

export default PointList;