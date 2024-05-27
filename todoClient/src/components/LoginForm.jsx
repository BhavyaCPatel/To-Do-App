import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const toast = useRef(null);
    const navigate = useNavigate();

    const [value, setValue] = useState({
        username: '',
        email: '',
        password: ''
    });

    const header = (
        <h2 className='text-center'>Login</h2>
    );
    
    const submit = async () => {
        try {
            const response = await axios.post('http://localhost:4000/user/login', {
                username: value.username,
                password: value.password
            });

            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('username', value.username);

            console.log(localStorage);

            setValue({
                username: '',
                email: '',
                password: ''
            });
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'User logged in successfully', life: 2000 });
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'User not found', life: 4000 });
            } else if (error.response && error.response.status === 401) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Invalid username or password', life: 4000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Try After Sometime', life: 4000 });
                console.log(error);
            }
        }
    }

    const footer = (
        <>
            <Button label="Login" icon="pi pi-check-circle" className='mb-3 bg-green-500 border-green-500 custom-button' onClick={submit} />
            <div>
                <p className='text-white'>Don&apos;t have an account? <Link to="/signup" className='text-blue-500'>Sign Up</Link></p>
            </div>
        </>
    );

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.id]: e.target.value
        });
    }

    return (
        <div className="card flex justify-content-center text-center bg-transparent m-7">
            <Card footer={footer} header={header} className="md:w-25rem text-white blur-background">
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput">
                    <FloatLabel>
                        <InputText id="username" value={value.username} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="username">Username</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput">
                    <FloatLabel>
                        <InputText id="password" value={value.password} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="password">Password</label>
                    </FloatLabel>
                </div>
            </Card>
            <Toast ref={toast} />
        </div>
    )
}
