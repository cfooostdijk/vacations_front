import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../services/Axios';
import Table from '../Table';
import { useAuth } from '../../context/AuthContext'; // Importar el contexto de autenticación

const MergedTable = () => {
  const { authToken } = useAuth(); // Obtener el token de autenticación desde el contexto
  const [vacationsData, setVacationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeesData, setEmployeesData] = useState({
    employees: [],
    total_pages: 1,
    current_page: 1,
    total_count: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesResponse, vacationsResponse] = await Promise.all([
          axiosInstance.get('/api/v1/employees', {
            headers: {
              Authorization: `Bearer ${authToken}` // Incluir el token en la cabecera de la petición
            }
          }),
          axiosInstance.get('/api/v1/vacations', {
            headers: {
              Authorization: `Bearer ${authToken}` // Incluir el token en la cabecera de la petición
            }
          })
        ]);
        setEmployeesData(employeesResponse.data);
        setVacationsData(vacationsResponse.data); // Corregir aquí
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken]); // Asegúrate de incluir authToken en las dependencias de useEffect

  if (loading) {
    return <Typography variant="body2" color="text.secondary" align="center">Cargando...</Typography>;
  }

  if (error) {
    return <Typography variant="body2" color="text.secondary" align="center">Error: {error.message}</Typography>;
  }

  const mergedData = vacationsData.vacations.map(vacation => {
    const employee = employeesData.employees.find(emp => emp.id === vacation.employee_id);
    return {
      employee_id: vacation.employee_id,
      employee_name: employee ? `${employee.first_name} ${employee.last_name}` : 'N/A',
      email: employee ? `${employee.email}` : 'N/A',
      lider: employee ? `${employee.lider}` : 'N/A',
      vacation_start: vacation.vacation_start,
      vacation_end: vacation.vacation_end,
      kind: vacation.kind,
      motive: vacation.motive,
      status: vacation.status
    };
  });

  const columns = [
    { id: 'employee_id', label: 'ID', align: 'right' },
    { id: 'employee_name', label: 'Nombre', align: 'right' },
    { id: 'email', label: 'Email', align: 'right' },
    { id: 'lider', label: 'Lider', align: 'right' },
    { id: 'vacation_start', label: 'Fecha desde', align: 'right' },
    { id: 'vacation_end', label: 'Fecha hasta', align: 'right' },
    { id: 'kind', label: 'Tipo', align: 'right' },
    { id: 'motive', label: 'Motivo', align: 'right' },
    { id: 'status', label: 'Estado', align: 'right' }
  ];

  return (
    <div>
      <Typography variant="h4" align="center">Información Fusionada</Typography>
      <Table columns={columns} rows={mergedData} />
    </div>
  );
};

export default MergedTable;
