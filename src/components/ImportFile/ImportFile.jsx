import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../services/Axios';

const ImportFile = ({ authToken }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
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
        setMessage(response.data.message);
      } else {
        console.error('Respuesta del servidor no contiene un mensaje definido:', response.data);
        setMessage('Error al importar datos: respuesta del servidor no válida');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error de respuesta del servidor:', error.response.data);
        setMessage(`Error al importar datos: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor:', error.request);
        setMessage('Error al importar datos: no se recibió respuesta del servidor');
      } else {
        console.error('Error al realizar la solicitud:', error.message);
        setMessage(`Error al importar datos: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir archivo</button>
      {message && <p>{message}</p>}
    </div>
  );
};

ImportFile.propTypes = {
  authToken: PropTypes.string.isRequired,
};

export default ImportFile;
