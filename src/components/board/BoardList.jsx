import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function BoardList({ boards }) {
  return (
    <BoardListContainer>
      <h1>Board List</h1>
      <Link to="/boards/create">
        <CreateButton>Create New Board</CreateButton>
      </Link>
      <BoardListUl>
        {boards.map(board => (
          <BoardListItem key={board.id}>
            <Link to={`/boards/${board.id}`}>{board.name}</Link>
          </BoardListItem>
        ))}
      </BoardListUl>
    </BoardListContainer>
  );
}

const BoardListContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CreateButton = styled.button`
  background-color: #32CD32; /* LimeGreen */
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1em;
  &:hover {
    background-color: #228B22; /* ForestGreen */
  }
`;

const BoardListUl = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const BoardListItem = styled.li`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
  a {
    text-decoration: none;
    color: #4682B4;
    font-size: 1.2em;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default BoardList;
