import React, { useState } from 'react';
import styled from 'styled-components';
import { ref, uploadBytes, getDownloadURL } from '../../firebase';
import { storage } from '../../firebase'; // Firebase 설정 가져오기

function CreatePostForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = '';
    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      try {
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error('이미지 업로드 오류:', error);
      }
    }
    console.log('Uploaded Image URL:', imageUrl);

    onSubmit({ title, content, imageUrl });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Create Post</h1>
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
      <SubmitButton type="submit">Create Post</SubmitButton>
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

export default CreatePostForm;