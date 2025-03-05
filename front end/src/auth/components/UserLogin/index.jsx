import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from '../../../libs/hooks/UseAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../libs/configs/config';

function UserLogin() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (values, actions) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: values.username,
      password: values.password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(`${BASE_URL}/auth/signin`, requestOptions);
      const data = await response.json();
      console.log("Response Status:", response.status, "Data:", data); // Debug

      if (!response.ok || data.error) {
        toast.error(data.message || "Invalid username or password. Please register first!");
        return;
      }

      const accessToken = data?.accessToken;
      const userRole = data?.roles[0]; // Adjust based on your backend response
      const userId = data?.id;

      if (!accessToken) {
        toast.error("Login failed: No access token received.");
        return;
      }

      setAuth({ accessToken, userRole, userId });
      toast.success("Login Success!");
      navigate(from, { replace: true });
    } catch (error) {
      console.log("Fetch Error:", error); // Debug
      toast.error(`Login Fail: ${error.message}`);
    }

    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
          <Toaster />
          <div>
            <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Username</label>
            <Field
              type="text"
              name="username"
              placeholder="john"
              className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-gray-800 dark:focus:border-gray-800 focus:ring-gray-800 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.username && touched.username && (
              <div className="text-red-500">{errors.username}</div>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Password</label>
            <Field
              type="password"
              name="password"
              placeholder="Enter your password"
              className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300"
            />
            {errors.password && touched.password && (
              <div className="text-red-500">{errors.password}</div>
            )}
          </div>
          <button
            type="submit"
            className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-black rounded-md hover:bg-gray-800 focus:outline-none"
          >
            <span>Sign In</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 rtl:-scale-x-100"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default UserLogin;