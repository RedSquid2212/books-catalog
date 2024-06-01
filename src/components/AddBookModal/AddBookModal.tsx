import {Button, DatePicker, Form, Input, InputNumber, Modal} from 'antd';
import React, {useState} from 'react';
import { collection, addDoc } from 'firebase/firestore';
import {db} from '../../firebase/firebaseConfig';
import {Book} from '../../types/book';
import dayjs from 'dayjs';
import {DeleteOutlined} from '@ant-design/icons';

interface AddBookModalProps {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type ValidationStatus = 'success' | 'error';

export function AddBookModal({isOpen, setIsOpen}: AddBookModalProps) {
    const titleError = 'Введите название книги';
    const authorsError = 'Добавьте хотя бы одного автора';

    const [form] = Form.useForm<Book>();
    const [errorMsg, setErrorMsg] = useState('');
    const [validationStatus, setValidationStatus] = useState<ValidationStatus>('success');

    const handleValidation = (title: string, authors: string[]) => {
        if (!title) {
            setErrorMsg(titleError);
            setValidationStatus('error');
            return false;
        }
        if (!authors || !authors.some(author => author)) {
            setErrorMsg(authorsError);
            setValidationStatus('error');
            return false;
        }
        return true;
    };

    const handleOk = async () => {
        const {title, authors, rating, ISBN} = form.getFieldsValue();
        const year = form.getFieldValue('year');

        if (!handleValidation(title, authors)) {
            return;
        }

        const newBook: Book = {
            title,
            authors: authors.filter(author => author),
            year: year ? dayjs(year).year() : -1,
            rating: rating ?? 0,
            ISBN: ISBN ?? ''
        };

        try {
            await addDoc(collection(db, 'books'), newBook);
        } catch (err) {
            console.log(err);
        }

        setIsOpen(false);
    };

    const handleCancel = () => {
        setErrorMsg('');
        setValidationStatus('success');
        setIsOpen(false);
    };

    const handleFieldChange = () => {
        setErrorMsg('');
        setValidationStatus('success');
    };

    return (
        <Modal
            title={<h3>Добавить книгу</h3>}
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key={'submit'} onClick={handleOk} type={'primary'}>
                    Добавить
                </Button>
            ]}
            destroyOnClose
        >
            <Form
                form={form}
                initialValues={{'rating': 0}}
                autoComplete={'off'}
                preserve={false}
            >
                <Form.Item
                    name={'title'}
                    label={'Название книги'}
                    help={errorMsg === titleError ? errorMsg : ''}
                    validateStatus={errorMsg === titleError ? validationStatus : 'success'}
                >
                    <Input type={'text'} onChange={handleFieldChange} />
                </Form.Item>
                <Form.List
                    name={'authors'}
                >
                    {(fields, {add, remove}) => (
                        <>
                            {errorMsg === authorsError
                                && <p style={{color: 'red'}}>{errorMsg}</p>}
                            {fields.map((field, index) => (
                                <Form.Item
                                    label={index === 0 ? 'Авторы' : ''}
                                    key={field.key}
                                >
                                    <Form.Item
                                        key={field.key}
                                        name={field.name}
                                        validateStatus={(index === 0 && errorMsg === authorsError) ?
                                            validationStatus :
                                            'success'}
                                    >
                                        <Input
                                            placeholder={'Введите имя и фамилию автора'}
                                            onChange={handleFieldChange}
                                            suffix={<DeleteOutlined onClick={() => remove(field.name)}/>}
                                        />
                                    </Form.Item>
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button onClick={() => {
                                    setErrorMsg('');
                                    setValidationStatus('success');
                                    add();
                                }}>
                                    Добавить автора
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item name={'year'} label={'Год издания'}>
                    <DatePicker
                        picker={'year'}
                        placeholder={'Выберите год'}
                        disabledDate={(value) => value.isBefore(dayjs('1800-01-01'), 'year')}
                    />
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
