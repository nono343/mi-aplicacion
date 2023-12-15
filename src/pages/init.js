import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductSearch from '../components/ProductSearch';

const Init = (props) =>  {
    const [categories, setCategories] = useState([]);
    const [isSearching, setIsSearching] = useState(false);


    useEffect(() => {
        axios.get('http://catalogo.granadalapalma.com:5000/categories')
            .then((response) => {
                setCategories(response.data.categories);
            })
            .catch((error) => {
                console.error('Error al obtener las categorías', error);
            });
    }, []);


    useEffect(() => {
    }, [props.isSpanish]);


  return (
        <>
            <ProductSearch isSpanish={props.isSpanish} setIsSearching={setIsSearching} />
            {!isSearching && (
                <div className="py-5 mx-auto">
                    <div className="container m-auto px-6 text-gray-500 md:px-12">
                        <div className="grid gap-6 md:mx-auto lg:grid-cols-3">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/categorias/${category.id}`}
                                    className="group space-y-1 border border-gray-100 rounded-3xl bg-white px-8 py-12 text-center shadow-2xl shadow-gray-600/10 transition-transform transform hover:scale-105 duration-500 ease-in-out hover:shadow-2xl hover:border-green-400"
                                >
                                    <img className="mx-auto w-120" 
                                    src={`http://catalogo.granadalapalma.com:5000/uploads/${category.nameesp}/${category.photo}`}
                                    alt={category.nameesp} 
                                    loading="lazy" />
                                    <h3 className="text-3xl font-semibold text-gray-800 ">
                                    {props.isSpanish ? category.nameesp : category.nameeng}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}



export default Init;
