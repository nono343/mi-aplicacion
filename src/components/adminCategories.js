import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminCategories = (props) =>  {
    const [selectedFileCategory, setSelectedFileCategory] = useState(null);
    const [nameEspCategory, setNameEspCategory] = useState("");
    const [nameEngCategory, setNameEngCategory] = useState("");
    const [uploadedFileNameCategory, setUploadedFileNameCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);

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

    // Manejador de cambio de archivo
    const handleFileChangeCategory = (event) => {
        setSelectedFileCategory(event.target.files[0]);
    };

    // Manejador de cambio de nombre en español
    const handleNameEspChangeCategory = (event) => {
        setNameEspCategory(event.target.value);
    };

    // Manejador de cambio de nombre en inglés
    const handleNameEngChangeCategory = (event) => {
        setNameEngCategory(event.target.value);
    };

    // Función para cargar una nueva categoría
    const handleUploadCategory = async () => {
        if (selectedFileCategory && nameEspCategory && nameEngCategory) {
            try {
                // Configura los datos del formulario y realiza una solicitud POST
                const formData = new FormData();
                formData.append('file', selectedFileCategory);
                formData.append('nameesp', nameEspCategory);
                formData.append('nameeng', nameEngCategory);

                const response = await axios.post('http://catalogo.granadalapalma.com:5000/upload_category', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                // Verifica la respuesta del servidor
                if (response.status === 200) {
                    // Actualiza el estado de la lista de categorías
                    setUploadedFileNameCategory(response.data.message);
                    fetchCategories();
                } else {
                    console.error('Error al cargar la categoría con photo');
                }
            } catch (error) {
                console.error('Error al cargar la categoría con photo', error);
            }
        } else {
            console.error('Todos los campos son obligatorios');
        }
    };

    // Función para eliminar una categoría
    const handleDeleteCategory = async (id) => {
        try {
            // Realiza una solicitud DELETE para eliminar la categoría
            await axios.delete(`http://catalogo.granadalapalma.com:5000/categories/${id}`);
            // Actualiza el estado de la lista de categorías
            fetchCategories();
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    };

    // Función para iniciar la edición de una categoría
    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNameEspCategory(category.nameesp);
        setNameEngCategory(category.nameeng);
        setSelectedFileCategory(null);
    };

    // Función para cancelar la edición de una categoría
    const handleCancelEdit = () => {
        setEditingCategory(null);
        setNameEspCategory("");
        setNameEngCategory("");
        setSelectedFileCategory(null);
    };

    // Función para actualizar una categoría después de editar
    const handleUpdateCategory = async () => {
        if (nameEspCategory && nameEngCategory) {
            try {
                // Configura los datos del formulario y realiza una solicitud PUT
                const formData = new FormData();
                formData.append("file", selectedFileCategory);
                formData.append("nameesp", nameEspCategory);
                formData.append("nameeng", nameEngCategory);

                const response = await axios.put(
                    `http://catalogo.granadalapalma.com:5000/edit_category/${editingCategory?.id || editingCategory}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                

                // Verifica la respuesta del servidor
                if (response.status === 200) {
                    // Actualiza el estado de la lista de categorías y reinicia los estados de edición
                    setUploadedFileNameCategory(response.data.message);
                    fetchCategories();
                    setEditingCategory(null);
                    setNameEspCategory("");
                    setNameEngCategory("");
                    setSelectedFileCategory(null);
                } else {
                    console.error("Error al cargar la categoría con photo");
                }
            } catch (error) {
                console.error("Error al cargar la categoría con photo", error);
            }
        } else {
            console.error("Todos los campos son obligatorios");
        }
    };

    return (
        <div className='animate-flip-down mx-auto px-10'>
            <form className="grid mx-auto md:grid-cols-3 gap-6 mb-5">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Nombre Categoría Español</span>
                    </label>

                    <input type="text" id="name_esp" className="input input-bordered w-full" placeholder="Nombre Categoría Español" onChange={handleNameEspChangeCategory} required />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Nombre Categoría Inglés</span>
                    </label>

                    <input type="text" id="name_eng" className="input input-bordered w-full" placeholder="Nombre Categoría Inglés" onChange={handleNameEngChangeCategory} required />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Foto Categoría</span>
                    </label>

                    <input type="file" className="file-input file-input-bordered file-input-success w-full" onChange={handleFileChangeCategory} required />
                </div>

                <div className='mx-auto md:col-start-2'>
                    <button onClick={handleUploadCategory} type="button" className="btn btn-outline btn-success">Crear Categoría</button>
                </div>
            </form>

            <div className="overflow-x-auto mt-5">
                <table className="table overflow-x-auto">
                    <thead>
                        <tr>
                            <th className="sm:w-1/4">Foto</th>
                            <th className="sm:w-1/4">Nombre</th>
                            <th className="sm:w-1/4">Nombre Inglés</th>
                            <th className="sm:w-1/4">Editar</th>
                            <th className="sm:w-1/4">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td className="sm:w-1/4">
                                    {category.photo && (
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img
                                                        src={`http://catalogo.granadalapalma.com:5000/uploads/${category.nameesp}/${category.photo}`}
                                                        alt={category.nameesp}
                                                        className="max-w-full h-auto"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="sm:w-1/4">{category.nameesp}</td>
                                <td className="sm:w-1/4">{category.nameeng}</td>
                                <td className="sm:w-1/4">
                                    <button
                                        onClick={() => handleEditCategory(category)}
                                        className="btn btn-outline btn-warning"
                                    >
                                        Editar
                                    </button>
                                </td>
                                <td className="sm:w-1/4">
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="btn btn-outline btn-error"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingCategory && (
                <div className="mt-5">
                    <h2>Editar Categoría</h2>
                    <form className="grid md:grid-cols-3 gap-6">
                        <div className="form-control w-full">
                            <input
                                type="text"
                                id="edit_name_esp"
                                className="input input-bordered w-full"
                                placeholder="Nombre Categoría Español"
                                onChange={handleNameEspChangeCategory}
                                value={nameEspCategory}
                                required
                            />
                        </div>

                        <div className="form-control w-full">
                            <input
                                type="text"
                                id="edit_name_eng"
                                className="input input-bordered w-full"
                                placeholder="Nombre Categoría Inglés"
                                onChange={handleNameEngChangeCategory}
                                value={nameEngCategory}
                                required
                            />
                        </div>

                        <div className="form-control w-full">
                            <input
                                type="file"
                                className="file-input file-input-bordered w-full"
                                onChange={handleFileChangeCategory}
                            />
                        </div>

                        <div className="mx-auto md:col-start-2 mt-5">
                            <button
                                onClick={handleUpdateCategory}
                                type="button"
                                className="btn btn-outline btn-success"
                            >
                                Actualizar Categoría
                            </button>
                            <button
                                onClick={handleCancelEdit}
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
    );
}

export default AdminCategories;
