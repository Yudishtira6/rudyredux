//client/components/App.js
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Add from './Add'
export default class App extends React.Component {
constructor() {
    super();
  this.state = {data: []};
    this.getData = this.getData.bind(this);
  }
componentDidMount() {
    this.getData(this);
  }
  componentWillReceiveProps(nextProps) {
    this.getData(this);
  }
getData(ev){
    axios.get('/getAll')
      .then(function(response) {
        ev.setState({data: response.data});
      });
  }
render() {
    return (
      <div>
        <Add />
        <table>
          <thead>
            <tr><th></th><th className='desc-col'>ClientName</th><th className='button-col'>Product Id</th></tr>
          </thead>
          <tbody>
            {
              this.state.data.map(function(exp){
                return  <tr><td className='counterCell'></td><td className='desc-col'>{exp.clientName}</td><td className='button-col'>{exp.productId}</td></tr>
              })
            }
            </tbody>
</table>
      </div>
    );
  }
}