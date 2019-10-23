import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk'
import RecurringRevenueGraph from './dashboard/RecurringRevenueGraph'
import ActiveLicencesGraph from './dashboard/ActiveLicencesGraph'
import Churn from './dashboard/Churn'
import InvoiceSearch from './dashboard/InvoiceSearch'
import ActiveLicencesBox from './dashboard/ActiveLicencesBox'
import RecurringRevenueBox from './dashboard/RecurringRevenueBox'
import ChurnBox from './dashboard/ChurnBox'
import CACBox from './dashboard/CACBox'
import BudgetBox from './dashboard/BudgetBox'
import EIQBox from './dashboard/EIQBox'
import NonRecurringBox from './dashboard/NonRecurringBox'
import RRRBox from './dashboard/RRRBox'
import LTVBox from './dashboard/LTVBox'

import { Segment, Grid, Dimmer, Loader, Icon, Button, Image } from 'semantic-ui-react'

class Dashboard extends Component {
  state = {
    rawData: [],
    whatsNext: false,
    forexData:
    {
      "07/2015": {
        "AUD/CAD": 1.05096,
        "AUD/USD": 1.34784,
        "AUD/GBP": 2.09684,
        "AUD/NZD": 0.89611
      },
      "08/2015": {
        "AUD/CAD": 1.04119,
        "AUD/USD": 1.36834,
        "AUD/GBP": 2.1327,
        "AUD/NZD": 0.89854
      },
      "09/2015": {
        "AUD/CAD": 1.0678,
        "AUD/USD": 1.41609,
        "AUD/GBP": 2.17205,
        "AUD/NZD": 0.89753
      },
      "10/2015": {
        "AUD/CAD": 1.062,
        "AUD/USD": 1.38807,
        "AUD/GBP": 2.12727,
        "AUD/NZD": 0.92677
      },
      "11/2015": {
        "AUD/CAD": 1.05415,
        "AUD/USD": 1.39994,
        "AUD/GBP": 2.12707,
        "AUD/NZD": 0.9191
      },
      "12/2015": {
        "AUD/CAD": 1.00744,
        "AUD/USD": 1.3801,
        "AUD/GBP": 2.07052,
        "AUD/NZD": 0.93073
      },
      "01/2016": {
        "AUD/CAD": 1.00334,
        "AUD/USD": 1.42272,
        "AUD/GBP": 2.0509,
        "AUD/NZD": 0.93313
      },
      "02/2016": {
        "AUD/CAD": 1.01674,
        "AUD/USD": 1.40347,
        "AUD/GBP": 2.00934,
        "AUD/NZD": 0.93017
      },
      "03/2016": {
        "AUD/CAD": 1.00816,
        "AUD/USD": 1.33475,
        "AUD/GBP": 1.9015,
        "AUD/NZD": 0.89914
      },
      "04/2016": {
        "AUD/CAD": 1.01645,
        "AUD/USD": 1.30488,
        "AUD/GBP": 1.86584,
        "AUD/NZD": 0.89843
      },
      "05/2016": {
        "AUD/CAD": 1.05623,
        "AUD/USD": 1.36586,
        "AUD/GBP": 1.9838,
        "AUD/NZD": 0.92912
      },
      "06/2016": {
        "AUD/CAD": 1.04868,
        "AUD/USD": 1.35286,
        "AUD/GBP": 1.9267,
        "AUD/NZD": 0.95099
      },
      "07/2016": {
        "AUD/CAD": 1.0194,
        "AUD/USD": 1.32842,
        "AUD/GBP": 1.7457,
        "AUD/NZD": 0.94856
      },
      "08/2016": {
        "AUD/CAD": 1.00894,
        "AUD/USD": 1.31111,
        "AUD/GBP": 1.71609,
        "AUD/NZD": 0.94702
      },
      "09/2016": {
        "AUD/CAD": 1.00791,
        "AUD/USD": 1.32083,
        "AUD/GBP": 1.73621,
        "AUD/NZD": 0.96394
      },
      "10/2016": {
        "AUD/CAD": 0.99154,
        "AUD/USD": 1.31305,
        "AUD/GBP": 1.62476,
        "AUD/NZD": 0.94051
      },
      "11/2016": {
        "AUD/CAD": 0.98835,
        "AUD/USD": 1.33011,
        "AUD/GBP": 1.65596,
        "AUD/NZD": 0.94935
      },
      "12/2016": {
        "AUD/CAD": 1.02123,
        "AUD/USD": 1.36318,
        "AUD/GBP": 1.70089,
        "AUD/NZD": 0.95776
      },
      "01/2017": {
        "AUD/CAD": 1.01582,
        "AUD/USD": 1.34212,
        "AUD/GBP": 1.6571,
        "AUD/NZD": 0.95505
      },
      "02/2017": {
        "AUD/CAD": 0.99551,
        "AUD/USD": 1.30407,
        "AUD/GBP": 1.62802,
        "AUD/NZD": 0.94249
      },
      "03/2017": {
        "AUD/CAD": 0.98013,
        "AUD/USD": 1.31228,
        "AUD/GBP": 1.6196,
        "AUD/NZD": 0.91913
      },
      "04/2017": {
        "AUD/CAD": 0.98736,
        "AUD/USD": 1.32732,
        "AUD/GBP": 1.67798,
        "AUD/NZD": 0.92471
      },
      "05/2017": {
        "AUD/CAD": 0.98972,
        "AUD/USD": 1.3455,
        "AUD/GBP": 1.73846,
        "AUD/NZD": 0.93527
      },
      "06/2017": {
        "AUD/CAD": 0.99402,
        "AUD/USD": 1.32369,
        "AUD/GBP": 1.69436,
        "AUD/NZD": 0.95676
      },
      "07/2017": {
        "AUD/CAD": 1.01009,
        "AUD/USD": 1.28253,
        "AUD/GBP": 1.66777,
        "AUD/NZD": 0.94444
      },
      "08/2017": {
        "AUD/CAD": 1.00198,
        "AUD/USD": 1.26334,
        "AUD/GBP": 1.63683,
        "AUD/NZD": 0.92309
      },
      "09/2017": {
        "AUD/CAD": 1.02046,
        "AUD/USD": 1.25372,
        "AUD/GBP": 1.66926,
        "AUD/NZD": 0.90963
      },
      "10/2017": {
        "AUD/CAD": 1.01899,
        "AUD/USD": 1.28449,
        "AUD/GBP": 1.695,
        "AUD/NZD": 0.90402
      },
      "11/2017": {
        "AUD/CAD": 1.0284,
        "AUD/USD": 1.31207,
        "AUD/GBP": 1.73405,
        "AUD/NZD": 0.90349
      },
      "12/2017": {
        "AUD/CAD": 1.02418,
        "AUD/USD": 1.30603,
        "AUD/GBP": 1.75058,
        "AUD/NZD": 0.91041
      },
      "01/2018": {
        "AUD/CAD": 1.01123,
        "AUD/USD": 1.25742,
        "AUD/GBP": 1.73677,
        "AUD/NZD": 0.91238
      },
      "02/2018": {
        "AUD/CAD": 1.01046,
        "AUD/USD": 1.27076,
        "AUD/GBP": 1.77506,
        "AUD/NZD": 0.92866
      },
      "03/2018": {
        "AUD/CAD": 0.99706,
        "AUD/USD": 1.28906,
        "AUD/GBP": 1.80025,
        "AUD/NZD": 0.93494
      },
      "04/2018": {
        "AUD/CAD": 1.02153,
        "AUD/USD": 1.30191,
        "AUD/GBP": 1.83085,
        "AUD/NZD": 0.94254
      },
      "05/2018": {
        "AUD/CAD": 1.03168,
        "AUD/USD": 1.32797,
        "AUD/GBP": 1.78805,
        "AUD/NZD": 0.92345
      },
      "06/2018": {
        "AUD/CAD": 1.01664,
        "AUD/USD": 1.33423,
        "AUD/GBP": 1.77375,
        "AUD/NZD": 0.92598
      },
      "07/2018": {
        "AUD/CAD": 1.02833,
        "AUD/USD": 1.3505,
        "AUD/GBP": 1.77862,
        "AUD/NZD": 0.91688
      },
      "08/2018": {
        "AUD/CAD": 1.04582,
        "AUD/USD": 1.36474,
        "AUD/GBP": 1.75584,
        "AUD/NZD": 0.90966
      },
      "09/2018": {
        "AUD/CAD": 1.06566,
        "AUD/USD": 1.38889,
        "AUD/GBP": 1.81141,
        "AUD/NZD": 0.91644
      },
      "10/2018": {
        "AUD/CAD": 1.08114,
        "AUD/USD": 1.4077,
        "AUD/GBP": 1.83299,
        "AUD/NZD": 0.91877
      },
      "11/2018": {
        "AUD/CAD": 1.04565,
        "AUD/USD": 1.37995,
        "AUD/GBP": 1.78032,
        "AUD/NZD": 0.93472
      },
      "12/2018": {
        "AUD/CAD": 1.03837,
        "AUD/USD": 1.39689,
        "AUD/GBP": 1.77105,
        "AUD/NZD": 0.95087
      },
      "01/2019": {
        "AUD/CAD": 1.05103,
        "AUD/USD": 1.39809,
        "AUD/GBP": 1.80309,
        "AUD/NZD": 0.94786
      },
      "02/2019": {
        "AUD/CAD": 1.06049,
        "AUD/USD": 1.40017,
        "AUD/GBP": 1.82165,
        "AUD/NZD": 0.95681
      },
      "03/2019": {
        "AUD/CAD": 1.05644,
        "AUD/USD": 1.4127,
        "AUD/GBP": 1.85954,
        "AUD/NZD": 0.96486
      },
      "04/2019": {
        "AUD/CAD": 1.05038,
        "AUD/USD": 1.40585,
        "AUD/GBP": 1.83096,
        "AUD/NZD": 0.94363
      },
      "05/2019": {
        "AUD/CAD": 1.06998,
        "AUD/USD": 1.43967,
        "AUD/GBP": 1.85111,
        "AUD/NZD": 0.94515
      },
      "06/2019": {
        "AUD/CAD": 1.08205,
        "AUD/USD": 1.43935,
        "AUD/GBP": 1.82457,
        "AUD/NZD": 0.95006
      },
      "07/2019": {
        "AUD/CAD": 1.093078,
        "AUD/USD": 1.432225,
        "AUD/GBP": 1.786366,
        "AUD/NZD": 0.956535
      },
      "08/2019": {
        "AUD/CAD": 1.111795,
        "AUD/USD": 1.476194,
        "AUD/GBP": 1.794814,
        "AUD/NZD": 0.950012
      },
      "09/2019": {
        "AUD/CAD": 1.108747,
        "AUD/USD": 1.468828,
        "AUD/GBP": 1.81477,
        "AUD/NZD": 0.931331
      }
    },
    name: "",
    recurringRevenueChart: false,
    selected: "Select Chart",
    raised: ""
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


  renderDashboard() {
    let toDisplay;

    if (this.state.selected === "Active Licences") {
      toDisplay = <ActiveLicencesGraph rawData={this.state.rawData} />

    }

    if (this.state.selected === "Recurring Revenue") {
      toDisplay = <RecurringRevenueGraph forexData={this.state.forexData} rawData={this.state.rawData} charts={this.state} />
    }

    if (this.state.selected === "Churn") {
      toDisplay = <Churn forexData={this.state.forexData} rawData={this.state.rawData} />
    }

    if (this.state.selected === "Invoice Search") {
      toDisplay = <InvoiceSearch rawData={this.state.rawData} />
    }

    if (this.state.selected === "Whats Next") {
      this.displayWhatsNext()
    }

    return (
      <div style={{ fontFamily: 'Titillium Web' }}>
        {toDisplay}
      </div >
    )
  }

  newDashboard = () => {
    if (this.state.selected === "Select Chart") {
      return (
        <div style={{ paddingTop: 24, paddingBotton: 100 }}>
          <div style={{ paddingBottom: 12 }}>
            <Segment color="black" style={{ width: 1079 }}>
              <Grid verticalAlign={"middle"}>
                <Grid.Column width={4}>
                  <Button basic style={{ cursor: 'pointer', fontSize: 12 }} onClick={() => this.triggerWhatsNext()} compact color="orange"><Icon name="cogs"></Icon>Work In Progress</Button>
                </Grid.Column>
                <Grid.Column width={8}>
                  <h1 style={{ fontSize: 40, textAlign: "center", fontFamily: 'Titillium Web' }}>Dashboard</h1>
                </Grid.Column>
                <Grid.Column width={4}>
                  <p style={{ textAlign: "right", size: 10 }}><Icon name="star outline"></Icon>=  Recently Updated</p>
                </Grid.Column>
              </Grid>
            </Segment>
          </div>
          <Segment style={{ width: 1079, textAlign: "center", backgroundColor: '#F7F7F7' }}>
            <Dimmer active={this.state.rawData.length < 1}>
              <Loader>Syncing data....</Loader>
            </Dimmer>
            <Grid>
              <Grid.Row columns={3}>
                <Grid.Column>
                  <div style={{ cursor: 'pointer' }} id="Active Licences" onMouseEnter={() => this.onMouseEnterActiveLicences()} onMouseLeave={() => this.onMouseLeaveActiveLiecences()} onClick={e => this.handleSelection(e.currentTarget.id)}>
                    <Segment color={"green"} inverted={this.state.selected === "Active Licences"} raised={this.state.raised === "Active Licences"}>
                      <h1 style={{ fontFamily: 'Titillium Web' }}>Active Licences</h1>
                      <ActiveLicencesBox selected={this.state.selected} rawData={this.state.rawData} />
                    </Segment>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <Image fluid label={{ as: 'a', color: 'orange', corner: 'right', icon: 'star' }} />
                  <div style={{ cursor: 'pointer' }} onMouseEnter={() => this.onMouseEnterRecurringRevenue()} onMouseLeave={() => this.onMouseLeaveRecurringRevenue()} id="Recurring Revenue" onClick={e => this.handleSelection(e.currentTarget.id)}>
                    <Segment color={"orange"} inverted={this.state.selected === "Recurring Revenue"} raised={this.state.raised === "Recurring Revenue"}>
                      <h1 style={{ fontFamily: 'Titillium Web' }}>Recurring Revenue</h1>
                      <RecurringRevenueBox selected={this.state.selected} rawData={this.state.rawData} />
                    </Segment>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <Image fluid label={{ as: 'a', color: 'blue', corner: 'right', icon: 'star' }} />
                  <div style={{ cursor: 'pointer' }} id="Churn" onMouseEnter={() => this.onMouseEnterChurn()} onMouseLeave={() => this.onMouseLeaveChurn()} onClick={e => this.handleSelection(e.currentTarget.id)}>
                    <Segment color={"blue"} inverted={this.state.selected === "Churn"} raised={this.state.raised === "Churn"}>

                      <h1 style={{ fontFamily: 'Titillium Web' }}>Client Churn</h1>
                      <ChurnBox selected={this.state.selected} rawData={this.state.rawData} />
                    </Segment>
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{ color: '#E0E0E0' }} columns={3}>
                <Grid.Column>
                  <div style={{ color: '#A0A0A0' }} id="RRR" onMouseEnter={() => this.onMouseEnterRRR()} onMouseLeave={() => this.onMouseLeaveRRR()}>
                    <Segment color="yellow" inverted={this.state.selected === "RRR"} raised={this.state.raised === "RRR"}>
                      <h1 style={{ fontFamily: 'Titillium Web' }}>Revenue Run Rate</h1>
                      <RRRBox selected={this.state.selected} rawData={this.state.rawData} />
                    </Segment>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div id="Non Recurring" onMouseEnter={() => this.onMouseEnterNonRecurring()} onMouseLeave={() => this.onMouseLeaveNonRecurring()}>
                    <Segment inverted={this.state.selected === "Non Recurring"} raised={this.state.raised === "Non Recurring"}>
                      <h1 style={{ fontFamily: 'Titillium Web' }}>Non Recurring Revenue</h1>
                      <NonRecurringBox selected={this.state.selected} rawData={this.state.rawData} />
                    </Segment>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div id="EIQ" onMouseEnter={() => this.onMouseEnterEIQ()} onMouseLeave={() => this.onMouseLeaveEIQ()}>
                    <Segment inverted={this.state.selected === "EIQ"} raised={this.state.raised === "EIQ"}>
                      <h1 style={{ fontFamily: 'Titillium Web' }}>EngagementIQ</h1>
                      <EIQBox selected={this.state.selected} rawData={this.state.rawData} />
                    </Segment>
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{ color: '#E0E0E0' }} columns={3}>
                <Grid.Column>
                  <div id="CAC" onMouseEnter={() => this.onMouseEnterCAC()} onMouseLeave={() => this.onMouseLeaveCAC()}>
                    <Segment inverted={this.state.selected === "CAC"} raised={this.state.raised === "CAC"}>
                      <h1 style={{ fontFamily: 'Titillium Web' }}>Cost of Acquiring Clients</h1>
                      <CACBox selected={this.state.selected} rawData={this.state.rawData} />
                    </Segment>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div id="LTV" onMouseEnter={() => this.onMouseEnterLTV()} onMouseLeave={() => this.onMouseLeaveLTV()}>
                    <Segment inverted={this.state.selected === "LTV"} raised={this.state.raised === "LTV"}>
                      <h1 style={{ fontFamily: 'Titillium Web' }}>Client Life Time Value</h1>
                      <LTVBox selected={this.state.selected} rawData={this.state.rawData} />
                    </Segment>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div id="Budget" onMouseEnter={() => this.onMouseEnterBudget()} onMouseLeave={() => this.onMouseLeaveBudget()}>
                    <Segment inverted={this.state.selected === "Budget"} raised={this.state.raised === "Budget"}>
                      <h1 style={{ fontFamily: 'Titillium Web' }}>Budget Variances</h1>
                      <BudgetBox selected={this.state.selected} rawData={this.state.rawData} />
                    </Segment>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </div >
      )
    }
  }

  triggerWhatsNext = () => {
    this.setState((prevState) => ({ selected: "whats next" }))
  }

  displayWhatsNext = () => {
    if (this.state.selected === "whats next") {
      return (
        <div style={{ paddingTop: 24 }}>
          <Segment color="purple" style={{ width: 1079, paddingTop: 24, fontFamily: 'Titillium Web' }}>
            <h1 style={{ fontFamily: 'Titillium Web' }}>
              What's next
            </h1>

            <h3 style={{ fontFamily: 'Titillium Web' }}>Recurring Revenue</h3>
            <ol start={1} style={{ fontFamily: 'Titillium Web' }}>
              <li>Add toggle buttons for territories which update data table below (same style as Churn page)</li>
              <li>Allow any combination of territory data to be displayed on chart at once</li>
              <li>Include toggle to show total revenue line on chart</li>
              <li>Add option to show revenue data in USD or AUD (any other currencies worthwhile?)</li>
            </ol>

            <h3 style={{ fontFamily: 'Titillium Web' }}>Main Dashboard</h3>
            <ol start={5}>
              <li>Hook data up to each section. Numbers here are currently hardcoded for September</li>
            </ol>

            <h3 style={{ fontFamily: 'Titillium Web' }}>Revenue Run Rate</h3>
            <ol start={6}>
              <li>Build out RRR dashboard</li>
            </ol>

            <h3 style={{ fontFamily: 'Titillium Web' }}>Churn</h3>
            <ol start={7}>
              <li>Add option to show churn data quarterly and annually</li>
              <li>Add switch to show Client Number Churn (as is currently displayed) or Churn by dollar value with option to select currency</li>
            </ol>

            <h3 style={{ fontFamily: 'Titillium Web' }}>Other tasks, not ordered by priority</h3>
            <ul style={{ fontFamily: 'Titillium Web' }}>
              <li>Build out remaining dashboards</li>
              <li>Create a privacy concious report of spending data that is meaningful and easy to report against revenue numbers. (This one is a big job)</li>
              <li>Add mini graphs to each dashboard square for figures that could be better presented visually than just with text</li>
              <li>Add ability to change currency being displayed when currency flags are clicked (On Client Churn page only for now, but could be used on any dashboard)</li>
              <li>Add functionality to display all data related to a specific client when their name is clicked on any table in which they appear</li>
              <li>Time travel back to specific months on Active Licence</li>
              <li>Non Recurring Revenue dashboard build - use this to analyse sales for each product family</li>
              <li>Set up Cost of Acquiring Clients Dashboard (CAC) - showing total marketing spend vs converted new leads (by month/qtr/annual)</li>
              <li>EIQ dashboard build - Display list of current EIQ licences and show their added value relative to client's EHQ licence</li>
              <li>LTV dashboard - there are a number of different formulas for calculating this. Create dynamic chart that can show results using different calculation methods</li>
              <li>Create board report option that automatically outputs a set of specific charts and table combinations in an exportable format</li>
              <li>Add a toggle button on main dashboard that switches the dislpay of all figures to show current quarter rather than just previous month(current view)</li>
              <li>Track "Expansion": Increase in revenue when when a client renews, we sell more than their previous licence, or if renew clients on to a higher EIQ package</li>
              <li>Toggle to switch main dashboard to dislpay all figures in any chosen currency</li>

            </ul>
            <h3 style={{ fontFamily: 'Titillium Web' }}>Non data related site improvements</h3>
            <ul style={{ fontFamily: 'Titillium Web' }}>
              <li>Add basic invoice search page. Not as a dashboard. Link to this will be in the header</li>
              <li>Need a "Loading" icon for when toggling options take a while to reload. A lot of number crunching in Client Churn causing some lag</li>
              <li>Consider changing layout. Maybe make things smaller, or use more width of screen</li>
              <li>Add current forex rates on main screen</li>
              <li>Create funcionality for people to make comments</li>
              <li>Create ability to export tables to a google sheet</li>
              <li>Templates to create printer/PDF friendly nicely formatted reports</li>
              <li>Code should be refactored to make it more dry</li>
            </ul>
          </Segment>

          <Segment color="yellow" style={{ width: 1079, paddingTop: 24, fontFamily: 'Titillium Web' }}>
            <h1 style={{ fontFamily: 'Titillium Web' }}>
              What's New
            </h1>

            <h3 style={{ fontFamily: 'Titillium Web' }}>23 October 2019</h3>

            <h4 style={{ fontFamily: 'Titillium Web' }}>Recurring Revenue</h4>
            <ul style={{ fontFamily: 'Titillium Web' }}>
              <li>Time travel back to any month by clicking it in graph to show that month's details below<Icon name="check green"></Icon></li>
            </ul>

            <h3 style={{ fontFamily: 'Titillium Web' }}>22 October 2019</h3>

            <h4 style={{ fontFamily: 'Titillium Web' }}>Recurring Revenue</h4>
            <ul style={{ fontFamily: 'Titillium Web' }}>
              <li>Show total of current month in AUD<Icon name="check green"></Icon></li>
              <li>Display forex exchange rates for current months's calculations<Icon name="check green"></Icon></li>
              <li>Add toggle for adding non recurring revenue for current month<Icon name="check green"></Icon></li>
              <li>When include non recurring toggle is selected, table appears below with details of non recurring products invoiced in current month <Icon name="check green"></Icon></li>
            </ul>

            <h3 style={{ fontFamily: 'Titillium Web' }}>19 October 2019</h3>

            <h4 style={{ fontFamily: 'Titillium Web' }}>Churn</h4>
            <ul style={{ fontFamily: 'Titillium Web' }}>
              <li>Display MRR value lost and added<Icon name="check green"></Icon></li>
              <li>Display forex exchange rates that are being used in current months's calculations<Icon name="check green"></Icon></li>
              <li>Fix formatting of currencies displayed in subheadings and in table data<Icon name="check green"></Icon></li>
            </ul>
            <br />
            <Button basic
              compact color='orange' style={{ cursor: 'pointer', size: 11 }} onClick={() => this.setState((prevState) => ({ selected: 'Select Chart' }))}><Icon name="arrow left"></Icon>Back to Dashboard</Button>
          </Segment>

        </div >
      )
    }
  }

  render() {

    if (!this.props.auth) {
      return null
    }

    return (
      <div style={{ fontFamily: 'Titillium Web', paddingBottom: 200 }}>
        {this.newDashboard()}
        {this.renderDashboard()}
        {this.displayWhatsNext()}
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Dashboard)
