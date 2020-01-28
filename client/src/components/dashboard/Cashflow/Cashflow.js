import React, { Component } from 'react'
import CashflowChart from './CashflowChart'

class Cashflow extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
      this.loadData()
  }

  // need to convert to aud
  

  loadData = props => {
    const data = this.props.rawCashflow
    let anzi = []
    let cani = []
    let usai = []
    let uki = []
    data.forEach((item) => {
        anzi.push(item.ANZI)
        cani.push(item.CANI)
        usai.push(item.USAI)
        uki.push(item.UKI)
    })

    this.setState({ anzi, cani, usai, uki })

  }

  render(props) {

    if (this.props.toRender === "QR") {
      return null
    } else {
      return (
        <div style={{ paddingTop: 24, paddingBotton: 24 }}>
          <h1>Cashflow</h1>
          <CashflowChart
            anzi={this.state.anzi}
            cani={this.state.cani}
            usai={this.state.usai}
            uki={this.state.uki}
          />
        </div>
      )
    }
  }
}

export default Cashflow