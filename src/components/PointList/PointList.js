import React from 'react';
import PropTypes from 'prop-types';
import Point from '../Point/Point';
import './PointList.scss';

function PointList({points, pointClickHandler, pointRemoveHandler}) {
    return (
        <ul className="point_list">
            {points.map(
                point =>
                    <Point
                        key={point.id}
                        point={point}
                        clickHandler={pointClickHandler}
                        removeHandler={pointRemoveHandler}
                    />
            )}
        </ul>
    );
}

PointList.propTypes = {
    points: PropTypes.array,
    pointClickHandler: PropTypes.func,
    pointRemoveHandler: PropTypes.func
}

export default PointList;