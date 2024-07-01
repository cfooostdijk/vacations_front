// src/components/FilterForm/FilterForm.jsx
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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

  const handleApply = () => {
    onApply(localFilters);
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      {localFilters.map((filter) => (
        <TextField
          key={filter.name}
          label={filter.label}
          name={filter.name}
          value={filter.value}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
      ))}
      <Button variant="contained" color="primary" onClick={handleApply}>
        Aplicar Filtros
      </Button>
    </div>
  );
};

export default FilterForm;
