import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

const TitleTable = ({ title, buttonText, onCreate }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
    <Typography variant="h4">{title}</Typography>
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={onCreate}
    >
      {buttonText}
    </Button>
  </div>
);

export default TitleTable;
