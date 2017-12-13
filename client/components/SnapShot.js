import React from 'react';


import Loader from './loader';
export default class SnapShot extends React.Component {
constructor(props) {
super(props);
this.switchNative=this.switchNative.bind(this);
this.switchFamily=this.switchFamily.bind(this);
this.switchAll=this.switchAll.bind(this);
this.switchSyndicated=this.switchSyndicated.bind(this);
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
render(){
let familyIds=0;

  if (this.props.data.familyIds.length>=1){
   familyIds=this.props.data.familyIds.length;
}

let snapShot=(
              <ul className="snapshot-container">
                <li onClick={this.switchNative} className="native">
                  <div className="snap-main">
                    <h2 className="main-number">{this.props.data.native}</h2>
                    <h3 className="main-label">NATIVE</h3>
                  </div>
                  <div className="secondary-container">
                    <h4 className="secondary-number">{this.props.data.displayableNative}</h4>
                    <h4 className="secondary-label">Displayable Native Reviews</h4>
                  </div>
                  <div className="secondary-container">
                    <h4 className="secondary-number">{this.props.data.ratingOnly}</h4>
                    <h4 className="secondary-label">Ratings Only Native Reviews</h4>
                  </div>
                </li>

                <li>
                <div onClick={this.switchSyndicated} className="snap-main">
                  <h2 className="main-number">{this.props.data.syndicated}</h2>
                  <h3 className="main-label">SYNDICATED</h3>
                </div>
                <div className="secondary-container">
                  <h4 className="secondary-number">{this.props.data.displayableSyndicated}</h4>
                  <h4 className="secondary-label">Displayable Syndicated Reviews</h4>
                </div>
                <div className="secondary-container">
                  <h4 className="secondary-number">{this.props.data.stopped}</h4>
                  <h4 className="secondary-label">Blocked Syndicated Reviews</h4>
                </div>
                </li>
                <li>
                  <div onClick={this.switchFamily} className="snap-main">
                    <h2 className="main-number">{this.props.data.family}</h2>
                    <h3 className="main-label">Family Reviews</h3>
                  </div>
                  <div className="family-information">
                    <h4 className="family-title">Family IDs</h4>
                    {familyIds}
                  </div>
                </li>
                <li onClick={this.switchAll} className="total-container">
                  <div className="total-main">
                    <h2 className="total-number">{this.props.data.total}</h2>
                    <h3 className="total-label">Total Reviews Displaying</h3>
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
            <h3 className="snapshot-header">Product SnapShot<i className="fa fa-camera" aria-hidden="true"></i></h3>
            {snapShot}
          </div>
          );
  }
}
