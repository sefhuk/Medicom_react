import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/board/PostForm';
import MainContainer from '../components/global/MainContainer';

function UpdatePostPage() {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/posts/${id}`)
      .then(response => setInitialValues(response.data))
      .catch(error => console.error('Error fetching post:', error));
  }, [id]);

  const handleUpdatePost = async (postData) => {
    try {
      const updatedPostData = { ...postData, id: id };

      const response = await axios.put(`http://localhost:8080/posts/${id}`, updatedPostData);
      console.log('Post updated:', response.data);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <MainContainer>
      <PostForm initialValues={initialValues} onSubmit={handleUpdatePost} />
    </MainContainer>
  );
}

export default UpdatePostPage;
