import React from 'react';

class Product extends React.Component {
  constructor(props) {
        super(props);
}
render(){

return(
        <div>
          <img src={this.props.data.image}/>
          <h3>{this.props.data.productName}</h3>
        </div>
      );
  }
}

export default Product;
