import React from 'react';

class Product extends React.Component {
  constructor(props) {
        super(props);
}
render(){
console.log("product data",this.props.data);
let familyIds;
let sourceClient;
  if(this.props.data.familyIds){
    familyIds=this.props.data.familyIds.map((id)=>{
    return id;
  });
}
  if(this.props.data.sourceClient){
    sourceClient=this.props.data.sourceClient.map((client)=>{
    return client;
  });
}

return(
        <div className="product-info">
          <h2 className="product-title">Product Information</h2>
          <img className="product-photo" src={this.props.data.image}/>
          <div className="product-information">
            <h3 className="product-details"><a href={this.props.data.productPageUrl} target="_blank">{this.props.data.productName}</a></h3>
            <h3 className="product-details">Product ID: {this.props.data.productId}</h3>
            <h3 className="product-details">Family IDs: {familyIds}</h3>
            <h3 className="product-details">Syndication Sources: {sourceClient}</h3>
            <h3 className="product-details">Matching Strategies: </h3>
          </div>
        </div>
      );
  }
}

export default Product;
