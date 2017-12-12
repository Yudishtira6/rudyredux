import React from 'react';

class Product extends React.Component {
  constructor(props) {
        super(props);
}
render(){
console.log(this.props.data);
return(
        <div className="product-info">
          <img className="product-photo" src={this.props.data.image}/>
          <h3 className="product-name"><a href={this.props.data.productPageUrl} target="_blank">{this.props.data.productName}</a></h3>
        </div>
      );
  }
}

export default Product;
