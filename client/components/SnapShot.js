import React from 'react';


import Loader from './loader';

const SnapShot=({data, loading})=>{

let snapShot=(
              <ul className="snapshot-container">
                <li className="native">
                  <div className="snap-main">
                    <h2 className="main-number">{data.native}</h2>
                    <h3 className="main-label">NATIVE</h3>
                  </div>
                  <div className="secondary-container">
                    <h4 className="secondary-number">{data.displayableNative}</h4>
                    <h4 className="secondary-label">Displayable Native Reviews</h4>
                  </div>
                  <div className="secondary-container">
                    <h4 className="secondary-number">{data.ratingOnly}</h4>
                    <h4 className="secondary-label">Ratings Only Native Reviews</h4>
                  </div>
                </li>

                <li>
                <div className="snap-main">
                  <h2 className="main-number">{data.syndicated}</h2>
                  <h3 className="main-label">SYNDICATED</h3>
                </div>
                <div className="secondary-container">
                  <h4 className="secondary-number">{data.displayableSyndicated}</h4>
                  <h4 className="secondary-label">Displayable Syndicated Reviews</h4>
                </div>
                <div className="secondary-container">
                  <h4 className="secondary-number">{data.stopped}</h4>
                  <h4 className="secondary-label">Blocked Syndicated Reviews</h4>
                </div>
                </li>
                <li>
                  <div className="snap-main">
                    <h2 className="main-number">{data.family}</h2>
                    <h3 className="main-label">Family Reviews</h3>
                  </div>
                  <div className="family-information">
                    <h4 className="family-title">Family ID</h4>
                    <h4 className="family-id">{data.familyInfo}</h4>
                  </div>
                </li>
                <li className="total-container">
                  <div className="total-main">
                    <h2 className="total-number">{data.total}</h2>
                    <h3 className="total-label">Total Reviews Displaying</h3>
                  </div>
                </li>
              </ul>
            );
        if(loading){
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

export default SnapShot;
