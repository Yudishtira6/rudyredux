import React from 'react';
// ONE LINE of the Grid


const GridLine =({productId, data})=>{
console.log(data);
let syndicated="Native";
if(data.IsSyndicated){
syndicated="Syndicated";
}else if(data.ProductId!=productId){
  syndicated="Family";
}

return(

        <tr className="hits">
            <td>{data.Id}</td>
            <td>{syndicated}</td>
            <td>{data.SourceClient}</td>
            <td>{data.ProductId}</td>
            <td>{data.Rating}</td>
            <td>{data.ModerationStatus}</td>
            <td>HMP</td>
            <td>{data.SubmissionTime}</td>
		</tr>

      );
}

export default GridLine;
