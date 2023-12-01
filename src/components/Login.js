import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LaPalma.png"

function Login(props) {
    const [loginForm, setloginForm] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = props.token;

        if (token) {
            navigate('/inicio');
        }
    }, [navigate, props]);

    function btnlogin(event) {
        axios({
            method: "POST",
            url: "http://catalogo.granadalapalma.com:5000/logintoken",
            data: {
                username: loginForm.username,
                password: loginForm.password
            }
        })
            .then((response) => {
                console.log(response);
                const { access_token, isAdmin } = response.data;
                props.setToken(access_token);
                // alert("Successfully Login");
                localStorage.setItem('username', loginForm.username);
                localStorage.setItem('isAdmin', isAdmin);
                navigate('/inicio');
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    if (error.response.status === 401) {
                        alert("Usuario no valido");
                    }
                }
            });

        setloginForm({
            username: "",
            password: ""
        });

        event.preventDefault();
    }

    function handleChange(event) {
        const { value, name } = event.target;
      
        setloginForm((prevNote) => ({
          ...prevNote,
          [name]: name === 'username' ? value.toUpperCase() : value.trim(),
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
                        Accede a tu cuenta 
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Usuario
                            </label>
                            <div className="mt-2">
                            <input type="username" value={loginForm.username} onChange={handleChange} text={loginForm.username} name="username" className="input input-bordered input-error w-full" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Contraseña
                                </label>
                            </div>
                            <div className="mt-2">
                            <input type="password" value={loginForm.password} onChange={handleChange} text={loginForm.password} name="password" className="input input-bordered input-error w-full" />
                            </div>
                        </div>
                        <div>
                        <button className="btn btn-outline btn-success" onClick={btnlogin}>Accede</button>
                        </div>
                    </form>
                </div>
            </div>
    );

}
export default Login;