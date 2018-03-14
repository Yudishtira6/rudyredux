import React, { Component } from "react";
import ReactDOM from "react-dom";
import Pagination from "react-js-pagination";
import $ from 'jquery';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage:this.props.page
    };
  this.handlePageChange=this.handlePageChange.bind(this);
  }

  handlePageChange(pageNumber) {
    this.props.paginate(pageNumber-1);
    this.setState({activePage: this.props.page});
  }

  render() {
    return (
        <Pagination
          activePage={this.props.page}
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
