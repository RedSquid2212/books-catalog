import {Book} from '../../types/book';
import {BookCard} from '../BookCard/BookCard';

export function BookCardList({books}: {books: Book[]}) {
    return (
        <>
            {books.map(book => <BookCard book={book} key={book.title}/>)}
        </>
    );
}