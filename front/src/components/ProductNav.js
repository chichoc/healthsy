import React, { useState } from 'react';
import ProductInfo from '../components/ProductInfo';
import ProductReview from '../components/ProductReview';
import ProductAsk from '../components/ProductAsk';
import ProductDetail from '../components/ProductDetail';
import { NavProduct } from '../styles/product_nav';

const ProductNav = () => {
  const [showComponent, setShowComponent] = useState(0);
  const dataProductNav = [
    { name: '상품 정보', component: <ProductInfo /> },
    { name: '후기', component: <ProductReview /> },
    { name: 'Q&A', component: <ProductAsk /> },
    { name: '구매 정보', component: <ProductDetail /> },
  ];

  return (
    <>
      <NavProduct className='horizontal_flex'>
        {dataProductNav.map((nav, index) => (
          <button
            onClick={() => {
              setShowComponent(index);
            }}
            key={index}
          >
            {nav.name}
          </button>
        ))}
      </NavProduct>
      <div>{dataProductNav[showComponent].component}</div>
    </>
  );
};

export default ProductNav;
