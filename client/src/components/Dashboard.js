import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk'
import RecurringRevenueGraph from './dashboard/RecurringRevenueGraph'
// import NumberOfInvoices from './dashboard/NumberOfInvoices'
// import TotalValue from './dashboard/TotalValue'
// import RevenueBreakdown from "./dashboard/RevenueBreakdown"
import ActiveLicencesGraph from './dashboard/ActiveLicencesGraph'
import RenderNoAuth from './Auth/RenderNoAuth'
import Churn from './dashboard/Churn'
import InvoiceSearch from './dashboard/InvoiceSearch'

import { Dropdown } from 'semantic-ui-react'

class Dashboard extends Component {
  state = {
    rawData: [],
    name: "",
    authorised: [
      'andrew@bangthetable.com',
      'andrew@dutton.pro',
      'johannes.kresling@bangthetable.com',
      'matt@bangthetable.com',
      'crispin@bangthetable.com',
      'anna@bangthetable.com'
    ],
    compact: true,
    graphsOptions: [{
      key: "Active Licences",
      text: "Active Licences",
      graph: "Active Licences"
    }, {
      key: "Recurring Revenue",
      text: "Recurring Revenue",
      graph: "Recurring Revenue"
    }, {
      key: "Churn",
      text: "Churn",
      graph: "Churn"
    }],
    activeClientsChart: false,
    recurringRevenueChart: false,
    selected: "Select Chart"
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

  handleSelection = (event, data) => {
    console.log('trig')
    event.persist()
    this.setState((prevState) => ({ selected: event.target.textContent }))
    console.log(event.target.textContent)
  }

  renderDashboard() {
    const { value } = this.state

    if (this.state.selected === "Select Chart") {
      return (
        <div>
          <h1>Dashboard</h1>
          <Dropdown placeholder={this.state.selected} selection onChange={this.handleSelection} options={this.state.graphsOptions} value={value} />
          <h1>Please select a chart from above</h1>
        </div>
      )
    }

    if (this.state.selected === "Active Licences") {
      return (
        <div>
          <h1>Dashboard</h1>
          <Dropdown placeholder={this.state.selected} selection onChange={this.handleSelection} options={this.state.graphsOptions} value={value} />
          <h2>Active Licences</h2>
          <ActiveLicencesGraph rawData={this.state.rawData} />
        </div>
      )
    }

    if (this.state.selected === "Recurring Revenue") {
      return (
        <div>
          <h1>Dashboard</h1>
          <Dropdown placeholder={this.state.selected} selection onChange={this.handleSelection} options={this.state.graphsOptions} value={value} />
          <h1>Monthly Recurring Revenue</h1>
          <RecurringRevenueGraph rawData={this.state.rawData} charts={this.state} />
        </div>
      )
    }

    if (this.state.selected === "Churn") {
      return (
        <div>
          <h1>Dashboard</h1>
          <Dropdown placeholder={this.state.selected} selection onChange={this.handleSelection} options={this.state.graphsOptions} value={value} />
          <Churn rawData={this.state.rawData} />
        </div>
      )
    }

    if (this.state.selected === "Invoice Search") {
      return (
        <div>
          <InvoiceSearch rawData={this.state.rawData} />
        </div>
      )
    }

    if (this.state.selected === "Revenue Breakdown") {
      return (
        <div>
          <h1>Dashboard</h1>
          <Dropdown placeholder={this.state.selected} selection onChange={this.handleSelection} options={this.state.graphsOptions} value={value} />

          <h3>Check console..</h3>
          <div>
            {/* <RevenueBreakdown rawData={this.state.rawData} />
          <TotalValue rawData={this.state.rawData} />
          <NumberOfInvoices rawData={this.state.rawData} /> */}
            {/* <RecRevChart rawData={this.state.rawData} /> */}
          </div>




          {/* <Grid stackable divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column largeScreen={8} computer={16} tablet={16}>
              <h2>Active Licences</h2>
              <ActiveLicencesGraph rawData={this.state.rawData} />
            </Grid.Column>
            <Grid.Column largeScreen={8} computer={16} tablet={16}>
              <h1>Monthly Recurring Revenue</h1>
              <RecurringRevenueGraph rawData={this.state.rawData} charts={this.state} />
            </Grid.Column>
          </Grid.Row>
        </Grid> */}
        </div>
      )
    }


  }

  render() {
    if (!this.props.auth) {
      return null
    }

    if (this.state.authorised.includes(this.props.auth.email)) {
      console.log(this.state.selected)
      return <div>{this.renderDashboard()}</div>
    }

    return <div><RenderNoAuth /></div>
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Dashboard)
