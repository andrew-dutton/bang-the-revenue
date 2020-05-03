import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import DataIn from '../DataIn'

class RecurringRevenueBox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      thisMonth: DataIn.RecurringRevenue.thisMonth,
      lastMonth: DataIn.RecurringRevenue.lastMonth,
      diff: DataIn.RecurringRevenue.diff,
      monthName: "",
      months: [],
      forexData: props.forexData
    };
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

    this.setState((prevState) => ({ monthName: fullDate }), this.revenueTotals)
  }

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  revenueTotals() {
    const ausTotal = []
    const canTotal = []
    const usaTotal = []
    const ukTotal = []
    const nzTotal = []

    this.state.months.forEach((thisMonthEnd) => {
      let ausCounter = []
      let canCounter = []
      let usaCounter = []
      let ukCounter = []
      let nzCounter = []

      this.props.rawData.forEach((invoice) => {
        if (invoice["start"] !== "") {
          let startString = invoice["start"]
          let startDateParts = startString.split("/")
          let startContract = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])

          let endString = invoice["end"]
          let endDateParts = endString.split("/")
          let endContract = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

          let actualStartMonth = startContract.getMonth()
          let actualStartYear = startContract.getFullYear()

          let actualEndMonth = endContract.getMonth()
          let actualEndYear = endContract.getFullYear()


          let thisMonth = thisMonthEnd.getMonth()
          let thisYear = thisMonthEnd.getFullYear()

          let thisMonthBegin = new Date(thisYear, thisMonth, 1)


          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "AUS")) {
            if (invoice["spreadmonths"] > invoice["months"]) {
              // INVOICE DATES ARE NOT FIRST AND/OR LAST DAYS OF MONTH SO NEED PARTIAL CALCULATIONS
              if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
                // CONTRACT START DATE IS THIS MONTH, THEREFORE DIVIDE MONTH AMOUNT BY 30 AND TIMES BY REMAINING DAYS IN MONTH/*
                // EG INVOICE WITH $1000 MRR AND START DATE OF 24TH OF MONTH = ($1000 / 30) X (30-24) 

                ausCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
              } else if (actualEndMonth === thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
                ausCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
              } else {
                ausCounter.push(invoice["valuepermonth"])
              }
            } else {
              ausCounter.push(invoice["valuepermonth"])
            }
          }

          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "CAN")) {
            if (invoice["spreadmonths"] > invoice["months"]) {
              if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
                canCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
              } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
                canCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
              } else {
                canCounter.push(invoice["valuepermonth"])
              }
            } else {
              canCounter.push(invoice["valuepermonth"])
            }
          }

          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "USA")) {
            if (invoice["spreadmonths"] > invoice["months"]) {
              if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
                usaCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
              } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
                usaCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
              } else {
                usaCounter.push(invoice["valuepermonth"])
              }
            } else {
              usaCounter.push(invoice["valuepermonth"])
            }
          }

          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "UK")) {
            if (invoice["spreadmonths"] > invoice["months"]) {
              if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
                ukCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
              } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
                ukCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
              } else {
                ukCounter.push(invoice["valuepermonth"])
              }
            } else {
              ukCounter.push(invoice["valuepermonth"])
            }
          }

          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "NZ")) {
            if (invoice["spreadmonths"] > invoice["months"]) {
              if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
                nzCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
              } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
                nzCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
              } else {
                nzCounter.push(invoice["valuepermonth"])
              }
            } else {
              nzCounter.push(invoice["valuepermonth"])
            }
          }
        }
      })

      ausTotal.push(Math.round(ausCounter.reduce((a, b) => a + b, 0)))
      canTotal.push(Math.round(canCounter.reduce((a, b) => a + b, 0)))
      usaTotal.push(Math.round(usaCounter.reduce((a, b) => a + b, 0)))
      ukTotal.push(Math.round(ukCounter.reduce((a, b) => a + b, 0)))
      nzTotal.push(Math.round(nzCounter.reduce((a, b) => a + b, 0)))
    })

    this.setState(prevState => ({
      ausData: [...ausTotal]
    }))

    this.setState(prevState => ({
      canData: [...canTotal]
    }))

    this.setState(prevState => ({
      usaData: [...usaTotal]
    }))

    this.setState(prevState => ({
      ukData: [...ukTotal]
    }))

    this.setState(prevState => ({
      nzData: [...nzTotal]
    }))


    const totalDataRR = []
    let canRates = []
    let usaRates = []
    let ukRates = []
    let nzRates = []

    Object.keys(this.state.forexData).forEach(key => {
      canRates.push(this.state.forexData[key]["AUD/CAD"])
    })

    Object.keys(this.state.forexData).forEach(key => {
      usaRates.push(this.state.forexData[key]["AUD/USD"])
    })

    Object.keys(this.state.forexData).forEach(key => {
      ukRates.push(this.state.forexData[key]["AUD/GBP"])
    })

    Object.keys(this.state.forexData).forEach(key => {
      nzRates.push(this.state.forexData[key]["AUD/NZD"])
    })

    for (let i = 0; i < ausTotal.length; i++) {
      totalDataRR.push(Math.round(
        ausTotal[i] +
        (canTotal[i] * canRates[i]) +
        (usaTotal[i] * usaRates[i]) +
        (ukTotal[i] * ukRates[i]) +
        (nzTotal[i] * nzRates[i])
      ))
    }

    if(totalDataRR[DataIn.MonthNumber-2] > totalDataRR[DataIn.MonthNumber-3]) {
      this.setState({arrow: "triangle up", arrowColor: "green"})
    } else if(totalDataRR[DataIn.MonthNumber-2] < totalDataRR[DataIn.MonthNumber-3]) {
      this.setState({arrow: "triangle down", arrowColor: "red"})
    } else {
      this.setState({arrow: "", arrowColor: ""})
    }

    let thisMonth = this.numberWithCommas(totalDataRR[DataIn.MonthNumber - 2])
    let diff = this.numberWithCommas(totalDataRR[DataIn.MonthNumber - 2] - totalDataRR[DataIn.MonthNumber - 3])
     
    this.setState({thisMonth, diff})
  }

  boxSelected = () => {
      return (
        <div style={{ height: 150 }}>
          <h1 style={{ position: 'absolute', left: '50%', top: '75%', transform: 'translate(-50%, -50%)', fontFamily: 'Titillium Web' }}>A ${this.state.thisMonth}</h1>
          <h3 style={{ fontFamily: 'Titillium Web' }}>{this.state.monthName}</h3>
          <h4 style={{ fontFamily: 'Titillium Web' }}><Icon name={this.state.arrow} color={this.state.arrowColor} />A ${this.state.diff}</h4>
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

export default RecurringRevenueBox