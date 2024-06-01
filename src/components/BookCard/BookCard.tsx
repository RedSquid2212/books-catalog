import {Button, Card} from 'antd';
import {Book} from '../../types/book';

export function BookCard({book}: {book: Book}) {
    return (
        <Card
            type={'inner'}
            title={book.title}
            style={{marginBottom: '15px'}}
            extra={<Button type={'primary'} danger>Удалить</Button>}
        >
            <p>Авторы: {book.authors.join(', ')}</p>
            <p>Год издания: {book.year}</p>
            <p>Рейтинг: {book.rating}</p>
            <p>ISBN: {book.ISBN}</p>
        </Card>
    );
}