import React from 'react';
import styled from 'styled-components';

function SearchBar() {
  return (
    <SearchBarContainer>
      <input type="text" placeholder="Search..." />
      <button>Search</button>
    </SearchBarContainer>
  );
}

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
  input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1em;
  }
  button {
    background-color: #4682B4; /* SteelBlue */
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
    font-size: 1em;
    &:hover {
      background-color: #4169E1; /* RoyalBlue */
    }
  }
`;

export default SearchBar;
