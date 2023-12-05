import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/LaPalma.png"
import unorm from "unorm"; // Importa unorm


function AdminPackaging() {
    const [selectedFilePackaging, setSelectedFilePackaging] = useState(null);
    const [selectedFilePackaging2, setSelectedFilePackaging2] = useState(null); // Added for the second file
    const [nombreesp, setNombreEsp] = useState('');
    const [nombreeng, setNombreEng] = useState('');
    const [marca, setMarca] = useState('');
    const [presentacion, setPresentacion] = useState('');
    const [calibre, setCalibre] = useState('');
    const [pesoPresentacion, setPesoPresentacion] = useState('');
    const [pesoNeto, setPesoNeto] = useState('');
    const [tamanoCaja, setTamanoCaja] = useState('');
    const [pallet80x120, setPallet80x120] = useState('');
    const [pesoNetoPallet80x120, setPesoNetoPallet80x120] = useState('');
    const [pallet100x120, setPallet100x120] = useState('');
    const [pesoNetoPallet100x120, setPesoNetoPallet100x120] = useState('');
    const [palletAvion, setPalletAvion] = useState('');
    const [pesoNetoPalletAvion, setPesoNetoPalletAvion] = useState('');
    const [productoId, setProductoId] = useState('');
    const [userIds, setUserIds] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [productIds, setProductIds] = useState(""); // Suponiendo que productIds es una cadena
    const [availableProducts, setAvailableProducts] = useState([]);


    const nombresMappings = {
        'BOLSA SNACK EN FLOWPACK': 'FLOWPACK SNACK BAG',
        'TARRINA DE CARTÓN CON TAPA': 'CARDBOARD WITH LID',
        'TARRINA DE CARTÓN CON FLOWPACK': 'CARDBOARD WITH FLOWPACK',
        'BOLSA EN FLOWPACK': 'FLOWPACK BAG',
        'TARRINA TERMOSELLADA': 'TOP SEAL PUNNET',
        'TARRINA CON FLOWPACK': 'PUNNET WITH FLOWPACK',
        'TARRINA CON BISAGRA TRIANGULAR': 'TRIANGULAR CLAMSHELL',
        'VASO CON TAPA': 'SHAKER WITH LID',
        'VASO APLICABLE CON VISAGRA': 'STOCKABLE CLAMSHELL SHAKER',
        'TARRINA TERMOSELLADA CON ENFAJADO': 'TOP SEAL PUNNET WITH BAND',
        'TARRINA PASTA CELULOSA TERMOSELLADA': 'CELLULOSE PULP TOP SEAL PUNNET',
        'TARRINA CON TAPA': 'PUNNET WITH LID',
        'CUBO CON TAPA': 'BUCKET WITH LID',
        'GRANEL': 'LOOSE',
    };

    const marcasMapping = {
        'PARCELA': 'Nombre de Marca 1',
        'LA PALMA': 'Nombre de Marca 2',
    };

    const medidasPackaging = {
        '24*18*6': 'Medida 1',
        '30*20*11.5': 'Medida 2',
        '30*20*8': 'Medida 3',
        '40*30*10': 'Medida 4',
        '40*30*12': 'Medida 5',
        '40*30*14': 'Medida 6',
        '40*30*15.2': 'Medida 7',
        '40*30*15.5': 'Medida 8',
        '40*30*7': 'Medida 9',
        '40*30*8': 'Medida 10',
        '40*30*9': 'Medida 11',
        '40*30*9.5': 'Medida 12',
        '60*40*10': 'Medida 13',
        '60*40*15': 'Medida 14',
        '60*40*16': 'Medida 15',
        '60*40*6.2': 'Medida 16',
        '60*40*7': 'Medida 17',
        '60*40*8': 'Medida 18',
        '60*40*9.7': 'Medida 19'
    };

    const calibreMapping = {
        'P': 'Medida 1',
        'M': 'Medida 2',
        'G': 'Medida 3',
        'GG': 'Medida 4',
        'GGG': 'Medida 5',
        '16': 'Medida 6',
        '14': 'Medida 7',
        '12P': 'Medida 8',
        '12M': 'Medida 9',
        '12G': 'Medida 10',
    };



    const handleNombreEspChange = (e) => {
        const selectedNombreEsp = e.target.value;

        setNombreEsp(selectedNombreEsp);
        const selectedNombreEng = nombresMappings[selectedNombreEsp] || '';
        setNombreEng(selectedNombreEng);

        if (selectedNombreEsp === 'GRANEL') {
            setPresentacion('1');
        } else {
            setPresentacion('');
        }
    };

    const handleMarcaChange = (e) => {
        const selectedMarca = e.target.value;
        setMarca(selectedMarca);
    };

    const handleMedidasPackagingChange = (e) => {
        const medidasPackaging = e.target.value;
        setTamanoCaja(medidasPackaging);
    };

    const handleCalibreChange = (e) => {
        const calibreMapping = e.target.value;
        setCalibre(calibreMapping);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get('http://catalogo.granadalapalma.com:5000/users');
                setAvailableUsers(usersResponse.data.users);

                const productsResponse = await axios.get('http://catalogo.granadalapalma.com:5000/productos'); // Cambiado de 'products' a 'productos'
                setAvailableProducts(productsResponse.data.products);
            } catch (error) {
                console.error('Error al obtener la lista de usuarios o productos:', error.response.data.error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
    }, [availableUsers]);

    const handleFileChange1 = (event) => {
        setSelectedFilePackaging(event.target.files[0]);
    };

    const handleFileChange2 = (event) => {
        setSelectedFilePackaging2(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('file', selectedFilePackaging);
            formData.append('file2', selectedFilePackaging2);
            formData.append('nombreesp', nombreesp);
            formData.append('nombreeng', nombreeng);
            formData.append('marca', marca);
            formData.append('presentacion', presentacion);
            formData.append('calibre', calibre);
            formData.append('peso_presentacion_g', pesoPresentacion);
            formData.append('peso_neto_kg', pesoNeto);
            formData.append('tamano_caja', tamanoCaja);
            formData.append('pallet_80x120', pallet80x120);
            formData.append('peso_neto_pallet_80x120_kg', pesoNetoPallet80x120);
            formData.append('pallet_100x120', pallet100x120);
            formData.append('peso_neto_pallet_100x120_kg', pesoNetoPallet100x120);
            formData.append('pallet_avion', palletAvion);
            formData.append('peso_neto_pallet_avion', pesoNetoPalletAvion);
            formData.append('producto_id', productIds);

            userIds.forEach((userId) => {
                formData.append('user_ids', userId);
            });
            const response = await axios.post('http://catalogo.granadalapalma.com:5000/upload_packaging', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // Actualiza el estado de packagings después de la carga exitosa
                fetchData();
                // Cambia el estado para activar el useEffect y recargar los datos
                setUpdatedPackaging(new Date());
                // Cambia el estado para activar la actualización de filteredPackagings
                setActualizacionProductos(true);
            }
        } catch (error) {
            console.error('Error en la carga del embalaje:', error.response.data.error);
            // Manejar el error según sea necesario
        }
    };


    const handlePesoNetoCalculo = () => {
        // Verifica que ambos campos tengan valores numéricos antes de calcular
        if (!isNaN(presentacion) && !isNaN(pesoPresentacion)) {
            const pesoNetoCalculado = (presentacion * pesoPresentacion) / 1000;
            setPesoNeto(pesoNetoCalculado.toFixed(2)); // Ajusta la cantidad de decimales según tus necesidades
        }
    };

    const handlePesoNetoPalletCalculo = (unidades, setPesoNetoPallet) => {
        // Verifica que ambos campos tengan valores numéricos antes de calcular
        if (!isNaN(pesoNeto) && !isNaN(unidades)) {
            const pesoNetoPalletCalculado = pesoNeto * unidades;
            setPesoNetoPallet(pesoNetoPalletCalculado.toFixed(2)); // Ajusta la cantidad de decimales según tus necesidades
        }
    };


    const [packagingData, setPackagingData] = useState([]);
    const [updatedPackaging, setUpdatedPackaging] = useState(null);
    const [actualizacionProductos, setActualizacionProductos] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://catalogo.granadalapalma.com:5000/productos');
                const data = response.data.products;
                console.log(response.data)

                setPackagingData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [updatedPackaging]);


    // UseEffect para recargar datos cuando actualizacionProductos cambia
    useEffect(() => {
        if (actualizacionProductos) {
            // Fetch the updated list of products right after successful upload
            axios.get('http://catalogo.granadalapalma.com:5000/productos')
                .then((response) => {
                    setPackagingData(response.data.products);
                })
                .catch((error) => {
                    console.error('Error al obtener los productos después de cargar', error);
                });

            // Reiniciar el estado de actualización después de cargar los productos
            setActualizacionProductos(false);
        }
    }, [actualizacionProductos]);


    const handleDeletePackaging = async (packagingId) => {
        try {
            const response = await axios.delete(`http://catalogo.granadalapalma.com:5000/packagings/${packagingId}`);
            if (response.status === 200) {
                // Recargar los datos después de una eliminación exitosa
                fetchData();
            }
        } catch (error) {
            console.error('Error al eliminar el packaging:', error.response.data.error);
            // Manejar el error según sea necesario
        }
    };


    const handlePackagingCheckboxChange = (id, type) => {
        const stringId = String(id);

        if (type === 'user') {
            setUserIds((prevUserIds) =>
                prevUserIds.includes(stringId)
                    ? prevUserIds.filter((userId) => userId !== stringId)
                    : [...prevUserIds, stringId]
            );
        } else if (type === 'product') {
            setProductoId((prevProductId) =>
                prevProductId === stringId ? '' : stringId
            );

            setProductIds((prevProductIds) =>
                prevProductIds.includes(stringId)
                    ? prevProductIds.filter((productId) => productId !== stringId)
                    : [...prevProductIds, stringId]
            );
        }
    };

    const [packagings, setPackagings] = useState([]);
    const [filters, setFilters] = useState({
        nombreesp: '',
        calibre: '',
        marca: '',
        nombreproducto: ''
    });


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://catalogo.granadalapalma.com:5000/packagings');
            setPackagings(response.data.packagings);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getUniqueValues = (columnName) => {
        const uniqueValues = new Set(packagings.map((packaging) => packaging[columnName]));
        return Array.from(uniqueValues);
    };

    const handleFilterChange = (columnName, value) => {
        setFilters({ ...filters, [columnName]: value });
    };

    const filteredPackagings = packagings.filter((packaging) => {
        return (
            (filters.nombreesp === '' || packaging.nombreesp.toLowerCase().includes(filters.nombreesp.toLowerCase())) &&
            (filters.calibre === '' || packaging.calibre.toLowerCase() === filters.calibre.toLowerCase()) &&
            (filters.marca === '' || packaging.marca.toLowerCase().includes(filters.marca.toLowerCase())) &&
            (filters.nombreproducto === '' || packaging.nombreproducto.toLowerCase().includes(filters.nombreproducto.toLowerCase()))

        );
    });


    const [editingPackaging, setEditingPackaging] = useState(null);
    const [editedUsers, setEditedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);  // Nuevo estado para todos los usuarios


    useEffect(() => {
        // Realizar la solicitud GET para obtener los packagings
        axios.get('http://catalogo.granadalapalma.com:5000/packagings')
            .then(response => {
                setPackagings(response.data.packagings);
            })
            .catch(error => {
                console.error('Error al obtener los packagings:', error);
            });

        // Realizar la solicitud GET para obtener todos los usuarios
        axios.get('http://catalogo.granadalapalma.com:5000/users')
            .then(response => {
                setAllUsers(response.data.users);
            })
            .catch(error => {
                console.error('Error al obtener todos los usuarios:', error);
            });
    }, []); // Se ejecuta solo una vez al montar el componente

    const handleEditUsers = (packaging) => {
        setEditingPackaging(packaging);
        setEditedUsers([...packaging.users]);
    };

    const handleCancelEdit = () => {
        setEditingPackaging(null);
        setEditedUsers([]);
    };

    const handleSaveUsers = async () => {
        try {
            // Realizar la solicitud PUT para actualizar los usuarios asociados al packaging
            await axios.put(`http://catalogo.granadalapalma.com:5000/packagings/${editingPackaging.id}/edit_users`, {
                users: editedUsers.map(user => user.id),
            });


            // Actualizar la lista de packagings después de la edición
            axios.get('http://catalogo.granadalapalma.com:5000/packagings')
                .then(response => {
                    setPackagings(response.data.packagings);
                });

            // Restablecer el estado de edición
            setEditingPackaging(null);
            setEditedUsers([]);
        } catch (error) {
            console.error('Error al guardar los usuarios:', error);
        }
    };

    const handleUserCheckboxChange = (user) => {
        setEditedUsers(prevUsers => {
            if (prevUsers.some(u => u.id === user.id)) {
                // Usuario ya está seleccionado, quitarlo
                return prevUsers.filter(u => u.id !== user.id);
            } else {
                // Usuario no está seleccionado, agregarlo
                return [...prevUsers, user];
            }
        });
    };

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

    const removeAccents = (str) => {
        return unorm.nfd(str).replace(/[\u0300-\u036f]/g, "");
    };

    const removeAsterisks = (str) => {
        return str.replace(/\*/g, '');
    };


    return (
        <div className='animate-flip-down mx-auto px-10'>
            <form className="grid md:grid-cols-3 gap-6 mb-5">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Selecciona un producto</span>
                    </label>
                    <select
                        className="select select-bordered w-full"
                        value={productIds}
                        onChange={(e) => {
                            const selectedProductId = e.target.value;
                            setProductIds(selectedProductId);
                        }}>
                        <option value="" disabled>Selecciona un producto</option>
                        {availableProducts.map((product) => (
                            <option key={product.id} value={String(product.id)}>
                                {product.nombreesp}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Nombre Packaging</span>
                    </label>
                    <select
                        id="name_packaging_esp"
                        className="input input-bordered w-full"
                        value={nombreesp}
                        onChange={handleNombreEspChange}
                        required
                    >
                        <option value="" disabled>
                            Selecciona el tipo de Packaging
                        </option>
                        {Object.keys(nombresMappings).map((nombreEspOption) => (
                            <option key={nombreEspOption} value={nombreEspOption}>
                                {nombreEspOption}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Nombre Packaging Inglés</span>
                    </label>
                    <input
                        type="text"
                        id="name_packaging_eng"
                        className="input input-bordered w-full"
                        placeholder="Nombre Packaging Ingles"
                        value={nombreeng}
                        readOnly
                        required
                        disabled
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Marca Caja Packaging</span>
                    </label>
                    <select
                        id="name_marca_esp"
                        className="input input-bordered w-full"
                        value={marca}
                        onChange={handleMarcaChange}
                        required
                    >
                        <option value="" disabled>

                            Selecciona la Marca de la Caja
                        </option>
                        {Object.keys(marcasMapping).map((marcasOption) => (
                            <option key={marcasOption} value={marcasOption}>
                                {marcasOption}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Unidades por Confección</span>
                    </label>
                    <input
                        type="text"
                        id="presentacion"
                        className="input input-bordered w-full"
                        placeholder="Unidades"
                        value={presentacion}
                        onChange={(e) => setPresentacion(e.target.value)}
                        required
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Calibre</span>
                    </label>
                    <select
                        id="calibre"
                        className="input input-bordered w-full"
                        value={calibre}
                        onChange={handleCalibreChange}
                        required
                    >
                        <option value="" disabled>
                            Selecciona el calibre del Producto
                        </option>
                        {Object.keys(calibreMapping).map((calibresOption) => (
                            <option key={calibresOption} value={calibresOption}>
                                {calibresOption}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Medidas de la Caja</span>
                    </label>
                    <select
                        id="tamanocaja"
                        className="input input-bordered w-full"
                        value={tamanoCaja}
                        onChange={handleMedidasPackagingChange}
                        required
                    >
                        <option value="" disabled>
                            Selecciona la Medida de la Caja
                        </option>
                        {Object.keys(medidasPackaging).map((medidasOption) => (
                            <option key={medidasOption} value={medidasOption}>
                                {medidasOption}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Peso Neto de la Unidad (g)</span>
                    </label>
                    <input
                        type="text"
                        id="pesopresentacion"
                        className="input input-bordered w-full"
                        placeholder="Introduce el Peso Neto Confección (g)"
                        onChange={(e) => setPesoPresentacion(e.target.value)}
                        onBlur={handlePesoNetoCalculo}
                        required

                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Peso Neto Confección (Kg)</span>
                    </label>
                    <input
                        type="text"
                        id="pesoneto"
                        className="input input-bordered w-full"
                        placeholder="Peso Neto Confección (kg)"
                        value={pesoNeto}
                        readOnly
                        disabled
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Cajas por Pallet 80x120</span>
                    </label>
                    <input
                        type="text"
                        id="pallet80x120"
                        className="input input-bordered w-full"
                        placeholder="Introduce Cajas por Pallet 80x120"
                        onChange={(e) => setPallet80x120(e.target.value)}
                        onBlur={() => handlePesoNetoPalletCalculo(pallet80x120, setPesoNetoPallet80x120)}
                        required
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Peso Neto Pallet 80x120 (kg)</span>
                    </label>
                    <input
                        type="text"
                        id="pesoNetoPallet80x120"
                        className="input input-bordered w-full"
                        placeholder="Peso Neto Pallet 80x120 (kg)"
                        value={pesoNetoPallet80x120}
                        readOnly
                        disabled
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Cajas por Pallet 100x120</span>
                    </label>
                    <input
                        type="text"
                        id="pallet100x120"
                        className="input input-bordered w-full"
                        placeholder="Unidades Por Pallet 100x120"
                        onChange={(e) => setPallet100x120(e.target.value)}
                        onBlur={() => handlePesoNetoPalletCalculo(pallet100x120, setPesoNetoPallet100x120)}
                        required
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Peso Neto Pallet 100x120 (kg)</span>
                    </label>
                    <input
                        type="text"
                        id="pesoNetoPallet100x120"
                        className="input input-bordered w-full"
                        placeholder="Peso Neto Pallet 100x120 (kg)"
                        value={pesoNetoPallet100x120}
                        readOnly
                        disabled
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Cajas por Pallet Avión</span>
                    </label>
                    <input
                        type="text"
                        id="palletAvion"
                        className="input input-bordered w-full"
                        placeholder="Introduce Cajas por Pallet Avion"
                        onChange={(e) => setPalletAvion(e.target.value)}
                        onBlur={() => handlePesoNetoPalletCalculo(palletAvion, setPesoNetoPalletAvion)}
                        required
                    />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Peso Neto Pallet Avión (kg)</span>
                    </label>
                    <input
                        type="text"
                        id="pesoNetoPallet80x120"
                        className="input input-bordered w-full"
                        placeholder="Peso Neto Pallet Avion"
                        value={pesoNetoPalletAvion}
                        readOnly
                        disabled
                    />
                </div>

                {/* Mostrar nombres de usuarios disponibles */}
                {availableUsers.length > 0 && (
                    <div className="form-control">
                        <p>Usuarios disponibles:</p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {availableUsers.map((user) => (
                                <li key={user.id} style={{ display: 'inline-block', marginRight: '10px' }}>
                                    <label className="cursor-pointer label">
                                        <input
                                            type="checkbox"
                                            value={user.id}
                                            onChange={() => handlePackagingCheckboxChange(user.id, 'user')}
                                            checked={userIds.includes(String(user.id))} // Convertir a cadena para la comparación
                                            className="checkbox checkbox-success"
                                        />
                                        <span className="label-text ml-2">{user.username}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Foto Unidad</span>
                    </label>
                    <input type="file" className="file-input file-input-bordered file-input-success w-full" onChange={handleFileChange1} required />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Foto Confección</span>
                    </label>
                    <input type="file" className="file-input file-input-bordered file-input-success w-full" onChange={handleFileChange2} required />
                </div>
                <div className='mx-auto md:col-start-2 mt-5 '>
                    <button onClick={handleSubmit} type="button" className="btn btn-outline btn-success">Crear Packaging</button>
                </div>
            </form>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Foto Unidad</th>
                            <th>Foto Confección</th>
                            <th>
                                <select
                                    value={filters.nombreproducto}
                                    onChange={(e) => handleFilterChange('nombreproducto', e.target.value)}
                                    className="border border-gray-300 px-2 py-1"
                                >
                                    <option value="">Seleccionar</option>
                                    {getUniqueValues('nombreproducto').map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </th>
                            <th>
                                <select
                                    className="border border-gray-300 px-2 py-1"
                                    value={filters.nombreesp}
                                    onChange={(e) => handleFilterChange('nombreesp', e.target.value)}
                                >
                                    <option value="">Seleccionar</option>
                                    {getUniqueValues('nombreesp').map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </th>
                            <th>
                                <select
                                    value={filters.marca}
                                    onChange={(e) => handleFilterChange('marca', e.target.value)}
                                    className="border border-gray-300 px-2 py-1"
                                >
                                    <option value="">Seleccionar</option>
                                    {getUniqueValues('marca').map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </th>
                            <th>                <select
                                value={filters.calibre}
                                onChange={(e) => handleFilterChange('calibre', e.target.value)}
                                className="border border-gray-300 px-2 py-1"
                            >
                                <option value="">Seleccionar Calibre</option>
                                {getUniqueValues('calibre').map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            </th>
                            <th>Unidades</th>
                            <th>Peso Packaging (g)</th>
                            <th>Peso Neto Confección (kg)</th>
                            <th>Tamaño Caja</th>
                            <th>Unidades Pallet 80x120</th>
                            <th>Peso Neto Pallet 80x120 (kg)</th>
                            <th>Unidades Pallet 100x120</th>
                            <th>Peso Neto Pallet 100x120 (kg)</th>
                            <th>Unidades Pallet Avión</th>
                            <th>Peso Neto Pallet Avión (kg)</th>
                            <th>Clientes</th>
                            <th>Editar Usuarios</th>
                            <th>Eliminar Packaging</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {filteredPackagings.map((packaging) => (
                            <tr key={packaging.id}>
                                <td className="py-2 px-4 border-b">
                                    <img
                                        src={`http://catalogo.granadalapalma.com:5000/uploads/${removeAccents(packaging.categoria)}/${removeAccents(packaging.producto)}/${removeAccents(removeAsterisks(packaging.nombreesp.replace(/ /g, '_')))}/${removeAsterisks(packaging.tamano_caja)}/${packaging.calibre}/${packaging.foto}`}
                                        alt={`Imagen de ${packaging.nombreesp}`}
                                        className="max-w-full h-auto cursor-pointer"
                                        onClick={(event) => openImageModal(event)}
                                    />

                                </td>
                                <td className="py-2 px-4 border-b">
                                    {packaging.foto2 ? (
                                        <img
                                            src={`http://catalogo.granadalapalma.com:5000/uploads/${removeAccents(packaging.categoria)}/${removeAccents(packaging.producto)}/${removeAccents(removeAsterisks(packaging.nombreesp.replace(/ /g, '_')))}/${removeAsterisks(packaging.tamano_caja)}/${packaging.calibre}/${packaging.foto2}`}
                                            alt={packaging.nombreesp}
                                            className="max-w-full h-auto cursor-pointer"
                                            onClick={(event) => openImageModal(event)}
                                        />
                                    ) : (
                                        <img
                                            src={logo}
                                            className="max-w-full h-auto cursor-pointer"
                                        />
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">{packaging.nombreproducto}</td>
                                <td className="py-2 px-4 border-b">{packaging.nombreesp}</td>
                                <td className="py-2 px-4 border-b">{packaging.marca}</td>
                                <td className="py-2 px-4 border-b">{packaging.calibre}</td>
                                <td className="py-2 px-4 border-b">{packaging.presentacion}</td>
                                <td className="py-2 px-4 border-b">{packaging.peso_presentacion_g}</td>
                                <td className="py-2 px-4 border-b">{packaging.peso_neto_kg}</td>
                                <td className="py-2 px-4 border-b">{packaging.tamano_caja}</td>
                                <td className="py-2 px-4 border-b">{packaging.pallet_80x120}</td>
                                <td className="py-2 px-4 border-b">{packaging.peso_neto_pallet_80x120_kg}</td>
                                <td className="py-2 px-4 border-b">{packaging.pallet_100x120}</td>
                                <td className="py-2 px-4 border-b">{packaging.peso_neto_pallet_100x120_kg}</td>
                                <td className="py-2 px-4 border-b">{packaging.pallet_avion}</td>
                                <td className="py-2 px-4 border-b">{packaging.peso_neto_pallet_avion}</td>
                                <td className="py-2 px-4 border-b">
                                    {editingPackaging && editingPackaging.id === packaging.id ? (
                                        // Mostrar checkboxes para todos los usuarios disponibles en modo de edición
                                        allUsers.map(user => (
                                            <div key={user.id} className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    checked={editedUsers.some((u) => u.id === user.id)}
                                                    onChange={() => handleUserCheckboxChange(user)}
                                                    className="checkbox checkbox-success"

                                                />
                                                <span className="ml-2">{user.username}</span>
                                            </div>
                                        ))
                                    ) : (
                                        // Mostrar solo los usuarios asociados en modo de visualización normal
                                        packaging.users.map(user => (
                                            <div key={user.id}>{user.username}</div>
                                        ))
                                    )}
                                </td>

                                <td className="py-2 px-4 border-b">
                                    {editingPackaging && editingPackaging.id === packaging.id ? (
                                        // Mostrar botones de guardado y cancelación durante la edición
                                        <>
                                            <button className="btn btn-outline btn-success" onClick={handleSaveUsers}>Guardar</button>
                                            <button className="btn btn-outline btn-error" onClick={handleCancelEdit}>Cancelar</button>
                                        </>
                                    ) : (
                                        // Mostrar botón de editar en modo de visualización normal
                                        <button className="btn btn-outline btn-warning" onClick={() => handleEditUsers(packaging)}>Editar Usuarios</button>
                                    )}
                                </td>

                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleDeletePackaging(packaging.id)}
                                        className="btn btn-outline btn-danger"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal */}
                <dialog id="image_modal" className={`modal ${isModalOpen ? 'open' : ''}`}>
                    <div className="modal-box">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeImageModal}>✕</button>
                        </form>
                        <img id="modal_image" alt="Modal" src={modalImageUrl} className="w-full h-full object-cover" />
                    </div>
                </dialog>
            </div>
        </div >

    );
}

export default AdminPackaging;
