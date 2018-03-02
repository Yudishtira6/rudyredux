import React, { Component } from "react";
import ReactDOM from "react-dom";
import Pagination from "react-js-pagination";
import $ from 'jquery';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1
    };
  this.handlePageChange=this.handlePageChange.bind(this);
  }

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.props.paginate(pageNumber-1);
    this.setState({activePage: pageNumber});
  }

  render() {
    return (
        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={100}
          totalItemsCount={this.props.totalResults}
          pageRangeDisplayed={5}
          prevPageText={"Prev"}
          firstPageText={"First"}
          lastPageText={"Last"}
          nextPageText={"Next"}
          onChange={this.handlePageChange}
        />
    );
  }
}
