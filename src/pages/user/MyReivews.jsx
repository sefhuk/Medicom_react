import React, { useState, useEffect } from "react";
import {Typography, Card, CardContent, CardActions, Button, Paper, Box, TextField, IconButton} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import { axiosInstance, fetchUserReviews } from "../../utils/axios";
import MainContainer from "../../components/global/MainContainer";

const MyReviews = () => {
  const [state, setState] = useState({
    reviews: [],
    editingReviewId: null,
    editedContent: "",
    editedRating: 0,
  });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userReviews = await fetchUserReviews(userId);
        setState((prevState) => ({
          ...prevState,
          reviews: userReviews,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    loadReviews();
  }, []);

  const deleteReview = async (reviewId) => {
    const checkDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!checkDelete) return;
    try {
      await axiosInstance.delete(`/review/${reviewId}`);
      setState((prevState) => ({
        ...prevState,
        reviews: prevState.reviews.filter((review) => review.id !== reviewId),
      }));
      alert("리뷰가 삭제되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  const editReview = (reviewId, currentContent, currentRating) => {
    setState((prevState) => ({
      ...prevState,
      editingReviewId: reviewId,
      editedContent: currentContent,
      editedRating: currentRating,
    }));
  };

  const cancelEdit = () => {
    setState((prevState) => ({
      ...prevState,
      editingReviewId: null,
      editedContent: "",
      editedRating: 0,
    }));
  };

  const saveEditedReview = async (reviewId) => {
    try {
      await axiosInstance.put(`/review/${reviewId}`, {
        content: state.editedContent,
        rating: state.editedRating,
      });
      setState((prevState) => ({
        ...prevState,
        reviews: prevState.reviews.map((review) =>
          review.id === reviewId
            ? {
              ...review,
              content: prevState.editedContent,
              rating: prevState.editedRating,
            }
            : review
        ),
        editingReviewId: null,
        editedContent: "",
        editedRating: 0,
      }));
      alert("리뷰가 수정되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  const renderStars = (rating, editable = false) => {
    const maxRating = 5;
    const filledStars = Array.from({ length: rating }, (_, index) => (
      <IconButton
        key={index}
        onClick={() =>
          editable &&
          setState((prevState) => ({
            ...prevState,
            editedRating: index + 1,
          }))
        }
        disabled={!editable}
      >
        <Star style={{ color: "#FFD700" }} />
      </IconButton>
    ));
    const emptyStars = Array.from(
      { length: maxRating - rating },
      (_, index) => (
        <IconButton
          key={index + rating}
          onClick={() =>
            editable &&
            setState((prevState) => ({
              ...prevState,
              editedRating: rating + index + 1,
            }))
          }
          disabled={!editable}
        >
          <StarBorder style={{ color: "#FFD700" }} />
        </IconButton>
      )
    );

    return [...filledStars, ...emptyStars];
  };

  const { reviews, editingReviewId, editedContent, editedRating } = state;

  return (
    <MainContainer>
      <Paper elevation={6} sx={{ margin: "10px", padding: 3, borderRadius: "10px" }}>
        <Typography variant="h5" sx={{ display: "inline", color: "#6E6E6E" }}>
          나의 리뷰
        </Typography>
        <Box sx={{ margin: "20px 0", borderBottom: "1px solid grey" }}></Box>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  {editingReviewId === review.id
                    ? renderStars(editedRating, true)
                    : renderStars(review.rating)}
                </div>
                {editingReviewId === review.id ? (
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    variant="outlined"
                    value={editedContent}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        editedContent: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <Typography variant="h6">{review.content}</Typography>
                )}
                <Typography variant="body2" color="textSecondary">
                  병원: {review.hospitalName} | 작성일: {review.created_at}
                </Typography>
              </CardContent>
              <CardActions>
                {editingReviewId === review.id ? (
                  <>
                    <Button
                      size="small"
                      color="primary"
                      variant="outlined"
                      onClick={() => saveEditedReview(review.id)}
                    >
                      저장
                    </Button>
                    <Button size="small" variant="outlined" onClick={cancelEdit}>
                      취소
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        editReview(review.id, review.content, review.rating)
                      }
                    >
                      수정
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => deleteReview(review.id)}
                    >
                      삭제
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography variant="body1">작성한 리뷰가 없습니다.</Typography>
        )}
      </Paper>
    </MainContainer>
  );
};

export default MyReviews;
