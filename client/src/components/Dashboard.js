import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk'
import RecurringRevenueGraph from './dashboard/RecurringRevenueGraph'
// import NumberOfInvoices from './dashboard/NumberOfInvoices'
// import TotalValue from './dashboard/TotalValue'
// import RevenueBreakdown from "./dashboard/RevenueBreakdown"
import ActiveLicencesGraph from './dashboard/ActiveLicencesGraph'
import RenderNoAuth from './Auth/RenderNoAuth'
import { Grid } from 'semantic-ui-react'

class Dashboard extends Component {
  state = {
    rawData: [],
    name: "",
    authorised: [
      // 'andrew@dutton.pro',
      'andrew@bangthetable.com',
      'johannes.kresling@bangthetable.com',
      'matt@bangthetable.com',
      'crispin@bangthetable.com',
      'anna@bangthetable.com'
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

  renderDashboard() {
    return (
      <div className="App" style={{ textAlign: "center" }}>
        <h1>Dashboard</h1>
        <Grid stackable divided="vertically">
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
        </Grid>
        <div>
          {/* <RevenueBreakdown rawData={this.state.rawData} />
          <TotalValue rawData={this.state.rawData} />
          <NumberOfInvoices rawData={this.state.rawData} /> */}
          {/* <RecRevChart rawData={this.state.rawData} /> */}
        </div>
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

    return <div><RenderNoAuth /></div>
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Dashboard)
