import React from 'react'
import { Outlet } from 'react-router-dom'
import TopBar from './../components/topbar/index';
import SideBar from '../components/sidebar';

function DashboardLayout() {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1">
                    <Outlet /> {/* This renders the routed component, e.g., Reports */}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;