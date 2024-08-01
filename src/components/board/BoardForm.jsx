import React, { useState } from 'react';
import styled from 'styled-components';

function BoardForm({ initialValues = {}, onSubmit }) {
  const [name, setName] = useState(initialValues.name || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>{initialValues.id ? 'Update Board' : 'Create Board'}</h1>
      <Label>
        Board Name:
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </Label>
      <SubmitButton type="submit">
        {initialValues.id ? 'Update Board' : 'Create Board'}
      </SubmitButton>
    </Form>
  );
}

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  display: block;
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  background-color: #32CD32; /* LimeGreen */
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  &:hover {
    background-color: #228B22; /* ForestGreen */
  }
`;

export default BoardForm;
