import {Collapse, CollapseProps} from 'antd';
import {BookCardList} from '../BookCardList/BookCardList';
import {Book} from '../../types/book';
import React from 'react';
import {uid} from '../../utils/uidGenerator';

interface YearGroupProps {
    year: number,
    books: Book[],
    setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>
}

export function YearGroup({year, books, setAllBooks}: YearGroupProps) {
    const sortedBooks = books
        .sort((first, second) => first.title.localeCompare(second.title));
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: year !== -1 ? year : 'Книги без указания года',
            children: <BookCardList books={sortedBooks} setAllBooks={setAllBooks} key={uid()}/>
        }
    ];

    return (
        <Collapse
            items={items}
            ghost
            size={'large'}
            collapsible={'header'}
        />
    );
}