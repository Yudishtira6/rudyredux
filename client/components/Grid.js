import React from 'react';
import GridLine from './GridLine';
//WHOLE GRID OF DATA


const Grid =({data})=>{
return(
      <div>
        <h1 id="displayableReviewsTitle">Displayable Reviews</h1>

        <table class="tableMain" id="displayableReviews">
        	<tbody>
        		<tr class="tableHeader">
        			<th>REVIEW ID</th>
        			<th>REVIEW TYPE</th>
        			<th>SOURCE CLIENT</th>
                    <th>SOURCE PRODUCT ID</th>
                    <th>RATING</th>
                    <th>STATUS</th>
                    <th>CONTENT CODES</th>
                    <th>SUBMISSION TIME</th>
                </tr>
                <GridLine/>
			</tbody>
		</table>
      </div>

      );
}

export default Grid;