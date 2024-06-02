import {Button, DatePicker, Form, Input, InputNumber, Modal} from 'antd';
import React, {useState} from 'react';
import { setDoc, doc } from 'firebase/firestore';
import {db} from '../../firebase/firebaseConfig';
import {Book} from '../../types/book';
import dayjs from 'dayjs';
import {DeleteOutlined} from '@ant-design/icons';
import {uid} from '../../utils/uidGenerator';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';

interface AddBookModalProps {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>
}

type ValidationStatus = 'success' | 'error';

export function AddBookModal({isOpen, setIsOpen, setAllBooks}: AddBookModalProps) {
    const titleError = 'Введите название книги';
    const authorsError = 'Добавьте хотя бы одного автора';
    const isbnError = 'Введен невалидный ISBN';

    const [form] = Form.useForm<Book>();
    const [errorMsg, setErrorMsg] = useState('');
    const [validationStatus, setValidationStatus] = useState<ValidationStatus>('success');
    const {xs} = useBreakpoint();

    const validateISBN = (isbn: string) => {
        isbn = isbn.replace(/[- ]/g, '');

        if (isbn.length !== 10 && isbn.length !== 13) {
            return false;
        }

        if (isbn.length === 10) {
            let sum = 0;
            for (let i = 0; i < 9; i++) {
                sum += parseInt(isbn[i]) * (10 - i);
            }
            const checkDigit = isbn[9] === 'X' ? 10 : parseInt(isbn[9]);
            return (sum % 11) === checkDigit;
        }

        if (isbn.length === 13) {
            let sum = 0;
            for (let i = 0; i < 12; i++) {
                sum += (i % 2 === 0 ? 1 : 3) * parseInt(isbn[i]);
            }
            return (10 - (sum % 10)) % 10 === parseInt(isbn[12]);
        }

        return false;
    };

    const handleValidation = (title: string, authors: string[], ISBN?: string) => {
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

        if (ISBN && !validateISBN(ISBN)) {
            setErrorMsg(isbnError);
            setValidationStatus('error');
            return false;
        }

        return true;
    };

    const handleOk = async () => {
        const {title, authors, rating, ISBN} = form.getFieldsValue();
        const year = form.getFieldValue('year');

        if (!handleValidation(title, authors, ISBN)) {
            return;
        }

        const newBook: Book = {
            id: uid(),
            title,
            authors: authors.filter(author => author),
            year: year ? dayjs(year).year() : -1,
            rating: rating ?? 0,
            ISBN: ISBN ?? ''
        };

        try {
            await setDoc(doc(db, 'books', newBook.id), newBook);
            setAllBooks((prevState) => [...prevState, newBook]);
            setIsOpen(false);
        } catch (err) {
            console.log(err);
        }
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
                                    style={{marginLeft: index !== 0 && !xs ? 60 : 0, marginBottom: 0}}
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
                    <InputNumber controls={false} min={0} max={10}/>
                </Form.Item>
                <Form.Item
                    name={'ISBN'}
                    label={'ISBN'}
                    help={errorMsg === isbnError ? errorMsg : ''}
                    validateStatus={errorMsg === isbnError ? validationStatus : 'success'}
                >
                    <Input type={'text'} onChange={handleFieldChange}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}
