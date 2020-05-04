import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import DataIn from '../DataIn'

class ActiveLicencesBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      thisMonth: 0,
      lastMonth: 0,
      monthName: "",
      months: [],
      total: []
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

    this.setState((prevState) => ({ monthName: fullDate }), this.totalClients)
  }

  totalClients() {
    const total = []
    const uniqClients = []

    this.state.months.forEach((month) => {
      const counter = []
      this.props.rawData.forEach((invoice) => {

        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month) {
          counter.push(invoice["client"])
        }
      })

      const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
      }

      let uniqClients = counter.filter(onlyUnique)

      total.push(uniqClients.length)
    })

    if(total[DataIn.MonthNumber-2] > total[DataIn.MonthNumber-3]) {
      this.setState({arrow: "triangle up", arrowColor: "green"})
    } else if(total[DataIn.MonthNumber-2] < total[DataIn.MonthNumber-3]) {
      this.setState({arrow: "triangle down", arrowColor: "red"})
    } else {
      this.setState({arrow: "", arrowColor: ""})
    }

    this.setState({thisMonth: total[DataIn.MonthNumber - 2], diff:total[DataIn.MonthNumber-2] - total[DataIn.MonthNumber - 3] })
    return null
  }

  getTotalForCurrentMonth = () => {
    console.log(this.state)
  }

  boxSelected = () => {
    return (
      <div style={{ height: 150 }}>
        <h1 style={{ position: 'absolute', left: '50%', top: '75%', transform: 'translate(-50%, -50%)', fontFamily: 'Titillium Web' }}>{this.state.thisMonth}</h1>
        <h3 style={{ fontFamily: 'Titillium Web' }}>{this.state.monthName}</h3>
        <h4><Icon name={this.state.arrow} color={this.state.arrowColor} />{this.state.diff}</h4>
      </div>
    )
  }


  render() {
    return (
      <div>
        {this.boxSelected()}
      </div >
    )
  }
}

export default ActiveLicencesBox