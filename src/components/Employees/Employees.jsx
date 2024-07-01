import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../services/Axios';
import CustomTable from '../Table/Table';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Form from '../Form/Form';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/employees');
        setEmployees(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEdit = (id) => {
    const employeeToEdit = employees.find(employee => employee.id === id);
    setEditEmployee(employeeToEdit);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/employees/${id}`);
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (err) {
      setError(err);
      console.error(`Error deleting employee with id ${id}:`, err);
    }
  };

  const handleCreate = () => {
    setEditEmployee(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditEmployee(null);
  };

  const handleSubmitForm = async (formData) => {
    try {
      if (editEmployee) {
        await axiosInstance.put(`/api/v1/employees/${editEmployee.id}`, formData);
        const updatedEmployees = employees.map(employee => {
          if (employee.id === editEmployee.id) {
            return { ...employee, ...formData };
          }
          return employee;
        });
        setEmployees(updatedEmployees);
      } else {
        const response = await axiosInstance.post('/api/v1/employees', formData);
        setEmployees([...employees, response.data]);
      }
      setShowForm(false);
      setEditEmployee(null);
    } catch (err) {
      setError(err);
      console.error('Error saving employee:', err);
    }
  };

  if (loading) {
    return <Typography variant="body2" color="text.secondary" align="center">Cargando...</Typography>;
  }

  if (error) {
    return <Typography variant="body2" color="text.secondary" align="center">Error: {error.message}</Typography>;
  }

  const columns = [
    { id: 'id', label: 'ID de Empleado' },
    { id: 'first_name', label: 'Nombre', align: 'right' },
    { id: 'last_name', label: 'Apellido', align: 'right' },
    { id: 'email', label: 'Email', align: 'right' },
    { id: 'lider', label: 'Líder', align: 'right' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="h4">Empleados</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nuevo Empleado
        </Button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '1rem' }}>
          <Form entityType="employee" fields={columns} initialData={editEmployee} onSubmit={handleSubmitForm} />
          <Button variant="outlined" onClick={handleCloseForm}>Cancelar</Button>
        </div>
      )}

      <CustomTable columns={columns} rows={employees} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Employees;
