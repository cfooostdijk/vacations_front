import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import CustomTable from '../Table/Table';
import FilterForm from '../FilterForm/FilterForm';
import Pagination from '../Pagination/Pagination';
import TitleTable from '../TitleTable';
import Form from '../Form/Form';
import axiosInstance from '../../services/Axios';
import { useAuth } from '../../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Vacations = () => {
  const { authToken } = useAuth();
  const [vacationsData, setVacationsData] = useState({
    vacations: [],
    total_pages: 1,
    current_page: 1,
    total_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editVacation, setEditVacation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState([
    { name: 'file_number', label: 'ID Empleado', value: '' },
    { name: 'vacation_start', label: 'Fecha desde', value: '' },
    { name: 'vacation_end', label: 'Fecha hasta', value: '' },
    { name: 'kind', label: 'Tipo', value: '' },
    { name: 'motive', label: 'Motivo', value: '' },
    { name: 'status', label: 'Estado', value: '' },
  ]);

  useEffect(() => {
    const fetchVacations = async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const formattedFilters = filters.reduce((acc, filter) => {
          if (filter.name === 'vacation_start' || filter.name === 'vacation_end') {
            acc[filter.name] = filter.value; // Mantenemos el formato ingresado por el usuario
          } else {
            acc[filter.name] = filter.value;
          }
          return acc;
        }, {});

        const response = await axiosInstance.get('/api/v1/vacations', {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
          params: {
            page,
            ...formattedFilters,
          }
        });
        setVacationsData(response.data);
        setCurrentPage(response.data.current_page);
        console.log('Respuesta del backend para vacaciones:', response.data);
      } catch (err) {
        setError(err);
        console.error('Error al obtener vacaciones:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVacations(currentPage); // Cargar la página inicial al montar el componente
  }, [currentPage, filters, authToken]);

  const handleEdit = (id) => {
    const vacationToEdit = vacationsData.vacations.find(vacation => vacation.id === id);
    setEditVacation(vacationToEdit);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/vacations/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setVacationsData({
        ...vacationsData,
        vacations: vacationsData.vacations.filter(vacation => vacation.id !== id)
      });
    } catch (err) {
      setError(err);
      console.error(`Error deleting vacation with id ${id}:`, err);
    }
  };

  const handleCreate = () => {
    setEditVacation(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditVacation(null);
  };

  const handleSubmitForm = async (formData) => {
    try {
      if (editVacation) {
        await axiosInstance.put(`/api/v1/vacations/${editVacation.id}`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        const updatedVacations = vacationsData.vacations.map(vacation => {
          if (vacation.id === editVacation.id) {
            return { ...vacation, ...formData };
          }
          return vacation;
        });
        setVacationsData({
          ...vacationsData,
          vacations: updatedVacations
        });
      } else {
        const response = await axiosInstance.post('/api/v1/vacations', formData, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setVacationsData({
          ...vacationsData,
          vacations: [...vacationsData.vacations, response.data]
        });
      }
      setShowForm(false);
      setEditVacation(null);
    } catch (err) {
      console.error('Error saving vacation:', err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reiniciar a la primera página al aplicar filtros
  };

  if (loading) {
    return <Typography variant="body2" color="text.secondary" align="center">Cargando...</Typography>;
  }

  if (error) {
    return <Typography variant="body2" color="text.secondary" align="center">Error: {error.message}</Typography>;
  }

  const columns = [
    { id: 'file_number', label: 'ID Empleado', align: 'right' },
    { id: 'vacation_start', label: 'Fecha desde', align: 'right' },
    { id: 'vacation_end', label: 'Fecha hasta', align: 'right' },
    { id: 'kind', label: 'Tipo', align: 'right' },
    { id: 'motive', label: 'Motivo', align: 'right' },
    { id: 'status', label: 'Estado', align: 'right' }
  ];

  return (
    <div>
      <TitleTable title="Vacaciones" buttonText="Nuevas Vacaciones" onCreate={handleCreate} />

      <FilterForm
        filters={filters}
        onApply={applyFilters}
      />

      {showForm && (
        <div style={{ marginBottom: '1rem' }}>
          <Form
            entityType="vacation"
            fields={[
              { id: 'employee_id', label: 'ID Empleado' },
              { id: 'vacation_start', label: 'Fecha desde', inputComponent: <DatePicker selected={editVacation ? new Date(editVacation.vacation_start) : null} onChange={date => setEditVacation({...editVacation, vacation_start: date})} dateFormat="dd/MM/yyyy" /> },
              { id: 'vacation_end', label: 'Fecha hasta', inputComponent: <DatePicker selected={editVacation ? new Date(editVacation.vacation_end) : null} onChange={date => setEditVacation({...editVacation, vacation_end: date})} dateFormat="dd/MM/yyyy" /> },
              { id: 'kind', label: 'Tipo' },
              { id: 'motive', label: 'Motivo' },
              { id: 'status', label: 'Estado' }
            ]}
            initialData={editVacation}
            onSubmit={handleSubmitForm}
            onCancel={handleCloseForm}
          />
        </div>
      )}

      <CustomTable columns={columns} rows={vacationsData.vacations} onEdit={handleEdit} onDelete={handleDelete} showActions={true} />

      <Pagination currentPage={currentPage} totalPages={vacationsData.total_pages} onPageChange={handlePageChange} />
    </div>
  );
};

export default Vacations;
