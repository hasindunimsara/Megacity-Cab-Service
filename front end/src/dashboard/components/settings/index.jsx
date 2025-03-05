import React, { useState } from "react";
import 'react-dropdown/style.css';
import { IoIosArrowDown } from "react-icons/io";
import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from './../../../libs/hooks/UseAuth';

function Settings() {
  const { setAuth, auth } = useAuth()
  const [isDropdownShow, setIsDropdownShow] = useState(false)
  const [genderValue, setGenderValue] = useState('')
  const [selectedDate, setDate] = useState(null)

  const handleOptionClick = (value, actions) => {
    setGenderValue(value);
    setIsDropdownShow(false);
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    address: "",
    contactNumber: "",
    emailAddress: "",

    cardType: "",
    cardHolder: "",
    cardNumber: "",
    expireDate: "",
    cvv: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    address: Yup.string().required("Address is required"),
    contactNumber: Yup.string().required("Contact Number is required"),
    emailAddress: Yup.string().email("Invalid email").required("Email Address is required"),

    cardType: Yup.string().required("Card Type is required"),
    cardHolder: Yup.string().required("Card Holder name is required"),
    cardNumber: Yup.string()
      .required("Card Number is required")
      .matches(/^\d{16}$/, "Invalid card number"),
    expireDate: Yup.string()
      .required("Expiration Date is required")
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiration date"),
    cvv: Yup.string()
      .required("CVV is required")
      .matches(/^\d{3,4}$/, "Invalid CVV"),
  });

  const handleSubmit = async (values, actions) => {
    let gender = genderValue;
    const date = new Date(selectedDate);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const birthDate = `${year}-${month}-${day}`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.accessToken}`,
        "X-API-Key": "{{token}}"
      },
      body: JSON.stringify({
        userId: 1,
        userFirstName: values.firstName,
        userLastName: values.lastName,
        userDateOfBirth: birthDate,
        userGender: gender,
        userContactNumber: values.contactNumber,
        userEmail: values.emailAddress,
        userAddress: values.address,
        userProcedureRequest: values.procedureRequest,
        userAdditionalInformation: values.additionalInformation,
      })
    };

    try {
      const response = await fetch("http://localhost:9000/user/appointment/schedule", requestOptions);
      const data = await response.json();
      toast.success(`${data.message}`)
    } catch (error) {
      toast.error(`${data.message}`)
    }

    actions.setSubmitting(false);
  };
  return (
    <div className="m-10 w-full">
      <Toaster />
      <div className="mb-16 w-3/4">
        <h1 className="text-2xl mb-4 font-semibold">System Settings</h1>
        <p className='text-lg'>At this section, you have the option to revise and update both your personal {auth.userRole === "USER" && "and billing"} information.</p>
      </div>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="grid grid-flow-col gap-3">
              <div className="col-span-1">
                <div className="w-full max-w-lg">
                  <h1 className="text-xl font-semibold mb-6">Personal Information</h1>
                  <p className="italic font-normal text-gray-600 mb-10">Here, you can easily edit and update your personal details.</p>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                        First Name
                      </label>
                      <Field name="firstName" className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                      {errors.firstName && touched.firstName && <div className="text-red-500">{errors.firstName}</div>}
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                        Last Name
                      </label>
                      <Field name="lastName" className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" />
                      {errors.lastName && touched.lastName && <div className="text-red-500">{errors.lastName}</div>}
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-email">
                        Address
                      </label>
                      <Field name="address" className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-email" type="text" placeholder="No street, city." />
                      {errors.address && touched.address && <div className="text-red-500">{errors.address}</div>}
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                        Gender
                      </label>
                      <div className="relative">
                        <div
                          onClick={() => setIsDropdownShow(!isDropdownShow)}
                          className="border-solid border-gray-300 border-[1px] px-5 py-2 rounded cursor-pointer font-medium flex justify-between capitalize">
                          {genderValue === '' ? "select" : genderValue}
                          <IoIosArrowDown />
                        </div>
                        <div className={`rounded border-gray-300 border-[0.5px] bg-white px-2 absolute w-full ${isDropdownShow ? "" : "hidden"}`}>
                          <div onClick={() => handleOptionClick("male")} className="cursor-pointer hover:bg-gray-300 p-2">Male</div>
                          <div onClick={() => handleOptionClick("female")} className="cursor-pointer hover:bg-gray-300 p-2">Female</div>
                          <div onClick={() => handleOptionClick("other")} className="cursor-pointer hover:bg-gray-300 p-2">Other</div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Datepicker
                          selected={selectedDate}
                          onChange={date => setDate(date)}
                          className="py-2 px-4 w-[250px] rounded-md border-solid border-gray-300 border-[1px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                        Contact Number
                      </label>
                      <Field name="contactNumber" className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="07# ### ####" />
                      {errors.contactNumber && touched.contactNumber && <div className="text-red-500">{errors.contactNumber}</div>}
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                        Email Address
                      </label>
                      <Field name="emailAddress" className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="sample@gmail.com" />
                      {errors.emailAddress && touched.emailAddress && <div className="text-red-500">{errors.emailAddress}</div>}
                    </div>
                  </div>
                  <button type="submit" className="mt-10  bg-black hover:bg-gray-800 font-semibold text-white py-2 px-4 rounded w-64">
                    Save Personal Data
                  </button>

                </div>
              </div>
              {auth.userRole === "USER" &&
                (<div className="col-span-4 flex">
                  <hr className="w-[1px] h-[500px]" />
                  <div className="w-full max-w-lg ml-20">
                    <div className="w-[380px] h-56 bg-gray-900 rounded-xl relative text-white transition-transform transform mb-10">
                      <div className="w-full px-8 absolute top-8">
                        <div className="flex justify-between">
                          <div className="">
                            <p className="font-light">Name</p>
                            <p className="font-medium tracking-widest">Sachintha Madhawa</p>
                          </div>
                          <img className="w-14 h-14" src="https://i.imgur.com/bbPHJVe.png" />
                        </div>
                        <div className="pt-1">
                          <p className="font-light">Card Number</p>
                          <p className="font-medium tracking-more-wider">4642 3489 9867 7632</p>
                        </div>
                        <div className="pt-6 pr-6">
                          <div className="flex justify-between">
                            <div className="">
                              <p className="font-light text-xs">Valid</p>
                              <p className="font-medium tracking-wider text-sm">11/15</p>
                            </div>
                            <div className="">
                              <p className="font-light text-xs">Expiry</p>
                              <p className="font-medium tracking-wider text-sm">03/25</p>
                            </div>
                            <div className="">
                              <p className="font-light text-xs">CVV</p>
                              <p className="font-bold tracking-more-wider text-sm">···</p>
                            </div>
                          </div>
                        </div>
                      </div>

                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                        Card Type
                      </label>
                      <Field name="cardType" className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Visa/Master" />
                      {errors.cardType && touched.cardType && <div className="text-red-500">{errors.cardType}</div>}
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                        Card Holder Name
                      </label>
                      <Field name="cardHolder" className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Sachintha Madhawa" />
                      {errors.cardHolder && touched.cardHolder && <div className="text-red-500">{errors.cardHolder}</div>}
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-email">
                        Card Number
                      </label>
                      <Field name="cardNumber" className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-email" type="text" placeholder="0000 0000 0000 0000" />
                      {errors.cardNumber && touched.cardNumber && <div className="text-red-500">{errors.cardNumber}</div>}
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                        Expiration Date
                      </label>
                      <Field name="expireDate" className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="00/00" />
                      {errors.expireDate && touched.expireDate && <div className="text-red-500">{errors.expireDate}</div>}
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                        CVV
                      </label>
                      <Field name="cvv" className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="000" />
                      {errors.cvv && touched.cvv && <div className="text-red-500">{errors.cvv}</div>}
                    </div>
                  </div>
                  <button type="submit" className="mt-10  bg-black hover:bg-gray-800 font-semibold text-white py-2 px-4 rounded w-64">
                    Save Billing Data
                  </button>
                </div>
                </div>)}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Settings