import {Button, DatePicker, Form, Input, InputNumber, Modal} from 'antd';
import React from 'react';

interface AddBookModalProps {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddBookModal({isOpen, setIsOpen}: AddBookModalProps) {
    const [form] = Form.useForm();

    const handleOk = () => {
        setIsOpen(false);
    };

    return (
        <Modal
            title={<h3>Добавить книгу</h3>}
            open={isOpen}
            onOk={handleOk}
            onCancel={() => setIsOpen(false)}
            footer={[
                <Button key={'submit'} onClick={handleOk} type={'primary'}>
                    Добавить
                </Button>
            ]}
            destroyOnClose
        >
            <Form
                form={form}
                initialValues={{'rating': 1}}
                autoComplete={'off'}
            >
                <Form.Item name={'title'} label={'Название книги'}>
                    <Input type={'text'} />
                </Form.Item>
                <Form.Item name={'authors'} label={'Авторы книги'}>
                    <Input type={'text'}/>
                </Form.Item>
                <Form.Item name={'year'} label={'Год издания'}>
                    <DatePicker picker={'year'} placeholder={'Выберите год'}/>
                </Form.Item>
                <Form.Item name={'rating'} label={'Рейтинг'}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name={'ISBN'} label={'ISBN'}>
                    <Input type={'text'}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}
