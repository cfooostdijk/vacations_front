import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../services/Axios';
import { useAuth } from '../../context/AuthContext';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

const ImportFile = () => {
  const { authToken } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        setSeverity('warning');
        setMessage('Debe seleccionar un archivo Excel.');
        return;
      }

      const formData = new FormData();
      formData.append('excel_file', selectedFile);

      const response = await axiosInstance.post('/api/v1/import_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.data && response.data.message) {
        setSeverity('success');
        setMessage(response.data.message);
      } else {
        setSeverity('error');
        setMessage('Error al importar datos: respuesta del servidor no válida');
      }
    } catch (error) {
      if (error.response) {
        setSeverity('error');
        setMessage(`Error al importar datos: ${error.response.data.message}`);
      } else if (error.request) {
        setSeverity('error');
        setMessage('Error al importar datos: no se recibió respuesta del servidor');
      } else {
        setSeverity('error');
        setMessage(`Error al importar datos: ${error.message}`);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Importar Archivo Excel
      </Typography>
      <TextField
        type="file"
        onChange={handleFileChange}
        variant="outlined"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" color="primary" onClick={handleUpload} sx={{ mt: 2 }}>
        Subir archivo
      </Button>
      {message && (
        <Alert severity={severity} sx={{ mt: 2, width: '100%' }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

ImportFile.propTypes = {
  authToken: PropTypes.string.isRequired,
};

export default ImportFile;
