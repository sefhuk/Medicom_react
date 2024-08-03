import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainContainer from '../../components/global/MainContainer';
import './HospitalList.css';
import { CustomScrollBox } from '../../components/CustomScrollBox'

// 페이지 경로 : http://localhost:3000/hospitals

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const pageSize = 10;

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/departments/detail', {
          params: {
            page: currentPage,
            size: pageSize
          }
        });
        setHospitals(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setLoading(false);
      } catch (error) {
        setError(error);
        console.error('Error fetching hospitals:', error);
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [currentPage, selectedDepartment]); // 의존성 배열에 selectedDepartment 추가

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/departments');
        setDepartments(response.data || []);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/search', {
        params: {
          name: searchTerm,
          page: currentPage,
          size: pageSize
        }
      });
      setHospitals(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setLoading(false);
    } catch (error) {
      setError(error);
      console.error('Error searching hospitals:', error);
      setLoading(false);
    }
  };

  const handleFilter = (department) => {
    setSelectedDepartment(department);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 이동
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 10;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow);

    if (endPage - startPage < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow);
    }

    for (let i = startPage; i < endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={i === currentPage}
        >
          {i + 1}
        </button>
      );
    }
    return pageNumbers;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <MainContainer>
      <CustomScrollBox>
      <div className="container">
        <h1>병원 검색하기</h1>
        <h2>키워드 검색</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="찾으실 병원을 입력하세요"
        />
        <button onClick={handleSearch}>검색</button>
        
        <h2>부서 필터링</h2>
        <select
          value={selectedDepartment}
          onChange={e => handleFilter(e.target.value)}
        >
          <option value="">모든 부서</option>
          {departments.map(department => (
            <option key={department.id} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>
        
        <ul>
          {hospitals.length > 0 ? (
            hospitals.map(hospital => (
              <li key={hospital.id}>
                <strong>{hospital.name}</strong> - {hospital.district} {hospital.subDistrict} - {hospital.telephoneNumber}
                <ul>
                  {hospital.departments && hospital.departments.length > 0 ? (
                    hospital.departments.map(department => (
                      <li key={department.id}>
                        {department.name}
                      </li>
                    ))
                  ) : (
                    <li>No departments available</li>
                  )}
                </ul>
              </li>
            ))
          ) : (
            <p>No hospitals found</p>
          )}
        </ul>
        <div className="page-buttons">
          {renderPageNumbers()}
        </div>
      </div>
      </CustomScrollBox>
    </MainContainer>
  );
};

export default HospitalList;
