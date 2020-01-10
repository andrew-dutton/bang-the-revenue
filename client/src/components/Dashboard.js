import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk'
import WhatsNext from './dashboard/WhatsNext/WhatsNext'
import RenderSelectedDashboard from './dashboard/TheDashboard/RenderSelectedDashboard'
import RenderFullDashboard from './dashboard/TheDashboard/renderFullDashboard'
// import Forex from './dashboard/Forex'
import AuthUsers from './dashboard/authUsers'
import { Segment } from 'semantic-ui-react'
import DataIn from './dashboard/DataIn'

class Dashboard extends Component {
  state = {
    authUsers: AuthUsers.authUsers,
    rawData: [],
    rawSpend: [],
    users: [],
    whatsNext: false,
    forexData: DataIn.rates,
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
      .then(this.getMongoSpend)
      .catch(console.error)
  }

  getMongoData = () => {
    this.db.collection("invoice-lines").find({}).asArray().then(rawData => { this.setState({ rawData }) })
  }

  getMongoSpend = () => {
    this.db.collection("btt-spend").find({}).asArray().then(rawSpend => { this.setState({ rawSpend}) })
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

  onMouseEnterQR = () => {
    this.setState((prevState) => ({ raised: "QR" }))
  }

  onMouseLeaveQR = () => {
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

    let loginEmail = this.props.auth.email
    let authorised = false

    if (this.state.authUsers.includes(loginEmail)) {
      authorised = true
    } else {
      let domain = loginEmail.slice(loginEmail.indexOf("@") + 1)
      if (domain === "bangthetable.com") {
        authorised = true
      }
    }

    if (!authorised) {
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
          rawSpend={this.state.rawSpend}
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
          onMouseEnterQR={this.onMouseEnterQR}
          onMouseLeaveQR={this.onMouseLeaveQR}
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
          rawSpend={this.state.rawSpend}
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
