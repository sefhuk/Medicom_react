import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

function CommentPagination({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
        Previous
      </Button>
      <Typography sx={{ mx: 2 }}>Page {currentPage + 1} of {totalPages}</Typography>
      <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
        Next
      </Button>
    </Container>
  );
}

export default CommentPagination;
