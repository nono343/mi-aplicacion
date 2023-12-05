import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminProductos() {
    const [selectedFileProduct, setSelectedFileProduct] = useState(null);
    const [selectedFileProduct2, setSelectedFileProduct2] = useState(null);
    const [uploadedFileNameProduct, setUploadedFileNameProduct] = useState('');
    const [nombreEspProduct, setNombreEspProduct] = useState('');
    const [nombreEngProduct, setNombreEngProduct] = useState('');
    const [variedadEsp, setVariedadEsp] = useState('');
    const [variedadEng, setVariedadEng] = useState('');
    const [descripcionEsp, setDescripcionEsp] = useState('');
    const [descripcionEng, setDescripcionEng] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [monthProduction, setMonthProduction] = useState([]);
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);

    const variedadMapping = {
        'Tomate Dulce': 'Sweet Tomatoe',
        'Tomate Asurcado Marrón': 'Brown Roasted Tomato',
        'Tomate Asurcado Rosa': 'Pink Roasted Tomato',
    };


    console.log(products)
    // Función para obtener la lista de categorías desde el servidor
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        // Realiza una solicitud GET para obtener las categorías
        axios.get("http://catalogo.granadalapalma.com:5000/categorias")
            .then((response) => setCategories(response.data.categories))
            .catch((error) => console.error('Error al obtener las categorías', error));
    };

    useEffect(() => {
        // Fetch products when the component mounts
        axios.get('http://catalogo.granadalapalma.com:5000/productos')
            .then(response => setProducts(response.data.products))
            .catch(error => console.error('Error al obtener la lista de productos:', error));
    }, []);



    const handleFileChangeProduct = (event) => {
        setSelectedFileProduct(event.target.files[0]);
    };

    const handleFileChangeProduct2 = (event) => {
        setSelectedFileProduct2(event.target.files[0]);
    };

    const handleNombreEspChangeProduct = (event) => {
        setNombreEspProduct(event.target.value);
    };

    const handleNombreEngChangeProduct = (event) => {
        setNombreEngProduct(event.target.value);
    };


    const handleVariedadEspChange = (event) => {
        const selectedVariedadEsp = event.target.value;

        setVariedadEsp(selectedVariedadEsp);
        const selectedVariedadEng = variedadMapping[selectedVariedadEsp] || '';
        setVariedadEng(selectedVariedadEng);

    };



    const handleDescripcionEspChange = (event) => {
        setDescripcionEsp(event.target.value);
    };

    const handleDescripcionEngChange = (event) => {
        setDescripcionEng(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategoryId(event.target.value);
    };

    const handleCheckboxChange = (month) => {
        if (monthProduction.includes(month)) {
            setMonthProduction((prevMonths) => prevMonths.filter((prevMonth) => prevMonth !== month));
        } else {
            setMonthProduction((prevMonths) => [...prevMonths, month]);
        }
    };

    // Función para limpiar el formulario
    const clearForm = () => {
        console.log("Limpiando formulario...");
        setSelectedFileProduct(null);
        setSelectedFileProduct2(null);
        setUploadedFileNameProduct("");
        setNombreEspProduct("");
        setNombreEngProduct("");
        setVariedadEsp("");
        setVariedadEng("");
        setDescripcionEsp("");
        setDescripcionEng("");
        setCategoryId("");
        setMonthProduction([]);
        setEditingProduct(null);
    };

    // Función para cargar un producto
    const handleUploadProduct = async () => {
        if (
            selectedFileProduct &&
            nombreEspProduct &&
            nombreEngProduct &&
            categoryId &&
            monthProduction.length > 0
        ) {
            const formData = new FormData();
            formData.append('file', selectedFileProduct);
            formData.append('file2', selectedFileProduct2);
            formData.append('nombreesp', nombreEspProduct);
            formData.append('nombreeng', nombreEngProduct);
            formData.append('variedadEsp', variedadEsp);
            formData.append('variedadEng', variedadEng);
            formData.append('descripcionesp', descripcionEsp);
            formData.append('descripcioneng', descripcionEng);
            formData.append('categoria', categoryId);

            monthProduction.forEach((month) => {
                formData.append('mes_produccion', month);
            });

            try {
                const response = await axios.post('http://catalogo.granadalapalma.com:5000/upload_product', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    setUploadedFileNameProduct(response.data.message);

                    // Fetch the updated list of products right after a successful upload
                    const updatedProductsResponse = await axios.get('http://catalogo.granadalapalma.com:5000/productos');
                    setProducts(updatedProductsResponse.data.products || []);

                    console.log('Product uploaded successfully:', response.data.message);

                    // Después de cargar, limpia el formulario
                    clearForm();
                } else {
                    console.error('Error al cargar el producto con foto');
                }
            } catch (error) {
                console.error('Error al cargar el producto con foto', error);
            }
        } else {
            console.error('Faltan campos obligatorios para cargar el producto');
        }
    };

    const handleDelete = async (productId) => {
        try {
            // Lógica para eliminar el producto con el ID proporcionado
            const response = await axios.delete(`http://catalogo.granadalapalma.com:5000/productos/${productId}`);
            if (response.status === 200) {
                // Actualizar la lista de productos después de la eliminación
                const updatedProductsResponse = await axios.get('http://catalogo.granadalapalma.com:5000/productos');
                setProducts(updatedProductsResponse.data.products || []);
            } else {
                console.error('Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar el producto', error);
        }
    };

    // Función para iniciar la edición de una categoría
    const handleEditProducts = (product) => {
        setEditingProduct(product);
        setNombreEspProduct(product.nombreesp);
        setNombreEngProduct(product.nombreeng);
        setVariedadEsp(product.variedadesp);
        setVariedadEng(product.variedadeng);
        setDescripcionEsp(product.descripcionesp);
        setDescripcionEng(product.descripcioneng);
        setCategoryId(product.categoria_id)
        setSelectedFileProduct(null);
        setSelectedFileProduct2(null);
    };

    // Función para cancelar la edición de una categoría
    const handleCancelEditProducts = () => {
        setEditingProduct(null);
        setNombreEspProduct("");
        setNombreEngProduct("");
        setVariedadEsp("");
        setVariedadEng("");
        setDescripcionEsp("");
        setDescripcionEng("");
        setSelectedFileProduct(null);
        setSelectedFileProduct2(null);
        clearForm();
    };

    // Función para actualizar una categoría después de editar
    const handleUpdateProduct = async () => {
        if (selectedFileProduct && nombreEspProduct && nombreEngProduct && categoryId) {
            try {
                const formData = new FormData();
                formData.append('file', selectedFileProduct);
                formData.append('file2', selectedFileProduct2);
                formData.append('nombreesp', nombreEspProduct);
                formData.append('nombreeng', nombreEngProduct);
                formData.append('variedadesp', variedadEsp);
                formData.append('variedadeng', variedadEng);
                formData.append('descripcionesp', descripcionEsp);
                formData.append('descripcioneng', descripcionEng);
                formData.append('categoria', categoryId);

                const response = await axios.put(
                    `http://catalogo.granadalapalma.com:5000/edit_product/${editingProduct.id}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                // Verifica la respuesta del servidor
                if (response.status === 200) {
                    // Actualiza el estado de la lista de categorías y reinicia los estados de edición
                    const updatedProductsResponse = await axios.get('http://catalogo.granadalapalma.com:5000/productos');
                    setProducts(updatedProductsResponse.data.products || []);

                    console.log('Product updated successfully:', response.data.message);

                    // Después de actualizar, limpia el formulario
                    clearForm();
                } else {
                    console.error("Error al actualizar el producto con foto");
                }
            } catch (error) {
                console.error("Error al actualizar el producto con foto", error);
            }
        } else {
            console.error("Todos los campos son obligatorios");
        }
    };


    return (
        <div className='animate-flip-down mx-auto px-10'>
            <form className="grid md:grid-cols-3 gap-6">
                <div className="form-control w-full ">
                    <label className="label">
                        <span className="label-text">Nombre Producto Español</span>
                    </label>
                    <input type="text" id="name_product_esp" className="input input-bordered w-full " placeholder="Nombre Producto Español" value={nombreEspProduct} onChange={handleNombreEspChangeProduct} required />
                </div>
                <div className="form-control w-full ">
                    <label className="label">
                        <span className="label-text">Nombre Producto Inglés</span>
                    </label>
                    <input type="text" id="name_product_eng" className="input input-bordered w-full " placeholder="Nombre Producto Inglés" value={nombreEngProduct} onChange={handleNombreEngChangeProduct} required />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Variedad</span>
                    </label>
                    <select
                        id="name_variedad_esp"
                        className="input input-bordered w-full"
                        value={variedadEsp}
                        onChange={handleVariedadEspChange}
                        required
                    >
                        <option value="" disabled>
                            Selecciona el tipo de Variedad
                        </option>
                        {Object.keys(variedadMapping).map((variedadEspOption) => (
                            <option key={variedadEspOption} value={variedadEspOption}>
                                {variedadEspOption}
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
                        value={variedadEng}
                        readOnly
                        required
                        disabled
                    />
                </div>

                <div className="form-control w-full ">
                    <label className="label">
                        <span className="label-text">Descripción Producto Español</span>
                    </label>
                    <input type="text" id="description_product_esp" className="input input-bordered w-full " placeholder="Descripción Producto Español" value={descripcionEsp} onChange={handleDescripcionEspChange} required />
                </div>
                <div className="form-control w-full ">
                    <label className="label">
                        <span className="label-text">Descripción Producto Inglés</span>
                    </label>
                    <input type="text" id="description_product_eng" className="input input-bordered w-full " placeholder="Descripción Producto Inglés" value={descripcionEng} onChange={handleDescripcionEngChange} required />
                </div>
                <div className='form-control w-full "'>
                    <label className="label">
                        <span className="label-text">Categoría</span>
                    </label>
                    <select
                        className="select select-bordered w-full"
                        value={categoryId}
                        onChange={handleCategoryChange}
                    >
                        <option value="" disabled>Seleccionar categoría</option>
                        {categories && categories.length > 0 && categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.nombreesp} - {category.nombreeng}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Foto Producto Abierto</span>
                    </label>
                    <input type="file" className="file-input file-input-bordered file-input-success w-full" onChange={handleFileChangeProduct} required />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Foto Producto Cerrado</span>
                    </label>
                    <input type="file" className="file-input file-input-bordered  file-input-success w-full" onChange={handleFileChangeProduct2} required />
                </div>
                <div className='form-control w-full md:col-span-2 lg:col-span-2 xl:col-span-2'>
                    <label htmlFor="monthSelector" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-3">
                        Meses de producción:
                    </label>
                    <ul className="grid grid-cols-4 lg:grid-cols-12 gap-4 items-center text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                            <li key={month} className="w-full lg:w-auto border-r last:border-r-0 border-gray-200 dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <input
                                        id={`month-${month}`}
                                        type="checkbox"
                                        value={month}
                                        className="checkbox checkbox-success"
                                        checked={monthProduction.includes(month)}
                                        onChange={() => handleCheckboxChange(month)}
                                    />
                                    <label
                                        htmlFor={`month-${month}`}
                                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >{`${month}`}</label>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </form>
            <div className='flex justify-center md:col-start-2 mb-5 mt-5'>
                <button onClick={handleUploadProduct} type="button" className="btn btn-outline btn-success">Crear Producto</button>
            </div>
            <div className="overflow-x-auto mt-5">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Foto2</th>
                            <th>Nombre</th>
                            <th className="hidden md:table-cell">Nombre Inglés</th>
                            <th className="hidden md:table-cell">Variedad</th>
                            <th className="hidden md:table-cell">Descripción</th>
                            <th className="hidden md:table-cell">Descripción Inglés</th>
                            <th>Meses de Producción</th>
                            <th>Editar Producto</th>
                            <th>Eliminar Producto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products &&
                            products.length > 0 &&
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img
                                                        src={`http://catalogo.granadalapalma.com:5000/uploads/${product.categoria_nombreesp}/${product.nombreesp}/${product.foto}`}
                                                        alt={product.nombreesp} />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={`http://catalogo.granadalapalma.com:5000/uploads/${product.categoria_nombreesp}/${product.nombreesp}/${product.foto2}`}
                                                        alt={product.nombreesp} />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{product.nombreesp}</td>
                                    <td className="hidden md:table-cell">{product.nombreeng}</td>
                                    <td className="hidden md:table-cell">{product.tipo}</td>
                                    <td className="hidden md:table-cell">{product.descripcionesp}</td>
                                    <td className="hidden md:table-cell">{product.descripcioneng}</td>
                                    <td>
                                        {product.meses_produccion &&
                                            product.meses_produccion.map((mes) => <span key={mes}>{mes} </span>)}
                                    </td>
                                    <td>
                                        <button onClick={() => handleEditProducts(product)} className="btn btn-outline btn-warning">
                                            Editar
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-outline btn-error"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {editingProduct && (
                    <div className="mt-5">
                        <h2>Editar Categoría</h2>
                        <form className="grid md:grid-cols-3 gap-6">
                            <div className="form-control w-full">
                                <input
                                    type="text"
                                    id="edit_name_esp"
                                    className="input input-bordered w-full"
                                    placeholder="Nombre Categoría Español"
                                    onChange={handleNombreEspChangeProduct}
                                    value={nombreEspProduct}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <input
                                    type="text"
                                    id="edit_name_eng"
                                    className="input input-bordered w-full"
                                    placeholder="Nombre Categoría Inglés"
                                    onChange={handleNombreEngChangeProduct}
                                    value={nombreEngProduct}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <input
                                    type="text"
                                    id="edit_desc_esp"
                                    className="input input-bordered w-full"
                                    placeholder="Nombre Categoría Español"
                                    onChange={handleDescripcionEspChange}
                                    value={descripcionEsp}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <input
                                    type="text"
                                    id="edit_desc_eng"
                                    className="input input-bordered w-full"
                                    placeholder="Nombre Categoría Inglés"
                                    onChange={handleDescripcionEngChange}
                                    value={descripcionEng}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full"
                                    onChange={handleFileChangeProduct}
                                />
                            </div>
                            <div className="form-control w-full">
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full"
                                    onChange={handleFileChangeProduct2}
                                />
                            </div>
                            <div className="mx-auto md:col-start-2 mt-5">
                                <button
                                    onClick={handleUpdateProduct}
                                    type="button"
                                    className="btn btn-outline btn-success"
                                >
                                    Actualizar Categoría
                                </button>
                                <button
                                    onClick={handleCancelEditProducts}
                                    type="button"
                                    className="btn btn-outline btn-danger ml-2"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminProductos;
