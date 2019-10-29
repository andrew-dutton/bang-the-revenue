import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk'
import WhatsNext from './dashboard/WhatsNext/WhatsNext'
import RenderSelectedDashboard from './dashboard/TheDashboard/RenderSelectedDashboard'
import RenderFullDashboard from './dashboard/TheDashboard/renderFullDashboard'
import Forex from './dashboard/Forex'
import AuthUsers from './dashboard/authUsers'
import { Segment } from 'semantic-ui-react'

class Dashboard extends Component {
  state = {
    authUsers: AuthUsers.authUsers,
    rawData: [],
    users: [],
    whatsNext: false,
    forexData: Forex.rates,
    name: "",
    recurringRevenueChart: false,
    selected: "Select Chart",
    raised: ""
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
    this.db.collection("invoice-lines").find({}).asArray().then(rawData => { this.setState({ rawData }) })
  }

  handleSelection = (event, data) => {
    if (this.state.rawData.length < 1) {
      return null
    }
    this.setState((prevState) => ({ selected: event, raised: event, active: false }))
  }

  backToDashboard = () => {
    this.setState((prevState) => ({ selected: 'Select Chart' }))
  }

  triggerWhatsNext = () => {
    this.setState((prevState) => ({ selected: "whats next" }))
  }

  onMouseEnterRecurringRevenue = () => {
    this.setState((prevState) => ({ raised: "Recurring Revenue" }))
  }

  onMouseLeaveRecurringRevenue = () => {
    this.setState((prevState) => ({ raised: '' }))
  }

  onMouseEnterActiveLicences = () => {
    this.setState((prevState) => ({ raised: "Active Licences" }))
  }

  onMouseLeaveActiveLiecences = () => {
    this.setState((prevState) => ({ raised: '' }))
  }

  onMouseEnterChurn = () => {
    this.setState((prevState) => ({ raised: "Churn" }))
  }

  onMouseLeaveChurn = () => {
    this.setState((prevState) => ({ raised: '' }))
  }

  onMouseEnterCAC = () => {
    this.setState((prevState) => ({ raised: "CAC" }))
  }

  onMouseLeaveCAC = () => {
    this.setState((prevState) => ({ raised: '' }))
  }

  onMouseEnterBudget = () => {
    this.setState((prevState) => ({ raised: "Budget" }))
  }

  onMouseLeaveBudget = () => {
    this.setState((prevState) => ({ raised: '' }))
  }

  onMouseEnterEIQ = () => {
    this.setState((prevState) => ({ raised: "EIQ" }))
  }

  onMouseLeaveEIQ = () => {
    this.setState((prevState) => ({ raised: '' }))
  }

  onMouseEnterRRR = () => {
    this.setState((prevState) => ({ raised: "RRR" }))
  }

  onMouseLeaveRRR = () => {
    this.setState((prevState) => ({ raised: '' }))
  }

  onMouseEnterNonRecurring = () => {
    this.setState((prevState) => ({ raised: "Non Recurring" }))
  }

  onMouseLeaveNonRecurring = () => {
    this.setState((prevState) => ({ raised: '' }))
  }

  onMouseEnterLTV = () => {
    this.setState((prevState) => ({ raised: "LTV" }))
  }

  onMouseLeaveLTV = () => {
    this.setState((prevState) => ({ raised: '' }))
  }

  render() {
    if (!this.props.auth) {
      return null
    }

    if (!this.state.authUsers.includes(this.props.auth.email)) {
      return (
        <div style={{ textAlign: 'center', fontFamily: 'Titillium Web' }}>
          <Segment style={{ width: 1079, height: 900 }}>
            <div style={{ textAlign: 'center', paddingTop: 20 }}>
              <h1>You are not authorised to view this page</h1>
            </div>
          </Segment>
        </div>
      )
    }

    return (
      <div style={{ fontFamily: 'Titillium Web', paddingBottom: 200 }}>

        <RenderFullDashboard
          selected={this.state.selected}
          forexData={this.state.forexData}
          rawData={this.state.rawData}
          onMouseEnterActiveLicences={this.onMouseEnterActiveLicences}
          onMouseLeaveActiveLiecences={this.onMouseLeaveActiveLiecences}
          onMouseEnterBudget={this.onMouseEnterBudget}
          onMouseLeaveBudget={this.onMouseLeaveBudget}
          onMouseEnterCAC={this.onMouseEnterCAC}
          onMouseLeaveCAC={this.onMouseLeaveCAC}
          onMouseEnterChurn={this.onMouseEnterChurn}
          onMouseLeaveChurn={this.onMouseLeaveChurn}
          onMouseEnterEIQ={this.onMouseEnterEIQ}
          onMouseLeaveEIQ={this.onMouseLeaveEIQ}
          onMouseEnterLTV={this.onMouseEnterLTV}
          onMouseLeaveLTV={this.onMouseLeaveLTV}
          onMouseEnterNonRecurring={this.onMouseEnterNonRecurring}
          onMouseLeaveNonRecurring={this.onMouseLeaveNonRecurring}
          onMouseEnterRRR={this.onMouseEnterRRR}
          onMouseLeaveRRR={this.onMouseLeaveRRR}
          onMouseEnterRecurringRevenue={this.onMouseEnterRecurringRevenue}
          onMouseLeaveRecurringRevenue={this.onMouseEnterRecurringRevenue}
          handleSelection={this.handleSelection}
          raised={this.state.raised}
          triggerWhatsNext={this.triggerWhatsNext}
        />

        <RenderSelectedDashboard
          selected={this.state.selected}
          forexData={this.state.forexData}
          rawData={this.state.rawData}
          triggerWhatsNext={this.triggerWhatsNext}
        />

        <WhatsNext selected={this.state.selected} backToDashboard={this.backToDashboard} />
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Dashboard)
