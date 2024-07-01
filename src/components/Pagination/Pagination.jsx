// src/components/Pagination/Pagination.jsx
import React from 'react';
import Button from '@mui/material/Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      {pages.map(page => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={currentPage === page ? 'contained' : 'outlined'}
          color="primary"
        >
          {page}
        </Button>
      ))}
    </div>
  );
};

export default Pagination;
