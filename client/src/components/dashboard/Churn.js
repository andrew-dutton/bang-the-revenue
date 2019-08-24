import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

class Churn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      aus: [],
      first: [],
      second: []
    }

  }

  getFirst = () => {

  }

  getLast = () => {

  }

  render() {
    return (
      <div>
        <h1>Churn</h1>
        <p>{this.state.aus}</p>
      </div>
    )
  }
}

export default Churn
