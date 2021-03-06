import React from 'react';
// ONE LINE of the Grid
import moment from 'moment';
export default class GridLine extends React.Component{
  constructor(props){
    super(props);
    this.handleClick=this.handleClick.bind(this);
  }
  handleClick(){
    console.log("CLICKING ON A REVIEW EHRE***** HERES THE DATA", this.props);
    let page='';
      if(this.props.data.SyndicationSource){
        console.log("YES ITS HERE");
          this.props.clickHandler(this.props.data.ReviewText, this.props.data.Id, this.props.data.UserNickname, this.props.data.ContentLocale, this.props.data.SourceClient, this.props.data.Rating, this.props.data.Title, this.props.data.SyndicationSource.ContentLink );
      }else{
        console.log("NOPE NO CONTENT LINK HERE***");
        this.props.clickHandler(this.props.data.ReviewText, this.props.data.Id, this.props.data.UserNickname, this.props.data.ContentLocale, this.props.data.SourceClient, this.props.data.Rating, this.props.data.Title);
      }

    }
  render(){
  // set css classes dynamically depending on what type of review.
      let color="white";
      let type="Native";
      let codes="N/A";
      let reason;


  if(this.props.data.Content){
    switch(this.props.data.Content) {
        case "PC":
            codes="Promotions/Coupon References";
            break;
        case "RET":
            codes="Specific Retailer Reference";
            break;
         case "STP":
             codes="Stop Syndication (Multi-Reason)";
             break;
        default:
            codes="N/A";
    }
    reason="highlight";
    type="blocked";
    color="red";
  }

      if(this.props.data.IsSyndicated && !this.props.data.blocked){
      type="Syndicated";
      color="blue";
      }else if(this.props.data.ProductId.toLowerCase() != this.props.productId.toLowerCase()){
        type="Family";
        color="yellow";
      }
  var date=moment(this.props.data.SubmissionTime).format("dddd, MMMM Do YYYY, h:mm:ss a");

  return(

            <tr onClick={this.handleClick} className={color}>
              <td>{this.props.data.Id}</td>
              <td>{type}</td>
              <td>{this.props.data.SourceClient}</td>
              <td>{this.props.data.ProductId}</td>
              <td>{this.props.data.Rating}</td>
              <td>{this.props.data.ModerationStatus}</td>
              <td>{date}</td>
  		      </tr>

            );
  }

}
