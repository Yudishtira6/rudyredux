import React from 'react';
// ONE LINE of the Grid
import moment from 'moment';

const GridLine =({productId, data})=>{
    let color;
    let type="Native";
    let codes="N/A";
    let reason;
console.log("DATA FOR GRID",data,"CONTENT",data.contentCodes);
if(data.contentCodes){
codes=data.contentCodes.filter((code)=>{
  if(code==="PC"|| code==="RET"){
    return code;
    }
  });
}

    if(data.IsSyndicated && !data.blocked){
    type="Syndicated";
    color="blue";
    }else if(data.ProductId.toLowerCase() != productId.toLowerCase()){
      type="Family";
      color="yellow";
    }else if(data.blocked){
      type="blocked";
      color="red";
      reason="highlight";
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
