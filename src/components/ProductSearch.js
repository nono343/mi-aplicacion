import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import unorm from "unorm"; 

const ProductSearch = ({ isSpanish, setIsSearching }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    try {
      const response = await axios.get(`http://catalogo.granadalapalma.com:5000/products?name=${term}`);
      const data = response.data;
      setSearchResults(data.products);
      setIsSearching(!!term.trim());
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
    }
  };

  const removeAccents = (str) => {
    return unorm.nfd(str).replace(/[\u0300-\u036f]/g, "");
};

const removeAsterisks = (str) => {
    return str.replace(/\*/g, '');
};


  return (
    <div className='py-5 px-10 mt-20'>
      <div className="form-control w-full max-w-sm mx-auto">
        <input
          type="text"
          placeholder={isSpanish ? "Buscar productos por nombre..." : "Search products by name..."}
          value={searchTerm}
          onChange={handleInputChange}
          className="input input-bordered input-success w-full max-w-xs"
        />
      </div>
      {searchResults.length > 0 && searchTerm.trim() !== '' && (
        <div className=" py-5 mx-auto animate-fade">
          <div className="container m-auto px-6 text-gray-500 md:px-12">
          <div className="grid gap-6 md:mx-auto lg:grid-cols-3">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/categories/${product.category_id}/products/${product.id}`}
                  onClick={() => console.log(product.id)}
                  className="group space-y-1 border border-gray-100  rounded-3xl bg-white  px-8 py-12 text-center shadow-2xl shadow-gray-600/10  transition-transform transform hover:scale-105 duration-500 ease-in-out hover:shadow-2xl hover:border-green-400"
                >
                  <img
                    className="mx-auto w-120"
                    src={`http://catalogo.granadalapalma.com:5000/uploads/${removeAccents(product.category_nameesp.replace(/\s/g, '_'))}/${removeAccents(product.nameesp.replace(/\s/g, '_'))}/${product.photo}`}
                    alt={isSpanish ? product.nameesp : product.nameeng}
                    loading="lazy"
                  />
                  <h3 className="text-3xl font-semibold text-gray-800 ">
                    {isSpanish ? product.nameesp : product.nameeng}
                  </h3>
                  <h4 className="font-semibold text-gray-800 ">
                    {isSpanish ? product.varietyesp : product.varietyeng}
                  </h4>

                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
