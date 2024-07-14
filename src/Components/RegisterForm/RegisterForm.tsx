'use client'
import React, { ChangeEvent, useState } from 'react';
import "../RegisterForm/_RegisterForm.scss";
import fetchApi from '@/utils/fetchApi'

interface IformData {
    name: string;
    password: string;
}

const RegisterForm = () => {

    const [ formData, setFormData ] = useState<IformData>({
        name: "",
        password: ""
    })
    const [errorMessage, setErrorMessage] = useState('')

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
            await fetchApi('/user/','POST', formData)
            setFormData({
                    name: '',
                    password: '',
                })
        } catch (error: any) {
            console.error(error);
            setErrorMessage('Une erreur est survenue, veuillez réessayer plus tard');
        }
    }

    return (
        <div className='registerForm'>
            <div className="registerFormModal">
                <h1>Register</h1>
                <div className="formInputRegister">
                    <label >Name</label>
                    <input type="text" name='name' onChange={handleChange} required/>
                    <label >Password</label>
                    <input type="password" name='password' onChange={handleChange} required/>
                    <p>{errorMessage}</p>
                    <button onClick={submitForm}>S'inscrire</button>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;