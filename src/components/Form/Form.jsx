import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Form = ({ entityType, fields, initialData, onSubmit }) => {
  const initialFormData = {};
  fields.forEach(field => {
    initialFormData[field.id] = initialData ? initialData[field.id] || '' : '';
  });

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <Typography variant="h6">{initialData ? `Editar ${entityType === 'employee' ? 'Empleado' : 'Vacación'}` : `Crear Nuevo ${entityType === 'employee' ? 'Empleado' : 'Vacación'}`}</Typography>
      <form onSubmit={handleSubmit}>
        {fields.map(field => (
          <TextField
            key={field.id}
            name={field.id}
            label={field.label}
            value={formData[field.id]}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        ))}
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Form;
