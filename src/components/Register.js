import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LaPalma.png"

function Register() {
    const [registerForm, setRegisterForm] = useState({
        username: "",
        password: "",
        isAdmin: "",
        file: null,
    });

    const navigate = useNavigate();

    useEffect(() => {
        console.log("Updated registerForm:", registerForm);
    }, [registerForm]);

    function handleRegister(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("file", registerForm.file);
        formData.append("username", registerForm.username);
        formData.append("password", registerForm.password);
        formData.append("isAdmin", registerForm.isAdmin);

        console.log("FormData:", formData);

        axios.post("http://catalogo.granadalapalma.com:5000/signup", formData, {
            
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                console.log(response);
                const { id, username, isAdmin } = response.data;
                alert("Successfully Registered");
                navigate('/');
            })
            .catch((error) => {
                console.error(error);
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    alert("Registration failed. Please try again.");
                }
            });

        setRegisterForm({
            username: "",
            password: "",
            isAdmin: "",
            file: null,
        });
    }

    function handleChange(event) {
        const { name, type } = event.target;
      
        setRegisterForm((prevForm) => ({
          ...prevForm,
          [name]: type === 'file' ? event.target.files[0] : (name === 'isAdmin' ? event.target.value : (name === 'username' ? event.target.value.toUpperCase() : event.target.value.trim())),
        }));
      }
      
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-10 w-auto"
                    src={logo}
                    alt="Granada La Palma SCA"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Registro
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Usuario
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                value={registerForm.username}
                                onChange={handleChange}
                                name="username"
                                id="form3Example3"
                                autoComplete="username"
                                required
                                className="input input-bordered input-error w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                type="password"
                                value={registerForm.password}
                                onChange={handleChange}
                                name="password"
                                id="form3Example4"
                                autoComplete="current-password"
                                required
                                className="input input-bordered input-error w-full"
                            />
                        </div>
                    </div>
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="roleSelect">Rol:</label>
                        <select
                            id="roleSelect"
                            name="isAdmin"
                            value={registerForm.isAdmin}
                            onChange={handleChange}
                            className="input input-bordered input-error w-full"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="file" className="block text-sm font-medium leading-6 text-gray-900">
                            Avatar Usuario
                        </label>
                        <div className="mt-2">
                            <input
                                type="file"
                                name="file"
                                id="file"
                                onChange={handleChange}
                                accept="image/*"
                                className="file-input file-input-bordered file-input-success w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            onClick={handleRegister}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;
