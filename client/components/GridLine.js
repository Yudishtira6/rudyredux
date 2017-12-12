import React from 'react';
// ONE LINE of the Grid
import moment from 'moment';

const GridLine =({productId, data})=>{
    let color;
    let type="Native";
    if(data.IsSyndicated){
    type="Syndicated";
    color="blue";
    }else if(data.ProductId!=productId){
      type="Family";
      color="yellow"
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
            <td>N/A</td>
            <td>{date}</td>
		</tr>

      );
}

export default GridLine;
