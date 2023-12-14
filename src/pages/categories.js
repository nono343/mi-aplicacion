import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import unorm from "unorm"; // Importa unorm


const ProductosPorCategoria = (props) => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryNameEsp, setCategoryNameEsp] = useState('');
  const [categoryNameEng, setCategoryNameEng] = useState('');

  
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get(`http://catalogo.granadalapalma.com:5000/categories/${id}/products`);
        const data = response.data;
        setCategoryNameEsp(data.category.nameesp);
        setCategoryNameEng(data.category.nameeng);
        setProducts(data.products);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchProductsByCategory();
  }, [id]);
  

  const removeAccents = (str) => {
    return unorm.nfd(str).replace(/[\u0300-\u036f]/g, "");
};

  return (
    <div className=" py-5 mx-auto animate-fade mt-20">
      <div className="container  m-auto px-6 text-gray-500 md:px-12">
        <h2 className="mb-5 text-2xl font-bold text-gray-800 dark:text-white md:text-4xl text-center">
          {props.isSpanish ? categoryNameEsp : categoryNameEng}

        </h2>

        <div className="grid gap-6 md:mx-auto md:w-8/12 lg:w-10/12 lg:grid-cols-3">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to={`/categories/${id}/products/${product.id}`}
              className="group space-y-1 border border-gray-100 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800 px-8 py-12 text-center shadow-2xl shadow-gray-600/10 dark:shadow-none transition-transform transform hover:scale-105 duration-500 ease-in-out hover:shadow-2xl hover:border-green-400"
            >
              <img
                className="mx-auto" 
                src={`http://catalogo.granadalapalma.com:5000/uploads/${removeAccents(product.category_nameesp)}/${removeAccents(product.nameesp)}/${product.photo}`}
                alt={product.nameesp}
                loading="lazy"
              />
              <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
                {props.isSpanish ? product.nameesp : product.nameeng}
              </h3>
              <h5 className="font-semibold text-gray-800 dark:text-white">
                {props.isSpanish ? product.variedadesp : product.variedadeng}
              </h5>

            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductosPorCategoria;
