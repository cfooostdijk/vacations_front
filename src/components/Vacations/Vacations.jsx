import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../services/Axios';
import Table from '../Table';

const Vacations = () => {
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <Typography variant="h4" align="center">Vacaciones</Typography>
      <Table columns={columns} rows={vacations} />
    </div>
  );
};

export default Vacations;
