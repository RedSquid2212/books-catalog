import {Book} from '../../types/book';
import {BookCard} from '../BookCard/BookCard';
import React from 'react';

interface BookCardListProps {
    books: Book[],
    setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>
}

export function BookCardList({books, setAllBooks}: BookCardListProps) {
    return (
        <>
            {
                books.map(book => <BookCard
                    book={book}
                    key={book.id}
                    setAllBooks={setAllBooks}
                />)
            }
        </>
    );
}