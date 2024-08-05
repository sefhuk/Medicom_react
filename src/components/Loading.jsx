import React from "react";
import { CircularProgress, Backdrop } from "@mui/material";


export const Loading = (props) => {
  const {open} = props;

  return(
    <Backdrop color="#fff" sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
      <CircularProgress />
    </Backdrop>
  )
}