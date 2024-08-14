import React, { useState, useEffect } from "react";
import { Typography, Paper, Box, IconButton } from "@mui/material";
import { axiosInstance, fetchUserReviews, userInformation } from '../../utils/axios';
import MainContainer from "../../components/global/MainContainer";
import MyReviewCard from "../../components/MyReviewCard";
import { Loading } from "../../components/Loading";
import { ArrowRightIcon } from "@mui/x-date-pickers-pro";
import { useNavigate } from "react-router";

export const MyPosts = () => {

  const [postList, setPostList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      try{
        const response = await axiosInstance.get('/users/my-page/post');
        setPostList(response.data);
      } catch(exception){
        console.log(exception);
      }
    }
    getPosts();
  }, {})

  const OnClickPostButton = (id) => {
    navigate(`/posts/${id}`)
  }

  const PostComponent = () =>{
    return postList.map(post => (
      <Box fullWidth sx={{height: '60px', padding: '10px', margin: '15px 0 auto', border: '1px solid #BCBDBC', }}>
        <IconButton sx={{float: 'right', margin: '5px 0 auto'}} onClick={(e) => {OnClickPostButton(post.id)}}>
          <ArrowRightIcon fontSize="large"></ArrowRightIcon>
        </IconButton>
        <Typography variant='h5' sx={{margin: '0px 0px 5px 0px'}}>{post.title}</Typography>
        <Typography variant="body1">{post.createdAt}</Typography>
      </Box>
    ));
  }

  return(
    <MainContainer>
      <Paper elevation={6} sx={{ margin: "10px", padding: 3, borderRadius: "10px" }}>
      <Typography variant="h5" sx={{ display: "inline", color: "#6E6E6E" }}>
        내가 쓴 글
      </Typography>
      <Box sx={{ margin: "20px 0", borderBottom: "1px solid grey" }}></Box>
        {postList ? <PostComponent /> : <Loading />}
      </Paper>
    </MainContainer>
  )
}