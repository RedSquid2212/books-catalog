import {Collapse, CollapseProps} from 'antd';
import {books} from "../../mocks/booksMock";
import {BookCardList} from '../BookCardList/BookCardList';

export function YearGroup() {
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: '2021',
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