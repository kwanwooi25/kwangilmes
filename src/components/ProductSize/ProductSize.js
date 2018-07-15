import React from 'react';
import { highlight } from '../../helpers/highlight';
import './ProductSize.css';

const ProductSize = ({ product, search, className }) => {
  const { product_thick, product_length, product_width } = search;
  const productThick = highlight(product.product_thick, product_thick);
  const productLength = highlight(product.product_length, product_length);
  const productWidth = highlight(product.product_width, product_width);
  const productSize = `${productThick} x ${productLength} x ${productWidth}`;

  return (
    <div>
      <span
        className={`product-size ${className}`}
        dangerouslySetInnerHTML={{ __html: productSize }}
      />
    </div>
  );
}

export default ProductSize;
