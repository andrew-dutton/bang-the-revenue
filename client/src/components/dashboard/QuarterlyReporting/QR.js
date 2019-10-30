import React, { Component } from 'react'

class QR extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: props.rawData,
      forex: props.forex,
      months: []
    }
  }

  componentDidMount() {
    this.createMonthsArray()
  }

  getNumberOfMonthsSinceJuly2015 = () => {
    let today = new Date()
    let thisMonth = today.getMonth()
    let thisYear = today.getFullYear()
    let monthsOfYears = (thisYear - (2015 + 1)) * 12
    return monthsOfYears + thisMonth + 7
  }

  createMonthsArray = () => {
    const numberOfMonths = this.getNumberOfMonthsSinceJuly2015()

    let year = 2015
    let yearStep = 12
    let monthsHolder = []

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

      monthsHolder.push(new Date(year, month, 0))
      this.setState(prevState => ({ months: monthsHolder }), this.setStartingMonth)
    }
  }

  setStartingMonth = () => {
    let monthsOfYear = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ]

    let startingMonthNumber = this.state.months.length - 2

    let month = monthsOfYear[this.state.months[this.state.months.length - 2].getMonth()]
    let year = this.state.months[this.state.months.length - 2].getFullYear()

    let prevMonth = monthsOfYear[this.state.months[this.state.months.length - 3].getMonth()]
    let prevYear = this.state.months[this.state.months.length - 3].getFullYear()

    let theDate = month + " " + year
    let thePrevDate = prevMonth + " " + prevYear

    this.setState((prevState) => ({ currentMonth: theDate, currentPrevMonth: thePrevDate, selectedMonth: startingMonthNumber }), this.setCurrentQaurter)
  }

  setCurrentQaurter = () => {
    let quarters = {
      Q1: ["July", "August", "September"],
      Q2: ["October", "November", "December"],
      Q3: ["January", "Febraury", "March"],
      Q4: ["April", "May", "June"]
    }

    let currentMonth = this.state.currentMonth.slice(0, this.state.currentMonth.indexOf(" "))
    let currentYear = this.state.currentMonth.slice(this.state.currentMonth.indexOf(" "))
    let currentQuarter = ""
    let currentFinYear = ""

    Object.keys(quarters).forEach((key) => {
      if (quarters[key].includes(currentMonth)) {
        currentQuarter = key
      }
    })

    if (currentQuarter === "Q1" || currentQuarter === "Q2") {
      let nextYear = parseInt(currentYear) + 1
      currentFinYear = currentYear + "/" + nextYear
    } else {
      let lastYear = parseInt(currentYear) - 1
      currentFinYear = lastYear + "/" + currentYear
    }

    this.setState(prevState => ({ currentQuarter, currentFinYear }))
  }

  render() {
    if (this.state.months.length > 1) {
      return (
        <div>
          <h1 style={{ textAlign: 'center', fontFamily: "Titillium Web", paddingTop: 20 }}>{this.state.currentQuarter} {this.state.currentFinYear}</h1>
        </div>
      )
    }

    return null

  }
}

export default QR
