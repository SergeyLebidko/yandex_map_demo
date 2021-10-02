import React, {useRef} from 'react';
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
            <input ref={inputRef}/>
            <button onClick={searchButtonClickHandler}>Найти координаты</button>
        </div>
    );
}

export default SearchBlock;