import React, { Component } from "react"
import { connect } from 'react-redux'
import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk"
import { Line } from 'react-chartjs-2'
import { Checkbox } from 'semantic-ui-react'

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rawData: [],
      name: "",
      authorised: [
        'andrew@dutton.pro',
        'andrew@bangthetable.com',
        'johannes.kresling@bangthetable.com',
        'matt@bangthetable.com',
        'crispin@bangthetable.com',
        'anna@bangthetable.com'
      ],
      ausData: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ],
      ausDataOn: false,
      canData: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ],
      canDataOn: false,
      usaData: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ],
      usaDataOn: false,
      ukData: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ],
      ukDataOn: false,
      nzData: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ],
      nzDataOn: false
    }

    this.totalClients = this.totalClients.bind(this)
  }


  componentDidMount() {
    this.client = Stitch.initializeDefaultAppClient("bang-qfbza")

    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );

    this.db = mongodb.db("btt-data")
    this.loginToMongo()
  }

  loginToMongo = () => {
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(this.getMongoData)
      .catch(console.error)
  }

  getMongoData = () => {
    this.db
      .collection("invoice-lines")
      .find({})
      .asArray()
      .then(rawData => {
        this.setState({ rawData })
      });
  }

  numberOfInvoices = () => {
    const totalInvoices = []

    this.state.rawData.forEach((invoice) => {
      totalInvoices.push(invoice["invoice"])
    })

    const onlyUnique = (value, index, self) => {
      return self.indexOf(value) === index;
    }

    let uniqInvoices = totalInvoices.filter(onlyUnique)

    if (totalInvoices.length === 0) return <div></div>

    return (
      <div className="ui statistic">
        <div className="value" style={{ color: "black" }}>
          {uniqInvoices.length}
        </div>
        <div className="label">
          Total Number of Invoices
        </div>
      </div>
    )
  }

  totalValue = () => {
    if (this.state.rawData.length > 0) {
      const totals = []
      const sum = (a, b) => a + b;
      function currencyFormat(num) {
        return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }

      this.state.rawData.forEach((number) => {
        totals.push(number["total"])
      })

      const total = totals.reduce(sum)
      return (
        <div className="ui statistic">
          <div className="value" style={{ color: "blue" }}>
            {currencyFormat(total)}
          </div>
          <div className="label">
            Total value of all invoices
          </div>
        </div>
      )
    }
  }

  stateBreakdown = () => {
    const vic = []

    this.state.rawData.forEach((invoice) => {
      if (invoice.State === "VIC")
        vic.push(invoice["total"])
    })

    const sum = (a, b) => a + b;

    if (vic.length < 1) {
      return
    }
    const total = vic.reduce(sum)
    function currencyFormat(num) {
      return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
      <div className="ui statistic">
        <div className="value" style={{ color: "orange" }}>
          {currencyFormat(total)}
        </div>
        <div className="label">
          Total value of invoices from Victoria
        </div>
      </div>
    )
  }

  reveneuBreakdown = () => {
    const sub = []

    this.state.rawData.forEach((invoice) => {
      if (invoice["desc"] === "EHQ Licence")
        sub.push(invoice["total"])
    })

    const sum = (a, b) => a + b;

    if (sub.length < 1) {
      return
    }
    const total = sub.reduce(sum)
    function currencyFormat(num) {
      return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
      <div className="ui statistic">
        <div className="value" style={{ color: "green" }}>
          {currencyFormat(total)}
        </div>
        <div className="label">
          Total value of invoices with type of Subscription
        </div>
      </div>
    )
  }

  totalClients() {
    const months = [

      new Date('2015-07-30'),
      new Date('2015-08-30'),
      new Date('2015-09-29'),
      new Date('2015-10-30'),
      new Date('2015-11-29'),
      new Date('2015-12-30'),
      new Date('2016-01-30'),
      new Date('2016-02-27'),
      new Date('2016-03-30'),
      new Date('2016-04-29'),
      new Date('2016-05-30'),
      new Date('2016-06-29'),

      new Date('2016-07-30'),
      new Date('2016-08-30'),
      new Date('2016-09-29'),
      new Date('2016-10-30'),
      new Date('2016-11-29'),
      new Date('2016-12-30'),
      new Date('2017-01-30'),
      new Date('2017-02-27'),
      new Date('2017-03-30'),
      new Date('2017-04-29'),
      new Date('2017-05-30'),
      new Date('2017-06-29'),

      new Date('2017-07-31'),
      new Date('2017-08-30'),
      new Date('2017-09-29'),
      new Date('2017-10-30'),
      new Date('2017-11-29'),
      new Date('2017-12-30'),
      new Date('2018-01-30'),
      new Date('2018-02-27'),
      new Date('2018-03-30'),
      new Date('2018-04-29'),
      new Date('2018-05-30'),
      new Date('2018-06-29'),

      new Date('2018-07-30'),
      new Date('2018-08-30'),
      new Date('2018-09-29'),
      new Date('2018-10-30'),
      new Date('2018-11-29'),
      new Date('2018-12-30'),
      new Date('2019-01-30'),
      new Date('2019-02-27'),
      new Date('2019-03-30'),
      new Date('2019-04-29'),
      new Date('2019-05-30'),
      new Date('2019-06-29')
    ]

    const ausTotal = []
    const canTotal = []
    const usaTotal = []
    const ukTotal = []
    const nzTotal = []

    months.forEach((month) => {
      let ausCounter = []
      let canCounter = []
      let usaCounter = []
      let ukCounter = []
      let nzCounter = []

      this.state.rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month && (invoice["territory"] === "AUS")) {
          ausCounter.push(invoice["client"])
        }

        if (start <= month && end >= month && (invoice["territory"] === "CAN")) {
          canCounter.push(invoice["client"])
        }

        if (start <= month && end >= month && (invoice["territory"] === "USA")) {
          usaCounter.push(invoice["client"])
        }

        if (start <= month && end >= month && (invoice["territory"] === "UK")) {
          ukCounter.push(invoice["client"])
        }

        if (start <= month && end >= month && (invoice["territory"] === "NZ")) {
          nzCounter.push(invoice["client"])
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

    if (this.state.ausDataOn === true) {
      this.setState(prevState => ({
        ausData: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        ausDataOn: false
      }))
    }
    if (this.state.ausDataOn === false) {
      this.setState(prevState => ({
        ausData: [...ausTotal],
        ausDataOn: true
      }))
    }

    if (this.state.canDataOn === true) {
      this.setState(prevState => ({
        canData: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        canDataOn: false
      }))
    }
    if (this.state.canDataOn === false) {
      this.setState(prevState => ({
        canData: [...canTotal],
        canDataOn: true
      }))
    }

    if (this.state.usaDataOn === true) {
      this.setState(prevState => ({
        usaData: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        usaDataOn: false
      }))
    }
    if (this.state.usaDataOn === false) {
      this.setState(prevState => ({
        usaData: [...usaTotal],
        usaDataOn: true
      }))
    }

    if (this.state.ukDataOn === true) {
      this.setState(prevState => ({
        ukData: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        ukDataOn: false
      }))
    }
    if (this.state.ukDataOn === false) {
      this.setState(prevState => ({
        ukData: [...ukTotal],
        ukDataOn: true
      }))
    }

    if (this.state.nzDataOn === true) {
      this.setState(prevState => ({
        nzData: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        nzDataOn: false
      }))
    }
    if (this.state.nzDataOn === false) {
      this.setState(prevState => ({
        nzData: [...nzTotal],
        nzDataOn: true
      }))
    }


    return null
  }

  renderGraph = () => {
    const data = {
      labels: [
        'Jul-15', 'Aug-15', 'Sep-15', 'Oct-15', 'Nov-15', 'Dec-15', 'Jan-16', 'Feb-16', 'Mar-16', 'Apr-16', 'May-16', 'Jun-16',
        'Jul-16', 'Aug-16', 'Sep-16', 'Oct-16', 'Nov-16', 'Dec-16', 'Jan-17', 'Feb-17', 'Mar-17', 'Apr-17', 'May-17', 'Jun-17',
        'Jul-17', 'Aug-17', 'Sep-17', 'Oct-17', 'Nov-17', 'Dec-17', 'Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18', 'Jun-18',
        'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18', 'Dec-18', 'Jan-19', 'Feb-19', 'Mar-19', 'Apr-19', 'May-19', 'Jun-19'
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
        <Line
          data={data}
          options={{
            scales: {
              yAxes: [{
                ticks: {
                  min: 0,
                  max: 250
                }
              }]
            }
          }} />
      </div>
    )
  }

  renderDashboard() {
    return (
      <div className="App" style={{ textAlign: "center" }}>
        <h2>Dashbaord</h2>

        <br />
        <br />
        <div>{this.renderGraph()}</div>
        <div>
          <Checkbox toggle onChange={this.totalClients} />
          Active licences
        </div>
      </div>
    )
  }

  renderNoAuth() {
    return (
      <div className="App" style={{ textAlign: "center" }}>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <h5>You are not authorised to view this page</h5>
      </div>
    )
  }

  render() {
    if (!this.props.auth) {
      return null
    }

    if (this.state.authorised.includes(this.props.auth.email)) {
      return <div>{this.renderDashboard()}</div>
    }

    return <div>{this.renderNoAuth()}</div>
  }
}


function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Dashboard)

