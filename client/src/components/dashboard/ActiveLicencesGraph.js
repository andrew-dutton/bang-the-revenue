import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import { Button } from 'semantic-ui-react'

class ActiveLicencesGraph extends Component {
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

    this.totalClients = this.totalClients.bind(this)
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

  totalClients() {
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

      let ausType = []
      let canType = []
      let usaType = []
      let ukType = []
      let nzType = []

      this.props.rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month && (invoice["territory"] === "AUS")) {
          ausCounter.push(invoice["client"])
          ausType.push(invoice["product"])
        }

        if (start <= month && end >= month && (invoice["territory"] === "CAN")) {
          canCounter.push(invoice["client"])
          canType.push(invoice["product"])
        }

        if (start <= month && end >= month && (invoice["territory"] === "USA")) {
          usaCounter.push(invoice["client"])
          usaType.push(invoice["product"])
        }

        if (start <= month && end >= month && (invoice["territory"] === "UK")) {
          ukCounter.push(invoice["client"])
          ukType.push(invoice["product"])
        }

        if (start <= month && end >= month && (invoice["territory"] === "NZ")) {
          nzCounter.push(invoice["client"])
          nzType.push(invoice["product"])
        }
      })

      const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
      }

      let uniqAusClients = ausCounter.filter(onlyUnique)
      let uniqCanClients = canCounter.filter(onlyUnique)
      let uniqUsaClients = usaCounter.filter(onlyUnique)
      let uniqUkClients = ukCounter.filter(onlyUnique)
      let uniqNzClients = nzCounter.filter(onlyUnique)

      ausTotal.push(uniqAusClients.length)
      canTotal.push(uniqCanClients.length)
      usaTotal.push(uniqUsaClients.length)
      ukTotal.push(uniqUkClients.length)
      nzTotal.push(uniqNzClients.length)
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
    const data = {
      labels: [
        'Jul-15', 'Aug-15', 'Sep-15', 'Oct-15', 'Nov-15', 'Dec-15', 'Jan-16', 'Feb-16', 'Mar-16', 'Apr-16', 'May-16', 'Jun-16',
        'Jul-16', 'Aug-16', 'Sep-16', 'Oct-16', 'Nov-16', 'Dec-16', 'Jan-17', 'Feb-17', 'Mar-17', 'Apr-17', 'May-17', 'Jun-17',
        'Jul-17', 'Aug-17', 'Sep-17', 'Oct-17', 'Nov-17', 'Dec-17', 'Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18', 'Jun-18',
        'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18', 'Dec-18', 'Jan-19', 'Feb-19', 'Mar-19', 'Apr-19', 'May-19', 'Jun-19',
        'Jul-19'
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
          pointRadius: 1,
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
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.canData,
          trendlineLinear: {
            style: "rgba(255,105,180, .8)",
            lineStyle: "dotted|solid",
            width: 2
          }
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
          pointRadius: 1,
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
          pointRadius: 1,
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
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.nzData
        }
      ]
    }

    return (
      <div>
        <div>
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
        </div>
        <div>
          <Button primary onClick={this.totalClients}>
            Active licences
          </Button>
        </div>
      </div>
    )
  }
}

export default ActiveLicencesGraph
