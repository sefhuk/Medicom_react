// UpdatePostForm.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

function UpdatePostForm({ post, onUpdate }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(post.imageUrl || '');

  useEffect(() => {
    setTitle(post.title);
    setContent(post.content);
    setPreviewUrl(post.imageUrl);
  }, [post]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);

      // 선택된 이미지 파일을 미리보기 위해 Blob URL 생성
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPost = { title, content, imageUrl: previewUrl }; // 수정된 정보
    onUpdate(updatedPost);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        Title:
        <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Label>
      <Label>
        Content:
        <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
      </Label>
      <Label>
        Image:
        <Input type="file" onChange={handleImageChange} />
        {previewUrl && <img src={previewUrl} alt="Image Preview" style={{ maxWidth: '100%', height: 'auto' }} />}
      </Label>
      <SubmitButton type="submit">Update Post</SubmitButton>
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

export default UpdatePostForm;