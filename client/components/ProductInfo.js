import React from 'react';

const ProductInfo=({ data })=>{
    return(
            <div className="product-container tiles">
              <h2 className="product-title title">Product Information</h2>
              <img className="product-photo" src={data.image}/>
              <h3 className="product-details"><a href={data.productPageUrl} target="_blank">{data.productName}</a></h3>
              <h3 className="product-details">Product ID: {data.productId}</h3>
            </div>
          );
    }

export default ProductInfo;
