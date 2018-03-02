import React from 'react';

import SourceData from './SourceData';

class Product extends React.Component {
    constructor(props) {
          super(props);
      this.switchTab=this.switchTab.bind(this);
    }
    switchTab(e){
      this.props.switchTab(e.target.innerText.split(' ')[0].toLowerCase());

    }

    render(){

      console.log(this.props);
      let tabs;
      switch(this.props.tab){
        case "syndication" :
        tabs=(
              <ul className="tabs">
                <li onClick={this.switchTab}>Product Information</li>
                <li onClick={this.switchTab} className="tab-active">Syndication Information</li>
                <li onClick={this.switchTab}>Family Information</li>
              </ul>
              );
        break;
        case "family" :
        tabs=(
              <ul className="tabs">
                <li onClick={this.switchTab}>Product Information</li>
                <li onClick={this.switchTab}>Syndication Information</li>
                <li onClick={this.switchTab} className="tab-active">Family Information</li>
              </ul>
              );
        break;
        default:
        tabs=(
              <ul className="tabs">
                <li onClick={this.switchTab} className="tab-active">Product Information</li>
                <li onClick={this.switchTab}>Syndication Information</li>
                <li onClick={this.switchTab}>Family Information</li>
              </ul>
              );
      }

    return(<div>
            {tabs}
          </div>
          );
      }
    }

    export default Product;
