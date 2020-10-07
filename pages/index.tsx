import { useState, useEffect } from 'react';
import axios from 'axios';

import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import PhoneIcon from '@material-ui/icons/Phone';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import CloseIcon from '@material-ui/icons/Close';

import { Avatar, TextField, Button } from '@material-ui/core';

import '../src/home.less';
import {getEmail, getInitials, getPhone, storage} from "../domain/storageControl";

const initialErrors = {
    emailError: '',
    phoneError: '',
    initialsError: ''
}

export default function Home(){

    const [initials, setInitials] = useState('Фамилия Имя');
    const [email, setEmail] = useState('Укажите почту');
    const [phone, setPhone] = useState('Укажите номер');

    useEffect(() => {
        setInitials(getInitials());
        setEmail(getEmail());
        setPhone(getPhone());
    });

    const [isModify, setIsModify] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [errors, setErrors] = useState(initialErrors);

    const [initialsInput, setInitialsInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [phoneInput, setPhoneInput] = useState('');

    const changeEmail = (e) => {
        setEmailInput(e.target.value);
    }
    const changeInitials = (e) => {
        setInitialsInput(e.target.value);
    }
    const changePhone = (e) => {
        setPhoneInput(e.target.value);
    }

    const validate = (): boolean => {
        let newErrors = {...errors}
        newErrors.emailError = (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(emailInput) ? '' : 'Вы неверно указали электронную почту'
        newErrors.phoneError = (/^(\+[1-9]|[0-9]){1}[0-9]{3,14}$/).test(phoneInput) ? '': 'Вы неверно указали номер'
        newErrors.initialsError = (/^[A-Z][a-z]+\s[A-Z][a-z]+|[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/).test(initialsInput) ? '': 'Вы неверно указали имя или фамилию'

        setErrors(newErrors);

        return Object.values(newErrors).every(error => error === '')
    }

    const finishModify = () => {
        setInitialsInput('');
        setEmailInput('');
        setPhoneInput('');
        setErrors(initialErrors);
        setIsModify(false);
    }

    const openModify = () => {
        setIsModify(true);
    }

    const submit = (e) => {
        e.preventDefault();
        if (validate()){
            setConfirmModal(true)
        }
    }

    const confirmSubmit = () => {
        setInitials(initialsInput);
        setEmail(emailInput);
        setPhone(phoneInput);
        storage.store('initials', initialsInput);
        storage.store('email', emailInput);
        storage.store('phone', phoneInput);
        finishModify()
        setConfirmModal(false);
        setIsConfirmed(true);

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'x-token-access': 'random'
            }
        };

        axios.post( 'http://jsonplaceholder.typicode.com/posts', { initials, email, phone }, options)
            .then(res => console.log(res))
            .catch(err => console.log(err))

    }

    const cancelSubmit = () => {
        setConfirmModal(false);
    }

    return (
        <>
            <div className='background'/>
            <div className='container'>
                <div className='top-profile'>
                    <div className='top-profile-notification'><NotificationsOutlinedIcon/></div>
                    <div className='top-profile-divider'/>
                    <div className='top-profile-avatar'><Avatar/></div>
                    <div className='top-profile-initials'>{initials.split(' ')[0]} {initials.split(' ')[1].charAt(0)}.</div>
                </div>

                <div className='personal-profile-link'>Личный профиль</div>
                <div className='main-menu-link'>Главная/Личный профиль</div>
                <div className={'initials-container'}>
                    <Avatar className='avatar'/>
                    <div className='initials'>{initials}</div>
                    {
                    isModify ?
                        <div className='modify-btn'>
                            <div className='text' onClick={finishModify}>Закрыть</div>
                            <CloseIcon className='icon'/>
                        </div>
                        :
                        <div className='modify-btn'>
                            <div className='text' onClick={openModify}>Редактировать</div>
                            <CreateOutlinedIcon className='icon'/>
                        </div>
                    }
                </div>
                { isModify ?
                    <form className='info-modify-container' onSubmit={submit}>
                        <div className='info-modify'>
                            <div className='input-container'>
                                <PermContactCalendarIcon className='icon'/>
                                <TextField
                                    className='input'
                                    id='name'
                                    label='Фамилия и имя'
                                    placeholder='Укажите ваши фамилию и имя'
                                    variant='outlined'
                                    value={initialsInput}
                                    onChange={changeInitials}
                                    {...(errors.initialsError && {error: true, helperText: errors.initialsError})}
                                />
                            </div>
                            <div className='divider'/>
                            <div className='input-container'>
                                <AlternateEmailIcon className='icon'/>
                                <TextField
                                    className='input'
                                    id='email'
                                    label='E-mail'
                                    placeholder='Ivanova@mail.ru'
                                    variant='outlined'
                                    value={emailInput}
                                    onChange={changeEmail}
                                    {...(errors.emailError && {error: true, helperText: errors.emailError})}
                                />
                            </div>
                            <div className='divider'/>
                            <div className='input-container'>
                                <PhoneIcon className='icon'/>
                                <TextField
                                    className='input'
                                    id='phone'
                                    label='Номер телефона'
                                    placeholder='Укажите номер телефона'
                                    variant='outlined'
                                    value={phoneInput}
                                    onChange={changePhone}
                                    {...(errors.phoneError && {error: true, helperText: errors.phoneError})}
                                />
                            </div>
                        </div>
                        <div className='btn-container'>
                            <Button className='btn' type='submit'>Сохранить изменения</Button>
                        </div>
                    </form>
                    :
                    <div className='info-container'>
                        <div className='email-container'>
                            <AlternateEmailIcon className='icon'/>
                            <div className='email'>{email}</div>
                        </div>
                        <div className='divider'/>
                        <div className='phone-container'>
                            <PhoneIcon className='icon'/>
                            <div className='phone'>{phone}</div>
                        </div>
                    </div>
                }
            </div>
            {
                confirmModal &&
                <div className='confirm-modal-container'>
                    <div className='background-modal'/>
                    <div className='modal'>
                        <div className='close' onClick={cancelSubmit}>
                            <CloseIcon className='icon'/>
                        </div>
                        <div className='label'>Сохранить изменения?</div>
                        <Button className='btn-save' onClick={confirmSubmit}>Сохранить</Button>
                        <Button className='btn-cancel' variant='outlined' onClick={cancelSubmit}>Не сохранять</Button>
                    </div>
                </div>
            }
            {
                isConfirmed &&
                <div className='confirmed-modal-container'>
                    <div className='background-modal'/>
                    <div className='modal'>
                        <div className='label'>Данные успешно сохранены</div>
                        <Button className='btn-ok' onClick={() => {
                            setIsConfirmed(false);
                            setIsModify(false);
                        }}>Хорошо</Button>
                    </div>
                </div>
            }
        </>
    )

}