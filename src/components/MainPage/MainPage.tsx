import {useEffect, useState} from 'react';
import {Button, Spin} from 'antd';
import {collection, getDocs} from 'firebase/firestore';
import {AddBookModal} from '../AddBookModal/AddBookModal';
import {YearGroup} from '../YearGroup/YearGroup';

import './MainPage.css';
import {BookCard} from '../BookCard/BookCard';
import {db} from '../../firebase/firebaseConfig';
import {Book, GroupedBooks} from '../../types/book';
import dayjs from 'dayjs';

export function MainPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const sortGroupsByYear = (groups: GroupedBooks[]) => {
        return groups
            .sort((first, second) => second.year - first.year);
    };

    const groupByYear = () => {
        const groupedBooks: GroupedBooks[] = [];
        allBooks.map(book => {
            const curGroup = groupedBooks
                .find(item => item.year === book.year);
            if (curGroup) {
                curGroup.books.push(book);
            } else {
                groupedBooks.push({year: book.year!, books: [book]})
            }
        });
        return sortGroupsByYear(groupedBooks);
    };

    const pickRecommendedBook = () => {
        const curYear = dayjs().year();
        const oldBooks = allBooks
            .filter(book => book.year !== -1 && curYear - book.year! >= 3);
        const maxRating = Math.max(...oldBooks.map(book => book.rating!));
        const bestBooks = oldBooks.filter(book => book.rating === maxRating);
        const randomIndex = Math.floor(Math.random() * bestBooks.length);
        return bestBooks[randomIndex];
    };

    const fetchBooks = async () => {
        await getDocs(collection(db, 'books'))
            .then((snapshot) => {
                const newData = snapshot.docs
                    .map((doc) => (
                        {...doc.data(), id: doc.id}
                    ));
                setAllBooks(newData as Book[]);
            });
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        fetchBooks();
    }, [db]);

    const groups = groupByYear();
    const recommendedBook = pickRecommendedBook();

    if (isLoading || !groups || !recommendedBook) {
        return (
            <Spin />
        );
    }

    return (
        <div className={'main-page'}>
            <h1 className={'main-header'}>Каталог книг</h1>
            <p>Рекомендуемая книга:</p>
            <BookCard book={recommendedBook} />
            {
                groups.map(group => (
                    <YearGroup year={group.year} books={group.books} key={group.year} />
                ))
            }
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