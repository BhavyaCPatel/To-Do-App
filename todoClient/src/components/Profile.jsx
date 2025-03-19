import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import axios from 'axios';
import { Toast } from 'primereact/toast';

export default function Profile() {
    const toast = useRef(null);

    const [userData, setUserData] = useState({
        username: '',
        email: ''
    });

    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            // const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:5000/user/details/`, {
                headers: {
                    authorization: token
                }
            });
            setUserData(response.data.user);
        } catch (error) {
            console.error('Error fetching user data:', error);  // Detailed error log
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch user data', life: 3000 });
        }
    };


    const header = (
        <h2 className='text-center'>Profile</h2>
    );

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId')
            await axios.put(`http://localhost:5000/user/profile/`, {
                username: userData.username,
                email: userData.email
            }, {
                headers: {
                    authorization: token
                }
            });
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully', life: 2000 });
            setEditMode(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update profile', life: 3000 });
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    return (
        <div className="card flex justify-content-center text-center bg-transparent m-7">
            <Card header={header} className="md:w-25rem text-white blur-background pt-0">
                <div className="p-3 pt-0">
                    <div className="flex flex-wrap align-items-center mb-3 p-4 gap-2 fieldInput ">
                        <FloatLabel>
                            <InputText id="username" value={userData.username} onChange={handleChange} disabled={!editMode} className='bg-transparent text-white' />
                            <label htmlFor="username">Username</label>
                        </FloatLabel>
                    </div>
                    <div className="flex flex-wrap align-items-center mb-3 gap-2 fieldInput ">
                        <FloatLabel>
                            <InputText id="email" value={userData.email} onChange={handleChange} disabled={!editMode} className='bg-transparent text-white' />
                            <label htmlFor="email">Email</label>
                        </FloatLabel>
                    </div>
                    {!editMode ? (
                        <Button label="Edit" icon="pi pi-pencil" className='mb-3 bg-green-500 border-green-500 custom-button' onClick={handleEditClick} />
                    ) : (
                        <div>
                            <Button label="Save" icon="pi pi-check" className='mb-3 mx-1 bg-blue-500 border-blue-500 custom-button' onClick={handleSaveClick} />
                            <Button label="Cancel" icon="pi pi-times" className='mb-3 mx-1 bg-red-500 border-red-500 custom-button ' onClick={() => setEditMode(false)} />
                        </div>
                    )}
                </div>
            </Card>
            <Toast ref={toast} />
        </div>
    );
}
