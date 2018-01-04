import React from 'react';
import GridLine from './GridLine';
import Pages from './Pages';

//WHOLE GRID OF DATA
class Grid extends React.Component {
    constructor(props) {
          super(props);
    this.handlePage=this.handlePage.bind(this);
    }

handlePage(i){
  console.log("clicked",i);
  this.props.pagination(i);
 }

render(){
  let Items;

  if(this.props.data.length>1){

  //create the pages
console.log("TOTAL RESULTS AT GRID", this.props.results);


  //loop through data and build out grid
  Items=this.props.data.map((review)=>{
    return <GridLine key={review.Id} clickHandler={this.clickHandler} productId={this.props.productId} data={review}/>
  });
  }
return(
      <div>
        <h1 id="displayableReviewsTitle">{this.props.title}</h1>
        <table className="tableMain" id="displayableReviews">
        	<tbody>
        		<tr className="tableHeader">
        		  <th>REVIEW ID</th>
        			<th>REVIEW TYPE</th>
        			<th>SOURCE CLIENT</th>
              <th>SOURCE PRODUCT ID</th>
              <th>RATING</th>
              <th>STATUS</th>
              <th>BLOCKING REASON</th>
              <th>SUBMISSION TIME</th>
            </tr>
            {Items}
			    </tbody>
		     </table>
         <Pages paginate={this.handlePage} totalResults={this.props.results}/>
        </div>
        );
  }
}

export default Grid;
