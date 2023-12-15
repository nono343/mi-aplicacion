import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import logo from '../assets/LaPalma.png';
import unorm from "unorm"; // Importa unorm

const DetalleProducto = (props) => {
    const { category_id, product_id } = useParams();
    const [product, setProduct] = useState(null);
    const [packagings, setPackagings] = useState(null);
    const [users, setUsers] = useState(null);
    const [filters, setFilters] = useState({
        nameesp: '',
        caliber: '',
        brand: '',
        productname: ''
    });

    const token = props.token;
    const decodedToken = token ? jwt_decode(token) : null;
    const userId = decodedToken && decodedToken.sub;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');

    const openImageModal = (event) => {
        if (event.target && event.target.src) {
            const imageUrl = event.target.src;
            setModalImageUrl(imageUrl);
            const modal = document.getElementById('image_modal');
            if (modal && modal.showModal) {
                modal.showModal();
            }
        } else {
            console.error("No se pudo obtener la URL de la imagen");
        }
    };

    const closeImageModal = () => {
        setModalImageUrl(null);
        const modal = document.getElementById('image_modal');
        if (modal && modal.close) {
            modal.close();
        }
    };

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                const response = await axios.get(`http://catalogo.granadalapalma.com:5000/categories/${category_id}/products/${product_id}`);
                const data = response.data;

                // Accede a los datos del product, packagings y usuarios
                const productData = data.product;
                const packagingsData = data.product.packagings;
                const usersData = data.product.packagings.map(packaging => packaging.users).flat(); // Asume que cada packaging tiene un campo 'users'

                // Actualiza el estado con los datos
                setProduct(productData);
                setPackagings(packagingsData);
                setUsers(usersData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchProductById();
    }, [category_id, product_id]);

    if (!product) {
        return (
            <div>
                <span className="loading loading-ring loading-lg"></span>
            </div>
        );
    }

    const getUniqueValues = (columnName) => {
        const uniqueValues = new Set(packagings.map((packaging) => packaging[columnName]));
        return Array.from(uniqueValues);
    };

    const handleFilterChange = (columnName, value) => {
        setFilters({ ...filters, [columnName]: value });
    };

    const filteredPackagings = packagings ? packagings.filter((packaging) => {
        return (
            (filters.nameesp === '' || packaging.nameesp.toLowerCase().includes(filters.nameesp.toLowerCase())) &&
            (filters.caliber === '' || packaging.caliber.toLowerCase() === filters.caliber.toLowerCase()) &&
            (filters.brand === '' || packaging.brand.toLowerCase().includes(filters.brand.toLowerCase())) &&
            (filters.productname === '' || packaging.nameesp.toLowerCase().includes(filters.productname.toLowerCase())) &&  // Usar nameesp o nameeng según sea necesario
            (userId && packaging.users && packaging.users.some(user => user.id === userId))
        );
    }) : [];


    const removeAccents = (str) => {
        return unorm.nfd(str).replace(/[\u0300-\u036f]/g, "");
    };

    const removeAsterisks = (str) => {
        if (str === undefined) {
            return ''; // o alguna cadena predeterminada, dependiendo de tus necesidades
        }
        return str.replace(/\*/g, '');
    };



    return (
        <div className='mt-20 py-5'>
            {/* Sección de información del product */}
            <section className="text-gray-600 body-font mb-5">
                <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900 text-center">
                    {(() => {
                        if (product.category_nameesp === "Tomates") {
                            const tomatoPrefix = props.isSpanish ? 'Tomate' : 'Tomato';
                            const productName = props.isSpanish ? product.nameesp : product.nameeng;

                            // Verificar si el nombre del producto ya contiene alguna variante de "Tomate" o "Tomato"
                            const containsTomato = /Tomat(e|o)s?/i.test(productName);

                            const finalProductName = containsTomato ? productName : `${tomatoPrefix} ${productName}`;

                            return finalProductName;
                        } else {
                            return props.isSpanish ? product.nameesp : product.nameeng;
                        }
                    })()}
                </h1>
                <div className="container mx-auto flex flex-col md:flex-row items-center">
                    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 md:items-start md:text-left items-center text-center animate-fade-right">
                        <h2 className="title-font sm:text-2xl text-2xl mb-4 font-medium text-gray-900">
                            {props.isSpanish ? product.claimesp : product.claimeng}
                        </h2>
                        {(props.isSpanish ? product.descriptionesp : product.descriptioneng).split(/\./).map((paragraph, index) => (
                            <p key={index} className="mb-2 leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                    <div className=" md:w-1/2 w-5/6 animate-fade-left">
                        <div className="diff aspect-[15/9] rounded-full">
                            <div className="diff-item-1">
                                <img
                                    alt={product.nameesp || ''}
                                    src={`http://catalogo.granadalapalma.com:5000/uploads/${removeAccents(product.category_nameesp.replace(/\s/g, '_'))}/${removeAccents(product.nameesp.replace(/\s/g, '_'))}/${product.photo}`}
                                />
                            </div>
                            <div className="diff-item-2">
                                <img
                                    alt={product.nameesp || ''}
                                    src={`http://catalogo.granadalapalma.com:5000/uploads/${removeAccents(product.category_nameesp.replace(/\s/g, '_'))}/${removeAccents(product.nameesp.replace(/\s/g, '_'))}/${product.photo2}`}
                                />
                            </div>
                            <div className="diff-resizer"></div>
                        </div>
                    </div>
                </div >
            </section >

            {/* Calendario de producción */}
            < section >
                <div className="border-t mx-auto border-gray-200 bg-white px-10 py-10 sm:px-6 animate-fade-up">
                    <h1 className="sm:text-3xl text-center text-2xl mb-5">
                        {props.isSpanish ? "Calendario de producción" : "Production Calendar"}
                    </h1>
                    <div className="flex justify-center max-w-screen-md mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((mes, index) => (
                            <a
                                key={index}
                                className={`relative inline-flex w-1/12 sm:w-1/12 mr-1 h-16 ${product.months_production.map((m) => m.toString()).includes(mes.toString())
                                    ? 'bg-red-600'
                                    : 'bg-gray-200'
                                    } mb-2 flex items-center justify-center text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transform hover:scale-110 transition-transform`}
                            >
                                {mes}
                            </a>
                        ))}
                    </div>
                </div>
            </section >

            <div className="border-t mx-auto border-gray-200 bg-white py-5 sm:px-6 animate-fade-up"></div>

            {/* Tabla de packagings */}
            <section>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{props.isSpanish ? "Foto Unidad" : "Unit Photo"}</th>
                                <th>{props.isSpanish ? "Foto Confección" : "Packaging Photo"}</th>
                                <th>
                                    <select
                                        className="border border-gray-300 px-2 py-1"
                                        value={filters.nameesp}
                                        onChange={(e) => handleFilterChange('nameesp', e.target.value)}
                                    >
                                        <option value="">{props.isSpanish ? "Seleccionar Confeccón" : "Select Packaging"}</option>
                                        {getUniqueValues('nameesp').map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                <th>
                                    <select
                                        value={filters.brand}
                                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                                        className="border border-gray-300 px-2 py-1"
                                    >
                                        <option value="">{props.isSpanish ? "Seleccionar Marca" : "Select Brand"}</option>
                                        {getUniqueValues('brand').map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                <th>
                                    <select
                                        value={filters.caliber}
                                        onChange={(e) => handleFilterChange('caliber', e.target.value)}
                                        className="border border-gray-300 px-2 py-1"
                                    >
                                        <option value="">{props.isSpanish ? "Seleccionar Calibre" : "Select Caliber"}</option>
                                        {getUniqueValues('caliber').map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                <th>{props.isSpanish ? "Unidades" : "Units"}</th>
                                <th>{props.isSpanish ? "Peso Packaging (g)" : "Packaging Weight (g)"}</th>
                                <th>{props.isSpanish ? "Peso Neto Confección (kg)" : "Net Weight Packaging (kg)"}</th>
                                <th>{props.isSpanish ? "Tamaño Caja" : "Box Size"}</th>
                                <th>{props.isSpanish ? "Unidades Pallet 80x120" : "Units Pallet 80x120"}</th>
                                <th>{props.isSpanish ? "Peso Neto Pallet 80x120 (kg)" : "Net Weight Pallet 80x120 (kg)"}</th>
                                <th>{props.isSpanish ? "Unidades Pallet 100x120" : "Units Pallet 100x120"}</th>
                                <th>{props.isSpanish ? "Peso Neto Pallet 100x120 (kg)" : "Net Weight Pallet 100x120 (kg)"}</th>
                                <th>{props.isSpanish ? "Unidades Pallet Avión" : "Units Pallet Airplane"}</th>
                                <th>{props.isSpanish ? "Peso Neto Pallet Avión (kg)" : "Net Weight Pallet Airplane (kg)"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPackagings.length > 0 ? (
                                filteredPackagings.map((packaging, index) => (
                                    <tr className="bg-white" key={index}>
                                        <td className="py-2 px-4 border-b">
                                            <img
                                                src={`http://catalogo.granadalapalma.com:5000/uploads/${removeAccents(product.category_nameesp)}/${removeAccents(product.nameesp)}/${removeAccents(removeAsterisks(packaging.nameesp.replace(/ /g, '_')))}/${removeAsterisks(packaging.box_size)}/${packaging.caliber}/${packaging.photo}`}
                                                alt="Packaging"
                                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full cursor-pointer"
                                                onClick={(event) => openImageModal(event)}
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.photo2 ? (
                                                <img
                                                    src={`http://catalogo.granadalapalma.com:5000/uploads/${removeAccents(product.category_nameesp)}/${removeAccents(product.nameesp)}/${removeAccents(removeAsterisks(packaging.nameesp.replace(/ /g, '_')))}/${removeAsterisks(packaging.box_size)}/${packaging.caliber}/${packaging.photo2}`}
                                                    alt="Packaging"
                                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full cursor-pointer"
                                                    onClick={(event) => openImageModal(event)}
                                                />
                                            ) : (
                                                <img
                                                    src={logo}
                                                    alt="Otra Imagen"
                                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full cursor-pointer"
                                                />
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {props.isSpanish ? packaging.nameesp : packaging.nameeng}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.brand}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.caliber}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.presentation}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.weight_presentation_g}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.net_weight_kg}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.box_size}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.pallet_80x120}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.net_weight_pallet_80x120_kg}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.pallet_100x120}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.net_weight_pallet_100x120_kg}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.pallet_plane}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.net_weight_pallet_plane_kg}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-4">No hay datos disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modal */}
            <dialog id="image_modal" className={`modal ${isModalOpen ? 'open' : ''}`}>
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeImageModal}>✕</button>
                    </form>
                    <img id="modal_image" alt="Modal" src={modalImageUrl} className="w-full h-full object-cover" />
                </div>
            </dialog>
        </div >
    );
};

export default DetalleProducto;
