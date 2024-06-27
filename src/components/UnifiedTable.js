// src/components/UnifiedTable.js
import React, { useEffect, useState } from 'react';
import axios from '../services/Axios';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, TablePagination, TextField } from '@mui/material';

const UnifiedTable = ({ token }) => {
  const [employees, setEmployees] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, filter]);

  const fetchData = async () => {
    try {
      const employeeResponse = await axios.get(`/employees`, {
        params: { page, per_page: rowsPerPage, filter },
        headers: { Authorization: `Bearer ${token}` }
      });
      const vacationResponse = await axios.get(`/vacations`, {
        params: { page, per_page: rowsPerPage, filter },
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(employeeResponse.data);
      setVacations(vacationResponse.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <Paper>
      <TextField label="Filter" variant="outlined" value={filter} onChange={handleFilterChange} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Vacation Start Date</TableCell>
              <TableCell>Vacation End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{vacations.find(vacation => vacation.employee_id === employee.id)?.start_date || "N/A"}</TableCell>
                <TableCell>{vacations.find(vacation => vacation.employee_id === employee.id)?.end_date || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={employees.length} // Aquí deberías poner el total de elementos en lugar del número de elementos en la página actual
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default UnifiedTable;
