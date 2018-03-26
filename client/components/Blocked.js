import React, { Component } from 'react';
import moment from 'moment';
export default class Blocked extends Component {
  constructor(props){
    super(props);
    this.closeBlocked=this.closeBlocked.bind(this);
  }
  closeBlocked(){
    console.log("closing-Blocked");
    this.props.blockedFunction();
  }
  render() {
    let locale;
    let mod;
    let delay;
    let ratings;
    if(this.props.localeBlocked){
     locale=this.props.localeBlocked.map((review)=>{
                   var uniqueId = function() {
                      return 'id-' + Math.random().toString(36).substr(2, 16);
                    };
        return (
                <p key={uniqueId()}>* Review ID: <span className="review-number">{review.Id}</span> from {review.SourceClient} is blocked because of Invalid<span className="reason">LOCALE:</span> {review.ContentLocale}</p>
                );
      });
    }
    // if(this.props.ratings){
    //   ratings=this.props.ratings.map((reviews)=>{
    //     return(<p key={review.Id}>* Review ID: <span className="review-number">{review.Id}</span> from {review.SourceClient} is blocked because it is a Ratings only review</p>);
    //   )};
    // }
    if(this.props.ratings){
     locale=this.props.ratings.map((review)=>{
       var uniqueId = function() {
          return 'id-' + Math.random().toString(36).substr(2, 16);
        };
        return (
                <p key={uniqueId()}>* Review ID: <span className="review-number">{review.Id}</span> from {review.SourceClient} is blocked because it is a ratings only review</p>
                );
      });
    }
    if(this.props.modBlocked){
     mod=this.props.modBlocked.map((review)=>{
       var uniqueId = function() {
          return 'id-' + Math.random().toString(36).substr(2, 16);
        };
        let modCode=review.ModeratorCodes.map((code)=>{
          let codeDef;
            switch(code){
              case "RET":
                codeDef="RET: Retailer Mention";
              break;
              case "PC":
                codeDef="PC: Promotion, or Coupon";
              break;
              case "PRI":
                codeDef="PRI: Price mention";
              break;
              case "STP":
                codeDef="STP: Stop Syndication (Multi-Reason)";
              break;
              case "CR":
                codeDef="CR: Competitor Reference";
              break;
              case "CSN":
                codeDef="CSN: Customer Service Non-Reject";
              break;
              case "DBA":
                codeDef="DBA: Directing Business Away";
              break;
              case "FL":
                codeDef="FL: Foreign Language";
              break;
              case "FRD":
                codeDef="FRD: Fraud Team Rejected";
              break;
              case "HMP":
                codeDef="HMP: Human Moderated";
              break;
              case "IMP":
                codeDef="IMP: Import";
              break;
              case "IR":
                codeDef="IR: Incentivized Review";
              break;
              case "MIG":
                codeDef="MIG: Content Migration";
              break;
              case "MM":
                codeDef="MM: Machine moderated";
              break;
              case "MMA":
                codeDef="MMA: Machine moderated-approved";
              break;
              case "MMD":
                codeDef="MMD: Machine moderated-declined";
              break;
              case "POW":
                codeDef="POW: PowerReviews Syndication Import Content";
              break;
              case "BKL":
                codeDef="BKL: Blacklisted by CMS2";
              break;
              case "ATH":
                codeDef="ATH: Authenticity Investigation";
              break;
              case "CRMD":
                codeDef="CRMD: Content Remoderation via JIRA ticket";
              break;
              case "SLI":
                codeDef="SLI: Syndication Legal Interest";
              break;

              default:
                codeDef=code
              break;
            }
            return <span className="mod-code">{codeDef}</span>
          });
        return (
                <p key={uniqueId()}>* Review ID: <span className="review-number">{review.Id}</span> from {review.SourceClient} is blocked because of a <span className="reason">MODERATION STOP CODE.</span> <span className="reason-codes">Codes associated with review:</span> {modCode}</p>
                );
      });
    }
    if(this.props.syndBlocked){
      var uniqueId = function() {
         return 'id-' + Math.random().toString(36).substr(2, 16);
       };
      console.log("UNIQUE ID HERE***********",uniqueId());
     delay=this.props.syndBlocked.map((review)=>{
        var date=moment(review.SubmissionTime).format("dddd, MMMM Do YYYY, h:mm:ss a");
        return (
                <p key={uniqueId()}>* Review ID: <span className="review-number">{review.Id}</span> from {review.SourceClient} is blocked because of <span className="reason">SYNDICATION DELAY</span>. It was submitted on {date}  </p>
                );
      });
    }
    let blockedContainer;

    if(this.props.blocked){
      blockedContainer=(
                      <div className="modal-blocked">
                        <div className="blocked-container">
                          <h3 className="blocked-header">Blocked Reviews</h3>
                          <span className="disclaimer">**Note: Reviews can appear in the list multiple times because of different blocking reasons</span>
                          <button onClick={this.closeBlocked} type="button" className="close close-blocked" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                          {locale}
                          {mod}
                          {delay}
                          {ratings}
                        </div>
                      </div>
                    );
    }
  console.log("BLOCKED COMPONENT", this.props);
    return(<div>
              {blockedContainer}
           </div>);
  }
}
