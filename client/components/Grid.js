import React from 'react';
import GridLine from './GridLine';
//WHOLE GRID OF DATA


const Grid =({title, productId, data})=>{
let Items;

if(data){
console.log(data);
//loop through data and build out grid
Items=data.map((review)=>{
  return <GridLine key={review.Id} productId={productId} data={review}/>
});
}
return(
      <div>
        <h1 id="displayableReviewsTitle">{title}</h1>

        <table className="tableMain" id="displayableReviews">
        	<tbody>
        		<tr className="tableHeader">
        			<th>REVIEW ID</th>
        			<th>REVIEW TYPE</th>
        			<th>SOURCE CLIENT</th>
                    <th>SOURCE PRODUCT ID</th>
                    <th>RATING</th>
                    <th>STATUS</th>
                    <th>CONTENT CODES</th>
                    <th>SUBMISSION TIME</th>
                </tr>
                {Items}
			      </tbody>
		      </table>
        </div>
        );
}

export default Grid;
