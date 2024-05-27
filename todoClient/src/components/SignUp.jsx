
import { useState, useRef  } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Link, useNavigate } from 'react-router-dom';
export default function SignUp() {

    const toast = useRef(null);
    const navigate = useNavigate();

    const [value, setValue] = useState({
        username: '',
        email: '',
        password: ''
    });

    const header = (
        <h2 className='text-center'>Sign-Up</h2>
    );
    
    const submit = async() => {
        try {
            const response = await axios({
                method: 'post',
                url: 'http://localhost:4000/user/signup',
                data: {
                    username: value.username,
                    email: value.email,
                    password: value.password
                }
            });
            console.log(response)
            setValue({
                username: '',
                email: '',
                password: ''
            });
            toast.current.show({severity:'success', summary: 'Success', detail: 'User signed up successfully', life: 4000});
            setTimeout(() => {
                navigate('/login');
            }, 4000);
        } catch (error) {
            if (error.response && error.response.data.message === 'User already exists') {
                toast.current.show({severity:'error', summary: 'Error', detail: 'User already exists', life: 4000});
            } else {
                toast.current.show({severity:'error', summary: 'Error', detail: 'Sign up failed', life: 4000});
            }
        }
    }

    const footer = (
        <>
            <Button label="Sign-Up" icon="pi pi-sign-in" className='mb-3 bg-green-500 border-green-500 custom-button' onClick={submit} />
            <div>
                <p className='text-white'>Already have an account? <Link to="/login" className='text-blue-500'>Login</Link></p>
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
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="email" value={value.email} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="email">Email</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="username" value={value.username} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="username">Username</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center p-3 gap-2 fieldInput ">
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
