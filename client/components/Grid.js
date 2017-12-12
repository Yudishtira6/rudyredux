import React from 'react';
import GridLine from './GridLine';
//WHOLE GRID OF DATA


const Grid =({productId, data})=>{
let Items;

if(data.Results){
Items=data.Results.map((review)=>{
  return <GridLine key={review.Id} productId={productId} data={review}/>
});
}
return(
      <div>
        <h1 id="displayableReviewsTitle">Displayable Reviews</h1>

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
