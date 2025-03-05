import React from 'react'
import { Outlet } from 'react-router-dom'
import TopBar from './../components/topbar/index';
import SideBar from '../components/sidebar';

function DashboardLayout() {
    return (
        <div className="flex flex-col h-screen">
            <TopBar />
            <div className="flex-1 flex">
                <SideBar />
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout