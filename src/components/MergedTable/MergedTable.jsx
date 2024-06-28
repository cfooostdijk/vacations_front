import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../services/Axios';
import Table from '../Table';

const MergedTable = () => {
  const [employees, setEmployees] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesResponse, vacationsResponse] = await Promise.all([
          axiosInstance.get('/api/v1/employees'),
          axiosInstance.get('/api/v1/vacations')
        ]);
        setEmployees(employeesResponse.data);
        setVacations(vacationsResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography variant="body2" color="text.secondary" align="center">Cargando...</Typography>;
  }

  if (error) {
    return <Typography variant="body2" color="text.secondary" align="center">Error: {error.message}</Typography>;
  }

  const mergedData = vacations.map(vacation => {
    const employee = employees.find(emp => emp.id === vacation.employee_id);
    return {
      vacation_id: vacation.id,
      employee_id: vacation.employee_id,
      employee_name: employee ? `${employee.first_name} ${employee.last_name}` : 'N/A',
      email: employee ? `${employee.email}` : 'N/A',
      lider: employee ? `${employee.lider}` : 'N/A',
      vacation_start: vacation.vacation_start,
      vacation_end: vacation.vacation_end,
      kind: vacation.kind,
      motive: vacation.motive
    };
  });

  const columns = [
    { id: 'vacation_id', label: 'ID de Vacación' },
    { id: 'employee_id', label: 'ID de Empleado', align: 'right' },
    { id: 'employee_name', label: 'Nombre del Empleado', align: 'right' },
    { id: 'email', label: 'Email', align: 'right' },
    { id: 'lider', label: 'Lider', align: 'right' },
    { id: 'vacation_start', label: 'Fecha de Inicio', align: 'right' },
    { id: 'vacation_end', label: 'Fecha de Fin', align: 'right' },
    { id: 'kind', label: 'Tipo', align: 'right' },
    { id: 'motive', label: 'Motivo', align: 'right' }
  ];

  return (
    <div>
      <Typography variant="h4" align="center">Información Fusionada</Typography>
      <Table columns={columns} rows={mergedData} />
    </div>
  );
};

export default MergedTable;
