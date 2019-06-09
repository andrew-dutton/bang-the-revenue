import React, { Component } from "react"
import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk"


class Dashboard extends Component {
  state = {
    rawData: [],
    name: ""
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
      .find({}, { limit: 1000 })
      .asArray()
      .then(rawData => {
        this.setState({ rawData })
      });
  }

  numberOfInvoices = () => {
    const total = this.state.rawData.length

    if (total < 1) {
      return "...Loading..."
    }

    return total
  }

  totalValue = () => {
    if (this.state.rawData.length > 0) {
      const totals = []
      const sum = (a, b) => a + b;
      function currencyFormat(num) {
        return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }

      this.state.rawData.forEach((number) => {
        totals.push(number["Total (ex GST)"])
      })

      const total = totals.reduce(sum)
      return currencyFormat(total)
    }

    return <span>...Loading...</span>
  }

  render() {
    return (
      <div className="App">
        <h3>Revenue for 2014/2015</h3>
        <p>Total number of invoices: {this.numberOfInvoices()}</p>
        <p>Total of invoices: {this.totalValue()}</p>
      </div>
    )
  }
}

export default Dashboard
