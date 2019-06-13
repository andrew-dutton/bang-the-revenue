import React, { Component } from "react"
import { connect } from 'react-redux'
import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk"
import Chart from './ClientChart'

class Dashboard extends Component {
  state = {
    rawData: [],
    name: "",
    authorised: [
      'andrew@dutton.pro',
      'andrew@bangthetable.com',
      'johannes.kresling@bangthetable.com',
      'matt@bangthetable.com',
      'crispin@bangthetable.com'
    ],
    chartData: {},
    data: [21, 31, 35, 48, 57, 61, 73, 79, 93, 103, 110, 115]
  }

  componentWillMount() {
    this.getChartData();
  }

  getChartData() {
    this.setState({
      chartData: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'EHQ Subscritions',
            data: this.state.data,
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)'
            ]
          }
        ]
      }
    });
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
      totalInvoices.push(invoice["Invoice Number"])
    })

    const onlyUnique = (value, index, self) => {
      return self.indexOf(value) === index;
    }

    let uniqInvoices = totalInvoices.filter(onlyUnique)

    if (totalInvoices.length === 0) return <div></div>

    return (
      <div className="ui statistic">
        <div className="value" style={{ color: "red" }}>
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
        totals.push(number["Total (ex GST)"])
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
        vic.push(invoice["Total (ex GST)"])
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
      if (invoice["Revenue Type"] === "Subscription")
        sub.push(invoice["Total (ex GST)"])
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

  totalClients = () => {
    const months = [
      new Date('2014-07-30'),
      new Date('2014-08-30'),
      new Date('2014-09-29'),
      new Date('2014-10-30'),
      new Date('2014-11-29'),
      new Date('2014-12-30'),
      new Date('2015-01-30'),
      new Date('2015-02-27'),
      new Date('2015-03-30'),
      new Date('2015-04-29'),
      new Date('2015-05-30'),
      new Date('2015-06-29')
    ]

    const clientTotals = []

    months.forEach((month) => {
      let counter = []
      this.state.rawData.forEach((invoice) => {
        let start = new Date(invoice["Contract Start"])
        let end = new Date(invoice["Contract End"])


        if (start <= month && end >= month) {
          counter.push(invoice["Client"])
        }
      })

      const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
      }

      let uniqClients = counter.filter(onlyUnique)

      clientTotals.push(uniqClients.length)
    })

    // console.log(clientTotals)

    // need to be able to update state with new chart values.

    return (
      <div>

      </div>
    )
  }

  render() {
    if (!this.props.auth) {
      return <div>

      </div>
    }

    if (this.state.authorised.includes(this.props.auth.email)) {
      return (
        <div className="App" style={{ textAlign: "center" }}>
          <h2>Revenue for 2014/2015</h2>
          <br />
          <div>{this.numberOfInvoices()}</div>
          <br />
          <br />
          <div>{this.stateBreakdown()}</div>
          <br />
          <br />
          <div>{this.reveneuBreakdown()}</div>
          <br />
          <br />
          <div>{this.totalValue()}</div>
          <br />
          <br />
          <div>{this.totalClients()}</div>
          <div>
            <Chart chartData={this.state.chartData} legendPosition="bottom" />
          </div>
        </div>
      )
    } else {
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
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Dashboard)
