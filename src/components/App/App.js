import React from 'react';
import YandexMap from '../YandexMap/YandexMap';
import './App.scss';

function App() {
    return (
        <div className="app">
            <header>Компонент карты:</header>
            <YandexMap/>
        </div>
    );
}

export default App;
