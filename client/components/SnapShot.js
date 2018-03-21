import React from 'react';
import Loader from './Loader';
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
    this.props.blockedFunction();
    }

    render(){
    console.log("SNAPSHOT DATA HERE",this.props);
    let familyIds=0;

      if (this.props.data.familyIds.length>=1){
       familyIds=this.props.data.familyIds.length;
      }
    let totalSyndicated=  (
                          <div className="sub-one">
                          <div className="svg-box beaker-hidden">
                            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.83 66.97">
                            <defs>
                            <mask id="liquidMask">
                            <path d="M59.87,52.6a1.8,1.8,0,0,1,.24.21A9.22,9.22,0,0,1,61,54.53a16.46,16.46,0,0,0,1.73,1.74,6.87,6.87,0,0,1,.83,1.49,49.42,49.42,0,0,0,4,6.19,5.25,5.25,0,0,1,1.13,2.59,1.89,1.89,0,0,1-.22,1,2.69,2.69,0,0,1-1.76,1.05,33.16,33.16,0,0,1-7.44.83l-14.88,0H36.93a29.36,29.36,0,0,1-4.81,0c-1.15-.19-2.9.09-3.8-0.71a3.33,3.33,0,0,1-1-2.11,4.87,4.87,0,0,1,.2-2.07A8.9,8.9,0,0,1,28.26,63,56.34,56.34,0,0,1,38.68,49.91a2.76,2.76,0,0,1,.67-0.52A4,4,0,0,1,41,49.2a13.05,13.05,0,0,0,3.38-.92,4.59,4.59,0,0,1,3.43,0c0.44,0.22.81,0.55,1.26,0.76,1.53,0.72,3.21-.37,4.76-0.33a7.4,7.4,0,0,1,4.42,2.24c0.21,0.29.32,0.64,0.55,0.91A6,6,0,0,0,59.87,52.6Z" transform="translate(-24.17 -23.03)" />
                            <g id="bubblegroup" fill="#000000">
                              <circle cx="16.33" cy="53.47" r="4.5">
                              <animateTransform attributeType="xml"
                                attributeName="transform"
                                type="rotate"
                                from="0 50 50"
                                to="180 90 10"
                                dur="6s"
                                repeatCount="indefinite"/>
                                </circle>
                              <circle cx="34.33" cy="62.47" r="4.5" fill="#333333" >
                                <animateTransform attributeType="xml"
                                attributeName="transform"
                                type="rotate"
                                  from="0 50 50"
                                to="180 90 10"
                                dur="4s"
                                repeatCount="indefinite"/>
                                </circle>
                              <circle cx="34.33" cy="62.47" r="4.5" fill="#2d2d2d">
                                 <animateTransform attributeType="xml"
                                attributeName="transform"
                                type="rotate"
                                 from="0 50 50"
                                to="180 90 10"
                                dur="6s"
                                repeatCount="indefinite"/>
                                </circle>
                              <circle cx="22.33" cy="59.47" r="1.5">
                                 <animateTransform attributeType="xml"
                                attributeName="transform"
                                type="rotate"
                               from="0 50 50"
                                to="180 90 10"
                                dur="8s"
                                repeatCount="indefinite"/>
                                </circle>
                               <circle cx="10.33" cy="59.47" r="1.5" fill="#333333">
                            <animateTransform attributeType="xml"
                                attributeName="transform"
                                type="rotate"
                                 from="0 50 50"
                                to="180 90 10"
                                dur="6s"
                                repeatCount="indefinite"/>
                                </circle>
                              <circle cx="43.5" cy="88.5" r="3.5">
                            <animateTransform attributeType="xml"
                                attributeName="transform"
                                type="rotate"
                                  from="0 50 50"
                                to="180 90 10"
                                dur="5s"
                                repeatCount="indefinite"/>
                                </circle>
                              <circle cx="64.5" cy="73.5" r="1.5"  fill="black">
                                <animateTransform attributeType="xml"
                                attributeName="transform"
                                type="rotate"
                                  from="0 50 50"
                                to="180 90 10"
                                dur="4s"
                                repeatCount="indefinite"/>
                              </circle>
                            </g>
                            </mask>
                            </defs>

                              <path d="M24.17,64.72c0.33-.91.62-1.83,1-2.72a9.87,9.87,0,0,1,1.09-1.88c2.47-3.33,5-6.65,7.47-10q2.21-3,4.4-5.91c0.63-.85,1.25-1.7,1.85-2.57A1.21,1.21,0,0,0,40.21,41c0-4-.08-8-0.12-11.94a5.73,5.73,0,0,0-2-4.25c-0.82-.77-0.71-1.27.31-1.78H57.13c0.86,0.62,1,1,.3,1.66a6.08,6.08,0,0,0-2,4.85c0.1,3.76.17,7.52,0.29,11.28A2.21,2.21,0,0,0,56.15,42c1.78,2.49,3.61,5,5.41,7.43,1.43,2,2.85,3.93,4.29,5.89S68.71,59.07,70,61A8.94,8.94,0,0,1,72,66.52c-0.15,3.05-2.84,5.31-6.61,5.47H64.79q-17,0-34,0c-3.23,0-5.83-1.91-6.41-4.62a4.57,4.57,0,0,0-.17-0.5V64.72ZM41,24.86a8.35,8.35,0,0,1,1.38,4.86q0,5.79,0,11.58a1.88,1.88,0,0,1-.26,1c-0.42.67-.9,1.31-1.38,2l-4.4,5.91c-1.68,2.26-3.38,4.51-5,6.78-1.3,1.77-2.65,3.52-3.84,5.34a6,6,0,0,0-1,4.62A3.77,3.77,0,0,0,29.71,70a10.14,10.14,0,0,0,2,.15l32.36,0a11.11,11.11,0,0,0,1.83-.12c1.84-.31,3.14-1.11,3.62-2.67a5.27,5.27,0,0,0-1-4.7c-1.73-2.51-3.57-5-5.37-7.45L59,49.42c-1.67-2.29-3.36-4.57-5-6.87a2.46,2.46,0,0,1-.47-1.28c-0.13-3.78-.24-7.56-0.29-11.34a12.6,12.6,0,0,1,.31-2.9,13.74,13.74,0,0,1,.87-2.17H41Z" transform="translate(-24.17 -23.03)"/>


                              <g id="maskedliquid" mask="url(#liquidMask)">
                              <path d="M59.87,52.6a1.8,1.8,0,0,1,.24.21A9.22,9.22,0,0,1,61,54.53a16.46,16.46,0,0,0,1.73,1.74,6.87,6.87,0,0,1,.83,1.49,49.42,49.42,0,0,0,4,6.19,5.25,5.25,0,0,1,1.13,2.59,1.89,1.89,0,0,1-.22,1,2.69,2.69,0,0,1-1.76,1.05,33.16,33.16,0,0,1-7.44.83l-14.88,0H36.93a29.36,29.36,0,0,1-4.81,0c-1.15-.19-2.9.09-3.8-0.71a3.33,3.33,0,0,1-1-2.11,4.87,4.87,0,0,1,.2-2.07A8.9,8.9,0,0,1,28.26,63,56.34,56.34,0,0,1,38.68,49.91a2.76,2.76,0,0,1,.67-0.52A4,4,0,0,1,41,49.2a13.05,13.05,0,0,0,3.38-.92,4.59,4.59,0,0,1,3.43,0c0.44,0.22.81,0.55,1.26,0.76,1.53,0.72,3.21-.37,4.76-0.33a7.4,7.4,0,0,1,4.42,2.24c0.21,0.29.32,0.64,0.55,0.91A6,6,0,0,0,59.87,52.6Z" transform="translate(-24.17 -23.03)"/>
                            </g>

                              <path d="M18,27" transform="translate(-24.17 -23.03)" />
                            </svg>
                            </div>
                              <h4>{this.props.data.syndicated}</h4>
                              <h4>Total Syndicated</h4>
                          </div>
                          );
    let blocked= (
                    <div onClick={this.switchBlocked} className="sub-two">
                    <div className="svg-box beaker-hidden">
                      <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.83 66.97">
                      <defs>
                      <mask id="liquidMask">
                      <path d="M59.87,52.6a1.8,1.8,0,0,1,.24.21A9.22,9.22,0,0,1,61,54.53a16.46,16.46,0,0,0,1.73,1.74,6.87,6.87,0,0,1,.83,1.49,49.42,49.42,0,0,0,4,6.19,5.25,5.25,0,0,1,1.13,2.59,1.89,1.89,0,0,1-.22,1,2.69,2.69,0,0,1-1.76,1.05,33.16,33.16,0,0,1-7.44.83l-14.88,0H36.93a29.36,29.36,0,0,1-4.81,0c-1.15-.19-2.9.09-3.8-0.71a3.33,3.33,0,0,1-1-2.11,4.87,4.87,0,0,1,.2-2.07A8.9,8.9,0,0,1,28.26,63,56.34,56.34,0,0,1,38.68,49.91a2.76,2.76,0,0,1,.67-0.52A4,4,0,0,1,41,49.2a13.05,13.05,0,0,0,3.38-.92,4.59,4.59,0,0,1,3.43,0c0.44,0.22.81,0.55,1.26,0.76,1.53,0.72,3.21-.37,4.76-0.33a7.4,7.4,0,0,1,4.42,2.24c0.21,0.29.32,0.64,0.55,0.91A6,6,0,0,0,59.87,52.6Z" transform="translate(-24.17 -23.03)" />
                      <g id="bubblegroup" fill="#000000">
                        <circle cx="16.33" cy="53.47" r="4.5">
                        <animateTransform attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                          from="0 50 50"
                          to="180 90 10"
                          dur="6s"
                          repeatCount="indefinite"/>
                          </circle>
                        <circle cx="34.33" cy="62.47" r="4.5" fill="#333333" >
                          <animateTransform attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                            from="0 50 50"
                          to="180 90 10"
                          dur="4s"
                          repeatCount="indefinite"/>
                          </circle>
                        <circle cx="34.33" cy="62.47" r="4.5" fill="#2d2d2d">
                           <animateTransform attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                           from="0 50 50"
                          to="180 90 10"
                          dur="6s"
                          repeatCount="indefinite"/>
                          </circle>
                        <circle cx="22.33" cy="59.47" r="1.5">
                           <animateTransform attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                         from="0 50 50"
                          to="180 90 10"
                          dur="8s"
                          repeatCount="indefinite"/>
                          </circle>
                         <circle cx="10.33" cy="59.47" r="1.5" fill="#333333">
                      <animateTransform attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                           from="0 50 50"
                          to="180 90 10"
                          dur="6s"
                          repeatCount="indefinite"/>
                          </circle>
                        <circle cx="43.5" cy="88.5" r="3.5">
                      <animateTransform attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                            from="0 50 50"
                          to="180 90 10"
                          dur="5s"
                          repeatCount="indefinite"/>
                          </circle>
                        <circle cx="64.5" cy="73.5" r="1.5"  fill="black">
                          <animateTransform attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                            from="0 50 50"
                          to="180 90 10"
                          dur="4s"
                          repeatCount="indefinite"/>
                        </circle>
                      </g>
                      </mask>
                      </defs>

                        <path d="M24.17,64.72c0.33-.91.62-1.83,1-2.72a9.87,9.87,0,0,1,1.09-1.88c2.47-3.33,5-6.65,7.47-10q2.21-3,4.4-5.91c0.63-.85,1.25-1.7,1.85-2.57A1.21,1.21,0,0,0,40.21,41c0-4-.08-8-0.12-11.94a5.73,5.73,0,0,0-2-4.25c-0.82-.77-0.71-1.27.31-1.78H57.13c0.86,0.62,1,1,.3,1.66a6.08,6.08,0,0,0-2,4.85c0.1,3.76.17,7.52,0.29,11.28A2.21,2.21,0,0,0,56.15,42c1.78,2.49,3.61,5,5.41,7.43,1.43,2,2.85,3.93,4.29,5.89S68.71,59.07,70,61A8.94,8.94,0,0,1,72,66.52c-0.15,3.05-2.84,5.31-6.61,5.47H64.79q-17,0-34,0c-3.23,0-5.83-1.91-6.41-4.62a4.57,4.57,0,0,0-.17-0.5V64.72ZM41,24.86a8.35,8.35,0,0,1,1.38,4.86q0,5.79,0,11.58a1.88,1.88,0,0,1-.26,1c-0.42.67-.9,1.31-1.38,2l-4.4,5.91c-1.68,2.26-3.38,4.51-5,6.78-1.3,1.77-2.65,3.52-3.84,5.34a6,6,0,0,0-1,4.62A3.77,3.77,0,0,0,29.71,70a10.14,10.14,0,0,0,2,.15l32.36,0a11.11,11.11,0,0,0,1.83-.12c1.84-.31,3.14-1.11,3.62-2.67a5.27,5.27,0,0,0-1-4.7c-1.73-2.51-3.57-5-5.37-7.45L59,49.42c-1.67-2.29-3.36-4.57-5-6.87a2.46,2.46,0,0,1-.47-1.28c-0.13-3.78-.24-7.56-0.29-11.34a12.6,12.6,0,0,1,.31-2.9,13.74,13.74,0,0,1,.87-2.17H41Z" transform="translate(-24.17 -23.03)"/>


                        <g id="maskedliquid" mask="url(#liquidMask)">
                        <path d="M59.87,52.6a1.8,1.8,0,0,1,.24.21A9.22,9.22,0,0,1,61,54.53a16.46,16.46,0,0,0,1.73,1.74,6.87,6.87,0,0,1,.83,1.49,49.42,49.42,0,0,0,4,6.19,5.25,5.25,0,0,1,1.13,2.59,1.89,1.89,0,0,1-.22,1,2.69,2.69,0,0,1-1.76,1.05,33.16,33.16,0,0,1-7.44.83l-14.88,0H36.93a29.36,29.36,0,0,1-4.81,0c-1.15-.19-2.9.09-3.8-0.71a3.33,3.33,0,0,1-1-2.11,4.87,4.87,0,0,1,.2-2.07A8.9,8.9,0,0,1,28.26,63,56.34,56.34,0,0,1,38.68,49.91a2.76,2.76,0,0,1,.67-0.52A4,4,0,0,1,41,49.2a13.05,13.05,0,0,0,3.38-.92,4.59,4.59,0,0,1,3.43,0c0.44,0.22.81,0.55,1.26,0.76,1.53,0.72,3.21-.37,4.76-0.33a7.4,7.4,0,0,1,4.42,2.24c0.21,0.29.32,0.64,0.55,0.91A6,6,0,0,0,59.87,52.6Z" transform="translate(-24.17 -23.03)"/>
                      </g>

                        <path d="M18,27" transform="translate(-24.17 -23.03)" />
                      </svg>
                      </div>
                        <h4>{this.props.data.stopped}</h4>
                        <h4>Blocked Syndicated</h4>
                    </div>
                );
    if(this.props.blockedLoading){
      totalSyndicated=(
                        <div onClick={this.switchSyndicated} className="sub-one">
                        <div className="svg-box">
                          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.83 66.97">
                          <defs>
                          <mask id="liquidMask">
                          <path d="M59.87,52.6a1.8,1.8,0,0,1,.24.21A9.22,9.22,0,0,1,61,54.53a16.46,16.46,0,0,0,1.73,1.74,6.87,6.87,0,0,1,.83,1.49,49.42,49.42,0,0,0,4,6.19,5.25,5.25,0,0,1,1.13,2.59,1.89,1.89,0,0,1-.22,1,2.69,2.69,0,0,1-1.76,1.05,33.16,33.16,0,0,1-7.44.83l-14.88,0H36.93a29.36,29.36,0,0,1-4.81,0c-1.15-.19-2.9.09-3.8-0.71a3.33,3.33,0,0,1-1-2.11,4.87,4.87,0,0,1,.2-2.07A8.9,8.9,0,0,1,28.26,63,56.34,56.34,0,0,1,38.68,49.91a2.76,2.76,0,0,1,.67-0.52A4,4,0,0,1,41,49.2a13.05,13.05,0,0,0,3.38-.92,4.59,4.59,0,0,1,3.43,0c0.44,0.22.81,0.55,1.26,0.76,1.53,0.72,3.21-.37,4.76-0.33a7.4,7.4,0,0,1,4.42,2.24c0.21,0.29.32,0.64,0.55,0.91A6,6,0,0,0,59.87,52.6Z" transform="translate(-24.17 -23.03)" />
                          <g id="bubblegroup" fill="#000000">
                            <circle cx="16.33" cy="53.47" r="4.5">
                            <animateTransform attributeType="xml"
                              attributeName="transform"
                              type="rotate"
                              from="0 50 50"
                              to="180 90 10"
                              dur="6s"
                              repeatCount="indefinite"/>
                              </circle>
                            <circle cx="34.33" cy="62.47" r="4.5" fill="#333333" >
                              <animateTransform attributeType="xml"
                              attributeName="transform"
                              type="rotate"
                                from="0 50 50"
                              to="180 90 10"
                              dur="4s"
                              repeatCount="indefinite"/>
                              </circle>
                            <circle cx="34.33" cy="62.47" r="4.5" fill="#2d2d2d">
                               <animateTransform attributeType="xml"
                              attributeName="transform"
                              type="rotate"
                               from="0 50 50"
                              to="180 90 10"
                              dur="6s"
                              repeatCount="indefinite"/>
                              </circle>
                            <circle cx="22.33" cy="59.47" r="1.5">
                               <animateTransform attributeType="xml"
                              attributeName="transform"
                              type="rotate"
                             from="0 50 50"
                              to="180 90 10"
                              dur="8s"
                              repeatCount="indefinite"/>
                              </circle>
                             <circle cx="10.33" cy="59.47" r="1.5" fill="#333333">
                          <animateTransform attributeType="xml"
                              attributeName="transform"
                              type="rotate"
                               from="0 50 50"
                              to="180 90 10"
                              dur="6s"
                              repeatCount="indefinite"/>
                              </circle>
                            <circle cx="43.5" cy="88.5" r="3.5">
                          <animateTransform attributeType="xml"
                              attributeName="transform"
                              type="rotate"
                                from="0 50 50"
                              to="180 90 10"
                              dur="5s"
                              repeatCount="indefinite"/>
                              </circle>
                            <circle cx="64.5" cy="73.5" r="1.5"  fill="black">
                              <animateTransform attributeType="xml"
                              attributeName="transform"
                              type="rotate"
                                from="0 50 50"
                              to="180 90 10"
                              dur="4s"
                              repeatCount="indefinite"/>
                            </circle>
                          </g>
                          </mask>
                          </defs>

                            <path d="M24.17,64.72c0.33-.91.62-1.83,1-2.72a9.87,9.87,0,0,1,1.09-1.88c2.47-3.33,5-6.65,7.47-10q2.21-3,4.4-5.91c0.63-.85,1.25-1.7,1.85-2.57A1.21,1.21,0,0,0,40.21,41c0-4-.08-8-0.12-11.94a5.73,5.73,0,0,0-2-4.25c-0.82-.77-0.71-1.27.31-1.78H57.13c0.86,0.62,1,1,.3,1.66a6.08,6.08,0,0,0-2,4.85c0.1,3.76.17,7.52,0.29,11.28A2.21,2.21,0,0,0,56.15,42c1.78,2.49,3.61,5,5.41,7.43,1.43,2,2.85,3.93,4.29,5.89S68.71,59.07,70,61A8.94,8.94,0,0,1,72,66.52c-0.15,3.05-2.84,5.31-6.61,5.47H64.79q-17,0-34,0c-3.23,0-5.83-1.91-6.41-4.62a4.57,4.57,0,0,0-.17-0.5V64.72ZM41,24.86a8.35,8.35,0,0,1,1.38,4.86q0,5.79,0,11.58a1.88,1.88,0,0,1-.26,1c-0.42.67-.9,1.31-1.38,2l-4.4,5.91c-1.68,2.26-3.38,4.51-5,6.78-1.3,1.77-2.65,3.52-3.84,5.34a6,6,0,0,0-1,4.62A3.77,3.77,0,0,0,29.71,70a10.14,10.14,0,0,0,2,.15l32.36,0a11.11,11.11,0,0,0,1.83-.12c1.84-.31,3.14-1.11,3.62-2.67a5.27,5.27,0,0,0-1-4.7c-1.73-2.51-3.57-5-5.37-7.45L59,49.42c-1.67-2.29-3.36-4.57-5-6.87a2.46,2.46,0,0,1-.47-1.28c-0.13-3.78-.24-7.56-0.29-11.34a12.6,12.6,0,0,1,.31-2.9,13.74,13.74,0,0,1,.87-2.17H41Z" transform="translate(-24.17 -23.03)"/>


                            <g id="maskedliquid" mask="url(#liquidMask)">
                            <path d="M59.87,52.6a1.8,1.8,0,0,1,.24.21A9.22,9.22,0,0,1,61,54.53a16.46,16.46,0,0,0,1.73,1.74,6.87,6.87,0,0,1,.83,1.49,49.42,49.42,0,0,0,4,6.19,5.25,5.25,0,0,1,1.13,2.59,1.89,1.89,0,0,1-.22,1,2.69,2.69,0,0,1-1.76,1.05,33.16,33.16,0,0,1-7.44.83l-14.88,0H36.93a29.36,29.36,0,0,1-4.81,0c-1.15-.19-2.9.09-3.8-0.71a3.33,3.33,0,0,1-1-2.11,4.87,4.87,0,0,1,.2-2.07A8.9,8.9,0,0,1,28.26,63,56.34,56.34,0,0,1,38.68,49.91a2.76,2.76,0,0,1,.67-0.52A4,4,0,0,1,41,49.2a13.05,13.05,0,0,0,3.38-.92,4.59,4.59,0,0,1,3.43,0c0.44,0.22.81,0.55,1.26,0.76,1.53,0.72,3.21-.37,4.76-0.33a7.4,7.4,0,0,1,4.42,2.24c0.21,0.29.32,0.64,0.55,0.91A6,6,0,0,0,59.87,52.6Z" transform="translate(-24.17 -23.03)"/>
                          </g>

                            <path d="M18,27" transform="translate(-24.17 -23.03)" />
                          </svg>
                          </div>
                        </div>
                      );
      blocked= (
                <div className="sub-two">
                <div className="svg-box">
                  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.83 66.97">
                  <defs>
                  <mask id="liquidMask">
                  <path d="M59.87,52.6a1.8,1.8,0,0,1,.24.21A9.22,9.22,0,0,1,61,54.53a16.46,16.46,0,0,0,1.73,1.74,6.87,6.87,0,0,1,.83,1.49,49.42,49.42,0,0,0,4,6.19,5.25,5.25,0,0,1,1.13,2.59,1.89,1.89,0,0,1-.22,1,2.69,2.69,0,0,1-1.76,1.05,33.16,33.16,0,0,1-7.44.83l-14.88,0H36.93a29.36,29.36,0,0,1-4.81,0c-1.15-.19-2.9.09-3.8-0.71a3.33,3.33,0,0,1-1-2.11,4.87,4.87,0,0,1,.2-2.07A8.9,8.9,0,0,1,28.26,63,56.34,56.34,0,0,1,38.68,49.91a2.76,2.76,0,0,1,.67-0.52A4,4,0,0,1,41,49.2a13.05,13.05,0,0,0,3.38-.92,4.59,4.59,0,0,1,3.43,0c0.44,0.22.81,0.55,1.26,0.76,1.53,0.72,3.21-.37,4.76-0.33a7.4,7.4,0,0,1,4.42,2.24c0.21,0.29.32,0.64,0.55,0.91A6,6,0,0,0,59.87,52.6Z" transform="translate(-24.17 -23.03)" />
                  <g id="bubblegroup" fill="#000000">
                    <circle cx="16.33" cy="53.47" r="4.5">
                    <animateTransform attributeType="xml"
                      attributeName="transform"
                      type="rotate"
                      from="0 50 50"
                      to="180 90 10"
                      dur="6s"
                      repeatCount="indefinite"/>
                      </circle>
                    <circle cx="34.33" cy="62.47" r="4.5" fill="#333333" >
                      <animateTransform attributeType="xml"
                      attributeName="transform"
                      type="rotate"
                        from="0 50 50"
                      to="180 90 10"
                      dur="4s"
                      repeatCount="indefinite"/>
                      </circle>
                    <circle cx="34.33" cy="62.47" r="4.5" fill="#2d2d2d">
                       <animateTransform attributeType="xml"
                      attributeName="transform"
                      type="rotate"
                       from="0 50 50"
                      to="180 90 10"
                      dur="6s"
                      repeatCount="indefinite"/>
                      </circle>
                    <circle cx="22.33" cy="59.47" r="1.5">
                       <animateTransform attributeType="xml"
                      attributeName="transform"
                      type="rotate"
                     from="0 50 50"
                      to="180 90 10"
                      dur="8s"
                      repeatCount="indefinite"/>
                      </circle>
                     <circle cx="10.33" cy="59.47" r="1.5" fill="#333333">
                  <animateTransform attributeType="xml"
                      attributeName="transform"
                      type="rotate"
                       from="0 50 50"
                      to="180 90 10"
                      dur="6s"
                      repeatCount="indefinite"/>
                      </circle>
                    <circle cx="43.5" cy="88.5" r="3.5">
                  <animateTransform attributeType="xml"
                      attributeName="transform"
                      type="rotate"
                        from="0 50 50"
                      to="180 90 10"
                      dur="5s"
                      repeatCount="indefinite"/>
                      </circle>
                    <circle cx="64.5" cy="73.5" r="1.5"  fill="black">
                      <animateTransform attributeType="xml"
                      attributeName="transform"
                      type="rotate"
                        from="0 50 50"
                      to="180 90 10"
                      dur="4s"
                      repeatCount="indefinite"/>
                    </circle>
                  </g>
                  </mask>
                  </defs>

                    <path d="M24.17,64.72c0.33-.91.62-1.83,1-2.72a9.87,9.87,0,0,1,1.09-1.88c2.47-3.33,5-6.65,7.47-10q2.21-3,4.4-5.91c0.63-.85,1.25-1.7,1.85-2.57A1.21,1.21,0,0,0,40.21,41c0-4-.08-8-0.12-11.94a5.73,5.73,0,0,0-2-4.25c-0.82-.77-0.71-1.27.31-1.78H57.13c0.86,0.62,1,1,.3,1.66a6.08,6.08,0,0,0-2,4.85c0.1,3.76.17,7.52,0.29,11.28A2.21,2.21,0,0,0,56.15,42c1.78,2.49,3.61,5,5.41,7.43,1.43,2,2.85,3.93,4.29,5.89S68.71,59.07,70,61A8.94,8.94,0,0,1,72,66.52c-0.15,3.05-2.84,5.31-6.61,5.47H64.79q-17,0-34,0c-3.23,0-5.83-1.91-6.41-4.62a4.57,4.57,0,0,0-.17-0.5V64.72ZM41,24.86a8.35,8.35,0,0,1,1.38,4.86q0,5.79,0,11.58a1.88,1.88,0,0,1-.26,1c-0.42.67-.9,1.31-1.38,2l-4.4,5.91c-1.68,2.26-3.38,4.51-5,6.78-1.3,1.77-2.65,3.52-3.84,5.34a6,6,0,0,0-1,4.62A3.77,3.77,0,0,0,29.71,70a10.14,10.14,0,0,0,2,.15l32.36,0a11.11,11.11,0,0,0,1.83-.12c1.84-.31,3.14-1.11,3.62-2.67a5.27,5.27,0,0,0-1-4.7c-1.73-2.51-3.57-5-5.37-7.45L59,49.42c-1.67-2.29-3.36-4.57-5-6.87a2.46,2.46,0,0,1-.47-1.28c-0.13-3.78-.24-7.56-0.29-11.34a12.6,12.6,0,0,1,.31-2.9,13.74,13.74,0,0,1,.87-2.17H41Z" transform="translate(-24.17 -23.03)"/>


                    <g id="maskedliquid" mask="url(#liquidMask)">
                    <path d="M59.87,52.6a1.8,1.8,0,0,1,.24.21A9.22,9.22,0,0,1,61,54.53a16.46,16.46,0,0,0,1.73,1.74,6.87,6.87,0,0,1,.83,1.49,49.42,49.42,0,0,0,4,6.19,5.25,5.25,0,0,1,1.13,2.59,1.89,1.89,0,0,1-.22,1,2.69,2.69,0,0,1-1.76,1.05,33.16,33.16,0,0,1-7.44.83l-14.88,0H36.93a29.36,29.36,0,0,1-4.81,0c-1.15-.19-2.9.09-3.8-0.71a3.33,3.33,0,0,1-1-2.11,4.87,4.87,0,0,1,.2-2.07A8.9,8.9,0,0,1,28.26,63,56.34,56.34,0,0,1,38.68,49.91a2.76,2.76,0,0,1,.67-0.52A4,4,0,0,1,41,49.2a13.05,13.05,0,0,0,3.38-.92,4.59,4.59,0,0,1,3.43,0c0.44,0.22.81,0.55,1.26,0.76,1.53,0.72,3.21-.37,4.76-0.33a7.4,7.4,0,0,1,4.42,2.24c0.21,0.29.32,0.64,0.55,0.91A6,6,0,0,0,59.87,52.6Z" transform="translate(-24.17 -23.03)"/>
                  </g>

                    <path d="M18,27" transform="translate(-24.17 -23.03)" />
                  </svg>
                  </div>
                </div>
                )
    }
    let snapShot=(
                    <div className="snap-container">
                      <div onClick={this.switchNative} className="snap-details native">
                          <div className="main native-top">
                              <h2>{this.props.data.displayableNative}</h2>
                              <h2>DISPLAYED NATIVE REVIEWS</h2>
                          </div>
                          <div className="sub-one native-bottom">
                              <h4>{this.props.data.native}</h4>
                              <h4>Content Native</h4>
                          </div>
                          <div className="sub-two">
                              <h4>{this.props.data.ratingOnly}</h4>
                              <h4>Ratings-only Native</h4>
                          </div>
                      </div>
                      <div  className="snap-details syndicated">
                          <div onClick={this.switchSyndicated} className="main syndicated">
                              <h2>{this.props.data.displayableSyndicated}</h2>
                              <h2>DISPLAYED SYNDICATED REVIEWS</h2>
                          </div>
                        {totalSyndicated}
                        {blocked}
                      </div>
                      <div className="snap-details family">
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
