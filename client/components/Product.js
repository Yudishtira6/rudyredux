import React from 'react';

class Product extends React.Component {
  constructor(props) {
        super(props);
}
render(){

return(
        <div className="product-info">
          <img className="product-photo" src={this.props.data.image}/>
          <h3 className="product-name">{this.props.data.productName}</h3>
        </div>
      );
  }
}

export default Product;
