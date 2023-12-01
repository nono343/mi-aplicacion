import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminCategorias(props) {
    // Estado para almacenar la imagen seleccionada
    const [selectedFileCategory, setSelectedFileCategory] = useState(null);
    // Estados para los nombres de la categoría en español e inglés
    const [nombreEspCategory, setNombreEspCategory] = useState("");
    const [nombreEngCategory, setNombreEngCategory] = useState("");
    // Estado para el nombre del archivo cargado
    const [uploadedFileNameCategory, setUploadedFileNameCategory] = useState("");
    // Estado para almacenar la lista de categorías
    const [categories, setCategories] = useState([]);
    // Estado para la categoría que se está editando
    const [editingCategory, setEditingCategory] = useState(null);

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

    // Manejador de cambio de archivo
    const handleFileChangeCategory = (event) => {
        setSelectedFileCategory(event.target.files[0]);
    };

    // Manejador de cambio de nombre en español
    const handleNombreEspChangeCategory = (event) => {
        setNombreEspCategory(event.target.value);
    };

    // Manejador de cambio de nombre en inglés
    const handleNombreEngChangeCategory = (event) => {
        setNombreEngCategory(event.target.value);
    };

    // Función para cargar una nueva categoría
    const handleUploadCategory = async () => {
        if (selectedFileCategory && nombreEspCategory && nombreEngCategory) {
            try {
                // Configura los datos del formulario y realiza una solicitud POST
                const formData = new FormData();
                formData.append('file', selectedFileCategory);
                formData.append('nombreesp', nombreEspCategory);
                formData.append('nombreeng', nombreEngCategory);

                const response = await axios.post('http://catalogo.granadalapalma.com:5000/upload_category', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                // Verifica la respuesta del servidor
                if (response.status === 200) {
                    // Actualiza el estado de la lista de categorías
                    setUploadedFileNameCategory(response.data.message);
                    fetchCategories();
                } else {
                    console.error('Error al cargar la categoría con foto');
                }
            } catch (error) {
                console.error('Error al cargar la categoría con foto', error);
            }
        } else {
            console.error('Todos los campos son obligatorios');
        }
    };

    // Función para eliminar una categoría
    const handleDeleteCategory = async (id) => {
        try {
            // Realiza una solicitud DELETE para eliminar la categoría
            await axios.delete(`http://catalogo.granadalapalma.com:5000/categorias/${id}`);
            // Actualiza el estado de la lista de categorías
            fetchCategories();
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    };

    // Función para iniciar la edición de una categoría
    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNombreEspCategory(category.nombreesp);
        setNombreEngCategory(category.nombreeng);
        setSelectedFileCategory(null);
    };

    // Función para cancelar la edición de una categoría
    const handleCancelEdit = () => {
        setEditingCategory(null);
        setNombreEspCategory("");
        setNombreEngCategory("");
        setSelectedFileCategory(null);
    };

    // Función para actualizar una categoría después de editar
    const handleUpdateCategory = async () => {
        if (selectedFileCategory && nombreEspCategory && nombreEngCategory) {
            try {
                // Configura los datos del formulario y realiza una solicitud PUT
                const formData = new FormData();
                formData.append("file", selectedFileCategory);
                formData.append("nombreesp", nombreEspCategory);
                formData.append("nombreeng", nombreEngCategory);

                const response = await axios.put(
                    `http://catalogo.granadalapalma.com:5000/edit_category/${editingCategory.id}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                // Verifica la respuesta del servidor
                if (response.status === 200) {
                    // Actualiza el estado de la lista de categorías y reinicia los estados de edición
                    setUploadedFileNameCategory(response.data.message);
                    fetchCategories();
                    setEditingCategory(null);
                    setNombreEspCategory("");
                    setNombreEngCategory("");
                    setSelectedFileCategory(null);
                } else {
                    console.error("Error al cargar la categoría con foto");
                }
            } catch (error) {
                console.error("Error al cargar la categoría con foto", error);
            }
        } else {
            console.error("Todos los campos son obligatorios");
        }
    };

    return (
        <div className='animate-flip-down max-w-screen-xl mx-auto px-10'>
            <div className='animate-flip-down max-w-screen-xl mx-auto px-10 gap-6'>
                <form className="grid md:grid-cols-3 gap-6 mb-5">
                    <div className="form-control w-full max-w-xs">
                        <input type="text" id="name_esp" className="input input-bordered w-full max-w-xs" placeholder="Nombre Categoría Español" onChange={handleNombreEspChangeCategory} required />
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <input type="text" id="name_eng" className="input input-bordered w-full max-w-xs" placeholder="Nombre Categoría Inglés" onChange={handleNombreEngChangeCategory} required />
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileChangeCategory} required />
                    </div>

                    <div className='mx-auto md:col-start-2 mt-5 '>
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
                                        {category.foto && (
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img
                                                            src={`http://localhost:5000/uploads/${category.nombreesp}/${category.foto}`}
                                                            alt={category.nombreesp}
                                                            className="max-w-full h-auto"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="sm:w-1/4">{category.nombreesp}</td>
                                    <td className="sm:w-1/4">{category.nombreeng}</td>
                                    <td className="sm:w-1/4">
                                        <button
                                            onClick={() => handleEditCategory(category)}
                                            className="btn btn-outline btn-info"
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
                            <div className="form-control w-full max-w-xs">
                                <input
                                    type="text"
                                    id="edit_name_esp"
                                    className="input input-bordered w-full max-w-xs"
                                    placeholder="Nombre Categoría Español"
                                    onChange={handleNombreEspChangeCategory}
                                    value={nombreEspCategory}
                                    required
                                />
                            </div>

                            <div className="form-control w-full max-w-xs">
                                <input
                                    type="text"
                                    id="edit_name_eng"
                                    className="input input-bordered w-full max-w-xs"
                                    placeholder="Nombre Categoría Inglés"
                                    onChange={handleNombreEngChangeCategory}
                                    value={nombreEngCategory}
                                    required
                                />
                            </div>

                            <div className="form-control w-full max-w-xs">
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full max-w-xs"
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
        </div>
    );
}

export default AdminCategorias;
