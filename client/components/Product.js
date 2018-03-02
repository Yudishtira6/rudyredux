import React from 'react';

import SourceData from './SourceData';
import ProductInfo from './ProductInfo';
import SyndicationInfo from './SyndicationInfo';
import FamilyInfo from './FamilyInfo';
import Tabs from './Tabs';

class Product extends React.Component {
    constructor(props) {
          super(props);
      this.switchTab=this.switchTab.bind(this);
    }

    switchTab(tab){
      this.props.switchTabs(tab);
    }
    render(){
      let familyIds;
      let sourceClient;
      let familyInfo=[  <div className="familyInfo-block"><h1>FAMILY 1</h1></div>,
                        <div className="familyInfo-block"><h1>FAMILY 2</h1></div>,
                        <div className="familyInfo-block"><h1>FAMILY 3</h1></div>,
                        <div className="familyInfo-block"><h1>FAMILY 4</h1></div>,
                        <div className="familyInfo-block"><h1>FAMILY 5</h1></div>,
                        <div className="familyInfo-block"><h1>FAMILY 6</h1></div>,
                        <div className="familyInfo-block"><h1>FAMILY 7</h1></div>]
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

      let productInfo=(
                        <div className='info'>
                          <Tabs switchTab={this.switchTab} tab={this.props.data.activeTab}/>
                          <div className="product-info">
                            <ProductInfo data={this.props.data}/>
                          </div>
                          <div className="syndication-info slide">
                            <SyndicationInfo sourceData={this.props.sourceData}/>
                          </div>
                          <div className="family-block slide">
                            <FamilyInfo familyInfo={familyInfo}/>
                          </div>
                        </div>

                        );

    if(this.props.data.activeTab==='syndication'){
                productInfo=(
                  <div className='info'>
                    <Tabs switchTab={this.switchTab} tab={this.props.data.activeTab}/>
                    <div className="product-info slide">
                      <ProductInfo data={this.props.data}/>
                    </div>
                    <div className="syndication-info">
                      <SyndicationInfo sourceData={this.props.sourceData}/>
                    </div>
                    <div className="family-block slide">
                      <FamilyInfo familyInfo={familyInfo}/>
                    </div>
                  </div>
                              );
    }
    else if (this.props.data.activeTab==="family") {
              productInfo=(
                <div className='info'>
                  <Tabs switchTab={this.switchTab} tab={this.props.data.activeTab}/>
                  <div className="product-info slide">
                    <ProductInfo data={this.props.data}/>
                  </div>
                  <div className="syndication-info slide">
                    <SyndicationInfo sourceData={this.props.sourceData}/>
                  </div>
                  <div className="family-block">
                    <FamilyInfo familyInfo={familyInfo}/>
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
