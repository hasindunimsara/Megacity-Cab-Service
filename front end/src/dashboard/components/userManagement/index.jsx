import React from "react";
import useAuth from './../../../libs/hooks/UseAuth';
import { USER_ROLES } from "../../../libs/constants/roles";
import UserManagement from "./components/userManagement";

function UserManagements() {
    const { auth } = useAuth()

    if (auth.userRole === USER_ROLES.ADMIN) {
        return <UserManagement />;
    }
}

export default UserManagements