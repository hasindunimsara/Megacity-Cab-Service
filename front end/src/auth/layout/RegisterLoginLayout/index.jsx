import React, { useState } from 'react'
import UserRegister from '../../components/UserRegister'
import UserLogin from '../../components/UserLogin'

function RegisterLoginLayout() {
    const [isLogin, setIsLogin] = useState(true)
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="flex justify-center min-h-screen">
                <div className="hidden bg-cover lg:block lg:w-2/5" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1676288176918-232f7caadfee?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}>
                </div>
                <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
                    <div className="w-full">
                        <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                            Get your free account now.
                        </h1>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            Let’s get you all set up so you can verify your personal account and begin setting up your profile.
                        </p>
                        <div className="mt-6">
                            <h1 className="text-gray-500 dark:text-gray-300">Select type of account</h1>
                            <div className="mt-3 md:flex md:items-center md:-mx-2">
                                <button className={`flex justify-center w-full px-6 py-3 ${isLogin ? "text-white bg-black" : "text-black border border-black"} rounded-md md:w-auto md:mx-2 focus:outline-none`} onClick={(e) => setIsLogin(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="mx-2">
                                        Login
                                    </span>
                                </button>
                                <button className={`flex justify-center w-full px-6 py-3 mt-4 ${!isLogin ? "text-white bg-black" : "text-black border border-black"} rounded-md md:mt-0 md:w-auto md:mx-2 dark:border-gray-800 dark:text-gray-800 focus:outline-none`} onClick={(e) => setIsLogin(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="mx-2">
                                        Register
                                    </span>
                                </button>
                            </div>
                        </div>
                        {isLogin ? <UserLogin /> : <UserRegister />}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RegisterLoginLayout