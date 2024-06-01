import {Collapse, CollapseProps} from 'antd';
import {BookCardList} from '../BookCardList/BookCardList';
import {Book} from '../../types/book';

export function YearGroup({year, books}: {year: number, books: Book[]}) {
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: year,
            children: <BookCardList books={books} />
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