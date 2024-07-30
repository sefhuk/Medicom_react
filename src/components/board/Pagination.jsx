import React from 'react';
import styled from 'styled-components';

function Pagination({ totalPages, currentPage, onPageChange }) {
  const pages = [];

  for (let i = 0; i < totalPages; i++) {
    pages.push(i);
  }

  return (
    <PaginationContainer>
      {pages.map(page => (
        <PageButton
          key={page}
          isActive={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page + 1}
        </PageButton>
      ))}
    </PaginationContainer>
  );
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  background-color: ${props => (props.isActive ? '#4682B4' : '#f1f1f1')};
  color: ${props => (props.isActive ? '#fff' : '#000')};
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #4682B4;
    color: #fff;
  }
`;

export default Pagination;
