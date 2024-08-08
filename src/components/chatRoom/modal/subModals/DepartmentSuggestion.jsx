import { Autocomplete, Box, Button, createFilterOptions, Modal, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../utils/axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '40dvh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};


const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: option => option.title
});

function DepartmentSuggestion({ sendMessage, setOpens }) {
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState([]);

  const handleButtonClick = () => {
    const isConfirmed = window.confirm('해당 진료과로 제공하시겠습니까?');
    if (!isConfirmed) return;

    if (!value) {
      alert('진료과를 선택해주세요');
      return;
    }

    sendMessage(null, `dpt: ${value}`);
    setOpen(false);
    setOpens(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetcDepartments = async () => {
    try {
      const response = await axiosInstance.get('/api/departments');
      setDepartments(response.data);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    fetcDepartments();
  }, []);

  return (
    <>
      <Button onClick={handleOpen}>진료과목 정보 제공하기</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box sx={{ ...style, width: '70%' }}>
          <Autocomplete
            id='filter-demo'
            options={departments}
            getOptionLabel={option => option.name}
            filterOptions={filterOptions}
            sx={{ width: 300, marginBottom: '10px' }}
            renderInput={params => <TextField {...params} />}
            onChange={e => setValue(e.target.innerText)}
          />
          <Button variant='contained' onClick={handleButtonClick}>
            정보 제공하기
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default DepartmentSuggestion;