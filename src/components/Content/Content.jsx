import React from 'react';
import Paper from '@mui/material/Paper';

export default function Content(props) {
  return (
    <Paper sx={{ maxWidth: 'calc(100% - 20px)', margin: 'auto', overflow: 'hidden' }}>
      {props.children}
    </Paper>
  );
}
