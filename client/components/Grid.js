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
                  reviewId:'',
                  user:'',
                  locale:'',
                  source:'',
                  rating:'',
                  title:'',
                  }
    this.handlePage=this.handlePage.bind(this);
    this.clickHandler=this.clickHandler.bind(this);
    this.closeReview=this.closeReview.bind(this);
    }

  handlePage(i){
    this.props.pagination(i, this.props.title);
   }
  clickHandler(reviewText,reviewId, user, locale, source, rating, title, color){
    this.setState({clicked:true,reviewText:reviewText, reviewId:reviewId, user:user, locale:locale, source:source, rating:rating, title:title});
  }
  closeReview(){
  this.setState({clicked:false, reviewText:'', reviewId:'',user:'',locale:'',source:'',rating:'',title:''});
  }

render(){
  let rating;
  let color;
  switch(this.state.rating){
    case 1:
    rating=<img src="../components/photos/rating-1_0.gif"/>
    break;
    case 2:
    rating=<img src="../components/photos/rating-2_0.gif"/>
    break;
    case 3:
    rating=<img src="../components/photos/rating-3_0.gif"/>
    break;
    case 4:
    rating=<img src="../components/photos/rating-4_0.gif"/>
    break;
    case 5:
    rating=<img src="../components/photos/rating-5_0.gif"/>
    break;
  }
  let Items;
  let reviewText;
  if(this.state.clicked){
    reviewText=(
                  <div onClick={this.closeReview} className="review-modal">
                    <div className="review-text-container">
                      <button onClick={this.closeReview} type="button" className="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <h5 className="review-id-container">ReviewID<span className="review-id">{this.state.reviewId}</span></h5>
                      <ul className="review-details">
                        <li>user:{this.state.user}</li>
                        <li>Locale:{this.state.locale}</li>
                        <li>Source:{this.state.source}</li>
                      </ul>
                      {rating}
                      <h5 className="review-title">{this.state.title}</h5>
                      <p className="review-text">{this.state.reviewText}</p>
                    </div>
                  </div>
                );
  }

  if(this.props.data.length>=1){

  //create the pages



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
         <Pages paginate={this.handlePage} page={this.props.page} totalResults={this.props.results}/>
        </div>
        );
  }
}

export default Grid;
