import React, { useState } from 'react';
import AdminPackaging from '../components/adminPackaging';
import AdminCategorias from '../components/adminCategorias';
import AdminProductos from '../components/adminProductos';

function Admin() {

    const [mostrarFormularioCategorias, setMostrarFormularioCategorias] = useState(false);
    const toggleFormularioCategorias = () => {
        setMostrarFormularioCategorias(!mostrarFormularioCategorias);
        setMostrarFormularioProductos(false);
        setMostrarFormularioPackaging(false);
    };


    const [mostrarFormularioProductos, setMostrarFormularioProductos] = useState(false);
    const toggleFormularioProductos = () => {
        setMostrarFormularioProductos(!mostrarFormularioProductos);
        setMostrarFormularioCategorias(false);
        setMostrarFormularioPackaging(false);

    };


    const [mostrarFormularioPackaging, setMostrarFormularioPackaging] = useState(false);
    const toggleFormularioPackaging = () => {
        setMostrarFormularioPackaging(!mostrarFormularioPackaging);
        setMostrarFormularioCategorias(false);
        setMostrarFormularioProductos(false);

    };



    return (

        <div className='animate-fade-down mt-20'>
            <ul className="menu menu-horizontal flex justify-center rounded-box mb-5">
                <li>
                    <a onClick={toggleFormularioCategorias}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                        </svg>
                        Categorías
                    </a>
                </li>
                <li>
                    <a onClick={toggleFormularioProductos}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        Productos
                    </a>
                </li>
                <li>
                    <a onClick={toggleFormularioPackaging}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>

                        Packaging
                    </a>
                </li>
            </ul>

            {mostrarFormularioCategorias && (

                <AdminCategorias />

            )}

            {mostrarFormularioProductos && (
                <AdminProductos />
            )}


            {mostrarFormularioPackaging && (
                <AdminPackaging />
            )}
        </div>
    );
}

export default Admin;
