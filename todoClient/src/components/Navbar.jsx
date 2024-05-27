import { useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLogoutVisible, setIsLogoutVisible] = useState(false);

    const handleUserIconClick = () => {
        setIsLogoutVisible(prevState => !prevState);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => { navigate('/') }
        },
        {
            label: 'Todos',
            icon: 'pi pi-list-check',
            command: () => { navigate('/create') }
        },
        {
            label: 'Completed',
            icon: 'pi pi-check-square',
            command: () => { navigate('/completed') }
        },
        {
            label: 'User',
            icon: 'pi pi-fw pi-user',
            command: () => { navigate('/profile') }
        }
    ];

    return (
        <div className='navbar-wrapper'>
            <div className='navbar-container'>
                <TabMenu className="flex align-items-center" model={items} />
            </div>
            <div className="user-icon-container">
                <i 
                    id="userIcon" 
                    className="pi pi-user p-3 bg-white text-blue-500" 
                    style={{ fontSize: '1.25rem', borderRadius: '50%', cursor: 'pointer' }}
                    onClick={handleUserIconClick}
                ></i>
                {isLogoutVisible && (
                    <Button 
                        label="Logout" 
                        icon="pi pi-sign-out" 
                        className="p-button-danger logout-button custom-button" 
                        onClick={handleLogout} 
                    />
                )}
            </div>
        </div>
    )
}

export default Navbar;
