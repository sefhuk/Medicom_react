import React from "react";
import MainContainer from "../../components/global/MainContainer";
import { useLocation } from "react-router";


const AdminUserListDetail = () => {

    const location = useLocation();
    console.log(location.state.userDetail);

    return (
        <MainContainer>

        </MainContainer>
    )
}


export default AdminUserListDetail;