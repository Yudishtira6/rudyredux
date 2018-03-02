import React, { Component } from 'react';
import Slider from 'react-slick';
import _ from 'underscore';
import $ from 'jquery';

export default class FamilyInfo extends Component {
  constructor(props){
    super(props);
  this.hover=this.hover.bind(this);
  }
  hover(e){
    console.log(e.clientX);
    console.log($(e.target));
  }
  render() {
    var settings = {
      dots: true,
      infinite:true,
      speed: 500,
      slidesToShow:1,
    };

    var colors=["#4cc4f6","#fcb150","#12a8ab","#007aff","#e84c64","#01b08d","#e94cb9","#884ce9","#4ce9af","#4ee94c","#e9864c","#cae94c"];
    var families=[{12345:5,12343:3,23343:10,3434343:11,2343243:32,2222:11,4343:10,234234234234:5,familyId:1343423423324,total:87},
                  {33333:10,223343:11,familyId:1234533433,total:21},
                  {123333444:25,23432233:10,2333434:44,23423423:100,3234323:10,total:189,familyId:"SUPERAWESOME FAMILY"}
                 ];
    let familyProducts=families.map((family,i)=>{
        console.log("family Array", family);
        let total=family.total;
        let counter=0;
        let segments=[];
        let keyDisplay=[];
        let toolTips=[];
        let totalPercentage=0;
        _.mapObject(family, (val,key)=>{
              if(key ==='familyId' || key === 'total'){
                return false;
              }else {
              let percentage=(val/total * 100);
              let secondNum=100-percentage;
              let offset= 100 - totalPercentage + 25;
              if(totalPercentage === 0){
                offset=25;
              }
              let startingPlace=`0 ${secondNum}`;
              totalPercentage=totalPercentage + percentage;
              let input=`${percentage} ${secondNum}`;
              keyDisplay.push(<li><span className="key" style={{backgroundColor:colors[counter]}}></span><span className="product">{key} ({val})</span></li>);
              segments.push(<g onMouseEnter={this.hover} className="circle-component"><circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke={colors[counter]} strokeWidth="3" strokeDasharray={input} strokeDashoffset={offset}><animate attributeType="XML" attributeName="stroke-dasharray" from={startingPlace} to={input}
        dur="1s"/></circle></g>);
              }
            counter++;
          });
          let graphSegments=segments.map((segment)=>{
            return segment;
          });
          let keys=keyDisplay.map((key)=>{
            return key;
          });
        return (
                <div className="family-doughnut">
                  <svg width="100%" height="100%" viewBox="-30 0 100 70" className="donut">
                      <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                      <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="grey" strokeWidth="3"></circle>
                      {graphSegments}
                  </svg>
                  <div className="chart-text">
                    <span className="graph-label">Family ID</span>
                    <span className="family-id">{family.familyId}</span>
                  </div>
                  <ul className="keys">
                    {keys}
                  </ul>
                </div>

                );
    });
//stroke dash array= first number: % of how much second number is %-100.
//stroke dash-offset=100-total% + first dash array #.


    return (
      <div className="family-container tiles">
        <h2 className="family-title title">Family Information</h2>
        <Slider {...settings}>
          {familyProducts}
        </Slider>
      </div>
    );
  }
}
