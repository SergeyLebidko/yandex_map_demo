import React from 'react';
import YandexMap from '../YandexMap/YandexMap';
import './App.scss';

function App() {
    return (
        <div className="app">
            <h1>Компонент карты:</h1>
            <YandexMap idSuffix="1"/>
        </div>
    );
}

export default App;
