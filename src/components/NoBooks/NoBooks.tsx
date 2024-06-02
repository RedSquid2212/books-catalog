import {SmileOutlined} from '@ant-design/icons';

export function NoBooks() {
    return (
        <div style={{ textAlign: 'center', color: '#bfbfbf', fontSize: 20}}>
            <SmileOutlined style={{ fontSize: 20 }} />
            <p>Пока что книг нет... Попробуйте добавить книгу, нажав на кнопку ниже</p>
        </div>
    );
}
