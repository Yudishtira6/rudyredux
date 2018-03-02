import React from 'react';


import Loader from './loader';
export default class SnapShot extends React.Component {
    constructor(props) {
    super(props);
    this.switchNative=this.switchNative.bind(this);
    this.switchFamily=this.switchFamily.bind(this);
    this.switchAll=this.switchAll.bind(this);
    this.switchSyndicated=this.switchSyndicated.bind(this);
    this.switchBlocked=this.switchBlocked.bind(this);
    }
    switchNative(){

    this.props.display('native','product');
    }
    switchFamily(){
    this.props.display('family','family');
    }
    switchSyndicated(){
    this.props.display('syndication','syndication');

    }
    switchAll(){
    this.props.display('all','product');
    }
    switchBlocked(){
    this.props.display('blocked','syndicated');
    }
    render(){
    let familyIds=0;

      if (this.props.data.familyIds.length>=1){
       familyIds=this.props.data.familyIds.length;
      }
    console.log("snapshot DATA", this.props.data);
    let snapShot=(
                    <div className="snap-container">
                      <div onClick={this.switchNative} className="snap-details native">
                          <div className="main native-top">
                              <h2>{this.props.data.displayableNative}</h2>
                              <h2>DISPLAYED NATIVE REVIEWS</h2>
                          </div>
                          <div className="sub-one native-bottom">
                              <h4>{this.props.data.native}</h4>
                              <h4>Total Native</h4>
                          </div>
                          <div className="sub-two">
                              <h4>{this.props.data.ratingOnly}</h4>
                              <h4>Ratings-only Native</h4>
                          </div>
                      </div>
                      <div onClick={this.switchSyndicated} className="snap-details syndicated">
                          <div className="main syndicated">
                              <h2>{this.props.data.displayableSyndicated}</h2>
                              <h2>DISPLAYED SYNDICATED REVIEWS</h2>
                          </div>
                          <div className="sub-one">
                              <h4>{this.props.data.syndicated}</h4>
                              <h4>Total Syndicated</h4>
                          </div>
                          <div className="sub-two">
                              <h4>{this.props.data.stopped}</h4>
                              <h4>Blocked Syndicated</h4>
                          </div>
                      </div>
                      <div onClick={this.switchFamily} className="snap-details family">
                          <div className="main family">
                              <h2>{this.props.data.family}</h2>
                              <h2>DISPLAYED FAMILY REVIEWS</h2>
                          </div>
                          <div className="sub-main">
                              <h4>Member of {familyIds} Families </h4>
                          </div>
                      </div>
                      <div onClick={this.switchAll} className="snap-details total">
                          <h2>{this.props.data.total}</h2>
                          <h2>DISPLAYED TOTAL REVIEWS</h2>
                      </div>
                    </div>
                );
            if(this.props.loading){
            snapShot=(
                        <div className="loader-container">

                            <Loader/>
                        </div>

                      );
              }
      return( <div>
                <h3 className="snapshot-header">Product Snapshot</h3>
                {snapShot}
              </div>
              );
      }
    }
