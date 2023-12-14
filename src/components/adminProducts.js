import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProducts = () => {
    const [selectedFileProduct, setSelectedFileProduct] = useState(null);
    const [selectedFileProduct2, setSelectedFileProduct2] = useState(null);
    const [uploadedFileNameProduct, setUploadedFileNameProduct] = useState('');
    const [nameEspProduct, setNameEspProduct] = useState('');
    const [nameEngProduct, setNameEngProduct] = useState('');
    const [varietyEsp, setVarietyEsp] = useState('');
    const [varietyEng, setVarietyEng] = useState('');
    const [descriptionEsp, setDescriptionEsp] = useState('');
    const [descriptionEng, setDescriptionEng] = useState('');
    const [claimEsp, setClaimEsp] = useState('');
    const [claimEng, setClaimEng] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [monthProduction, setMonthProduction] = useState([]);
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);

    const variedadMapping = {
        'Tomate Dulce': 'Sweet Tomatoe',
        'Tomate Asurcado Marrón': 'Brown Roasted Tomato',
        'Tomate Asurcado Rosa': 'Pink Roasted Tomato',
        'Tomate Asurcado Antociano': 'Anthocyan Roasted Tomato',
        'Tomate Tradicional': 'Traditional Tomato',
    };


    // Función para obtener la lista de categorías desde el servidor
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        // Realiza una solicitud GET para obtener las categorías
        axios.get("http://catalogo.granadalapalma.com:5000/categories")
            .then((response) => setCategories(response.data.categories))
            .catch((error) => console.error('Error al obtener las categorías', error));
    };

    useEffect(() => {
        // Fetch products when the component mounts
        axios.get('http://catalogo.granadalapalma.com:5000/products')
            .then(response => setProducts(response.data.products))
            .catch(error => console.error('Error al obtener la lista de productos:', error));
    }, []);



    const handleFileChangeProduct = (event) => {
        setSelectedFileProduct(event.target.files[0]);
    };

    const handleFileChangeProduct2 = (event) => {
        setSelectedFileProduct2(event.target.files[0]);
    };

    const handleNameEspChangeProduct = (event) => {
        setNameEspProduct(event.target.value);
    };

    const handleNameEngChangeProduct = (event) => {
        setNameEngProduct(event.target.value);
    };


    const handleVarietyEspChange = (event) => {
        const selectedVarietyEsp = event.target.value;

        setVarietyEsp(selectedVarietyEsp);
        const selectedVarietyEng = variedadMapping[selectedVarietyEsp] || '';
        setVarietyEng(selectedVarietyEng);

    };



    const handleDescriptionEspChange = (event) => {
        setDescriptionEsp(event.target.value);
    };

    const handleDescriptionEngChange = (event) => {
        setDescriptionEng(event.target.value);
    };

    const handleClaimEspChange = (event) => {
        setClaimEsp(event.target.value);
    };

    const handleClaimEngChange = (event) => {
        setClaimEng(event.target.value);
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
        setNameEspProduct("");
        setNameEngProduct("");
        setVarietyEsp("");
        setVarietyEng("");
        setDescriptionEsp("");
        setDescriptionEng("");
        setClaimEsp("");
        setClaimEng("");
        setCategoryId("");
        setMonthProduction([]);
        setEditingProduct(null);
    };

    // Función para cargar un producto
    const handleUploadProduct = async () => {
        if (
            selectedFileProduct &&
            nameEspProduct &&
            nameEngProduct &&
            categoryId &&
            monthProduction.length > 0
        ) {
            const formData = new FormData();
            formData.append('file', selectedFileProduct);
            formData.append('file2', selectedFileProduct2);
            formData.append('nameesp', nameEspProduct);
            formData.append('nameeng', nameEngProduct);
            formData.append('varietyesp', varietyEsp);
            formData.append('varietyeng', varietyEng);
            formData.append('descriptionesp', descriptionEsp);
            formData.append('descriptioneng', descriptionEng);
            formData.append('claimesp', claimEsp);
            formData.append('claimeng', claimEng);
            formData.append('category', categoryId);

            monthProduction.forEach((month) => {
                formData.append('month_production', month);
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
                    const updatedProductsResponse = await axios.get('http://catalogo.granadalapalma.com:5000/products');
                    setProducts(updatedProductsResponse.data.products || []);

                    console.log('Product uploaded successfully:', response.data.message);

                    // Después de cargar, limpia el formulario
                    clearForm();
                } else {
                    console.error('Error al cargar el producto con photo');
                }
            } catch (error) {
                console.error('Error al cargar el producto con photo', error);
            }
        } else {
            console.error('Faltan campos obligatorios para cargar el producto');
        }
    };

    const handleDelete = async (productId) => {
        try {
            // Lógica para eliminar el producto con el ID proporcionado
            const response = await axios.delete(`http://catalogo.granadalapalma.com:5000/products/${productId}`);
            if (response.status === 200) {
                // Actualizar la lista de productos después de la eliminación
                const updatedProductsResponse = await axios.get('http://catalogo.granadalapalma.com:5000/products');
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
        setNameEspProduct(product.nameesp);
        setNameEngProduct(product.nameeng);
        setVarietyEsp(product.varietyesp);
        setVarietyEng(product.varietyeng);
        setClaimEsp(product.claimesp);
        setClaimEng(product.claimeng);
        setDescriptionEsp(product.descriptionesp);
        setDescriptionEng(product.descriptioneng);
        setCategoryId(product.category_id)
        setSelectedFileProduct(null);
        setSelectedFileProduct2(null);
    };

    // Función para cancelar la edición de una categoría
    const handleCancelEditProducts = () => {
        setEditingProduct(null);
        setNameEspProduct("");
        setNameEngProduct("");
        setVarietyEsp("");
        setVarietyEng("");
        setClaimEsp("");
        setClaimEng("");
        setDescriptionEsp("");
        setDescriptionEng("");
        setSelectedFileProduct(null);
        setSelectedFileProduct2(null);
        clearForm();
    };

    // Función para actualizar una categoría después de editar
    const handleUpdateProduct = async () => {
        if ( nameEspProduct && nameEngProduct && categoryId) {
            try {
                const formData = new FormData();
                formData.append('file', selectedFileProduct);
                formData.append('file2', selectedFileProduct2);
                formData.append('nameesp', nameEspProduct);
                formData.append('nameeng', nameEngProduct);
                formData.append('varietyesp', varietyEsp);
                formData.append('varietyeng', varietyEng);
                formData.append('claimesp', claimEsp);
                formData.append('claimeng', claimEng);
                formData.append('descriptionesp', descriptionEsp);
                formData.append('descriptioneng', descriptionEng);
                formData.append('category', categoryId);

                const response = await axios.put(
                    `http://catalogo.granadalapalma.com:5000/edit_product/${editingProduct.id}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                // Verifica la respuesta del servidor
                if (response.status === 200) {
                    // Actualiza el estado de la lista de categorías y reinicia los estados de edición
                    const updatedProductsResponse = await axios.get('http://catalogo.granadalapalma.com:5000/products');
                    setProducts(updatedProductsResponse.data.products || []);

                    console.log('Product updated successfully:', response.data.message);

                    // Después de actualizar, limpia el formulario
                    clearForm();
                } else {
                    console.error("Error al actualizar el producto con photo");
                }
            } catch (error) {
                console.error("Error al actualizar el producto con photo", error);
            }
        } else {
            console.error("Todos los campos son obligatorios");
        }
    };


    return (
        <div className='animate-flip-down mx-auto px-10 mb-5'>
            <form className="grid md:grid-cols-3 gap-6">
                <div className="form-control w-full ">
                    <label className="label">
                        <span className="label-text">Nombre Producto Español</span>
                    </label>
                    <input type="text" id="name_product_esp" className="input input-bordered w-full " placeholder="Nombre Producto Español" value={nameEspProduct} onChange={handleNameEspChangeProduct} required />
                </div>
                <div className="form-control w-full ">
                    <label className="label">
                        <span className="label-text">Nombre Producto Inglés</span>
                    </label>
                    <input type="text" id="name_product_eng" className="input input-bordered w-full " placeholder="Nombre Producto Inglés" value={nameEngProduct} onChange={handleNameEngChangeProduct} required />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Variedad</span>
                    </label>
                    <select
                        id="name_variedad_esp"
                        className="input input-bordered w-full"
                        value={varietyEsp}
                        onChange={handleVarietyEspChange}
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
                        value={varietyEng}
                        readOnly
                        required
                        disabled
                    />
                </div>
                <div className="form-control w-full ">
                    <label className="label">
                        <span className="label-text">Claim Español</span>
                    </label>
                    <input type="text" id="description_product_esp" className="input input-bordered w-full " placeholder="Claim Español" value={claimEsp} onChange={handleClaimEspChange} required />
                </div>
                <div className="form-control w-full ">
                    <label className="label">
                        <span className="label-text">Claim Inglés</span>
                    </label>
                    <input type="text" id="description_product_eng" className="input input-bordered w-full " placeholder="Claim Inglés" value={claimEng} onChange={handleClaimEngChange} required />
                </div>
                <div className="form-control w-full ">
                    <label className="label">
                        <span className="label-text">Descripción Producto Español</span>
                    </label>
                    <input type="text" id="description_product_esp" className="input input-bordered w-full " placeholder="Descripción Producto Español" value={descriptionEsp} onChange={handleDescriptionEspChange} required />
                </div>
                <div className="form-control w-full ">
                    <label className="label">
                        <span className="label-text">Descripción Producto Inglés</span>
                    </label>
                    <input type="text" id="description_product_eng" className="input input-bordered w-full " placeholder="Descripción Producto Inglés" value={descriptionEng} onChange={handleDescriptionEngChange} required />
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
                                {category.nameesp} - {category.nameeng}
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
                            <th className="hidden md:table-cell">Variedad Inglés</th>
                            <th className="hidden md:table-cell">Claim Español</th>
                            <th className="hidden md:table-cell">Claim Inglés</th>
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
                                                        src={`http://catalogo.granadalapalma.com:5000/uploads/${product.category_nameesp}/${product.nameesp}/${product.photo}`}
                                                        alt={product.nameesp} />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={`http://catalogo.granadalapalma.com:5000/uploads/${product.category_nameesp}/${product.nameesp}/${product.photo2}`}
                                                        alt={product.nameesp} />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{product.nameesp}</td>
                                    <td className="hidden md:table-cell">{product.nameeng}</td>
                                    <td className="hidden md:table-cell">{product.varietyesp}</td>
                                    <td className="hidden md:table-cell">{product.varietyeng}</td>
                                    <td className="hidden md:table-cell">{product.claimesp}</td>
                                    <td className="hidden md:table-cell">{product.claimeng}</td>
                                    <td className="hidden md:table-cell">{product.descriptionesp}</td>
                                    <td className="hidden md:table-cell">{product.descriptioneng}</td>
                                    <td>
                                        {product.months_production &&
                                            product.months_production.map((mes) => <span key={mes}>{mes} </span>)}
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
                                    onChange={handleNameEspChangeProduct}
                                    value={nameEspProduct}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <input
                                    type="text"
                                    id="edit_name_eng"
                                    className="input input-bordered w-full"
                                    placeholder="Nombre Categoría Inglés"
                                    onChange={handleNameEngChangeProduct}
                                    value={nameEngProduct}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <input
                                    type="text"
                                    id="edit_claim_esp"
                                    className="input input-bordered w-full"
                                    placeholder="Claim Español"
                                    onChange={handleClaimEspChange}
                                    value={claimEsp}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <input
                                    type="text"
                                    id="edit_claim_eng"
                                    className="input input-bordered w-full"
                                    placeholder="Claim Inglés"
                                    onChange={handleClaimEngChange}
                                    value={claimEng}
                                    required
                                />
                            </div>

                            <div className="form-control w-full">
                                <input
                                    type="text"
                                    id="edit_desc_esp"
                                    className="input input-bordered w-full"
                                    placeholder="Descripción Español"
                                    onChange={handleDescriptionEspChange}
                                    value={descriptionEsp}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <input
                                    type="text"
                                    id="edit_desc_eng"
                                    className="input input-bordered w-full"
                                    placeholder="Descripción Inglés"
                                    onChange={handleDescriptionEngChange}
                                    value={descriptionEng}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Categoría del Producto</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.nameesp}
                                        </option>
                                    ))}
                                </select>
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

export default AdminProducts;
