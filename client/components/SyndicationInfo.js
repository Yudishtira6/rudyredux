import React, { Component } from 'react';
import Slider from 'react-slick';
import SourceData from './SourceData';
import Loader from './loader';
export default class SyndicationInfo extends Component {
  constructor(props){
    super(props);
  }
  render() {
    let slideNumber;
    if(this.props.data.length<4){
      slideNumber=this.props.data.length;
    }else{
      slideNumber=4;
    }

    var settings = {
      dots: true,
      infinite:false,
      speed: 500,
      slidesToShow:1,
    };

    let sourceData=<p className="no-data">No Syndication Data Found</p>;
    if(this.props.data.length>0 && !this.props.loading && !this.props.error){
    sourceData=this.props.data.map((source)=>{
          let modCodes=source.modCodes.map((code)=>{
            return <span key={code} className="code">{code}</span>
          });
          let matchingStrategy=source.matchStragegy.map((item)=>{
            return <span key={item} className="code">{item}</span>
          })
          return (
                  <div key={source.productId} className="source-data">
                    <img className="source-image" src={source.companyLogo}/>
                    <h6>{source.sourceName} <span>{source.productId}</span></h6>
                    <h6>Stop Codes {modCodes}</h6>
                    <h6>Locales <span>{source.locales}</span></h6>
                    <h6>Syndication Delay <span>{source.syndicationDelay} days</span></h6>
                    <h6> Matching Strategies {matchingStrategy} </h6>
                    <h3></h3>
                  </div>
                );
        });
    }else if(this.props.loading && !this.props.error){
      sourceData=(<div className="loader-top">
                      <i className="fas left fa-circle"></i>
                      <i className="fas middle fa-circle"></i>
                      <i className="fas right fa-circle"></i>
                     <p> Calculating...</p>
                  </div>)
    }else if(this.props.error){
      sourceData=(<div className="error-message">
                    <img src="https://yt3.ggpht.com/a-/AJLlDp2Q_yE_9epRWRApU2gu-v1XZrxtr4ZkKeXDQw=s900-mo-c-c0xffffffff-rj-k-no"/>
                    <p>Something went wrong... Please try again</p>
                  </div>
                  );
    }
    return (
      <div className="syndication-container">
        <h2 className="syndication-title title">Syndication Information</h2>
        <Slider {...settings}>
            {sourceData}
        </Slider>
      </div>
    );
  }
}
