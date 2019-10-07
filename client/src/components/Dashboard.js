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

import { Dropdown, Grid } from 'semantic-ui-react'

class Dashboard extends Component {
  state = {
    rawData: [],
    name: "",
    authorised: [
      'andrew@bangthetable.com',
      'johannes.kresling@bangthetable.com',
      'matt@bangthetable.com',
      'crispin@bangthetable.com',
      'anna@bangthetable.com',
      'nathan@bangthetable.com',
      'nathan.connors@bangthetable.com'
    ],
    compact: true,
    graphsOptions: [{
      key: "Active Licences",
      text: "Active Licences",
      value: "Active Licences"
    }, {
      key: "Recurring Revenue",
      text: "Recurring Revenue",
      value: "Recurring Revenue"
    },
    {
      key: "Churn",
      text: "Churn",
      value: "Churn"
    },
    {
      key: "Invoice Search",
      text: "Invoice Search",
      value: "Invoice Search"
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
    event.persist()
    this.setState((prevState) => ({ selected: event.target.textContent }))
  }

  renderDashboard() {
    let toDisplay;
    const { value } = this.state
    if (this.state.selected === "Select Chart") {

    }

    if (this.state.selected === "Active Licences") {
      toDisplay = <ActiveLicencesGraph rawData={this.state.rawData} />
    }

    if (this.state.selected === "Recurring Revenue") {
      toDisplay = <RecurringRevenueGraph rawData={this.state.rawData} charts={this.state} />
    }

    if (this.state.selected === "Churn") {
      toDisplay = <Churn rawData={this.state.rawData} />
    }

    if (this.state.selected === "Invoice Search") {
      toDisplay = <InvoiceSearch rawData={this.state.rawData} />
    }

    // if (this.state.selected === "Revenue Breakdown") {
    //   toDisplay = (
    //     <div>
    //       <h1>Dashboard</h1>

    //       <h3>Check console..</h3>
    //       <div>
    //         {/* <RevenueBreakdown rawData={this.state.rawData} />
    //         <TotalValue rawData={this.state.rawData} />
    //         <NumberOfInvoices rawData={this.state.rawData} /> */}
    //         {/* <RecRevChart rawData={this.state.rawData} /> */}
    //       </div>




    //       <Grid stackable divided="vertically">
    //         <Grid.Row columns={2}>
    //           <Grid.Column>
    //             <h2>Active Licences</h2>
    //             <ActiveLicencesGraph rawData={this.state.rawData} />
    //           </Grid.Column>
    //           <Grid.Column>
    //             <h1>Monthly Recurring Revenue</h1>
    //             <RecurringRevenueGraph rawData={this.state.rawData} charts={this.state} />
    //           </Grid.Column>
    //         </Grid.Row>
    //       </Grid>
    //     </div>
    //   )
    // }


    return (
      <div>

        <h1 style={{ paddingTop: 20 }}>Dashboard</h1>
        <Dropdown placeholder="Select Chart" selection onChange={this.handleSelection} options={this.state.graphsOptions} value={value} />
        {toDisplay}

      </div >
    )
  }

  render() {
    if (!this.props.auth) {
      return null
    }

    return (
      <div>
        {this.renderDashboard()}
      </div>
    )

    // if (this.state.authorised.includes(this.props.auth.email)) {
    //   if (this.props.auth.email) {
    //     { console.log(this.props.auth) }
    //   }
    //   return <div>{this.renderDashboard()}</div>
    // }
    // if (this.props.auth.email) {
    //   { console.log(this.props.auth) }
    // }
    // if (this.props.auth.email) {
    //   { console.log(this.props.auth) }
    // }
    // return <div><RenderNoAuth /></div>

  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Dashboard)
