import React from 'react';
import { Container, Button, Box } from '@mui/material';

function Pagination({ totalPages, currentPage, onPageChange }) {
  const pages = [];

  for (let i = 0; i < totalPages; i++) {
    pages.push(
      <Button
        key={i}
        variant={currentPage === i ? 'contained' : 'outlined'}
        onClick={() => onPageChange(i)}
        sx={{ mx: 0.5 }}
      >
        {i + 1}
      </Button>
    );
  }

  return (
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      {pages}
    </Container>
  );
}

export default Pagination;
