import React from 'react';
import DaumPostcode from 'react-daum-postcode';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const PostCodeModal = ({ open, onClose, onComplete }) => {
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    onComplete(fullAddress);
    onClose();

  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>주소 검색</DialogTitle>
      <DialogContent>
        <DaumPostcode onComplete={handleComplete} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">취소</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostCodeModal;