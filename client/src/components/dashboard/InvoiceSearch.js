import React, { Component } from 'react'

class InvoiceSearch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      testData: 'testing ok',
      data: this.props.rawData,
      searchValue: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ searchValue: event.target.value })
  }

  handleSubmit(event) {
    alert('Client being searched for is: ' + this.state.searchValue)
    event.preventDefault()
  }

  render() {
    return (
      <div>
        <h1>Invoice Search</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Client:
          <input type="text" value={this.state.seachValue} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default InvoiceSearch