import {Button, Card, Modal} from 'antd';
import { doc, deleteDoc } from 'firebase/firestore';
import {Book} from '../../types/book';
import {db} from '../../firebase/firebaseConfig';
import React from 'react';

import './BookCard.css';

interface BookCardProps {
    book: Book,
    setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>
}

export function BookCard({book, setAllBooks}: BookCardProps) {
    const [modal, modalContextHolder] = Modal.useModal();
    const handleDelete = async () => {
        await modal.confirm({
            title: 'Вы хотите удалить книгу?',
            cancelText: 'Нет',
            cancelButtonProps: {type: 'primary'},
            okText: 'Да',
            okType: 'default',
            async onOk() {
                await deleteDoc(doc(db, 'books', book.id));
                setAllBooks((prevState) => prevState
                    .filter(item => item.id !== book.id));
            }
        });
    };

    return (
        <>
            <Card
                type={'inner'}
                title={book.title}
                style={{marginBottom: '15px'}}
                key={book.id}
                extra={<>
                    <Button
                        type={'primary'}
                        danger
                        onClick={handleDelete}
                    >
                        Удалить
                    </Button>
                    {modalContextHolder}
                </>}
            >
                <div className={'book-info'}>
                    <p>Авторы: {book.authors.join(', ')}</p>
                    <p>Год издания: {book.year !== -1 ? book.year : 'неизвестен'}</p>
                    <p>Рейтинг: {book.rating}</p>
                    <p>ISBN: {book.ISBN && book.ISBN.length ? book.ISBN : 'неизвестен'}</p>
                </div>
            </Card>
        </>
    );
}