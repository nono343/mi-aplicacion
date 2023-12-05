import React, { useEffect, useState } from 'react';
import logo from "../assets/LaPalma.png";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import ReactCountryFlag from "react-country-flag";
import { useNavigate } from 'react-router-dom';

export const Navbar = (props) => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.get('http://catalogo.granadalapalma.com:5000/categorias')
            .then((response) => {
                setCategories(response.data.categories);
            })
            .catch((error) => {
                console.error('Error al obtener las categorías', error);
            });
    }, []);

    const token = props.token;
    const decodedToken = token ? jwt_decode(token) : null;
    const foto = decodedToken && decodedToken.foto;
    const admin = decodedToken && decodedToken.isAdmin;


    const [isChecked, setIsChecked] = useState(true);

    const toggleCheckbox = () => {
        setIsChecked((prev) => !prev);
        props.setIsSpanish((prev) => !prev); // Cambiar isSpanish en el componente padre
    };

    const navigate = useNavigate()
    const handleLogout = () => {
        // Aquí puedes realizar cualquier lógica adicional antes de hacer logout, si es necesario.
        // Por ejemplo, enviar una solicitud al servidor para invalidar el token.

        // Luego, realiza el logout llamando a la función onLogout.
        props.onLogout();
        navigate("/");
    };



    return (

        <div className="navbar bg-base-100 mx-auto flex justify-around py-2 bg-white/80 backdrop-blur-md shadow-md w-full fixed top-0 left-0 right-0 z-10">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/categorias/${category.id}`}
                                className='font-bold'
                            >
                                <li><span>{props.isSpanish ? category.nombreesp : category.nombreeng}</span></li>
                            </Link>
                        ))}

                    </ul>
                </div>
                <Link to="/inicio">
                    <img src={logo} className='w-25 h-10' />
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/categorias/${category.id}`}
                            className='font-bold'
                        >
                            <li><span>{props.isSpanish ? category.nombreesp : category.nombreeng}</span></li>
                        </Link>
                    ))}
                </ul>
            </div>

            <div className="navbar-end">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        className="toggle toggle-success"
                        checked={isChecked}
                        onChange={toggleCheckbox}
                    />
                    <div className="ml-2 mr-5">
                        <ReactCountryFlag
                            countryCode={isChecked ? "ES" : "GB"}
                            svg
                            style={{
                                width: '2em',
                                height: '2em',
                            }}
                        />
                    </div>
                </div>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img src={`http://catalogo.granadalapalma.com:5000/uploads/users/${decodedToken.username}/${decodedToken.foto}`} alt="User Avatar" />
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {admin && (
                            <li onClick={() => navigate("/admin")}>
                                <a>Panel de Control</a>
                            </li>
                        )}
                        <li onClick={handleLogout}>
                            <a>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        // <header>
        //     <div className=" drawer z-50  mx-auto flex justify-around py-2 bg-white/80 backdrop-blur-md shadow-md w-full fixed top-0 left-0 right-0 z-10">
        //         <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        //         <div className="drawer-content flex flex-col">
        //             {/* Navbar */}
        //             <div className="w-full navbar">
        //                 <div className="flex-none lg:hidden">
        //                     <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
        //                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        //                     </label>
        //                 </div>
        //                 <div className="flex-1 px-2 mx-2">
        // <Link to="/inicio">
        //     <img src={logo} className='w-25 h-10' />
        // </Link>
        //                 </div>
        //                 <div className="flex-none hidden lg:block mr-20">
        //                     <ul className="menu menu-horizontal">
        //                         {categories.map((category) => (
        //                             <Link
        //                                 key={category.id}
        //                                 to={`/categorias/${category.id}`}
        //                                 className='font-bold'
        //                             >
        //                                 <li><span>{props.isSpanish ? category.nombreesp : category.nombreeng}</span></li>
        //                             </Link>
        //                         ))}
        //                     </ul>
        //                 </div>
        // <div className="flex items-center">
        //     <input
        //         type="checkbox"
        //         className="toggle toggle-success"
        //         checked={isChecked}
        //         onChange={toggleCheckbox}
        //     />
        //     <div className="ml-2 mr-5">
        //         <ReactCountryFlag
        //             countryCode={isChecked ? "ES" : "GB"}
        //             svg
        //             style={{
        //                 width: '2em',
        //                 height: '3em',
        //             }}
        //         />
        //     </div>
        // </div>
        //                 <div>
        //                     <details className="dropdown dropdown-end" >
        //                         <summary className="btn btn-ghost btn-circle avatar">
        //                             <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        // <img src={`http://catalogo.granadalapalma.com:5000/uploads/users/${decodedToken.username}/${decodedToken.foto}`} alt="User Avatar" />
        //                             </div>
        //                         </summary>
        // <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        //     {admin && (
        //         <li onClick={() => navigate("/admin")}>
        //             <a>Panel de Control</a>
        //         </li>
        //     )}
        //     <li onClick={handleLogout}>
        //         <a>Logout</a>
        //     </li>
        // </ul>
        //                     </details>
        //                 </div>
        //             </div>
        //             {/* Page content here */}
        //         </div>
        //         <div className="drawer-side">
        //             <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        //             <ul className="menu p-4 w-50 min-h-full bg-white">
        //                 {categories.map((category) => (
        //                     <li key={category.id}>
        //                         <Link to={`/categorias/${category.id}`} className='font-bold'>
        //                             <span>{props.isSpanish ? category.nombreesp : category.nombreeng}</span>
        //                         </Link>
        //                     </li>
        //                 ))}
        //             </ul>
        //         </div>
        //     </div>
        // </header>
    )
}
