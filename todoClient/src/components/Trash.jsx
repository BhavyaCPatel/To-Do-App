import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardComponent from './CardComponent';
import { ProgressSpinner } from 'primereact/progressspinner';

const Trash = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:4000/todo/all', {
        headers: {
          authorization: ` ${token}`
        }
      });
      const completedTodos = response.data.todos.filter(todo => todo.completed);
      setData(completedTodos);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTrashButtonClick = async (id, completed) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:4000/todo/update/${id}`, { completed: !completed }, {
        headers: {
          authorization: ` ${token}`
        }
      });
      setData(prevData =>
        prevData.filter(item => item._id !== id)
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo');
    }
  };

  return (
    <div className='flex flex-col mt-5 p-3'>
      {loading ? (
        <div className="card flex justify-content-center">
          <ProgressSpinner />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : data.length === 0 ? (
        <h1>No Todos Completed</h1>
      ) : (
        data.map(item => (
          <CardComponent key={item._id} data={item} onTrashButtonClick={handleTrashButtonClick} />
        ))
      )}
    </div>
  );
};

export default Trash;
