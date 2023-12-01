import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';


const ProductosPorCategoria = (props) => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [categoriaNombreEsp, setCategoriaNombreEsp] = useState('');
  const [categoriaNombreEng, setCategoriaNombreEng] = useState('');

  console.log(productos)
  useEffect(() => {
    const fetchProductosPorCategoria = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/categorias/${id}/productos`);
        const data = response.data;
        // console.log('Datos de productos:', data); // Registra los datos recibidos
        setCategoriaNombreEsp(data.categoria.nombreesp);
        setCategoriaNombreEng(data.categoria.nombreeng);
        setProductos(data.productos);
      } catch (error) {
        console.error('Error al obtener datos:', error); // Registra cualquier error
      }
    };

    fetchProductosPorCategoria();
  }, [id]);


  return (
    <div className=" py-5 max-w-screen-xl mx-auto animate-fade">
      <div className="container  m-auto px-6 text-gray-500 md:px-12">
        <h2 className="mb-5 text-2xl font-bold text-gray-800 dark:text-white md:text-4xl text-center">
          {props.isSpanish ? categoriaNombreEsp : categoriaNombreEng}

        </h2>

        <div className="grid gap-6 md:mx-auto md:w-8/12 lg:w-full lg:grid-cols-3">
          {productos.map((producto, index) => (
            <Link
              key={producto.id}
              to={`/categorias/${id}/productos/${producto.id}`}
              // onClick={() => console.log(producto.id)} // Agrega este log para verificar
              className="group space-y-1 border border-gray-100 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800 px-8 py-12 text-center shadow-2xl shadow-gray-600/10 dark:shadow-none transition-transform transform hover:scale-105 duration-500 ease-in-out hover:shadow-2xl hover:border-red-400"
            >
              <img
                className="mx-auto "  // Corregir la clase para establecer el ancho máximo
                src={producto.foto}
                alt={producto.nombreesp}
                loading="lazy"
              />
              <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
                {props.isSpanish ? producto.nombreesp : producto.nombreeng}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductosPorCategoria;
