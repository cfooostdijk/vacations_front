import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import CustomTable from '../Table/Table';
import FilterForm from '../FilterForm/FilterForm';
import Pagination from '../Pagination/Pagination';
import TitleTable from '../TitleTable/TitleTable';
import Form from '../Form/Form';
import axiosInstance from '../../services/Axios';
import { useAuth } from '../../context/AuthContext';

const Employees = () => {
  const { authToken } = useAuth();
  // console.log('Valor de authToken:', authToken);
  const [employeesData, setEmployeesData] = useState({
    employees: [],
    total_pages: 1,
    current_page: 1,
    total_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState([
    { name: 'file_number', label: 'ID Empleado', value: '' },
    { name: 'first_name', label: 'Nombre', value: '' },
    { name: 'last_name', label: 'Apellido', value: '' },
    { name: 'email', label: 'Email', value: '' },
    { name: 'lider', label: 'Líder', value: '' },
  ]);

  useEffect(() => {
    const fetchEmployees = async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        // console.log('Token de autenticación:', authToken);
        const response = await axiosInstance.get('/api/v1/employees', {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
          params: {
            page,
            ...filters.reduce((acc, filter) => {
              acc[filter.name] = filter.value;
              return acc;
            }, {}),
          }
        });
        setEmployeesData(response.data);
        setCurrentPage(response.data.current_page);
        // console.log('Respuesta del backend para empleados:', response.data);
      } catch (err) {
        setError(err);
        // console.error('Error al obtener empleados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees(currentPage);
  }, [currentPage, filters, authToken]);

  const handleEdit = (id) => {
    const employeeToEdit = employeesData.employees.find(employee => employee.id === id);
    setEditEmployee(employeeToEdit);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setEmployeesData({
        ...employeesData,
        employees: employeesData.employees.filter(employee => employee.id !== id)
      });
    } catch (err) {
      setError(err);
      // console.error(`Error al eliminar empleado con ID ${id}:`, err);
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
        await axiosInstance.put(`/api/v1/employees/${editEmployee.id}`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        const updatedEmployees = employeesData.employees.map(employee => {
          if (employee.id === editEmployee.id) {
            return { ...employee, ...formData };
          }
          return employee;
        });
        setEmployeesData({
          ...employeesData,
          employees: updatedEmployees
        });
      } else {
        const response = await axiosInstance.post('/api/v1/employees', formData, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setEmployeesData({
          ...employeesData,
          employees: [...employeesData.employees, response.data]
        });
      }
      setShowForm(false);
      setEditEmployee(null);
    } catch (err) {
      setError(err);
      // console.error('Error al guardar empleado:', err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (loading) {
    return <Typography variant="body2" color="text.secondary" align="center">Cargando...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        Error:
          {error.response.data.errors.map((errorMessage, index) => (
            <li key={index}>{errorMessage}</li>
          ))}
      </Typography>
    );
  }

  const columns = [
    { id: 'file_number', label: 'ID Empleado' },
    { id: 'first_name', label: 'Nombre', align: 'right' },
    { id: 'last_name', label: 'Apellido', align: 'right' },
    { id: 'email', label: 'Email', align: 'right' },
    { id: 'lider', label: 'Líder', align: 'right' },
  ];

  return (
    <div>
      <TitleTable title="Empleados" buttonText="Nuevo Empleado" onCreate={handleCreate} />

      <FilterForm
        filters={filters}
        onApply={applyFilters}
      />

      {showForm && (
        <div style={{ marginBottom: '1rem' }}>
          <Form
            entityType="employee"
            fields={[
              { id: 'file_number', label: 'Id Empleado' },
              { id: 'first_name', label: 'Nombre' },
              { id: 'last_name', label: 'Apellido' },
              { id: 'email', label: 'Email' },
              { id: 'lider', label: 'Líder' }
            ]}
            initialData={editEmployee}
            onSubmit={handleSubmitForm}
            onCancel={handleCloseForm}
          />
        </div>
      )}

      <CustomTable columns={columns} rows={employeesData.employees} onEdit={handleEdit} onDelete={handleDelete} showActions={true} />

      <Pagination currentPage={currentPage} totalPages={employeesData.total_pages} onPageChange={handlePageChange} />
    </div>
  );
};

export default Employees;
