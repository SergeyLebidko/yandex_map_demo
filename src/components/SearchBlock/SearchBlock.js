import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import './SearchBlock.scss';

function SearchBlock({searchValueHandler}) {
    const inputRef = useRef();

    const searchButtonClickHandler = () => {
        if (!inputRef.current) return;
        const searchValue = inputRef.current.value.trim();
        if (!searchValue) return;

        // Если значение было обработано и успешно добавлено вышестоящим компонентом - очищаем строку поиска
        const hasAddSearchValue = searchValueHandler(searchValue);
        if (hasAddSearchValue) inputRef.current.value = '';
    }

    return (
        <div className="search_block">
            <input ref={inputRef} placeholder="Введите название населенного пункта"/>
            <button onClick={searchButtonClickHandler}>Найти координаты</button>
        </div>
    );
}

SearchBlock.propTypes = {
    searchValueHandler: PropTypes.func
}

export default SearchBlock;