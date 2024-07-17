"use client";

import React, { ChangeEvent, useState } from 'react';
import "../LoginForm/_LoginForm.scss";
import fetchApi from '@/utils/fetchApi';
import { useRouter } from 'next/navigation'

interface IformData {
    name: string;
    password: string;
}

const LoginForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<IformData>({
        name: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const nameInput = event.target.name;
        const userText = event.target.value;
        setFormData(prevState => ({
            ...prevState,
            [nameInput]: userText
        }));
    };

    const submitForm = async () => {
        try {
            await fetchApi('/user/login', 'POST', formData);
            setFormData({
                name: '',
                password: '',
            });
            router.push('/');
        } catch (error: any) {
            console.error(error);
            setErrorMessage('Une erreur est survenue, veuillez réessayer plus tard');
        }
    };

    return (
        <div className='loginForm'>
            <div className="loginFormModal">
                <h1>Login</h1>
                <div className="formInputLogin">
                    <label>Name</label>
                    <input type="text" name='name' onChange={handleChange} required />
                    <label>Password</label>
                    <input type="password" name='password' onChange={handleChange} required />
                    <p>{errorMessage}</p>
                    <button onClick={submitForm}>Se connecter</button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
