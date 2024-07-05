import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


const Form = ({ entityType, fields, initialData, onSubmit }) => {
  const initialFormData = {};
  const initialErrors = {};

  fields.forEach(field => {
    initialFormData[field.id] = initialData ? initialData[field.id] || '' : '';
    initialErrors[field.id] = '';
  });

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await onSubmit(formData);
      console.log(response)

    } catch (error) {
      console.error('Error submitting form:', error);

      if (error.response && error.response.data && error.response.data.errors) {
        const { errors: serverErrors } = error.response.data;

        const newErrors = {};
        fields.forEach(field => {
          const fieldName = field.id.toLowerCase();
          if (serverErrors.includes(`${fieldName} has already been taken`)) {
            newErrors[field.id] = `${field.label} ya ha sido tomado.`;
          }
        });

        setErrors(newErrors);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Typography variant="h6">
        {initialData ? `Editar ${entityType === 'employee' ? 'Empleado' : 'Vacación'}` : `Crear Nuevo ${entityType === 'employee' ? 'Empleado' : 'Vacación'}`}
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
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
            error={!!errors[field.id]}
            helperText={errors[field.id]}
          />
        ))}
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={submitting}>
            {submitting ? 'Enviando...' : initialData ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Form;
