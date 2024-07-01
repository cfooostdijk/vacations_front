import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../services/Axios';
import CustomTable from '../Table/Table';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Form from '../Form/Form';

const Vacations = () => {
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editVacation, setEditVacation] = useState(null);

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/vacations');
        setVacations(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVacations();
  }, []);

  const handleEdit = (id) => {
    const vacationToEdit = vacations.find(vacation => vacation.id === id);
    setEditVacation(vacationToEdit);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/vacations/${id}`);
      setVacations(vacations.filter(vacation => vacation.id !== id));
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
        await axiosInstance.put(`/api/v1/vacations/${editVacation.id}`, formData);
        const updatedVacations = vacations.map(vacation => {
          if (vacation.id === editVacation.id) {
            return { ...vacation, ...formData };
          }
          return vacation;
        });
        setVacations(updatedVacations);
      } else {
        const response = await axiosInstance.post('/api/v1/vacations', formData);
        setVacations([...vacations, response.data]);
      }
      setShowForm(false);
      setEditVacation(null);
    } catch (err) {
      setError(err);
      console.error('Error saving vacation:', err);
    }
  };

  if (loading) {
    return <Typography variant="body2" color="text.secondary" align="center">Cargando...</Typography>;
  }

  if (error) {
    return <Typography variant="body2" color="text.secondary" align="center">Error: {error.message}</Typography>;
  }

  const columns = [
    { id: 'id', label: 'ID de Vacación' },
    { id: 'employee_id', label: 'ID de Empleado', align: 'right' },
    { id: 'vacation_start', label: 'Fecha de Inicio', align: 'right' },
    { id: 'vacation_end', label: 'Fecha de Fin', align: 'right' },
    { id: 'motive', label: 'Motivo', align: 'right' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="h4">Vacaciones</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nueva Vacación
        </Button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '1rem' }}>
          <Form entityType="vacation" fields={columns} initialData={editVacation} onSubmit={handleSubmitForm} />
          <Button variant="outlined" onClick={handleCloseForm}>Cancelar</Button>
        </div>
      )}

      <CustomTable columns={columns} rows={vacations} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Vacations;
