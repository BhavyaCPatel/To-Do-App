import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FloatLabel } from "primereact/floatlabel";
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';

export default function CreateTodo() {

    const toast = useRef(null);

    const [value, setValue] = useState({
        title: '',
        description: '',
        dueDate: ''
    });

    const header = (
        <h2 className='text-center'>Create To-Do</h2>
    );

    const submit = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post('http://localhost:4000/todo/create', {
                title: value.title,
                description: value.description,
                dueDate: value.dueDate
            }, {
                headers: {
                    authorization: `${token}`
                }
            });
    
            setValue({
                title: '',
                description: '',
                dueDate: ''
            });
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'ToDo created successfully', life: 2000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'ToDo creation failed', life: 4000 });
        }
    }

    const footer = (
        <>
            <Button label="Create" icon="pi pi-check-circle" className='mb-3 bg-green-500 border-green-500 custom-button' onClick={submit} />
        </>
    )

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
                        <InputText id="title" value={value.title} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="title">Title</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputTextarea id="description" value={value.description} onChange={handleChange} className='bg-transparent text-white' rows={3} cols={22} />
                        <label htmlFor="description">Description</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <Calendar autoResize id="dueDate" value={value.dueDate} onChange={handleChange} dateFormat="yy/mm/dd" />
                        <label htmlFor="dueDate">Due Date</label>
                    </FloatLabel>
                </div>
            </Card>
            <Toast ref={toast} />
        </div>
    )
}
