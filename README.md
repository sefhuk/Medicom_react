# 메디콤
![logo (1)](https://github.com/user-attachments/assets/1c157835-d764-46e6-bcf5-c250ff089ba2)

#### 원인 모를 통증과 증상을 통해 의심되는 질병을 알려주고,
#### 어떤 진료과를 가야하는지와 근처에 있는 해당 진료과 병원을 찾아주는 시스템

## 기술 스택
- React
- Nginx
- Axios
- MUI Component
- FireBase
- Naver Map API

### 배포
- GCP
- Gitlab CI/CD

## 와이어프레임
https://www.figma.com/design/GX6CyJdzJCfZVgUN4t9mZd/elice-project3?node-id=0-1&t=8cqv2TCWyLXtmpu7-0

## 기능

### 메인 기능
- AI에게 질의를 통해 간단한 진단 및 진료과 소개 후 근처 병원 검색 및 지도에 표
- 유행중인 질병 확인
- 현재 위치 기반으로 주변 병원 검색
- 병원 예약
- 병원 방문 리뷰

### 유저
- 일반 회원가입 및 Oauth2
- 로그인 시 Access Token, Refresh Token 발급
- Access Token 만료 시 Access Token, Refresh Token 모두 재발급
- 일반 유저, 의사, 관리자 총 3가지 Role
- 관리자는 유저 관리(삭제, 권한 관리) 가능
- 회원정보 수정 및 회원탈퇴

### 게시판
- 공지사항을 통해 유저들에게 주요 사항 공지
- 게시글 조회수
- 게시글 추천
- 게시글 정렬(최신, 추천, 조회)
- 게시글 수정 및 삭제
- 댓글 및 대댓글

### 채팅
- 유저는 의사와 1:1 채팅을 통해 간편 원격 진단 및 진료과 소개
- 의사에게 소개받은 진료과를 통해 빠르게 근처의 해당 진료과 병원 검색
- 유저는 관리자와 1:1 채팅을 통해 문의 가능
- 의사는 진단 신청 대기중인 채팅방 확인 및 채팅 수락
- 관리자는 문의 대기중인 채팅방 확인 및 채팅 수락

### 서비스 화면
![KakaoTalk_Photo_2024-11-21-10-45-44 001](https://github.com/user-attachments/assets/f1097516-a43c-4bd5-80e5-a3d564178e85)
![KakaoTalk_Photo_2024-11-21-10-45-44 003](https://github.com/user-attachments/assets/c3a83f00-c4a7-4834-99da-1d6d7f563653)
![KakaoTalk_Photo_2024-11-21-10-45-44 004](https://github.com/user-attachments/assets/cea91a77-c096-4b02-9196-7382b387c79e)
![KakaoTalk_Photo_2024-11-21-10-45-44 005](https://github.com/user-attachments/assets/6d73bdc8-6341-4acc-b767-c246d27eda57)

<img width="444" alt="image" src="https://github.com/user-attachments/assets/93094e5e-3e81-4d43-a514-cb02e3934f03">
