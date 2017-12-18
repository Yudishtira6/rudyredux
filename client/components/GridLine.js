import React from 'react';
// ONE LINE of the Grid
import moment from 'moment';

const GridLine =({productId, data})=>{
// set css classes dynamically depending on what type of review.
    let color;
    let type="Native";
    let codes="N/A";
    let reason;
console.log("data for Grid",data);

if(data.Content){
  if(data.Content=="PC"){
    codes="Promotions/Coupon References";
}else if(data.Content==="RET"){
    codes="Specific Retailer Reference";
}else if(data.Content==="PRI"){
  codes="Specific Price Reference";
}else if(data.Content==="STP"){
  codes="Stop Syndication (Multi-Reason)";
}

  reason="highlight";
  type="blocked";
  color="red";
}

    if(data.IsSyndicated && !data.blocked){
    type="Syndicated";
    color="blue";
    }else if(data.ProductId.toLowerCase() != productId.toLowerCase()){
      type="Family";
      color="yellow";
    }
var date=moment(data.SubmissionTime).format("dddd, MMMM Do YYYY, h:mm:ss a");

return(

        <tr className={color}>
            <td>{data.Id}</td>
            <td>{type}</td>
            <td>{data.SourceClient}</td>
            <td>{data.ProductId}</td>
            <td>{data.Rating}</td>
            <td>{data.ModerationStatus}</td>
            <td className={reason}>{codes}</td>
            <td>{date}</td>
		</tr>

      );
}

export default GridLine;
