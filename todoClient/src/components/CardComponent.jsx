import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types';

const CardComponent = ({ data, onTrashButtonClick }) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const createdAt = new Date(data.createdAt).toLocaleString('en-US', options);
    const updatedAt = new Date(data.updatedAt).toLocaleString('en-US', options);
    const dueDate = new Date(data.dueDate).toLocaleString('en-US', options);

    const handleTrashButtonClick = () => {
        onTrashButtonClick(data._id, data.completed);
    };

    const header = (
        <h2 className='text-3xl py-2 px-3 mb-0'>{data.title}</h2>
    );

    const footer = (
        <div className="flex align-items-center">
            <Button icon="pi pi-pen-to-square" className='bg-transparent text-green-600 border-0 custom-button' />
            <Button icon="pi pi-trash" className='bg-transparent text-red-600 border-0 custom-button' onClick={handleTrashButtonClick} />
        </div>
    );

    return (
        <div className="content card flex justify-content-center p-4">
            <Card footer={footer} header={header} className="md:w-25rem pt-0">
                <p className='px-1 py-1 mt-0 italic' style={{fontSize: 'small'}}>{dueDate}</p>
                <p className="m-0 text-xl font-medium">
                    {data.description}
                </p>
                <div className="flex pt-4 italic" style={{fontSize: 'small'}}>
                    <p className='px-1 flex-auto m-0'>{createdAt}</p>
                    <p className='px-1 m-0'>{updatedAt}</p>
                </div>
            </Card>
        </div>
    );
};

CardComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onTrashButtonClick: PropTypes.func.isRequired,
};

export default CardComponent;
