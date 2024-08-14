import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../utils/axios';
import Slider from 'react-slick';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png'; 

// 슬라이더 화살표 버튼
const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      left: 0,
      transform: 'translateY(-50%)',
      zIndex: 1,
    }}
  >
    <ArrowBackIos />
  </IconButton>
);

const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      right: 0,
      transform: 'translateY(-50%)',
      zIndex: 1,
    }}
  >
    <ArrowForwardIos />
  </IconButton>
);

// 슬라이더 설정
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000, // 3초마다 슬라이드 변경
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
};

const Banner = () => {
  const [diseases, setDiseases] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/webscraping/latest')
      .then(response => {
        setDiseases(response.data);
      })
      .catch(error => {
        console.error("데이터 에러", error);
      });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 1,
        borderRadius: '20px',
        bgcolor: 'transparent',
        textAlign: 'center',
        width: '90%',
        margin: 'auto',
        maxWidth: 800,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          padding: 0,
          borderRadius: '20px',
          position: 'relative',
          overflow: 'hidden', 
        }}
      >
        <Slider {...sliderSettings}>
          {/* 첫 번째 슬라이드: 이미지 */}
          <Box
            sx={{
              height: '250px', 
              width: '100%',
              borderRadius: '20px', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center', 
              boxShadow: '1',
            }}
          >
            <img
              src={banner1}
              alt="Banner"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '20px',
              }}
            />
          </Box>

          {/* 나머지 슬라이드: 질병 정보 */}
          {diseases.length > 0 ? (
            diseases.map((disease) => (
              <Box
                key={disease.id}
                sx={{
                  position: 'relative',
                  height: '250px', 
                  width: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backgroundImage: `url(${banner2})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: 1,
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: '250px',
                    width: '100%',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backgroundImage: `url(${banner2})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: 1,
                  }}
                >
                  {/* Rank 텍스트 위치 설정 */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '15%',
                      left: '35%',
                      transform: 'translate(-50%, -50%)',
                      color: 'black',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h3" sx={{ mt: 2, fontWeight: 700, fontFamily: 'Pretendard-Regular' }}>
                      TOP {disease.rank}
                    </Typography>
                  </Box>

                  {/* DiseaseName 텍스트 위치 설정 */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '35%',
                      left: '60%',
                      transform: 'translate(-50%, -50%)',
                      color: 'black',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Pretendard-Regular' }}>
                      {disease.diseaseName}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                position: 'relative',
                height: '250px',
                width: '100%',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundImage: `url(${banner2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 1,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">
                  로딩중
                </Typography>
              </Box>
            </Box>
          )}
        </Slider>

      </Box>
    </Box>
  );
};

export default Banner;
