import React from 'react';

import SourceData from './SourceData';

class Product extends React.Component {
    constructor(props) {
          super(props);
      this.switchTabSyndicated=this.switchTabSyndicated.bind(this);
      this.switchTabProduct=this.switchTabProduct.bind(this);
    }
    switchTabSyndicated(){
    this.props.switchTabs('syndicated');
    }
    switchTabProduct(){
    this.props.switchTabs('product');
    }
    render(){

    console.log("product data",this.props.data);
    let sourceData=<p className="no-data">No Source Data Found</p>;
    let familyIds;
    let sourceClient;
      if(this.props.data.familyIds){
        familyIds=this.props.data.familyIds.map((id)=>{
        return <li key={id}>{id}</li>;
      });
    }
      if(this.props.data.sourceClient){
        sourceClient=this.props.data.sourceClient.map((client)=>{
        return <li>{client}</li>;
      });
    }
    if(this.props.sourceData){
    sourceData=this.props.sourceData.map((source)=>{
          return (<SourceData key={source.key} data={source}/>);
        });
    }
    let productInfo=(
                      <div className='info'>
                        <div className='product-buttons'>
                          <h2 onClick={this.switchTabProduct} className="information-title active">Product Information</h2>
                          <h2 onClick={this.switchTabSyndicated} className="information-title">Source Information</h2>
                        </div>
                        <div className="product-info">
                          <img className="product-photo" src={this.props.data.image}/>
                          <div className="product-information">
                            <h3 className="product-details"><a href={this.props.data.productPageUrl} target="_blank">{this.props.data.productName}</a></h3>
                            <h3 className="product-details">Product ID: {this.props.data.productId}</h3>
                            <ul className="product-details"><li>Family IDs:</li> {familyIds}</ul>
                            <ul className="product-details"><li>Syndication Sources:</li> {sourceClient}</ul>
                          </div>
                        </div>
                        <div className="syndication-info slide">
                          {sourceData}
                        </div>
                      </div>

                      );

    if(this.props.data.activeTab==='syndicated'){
    productInfo=(
                  <div className='info'>
                    <div className='product-buttons'>
                      <h2 onClick={this.switchTabProduct} className="information-title">Product Information</h2>
                      <h2 onClick={this.switchTabSyndicated} className="information-title active">Source Information</h2>
                    </div>
                    <div className="product-info slide">
                      <img className="product-photo" src={this.props.data.image}/>
                      <div className="product-information">
                        <h3 className="product-details"><a href={this.props.data.productPageUrl} target="_blank">{this.props.data.productName}</a></h3>
                        <h3 className="product-details">Product ID: {this.props.data.productId}</h3>
                        <ul className="product-details"><li>Family IDs:</li> {familyIds}</ul>
                        <ul className="product-details"><li>Syndication Sources:</li> {sourceClient}</ul>
                      </div>
                    </div>
                    <div className="syndication-info">
                      {sourceData}
                    </div>
                  </div>
                  );
    }
    return(
            <div className="tabs">
              {productInfo}
            </div>
          );
      }
    }

    export default Product;
