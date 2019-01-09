import React, { Component } from 'react';
import Axios from 'axios';

export default class AddTreasure extends Component {
  constructor() {
    super();
    this.state = {
      treasureURL: '',
    };
  }

  handleInput(e) {
    this.setState({ treasureURL: e.target.value });
  }

  addTreasure() {
    Axios.post('/api/treasure/user', {treasureURL: this.state.treasureURL})
      .then(res => {
        this.props.addMyTreasure(res.data)
        this.setState({
          treasureURL: ''
        })
      })
      .catch(err => {
        alert(err.resopnse.request.resopnse)
      })
  }

  render() {
    return (
      <div className="addTreasure">
        <input
          type="text"
          placeholder="Add image URL"
          onChange={e => this.handleInput(e)}
          value={this.state.treasureURL}
        />
        <button onClick={() => this.addTreasure()}>Add</button>
      </div>
    );
  }
}
