import React, { Component } from 'react';
import _ from 'underscore';
import $ from 'jquery';
import { Link } from 'react-router';

export default class FamilyInfo extends Component {
  constructor(props){
    super(props);
    this.triggerFamily=this.triggerFamily.bind(this);
  }

  triggerFamily(e){

    //populate the specific family product when clicking on the dashboard.
    this.props.paginateFamily('family',e.target.innerHTML.split(' ')[0])
  }
  render() {
    var colors=["#4cc4f6","#fcb150","#12a8ab","#007aff","#e84c64","#01b08d","#e94cb9","#884ce9","#4ce9af","#4ee94c","#e9864c","#cae94c","#ad1111","#28ad11","#119dad","#8111ad","#ad11a7","#ad1166","#cff700","#f7b900","#f79600","#f7ddde"];
    let familyProducts=<p className="no-data">NO FAMILIES YET</p>
    //when there is family data, and the page isn't loading, and does not have errors map through the family object, and create a segment of the donut graph, and a key.
    if(this.props.data.length > 0 && !this.props.loading && !this.props.error){
     familyProducts=this.props.data.map((family,i)=>{
        var total=family.total;
        let counter=0;
        let segments=[];
        let keyDisplay=[];
        let totalPercentage=0;
        _.mapObject(family, (val,key)=>{
              if(key === 'total'){
                return false;
              }else {
              let percentage=(val/total * 100);
              let secondNum=100-percentage;
              let offset= 100 - totalPercentage + 25;
              if(totalPercentage === 0){
                offset=25;
              }
              //stroke dash array= first number: % of how much second number is %-100.
              //stroke dash-offset=100-total% + first dash array #.
              let startingPlace=`0 ${secondNum}`;
              totalPercentage=totalPercentage + percentage;
              let input=`${percentage} ${secondNum}`;
              keyDisplay.push(<li><span key={key} className="key" style={{backgroundColor:colors[counter]}}></span><span onClick={this.triggerFamily} className="product">{key} ({val})</span></li>);
              segments.push(<g key={counter} className="circle-component"><circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke={colors[counter]} strokeWidth="3" strokeDasharray={input} strokeDashoffset={offset}><animate attributeType="XML" attributeName="stroke-dasharray" from={startingPlace} to={input}
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
                    <span className="graph-label">Family Reviews</span>
                    <span className="family-id">{total}</span>
                  </div>
                  <ul className="keys">
                    <p>Select a productID below to display reviews</p>
                    {keys}
                  </ul>
                </div>

                );
    });
    //inject loader to family dashboard
    }else if(this.props.loading && !this.props.error){
      familyProducts=(<div className="loader-top">
                     <i className="fa left fa-circle" aria-hidden="true"></i>
                     <i className="fa middle fa-circle" aria-hidden="true"></i>
                     <i className="fa right fa-circle" aria-hidden="true"></i>
                     <p> Calculating...</p>
                  </div>)
    //inject error message if error is present
    }else if(this.props.error){
      familyProducts=(<div className="error-message">
                        <img src="https://yt3.ggpht.com/a-/AJLlDp2Q_yE_9epRWRApU2gu-v1XZrxtr4ZkKeXDQw=s900-mo-c-c0xffffffff-rj-k-no"/>
                        <p>Something went wrong... Please try again</p>
                      </div>
                      );
    //no families were found
    }else if(!this.props.loading && !this.props.error){
      familyProducts=<p className="no-data">NO FAMILIES FOUND</p>
    }



    return (
      <div className="family-container tiles">
        <h2 className="family-title title">Family Information</h2>
          {familyProducts}
      </div>
    );
  }
}
