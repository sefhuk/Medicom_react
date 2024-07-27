import React, { useState } from 'react';
import styled from 'styled-components';

function PostForm({ initialValues = {}, onSubmit }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [content, setContent] = useState(initialValues.content || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>{initialValues.id ? 'Update Post' : 'Create Post'}</h1>
      <Label>
        Title:
        <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Label>
      <Label>
        Content:
        <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
      </Label>
      <SubmitButton type="submit">
        {initialValues.id ? 'Update Post' : 'Create Post'}
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-height: 150px;
`;

const SubmitButton = styled.button`
  background-color: #ff6347; /* Tomato */
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  &:hover {
    background-color: #e5533f; /* Darker Tomato */
  }
`;

export default PostForm;
