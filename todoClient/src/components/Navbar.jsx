import { TabMenu } from 'primereact/tabmenu';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const navigate = useNavigate();

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => {navigate('/')}
        },
        {
            label: 'Todos',
            icon: 'pi pi-list-check',
            command: () => {navigate('/create')}
        },
        {
            label: 'Trash',
            icon: 'pi pi-trash',
            command: () => {navigate('/trash')}
        },
        {
            label: 'User',
            icon: 'pi pi-fw pi-user',
            command: () => {navigate('/profile')}
        }
    ];

    return (
        <div className='flex justify-content-center mt-1 m-3' >
            <TabMenu className="flex align-items-center justify-content-center" model={items} />
        </div>
    )
}

export default Navbar