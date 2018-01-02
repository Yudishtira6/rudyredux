import React from 'react';
import GridLine from './GridLine';
//WHOLE GRID OF DATA
class Grid extends React.Component {
    constructor(props) {
          super(props);
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
  //variable for pages array
  var pages=[];
  var pageButton;
  //check if we need more than one page
  if(Math.ceil(this.props.results/100)<2){
    pages=[];
  }else{
    let numberPages=Math.ceil(this.props.results/100);
    for(var i=1; i<=numberPages; i++){
      pages.push(i);
    }
  }

  pageButton=pages.map((page,i)=>{
    let pageClass="page-button";
    if(this.props.page===i){
      pageClass="active-page";
    }

    return <li className={pageClass} onClick={this.handlePage.bind(this,i)} key={i}>{page}</li>
  })

  //if we do then divide the total results rounded up by 100 and make that many pages
  // push those pages to the pages array

  //loop through pages array and create a button for each item
  // when I click on the button it should call the offset for that page * 100
  //create a button for next page
  //create a button for previous page
  //when I click on button it should take me back, or forward a page page number +-1


  //loop through data and build out grid
  Items=this.props.data.map((review)=>{
    return <GridLine key={review.Id} productId={this.props.productId} data={review}/>
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
        <ul className="pagination">
          {pageButton}
        </ul>
        </div>
        );
  }
}

export default Grid;
