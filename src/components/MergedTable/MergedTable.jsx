import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../services/Axios';
import Table from '../Table';
import FilterForm from '../FilterForm/FilterForm';
import Pagination from '../Pagination/Pagination';
import { useAuth } from '../../context/AuthContext';

const MergedTable = () => {
  const { authToken } = useAuth();
  const [mergedData, setMergedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState([
    // TO FIX EMPLOYEES FILTERS
    // { name: 'file_number', label: 'ID', value: '' },
    // { name: 'full_name', label: 'Nombre', value: '' },
    // { name: 'email', label: 'Email', value: '' },
    // { name: 'lider', label: 'Líder', value: '' },
    { name: 'vacation_start', label: 'Fecha desde', value: '' },
    { name: 'vacation_end', label: 'Fecha hasta', value: '' },
    { name: 'kind', label: 'Tipo', value: '' },
    { name: 'motive', label: 'Motivo', value: '' },
    { name: 'status', label: 'Estado', value: '' },
  ]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/api/v1/vacations', {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
          params: {
            ...filters.reduce((acc, filter) => {
              acc[filter.name] = filter.value;
              return acc;
            }, {}),
            page: currentPage,
          }
        });

        const { vacations, total_pages } = response.data;

        if (Array.isArray(vacations)) {
          const employeeIds = vacations.map(vacation => vacation.employee_id);
          const uniqueEmployeeIds = [...new Set(employeeIds)];

          const employeesData = await fetchEmployeesData(uniqueEmployeeIds);
          const filteredVacations = filterVacationsByEmployees(vacations, employeesData);
          const mergedData = buildMergedData(filteredVacations, employeesData);
          setMergedData(mergedData);
          setTotalPages(total_pages);
        } else {
          setError(new Error('Data retrieved is not in the expected format'));
        }
      } catch (err) {
        setError(err);
        // console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployeesData = async (employeeIds) => {
      const promises = employeeIds.map(async (employeeId) => {
        try {
          const response = await axiosInstance.get(`/api/v1/employees/${employeeId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          });
          return response.data;
        } catch (err) {
          // console.error(`Error fetching employee data for employee ID ${employeeId}:`, err);
          return null;
        }
      });

      const employeesData = await Promise.all(promises);
      return employeesData.filter(employee => employee !== null); // Filter out null values
    };

    const filterVacationsByEmployees = (vacations, employeesData) => {
      const employeeFilters = filters.filter(filter => ['file_number', 'full_name', 'email', 'lider'].includes(filter.name));
      if (employeeFilters.length === 0) {
        return vacations;
      }

      const filteredEmployeeIds = employeesData
        .filter(employee => {
          return employeeFilters.every(filter => {
            const value = filter.value.toLowerCase();
            if (filter.name === 'full_name') {
              const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
              return fullName.includes(value);
            }
            return employee[filter.name]?.toString().toLowerCase().includes(value);
          });
        })
        .map(employee => employee.id);

      return vacations.filter(vacation => filteredEmployeeIds.includes(vacation.employee_id));
    };

    const buildMergedData = (vacations, employeesData) => {
      const mergedData = [];

      vacations.forEach(vacation => {
        const employee = employeesData.find(employee => employee.id === vacation.employee_id);
        if (employee) {
          mergedData.push({
            employee_id: employee.file_number,
            employee_name: `${employee.first_name} ${employee.last_name}`,
            email: employee.email,
            lider: employee.lider,
            vacation_start: vacation.vacation_start,
            vacation_end: vacation.vacation_end,
            kind: vacation.kind,
            motive: vacation.motive,
            status: vacation.status
          });
        }
      });

      return mergedData;
    };

    fetchData();
  }, [currentPage, filters, authToken]);

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
    return <Typography variant="body2" color="text.secondary" align="center">Error: {error.message}</Typography>;
  }

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

      <FilterForm
        filters={filters}
        onApply={applyFilters}
      />

      <Table columns={columns} rows={mergedData} />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default MergedTable;
