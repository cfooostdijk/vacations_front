// src/components/FilterForm/FilterForm.jsx
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FilterForm = ({ filters, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.name === name ? { ...filter, value } : filter
      )
    );
  };

  const handleDateChange = (date, name) => {
    setLocalFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.name === name ? { ...filter, value: date } : filter
      )
    );
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
      {localFilters.map((filter) => (
        <div key={filter.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {filter.name === 'vacation_start' || filter.name === 'vacation_end' ? (
            <DatePicker
              selected={filter.value ? new Date(filter.value) : null}
              onChange={(date) => handleDateChange(date, filter.name)}
              dateFormat="dd/MM/yyyy"
              customInput={<TextField label={filter.label} variant="outlined" size="small" />}
              popperPlacement="bottom-start"
            />
          ) : (
            <TextField
              label={filter.label}
              name={filter.name}
              value={filter.value}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
          )}
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={handleApply}>
        Aplicar Filtros
      </Button>
    </div>
  );
};

export default FilterForm;
