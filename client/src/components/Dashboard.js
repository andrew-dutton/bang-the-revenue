import React, { Component } from "react"
import { connect } from 'react-redux'
import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk"


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
    ]
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
    const total = this.state.rawData.length

    if (total < 1) {
      return
    }

    return (
      <div className="ui statistic">
        <div className="value" style={{ color: "red" }}>
          {total}
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

    return <span>........Loading..........</span>
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

  render() {
    if (!this.props.auth) {
      return <div></div>
    }
    if (this.state.authorised.includes(this.props.auth.email)) {
      console.log(this.props.auth.email)
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
