import React from 'react';
import GridLine from './GridLine';
import Pages from './Pages';

//WHOLE GRID OF DATA
class Grid extends React.Component {
    constructor(props) {
          super(props);
      this.state={
                  clicked:false,
                  reviewText:'',
                  reviewId:''
                  }
    this.handlePage=this.handlePage.bind(this);
    this.clickHandler=this.clickHandler.bind(this);
    this.closeReview=this.closeReview.bind(this);
    }

  handlePage(i){
    console.log("clicked",i);
    this.props.pagination(i);
   }
  clickHandler(reviewText,reviewId){
    this.setState({clicked:true,reviewText:reviewText, reviewId:reviewId});
  }
  closeReview(){
  this.setState({clicked:false, reviewText:'', reviewId:''});
  }

render(){
  let Items;
  let reviewText;
  if(this.state.clicked){
    reviewText=(
                  <div onClick={this.closeReview} className="review-modal">
                    <div className="review-text-container">
                      <button onClick={this.closeReview} type="button" className="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <h5 className="review-id">ReviewID: {this.state.reviewId}</h5>
                      <p className="review-text">{this.state.reviewText}</p>
                    </div>
                  </div>
                );
  }
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
        {reviewText}
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
