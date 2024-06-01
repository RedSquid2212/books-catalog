import {useState} from 'react';
import {Button} from 'antd';
import {AddBookModal} from '../AddBookModal/AddBookModal';
import {YearGroup} from '../YearGroup/YearGroup';

import './MainPage.css';
import {BookCard} from "../BookCard/BookCard";
import {books} from "../../mocks/booksMock";

export function MainPage() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={'main-page'}>
            <h1 className={'main-header'}>Каталог книг</h1>
            <p>Рекомендуемая книга:</p>
            <BookCard book={books[0]} />
            <YearGroup />
            <Button
                type={'primary'}
                onClick={() => setIsOpen(true)}
                className={'add-button'}
                size={'large'}
            >
                Добавить книгу
            </Button>
            <AddBookModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
}