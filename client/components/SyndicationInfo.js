import React, { Component } from 'react';
import Slider from 'react-slick';
import SourceData from './SourceData';
export default class SyndicationInfo extends Component {
  constructor(props){
    super(props);
  }
  render() {
    console.log("Syndication Lenght",this.props.data.length);
    let slideNumber;
    if(this.props.data.length<4){
      slideNumber=this.props.data.length;
    }else{
      slideNumber=4;
    }

    var settings = {
      dots: true,
      infinite:true,
      speed: 500,
      slidesToShow:1,
    };
    let sourceData=<p className="no-data">No Source Data Found</p>;
    console.log("source data", this.props.data);
    if(this.props.data){
    sourceData=this.props.data.map((source)=>{
          return (
                  <div className="source-data">
                    <img className="source-image" src={source.attributionLogo}/>
                    <h3>{source.benchName}</h3>
                    <h3>Moderation Stop Codes: {source.ModStopCodes.map((code)=>{return <span key={code} className="stp-code">{code}</span>})}</h3>
                    <h3>Locales That will Syndicate: {source.Loc}</h3>
                  </div>
                );
        });
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
