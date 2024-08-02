import { Autocomplete, Box, Button, createFilterOptions, Modal, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../utils/axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};

// const departments = [
//   '내과',
//   '신경과',
//   '정신건강의학과',
//   '외과',
//   '정형외과',
//   '신경외과',
//   '심장혈관흉부외과',
//   '성형외과',
//   '마취통증의학과',
//   '산부인과',
//   '소아청소년과',
//   '안과',
//   '이비인후과',
//   '피부과',
//   '비뇨의학과',
//   '영상의학과',
//   '방사선종양학과',
//   '병리과',
//   '진단검사의학과',
//   '결핵과',
//   '재활의학과',
//   '핵의학과',
//   '가정의학과',
//   '응급의학과',
//   '직업환경의학과',
//   '예방의학과',
//   '치과',
//   '구강악안면외과',
//   '치과보철과',
//   '치과교정과',
//   '소아치과',
//   '치주과',
//   '치과보존과',
//   '구강내과',
//   '영상치의학과',
//   '구강병리과',
//   '예방치과',
//   '통합치의학과',
//   '한방내과',
//   '한방부인과',
//   '한방소아과',
//   '한방안·이비인후·피부과',
//   '한방신경정신과',
//   '침구과',
//   '한방재활의학과',
//   '사상체질과',
//   '한방응급'
// ];

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
      console.log(typeof response.data);
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
