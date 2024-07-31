import React from 'react';
import styled from 'styled-components';

function CommentPagination({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  return (
    <PaginationContainer>
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
      <span>Page {currentPage + 1} of {totalPages}</span>
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>Next</button>
    </PaginationContainer>
  );
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  button {
    margin: 0 5px;
    background-color: #4682B4;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;

export default CommentPagination;
