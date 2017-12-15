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

this.props.display('native');
}
switchFamily(){
this.props.display('family');
}
switchSyndicated(){
this.props.display('syndicated');
}
switchAll(){
this.props.display('all');
}
switchBlocked(){
this.props.display('blocked');
}
render(){
let familyIds=0;

  if (this.props.data.familyIds.length>=1){
   familyIds=this.props.data.familyIds.length;
}
let totalSyndicated=this.props.data.syndicated + this.props.data.stopped;
let totalNative=this.props.data.displayableNative + this.props.data.ratingOnly;
let snapShot=(
              <ul className="snapshot-container">
                <li onClick={this.switchNative} className="native">
                  <div className="snap-main">
                    <h2 className="main-number">{this.props.data.native}</h2>
                    <h3 className="main-label">NATIVE</h3>
                  </div>
                  <div className="secondary-container">
                    <h4 className="secondary-number">{totalNative}</h4>
                    <h4 className="secondary-label">Total Native</h4>
                  </div>
                  <div className="secondary-container">
                    <h4 className="secondary-number">{this.props.data.ratingOnly}</h4>
                    <h4 className="secondary-label">Ratings-only Native</h4>
                  </div>
                </li>

                <li>
                <div onClick={this.switchSyndicated} className="snap-main">
                  <h2 className="main-number">{this.props.data.syndicated}</h2>
                  <h3 className="main-label">SYNDICATED</h3>
                </div>
                <div className="secondary-container">
                  <h4 className="secondary-number">{totalSyndicated}</h4>
                  <h4 className="secondary-label">Total Syndicated</h4>
                </div>
                <div className="secondary-container" onClick={this.switchBlocked}>
                  <h4 className="secondary-number">{this.props.data.stopped}</h4>
                  <h4 className="secondary-label">Blocked Syndicated</h4>
                </div>
                </li>
                <li>
                  <div onClick={this.switchFamily} className="snap-main">
                    <h2 className="main-number">{this.props.data.family}</h2>
                    <h3 className="main-label">FAMILY</h3>
                  </div>
                  <div className="family-information">
                    <h4 className="family-title">Family IDs</h4>
                    <h4>{familyIds}</h4>
                  </div>
                </li>
                <li onClick={this.switchAll} className="total-container">
                  <div className="total-main">
                    <h2 className="total-number">{this.props.data.total}</h2>
                    <h3 className="total-label">TOTAL REVIEWS DISPLAYING</h3>
                  </div>
                </li>
              </ul>
            );
        if(this.props.loading){
        snapShot=(
                    <ul className="snapshot-container">
                      <li className="native">
                        <Loader/>
                      </li>

                      <li>
                        <Loader/>
                      </li>
                      <li>
                        <Loader/>
                      </li>
                      <li>
                        <Loader/>
                      </li>
                    </ul>

                          );
          }
  return( <div>
            <h3 className="snapshot-header">Product Snapshot<i className="fa fa-camera" aria-hidden="true"></i></h3>
            {snapShot}
          </div>
          );
  }
}
