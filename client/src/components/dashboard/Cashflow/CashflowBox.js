import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import DataIn from '../DataIn'

class CashflowBox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      thisFY: DataIn.CashflowReporting.thisFY,
      lastFY: DataIn.CashflowReporting.lastFY,
      diff: DataIn.CashflowReporting.diff,
      
      monthName: "",
      months: []
    }
  }

  componentDidMount() {
    this.createMonthsArray()
  }

  getNumberOfMonthsSinceJuly2015 = () => {
    return DataIn.MonthNumber
  }


  createMonthsArray = () => {
    const numberOfMonths = this.getNumberOfMonthsSinceJuly2015()

    let year = 2015
    let yearStep = 12

    for (let step = 0; step < numberOfMonths; step++) {
      let month = 7
      month += step

      if ((month % 12) === 0) {
        month = 12
      } else {
        month = month % 12
      }

      if (step >= 6) {
        yearStep++
        year = Math.floor(yearStep / 12) + 2015
        if (yearStep % 12 === 0) {
          year -= 1
        }
      }

      this.state.months.push(new Date(year, month, 0))
    }

    let monthsOfYear = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ]

    let month = this.state.months[this.state.months.length - 2]
    let theYear = month.getFullYear()

    month = monthsOfYear[month.getMonth()]

    let fullDate = month + " " + theYear

    this.setState((prevState) => ({ monthName: fullDate }))
  }

  boxSelected = () => {
    if (this.props.selected === "CashflowBox") {
      return (
        <div style={{ height: 150 }}>
          <h1 style={{ position: 'absolute', left: '50%', top: '75%', transform: 'translate(-50%, -50%)', fontFamily: 'Titillium Web' }}>{this.state.invoiced}</h1>
          <h3 style={{ fontFamily: 'Titillium Web' }}>{this.state.monthName}</h3>
        </div>
      )
    } else {
      return (
        <div style={{ height: 150 }}>
          <h2 style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%, -50%)', fontFamily: 'Titillium Web' }}>A {this.state.thisFY}</h2>
      <h3 style={{ fontFamily: 'Titillium Web' }}>Invoiced to {this.state.monthName}</h3>
          <h4 style={{ position: 'absolute', left: '50%', top: '70%', transform: 'translate(-50%, -50%)', fontFamily: 'Titillium Web' }}><Icon name="triangle up" color="green" />A {this.state.diff}</h4>
          <p style={{ fontSize: "10px", position: 'absolute', left: '50%', top: '90%', transform: 'translate(-50%, -50%)', fontFamily: 'Titillium Web' }}>on same time at previous financial year</p>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        {this.boxSelected()}
      </div >
    )
  }
}

export default CashflowBox