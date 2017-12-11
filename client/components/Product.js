import React from 'react';

class Product extends React.Component {
  constructor(props) {
        super(props);
}
render(){
console.log(this.props);
return(
        <div>
          <h1>{this.props.data}</h1>
        </div>
      );
}
}

export default Product;
