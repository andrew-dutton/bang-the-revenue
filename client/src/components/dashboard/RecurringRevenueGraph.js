import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import { Segment, Grid, Form, Radio } from 'semantic-ui-react'

class RecurringRevenueChart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ausData: [],
      canData: [],
      usaData: [],
      ukData: [],
      nzData: [],
      months: []
    }

    this.revenueTotals = this.revenueTotals.bind(this)
    this.revenueTotalsAUD = this.revenueTotalsAUD.bind(this)
    this.revenueTotalsNON = this.revenueTotalsNON.bind(this)
  }

  handleChange = (e, { value }) => this.setState({ value })

  getNumberOfMonthsSinceJuly2015 = () => {
    let today = new Date()
    let thisMonth = today.getMonth()
    let thisYear = today.getFullYear()
    let monthsOfYears = (thisYear - (2015 + 1)) * 12
    return monthsOfYears + thisMonth + 7

  }

  createMonthsArray = () => {
    const numberOfMonths = this.getNumberOfMonthsSinceJuly2015()

    this.setState(prevState => ({
      months: []
    }))

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
  }

  revenueTotals() {
    this.createMonthsArray()

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

        if (startContract <= thisMonthEnd && endContract >= thisMonthEnd && (invoice["territory"] === "AUS")) {
          if (invoice["spreadmonths"] > invoice["months"]) {
            if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
              ausCounter.push((invoice["valuepermonth"] / 30) * (30 - (startContract.getDay())))
            } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
              ausCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDay()))
            } else {
              ausCounter.push(invoice["valuepermonth"])
            }
          } else {
            ausCounter.push(invoice["valuepermonth"])
          }
        }

        if (startContract <= thisMonthEnd && endContract >= thisMonthEnd && (invoice["territory"] === "CAN")) {
          if (invoice["spreadmonths"] > invoice["months"]) {
            if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
              canCounter.push((invoice["valuepermonth"] / 30) * (30 - (startContract.getDay())))
            } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
              canCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDay()))
            } else {
              canCounter.push(invoice["valuepermonth"])
            }
          } else {
            canCounter.push(invoice["valuepermonth"])
          }
        }

        if (startContract <= thisMonthEnd && endContract >= thisMonthEnd && (invoice["territory"] === "USA")) {
          if (invoice["spreadmonths"] > invoice["months"]) {
            if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
              usaCounter.push((invoice["valuepermonth"] / 30) * (30 - (startContract.getDay())))
            } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
              usaCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDay()))
            } else {
              usaCounter.push(invoice["valuepermonth"])
            }
          } else {
            usaCounter.push(invoice["valuepermonth"])
          }
        }

        if (startContract <= thisMonthEnd && endContract >= thisMonthEnd && (invoice["territory"] === "UK")) {
          if (invoice["spreadmonths"] > invoice["months"]) {
            if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
              ukCounter.push((invoice["valuepermonth"] / 30) * (30 - (startContract.getDay())))
            } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
              ukCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDay()))
            } else {
              ukCounter.push(invoice["valuepermonth"])
            }
          } else {
            ukCounter.push(invoice["valuepermonth"])
          }
        }

        if (startContract <= thisMonthEnd && endContract >= thisMonthEnd && (invoice["territory"] === "NZ")) {
          if (invoice["spreadmonths"] > invoice["months"]) {
            if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
              nzCounter.push((invoice["valuepermonth"] / 30) * (30 - (startContract.getDay())))
            } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
              nzCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDay()))
            } else {
              nzCounter.push(invoice["valuepermonth"])
            }
          } else {
            nzCounter.push(invoice["valuepermonth"])
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

    return null
  }

  revenueTotalsNON() {
    this.createMonthsArray()

    const ausTotal = []
    const canTotal = []
    const usaTotal = []
    const ukTotal = []
    const nzTotal = []

    this.state.months.forEach((month) => {
      let ausCounter = []
      let canCounter = []
      let usaCounter = []
      let ukCounter = []
      let nzCounter = []

      this.props.rawData.forEach((invoice) => {
        let invDateString = invoice["date"]
        let invDateParts = invDateString.split("/")
        let invDate = new Date(invDateParts[2], invDateParts[1] - 1, +invDateParts[0])
        let monthStart = new Date(month.getFullYear(), month.getMonth(), 1)

        if (invoice["start"] === "" && (invDate >= monthStart && invDate <= month) && invoice["territory"] === "AUS") {
          ausCounter.push(invoice["total"])
        }

        if (invoice["start"] === "" && (invDate >= monthStart && invDate <= month) && invoice["territory"] === "CAN") {
          canCounter.push(invoice["total"])
        }

        if (invoice["start"] === "" && (invDate >= monthStart && invDate <= month) && invoice["territory"] === "USA") {
          usaCounter.push(invoice["total"])
        }

        if (invoice["start"] === "" && (invDate >= monthStart && invDate <= month) && invoice["territory"] === "UK") {
          ukCounter.push(invoice["total"])
        }

        if (invoice["start"] === "" && (invDate >= monthStart && invDate <= month) && invoice["territory"] === "NZ") {
          nzCounter.push(invoice["total"])
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

    return null
  }

  revenueTotalsAUD() {
    this.createMonthsArray()

    const ausTotal = []
    const canTotal = []
    const usaTotal = []
    const ukTotal = []
    const nzTotal = []

    this.state.months.forEach((month) => {
      let ausCounter = []
      let canCounter = []
      let usaCounter = []
      let ukCounter = []
      let nzCounter = []

      this.props.rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month && (invoice["territory"] === "AUS")) {
          ausCounter.push(invoice["valuepermonth"])
        }

        if (start <= month && end >= month && (invoice["territory"] === "CAN")) {
          canCounter.push(invoice["valuepermonth"])
        }

        if (start <= month && end >= month && (invoice["territory"] === "USA")) {
          usaCounter.push(invoice["valuepermonth"])
        }

        if (start <= month && end >= month && (invoice["territory"] === "UK")) {
          ukCounter.push(invoice["valuepermonth"])
        }

        if (start <= month && end >= month && (invoice["territory"] === "NZ")) {
          nzCounter.push(invoice["valuepermonth"])
        }
      })

      ausTotal.push(Math.round(ausCounter.reduce((a, b) => a + b, 0)))
      canTotal.push(Math.round(canCounter.reduce((a, b) => a + b, 0) / .9))
      usaTotal.push(Math.round(usaCounter.reduce((a, b) => a + b, 0) / .6))
      ukTotal.push(Math.round(ukCounter.reduce((a, b) => a + b, 0) / .45))
      nzTotal.push(Math.round(nzCounter.reduce((a, b) => a + b, 0) / 1.05))
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

    return null
  }

  render() {
    const headingStyle = {
      textAlign: 'center'
    }

    const radioStyle = {
      textAlign: 'left'
    }

    const data = {
      labels: [
        'Jul-15', 'Aug-15', 'Sep-15', 'Oct-15', 'Nov-15', 'Dec-15', 'Jan-16', 'Feb-16', 'Mar-16', 'Apr-16', 'May-16', 'Jun-16',
        'Jul-16', 'Aug-16', 'Sep-16', 'Oct-16', 'Nov-16', 'Dec-16', 'Jan-17', 'Feb-17', 'Mar-17', 'Apr-17', 'May-17', 'Jun-17',
        'Jul-17', 'Aug-17', 'Sep-17', 'Oct-17', 'Nov-17', 'Dec-17', 'Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18', 'Jun-18',
        'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18', 'Dec-18', 'Jan-19', 'Feb-19', 'Mar-19', 'Apr-19', 'May-19', 'Jun-19',
        'Jul-19', 'Aug-19', 'Sept-19'
      ],
      datasets: [
        {
          label: 'Australia',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,1,0.4)',
          borderColor: 'rgba(75,192,1,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: this.state.ausData
        },
        {
          label: 'Canada',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(222,213,42,0.4)',
          borderColor: 'rgba(222,213,42,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: this.state.canData
        },
        {
          label: 'USA',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(234,77,49,0.4)',
          borderColor: 'rgba(234,77,49,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: this.state.usaData
        },
        {
          label: 'UK',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(49,234,212,0.4)',
          borderColor: 'rgba(49,234,212,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: this.state.ukData
        },
        {
          label: 'New Zealand',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(234,49,223,0.4)',
          borderColor: 'rgba(234,49,223,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: this.state.nzData
        }
      ]
    }

    return (
      <div style={{ paddingTop: 20 }}>
        <Grid columns='equal' style={{ width: 1300 }}>
          <Grid.Column>
            <Segment style={{ width: 1079 }} >


              <Form style={radioStyle}>
                {/* <Form.Field>
              Currency: <b>{this.state.value}</b>
            </Form.Field> */}
                <Form.Field >
                  <Radio
                    style={{ "paddingRight": "20px" }}
                    label='Recurring Revenue in Local Currency'
                    name='radioGroup'
                    value='Local'
                    checked={this.state.value === 'Local'}
                    onChange={this.revenueTotals}
                    onClick={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label='Recurring Revenue in AUD'
                    name='radioGroup'
                    value='AUD'
                    checked={this.state.value === 'AUD'}
                    onChange={this.revenueTotalsAUD}
                    onClick={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label='Non Recurring Revenue in Local Currency'
                    name='radioGroup'
                    value='NON'
                    checked={this.state.value === 'NON'}
                    onChange={this.revenueTotalsNON}
                    onClick={this.handleChange}
                  />
                </Form.Field>
              </Form>
            </Segment>
            <Segment style={{ width: 1079 }} >
              <Line
                data={data}
                options={{
                  scales: {
                    yAxes: [{
                      ticks: {
                        min: 0
                      }
                    }]
                  }
                }} />
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default RecurringRevenueChart