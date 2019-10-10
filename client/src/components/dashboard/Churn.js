import React, { Component } from 'react'
import { Grid, Checkbox, Segment, Button, Card, Dropdown, Form, Radio } from 'semantic-ui-react'
import Chart from 'react-google-charts'

class Churn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      clients: [],
      detail: [],
      lost: [],
      new: [],
      months: [],
      lostTest: [],
      newTest: [],
      totalTest: [],
      totalText: [],
      annualOn: false,
      projectOn: false,
      staticOn: false,
      budgetOn: false,
      chartColor: [],
      forChurnForumla: [],
      monthsText: [],
      chartData: [
        [],
        []
      ],
      totalLost: [],
      churnTer: "",
      terOptions: [{
        key: "Global",
        text: "Global",
        value: "Global"
      }, {
        key: "AUS",
        text: "Australia",
        value: "AUS"
      }, {
        key: "CAN",
        text: "Canada",
        value: "CAN"
      }, {
        key: "USA",
        text: "United States",
        value: "USA"
      }, {
        key: "UK",
        text: "United Kingdom",
        value: "UK"
      }, {
        key: "NZ",
        text: "New Zealand",
        value: "NZ"
      }]
    }

    this.totalClients = this.totalClients.bind(this)
    this.totalClientsDetail = this.totalClientsDetail.bind(this)
    this.getLostValue = this.getLostValue.bind(this)
    this.getExpansion = this.getExpansion.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleClickAnnual = this.handleClickAnnual.bind(this)
    this.handleClickProject = this.handleClickProject.bind(this)
    this.handleClickStatic = this.handleClickStatic.bind(this)
    this.handleClickBudget = this.handleClickBudget.bind(this)
  }

  handleClickAnnual = () => {
    if (this.state.annualOn) {
      this.setState((prevState) => ({ annual: "" }))
    } else {
      this.setState((prevState) => ({ annual: "Annual" }))
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ annualActive: !prevState.annualActive, annualOn: !prevState.annualOn, loadButtonActive: true }), this.totalGlobalClients)
    } else {
      this.setState((prevState) => ({ annualActive: !prevState.annualActive, annualOn: !prevState.annualOn, loadButtonActive: true }), this.totalClients)
    }
  }

  handleClickProject = () => {
    if (this.state.projectOn) {
      this.setState((prevState) => ({ project: "" }))
    } else {
      this.setState((prevState) => ({ project: "Project" }))
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ projectActive: !prevState.projectActive, projectOn: !prevState.projectOn, loadButtonActive: true }), this.totalGlobalClients)
    } else {
      this.setState((prevState) => ({ projectActive: !prevState.projectActive, projectOn: !prevState.projectOn, loadButtonActive: true }), this.totalClients)
    }
  }

  handleClickStatic = () => {
    if (this.state.staticOn) {
      this.setState((prevState) => ({ static: "" }))
    } else {
      this.setState((prevState) => ({ static: "Static" }))
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ staticActive: !prevState.staticActive, staticOn: !prevState.staticOn, loadButtonActive: true }), this.totalGlobalClients)
    } else {
      this.setState((prevState) => ({ staticActive: !prevState.staticActive, staticOn: !prevState.staticOn, loadButtonActive: true }), this.totalClients)
    }
  }

  handleClickBudget = () => {
    if (this.state.budgetOn) {
      this.setState((prevState) => ({ budget: "" }))
    } else {
      this.setState((prevState) => ({ budget: "Budget Allocator" }))
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ budgetActive: !prevState.budgetActive, budgetOn: !prevState.budgetOn, loadButtonActive: true }), this.totalGlobalClients)
    } else {
      this.setState((prevState) => ({ budgetActive: !prevState.budgetActive, budgetOn: !prevState.budgetOn, loadButtonActive: true }), this.totalClients)
    }
  }

  updateChurnTer = () => {
    if (this.state.churnTer === "Australia") {
      this.setState((prevState) => ({ churnTer: "AUS", chartColor: ["#8CD75C"] }), this.totalClients)
    }
    if (this.state.churnTer === "Canada") {
      this.setState((prevState) => ({ churnTer: "CAN", chartColor: ["#EAE477"] }), this.totalClients)
    }
    if (this.state.churnTer === "United States") {
      this.setState((prevState) => ({ churnTer: "USA", chartColor: ["#F28E7C"] }), this.totalClients)
    }
    if (this.state.churnTer === "United Kingdom") {
      this.setState((prevState) => ({ churnTer: "UK", chartColor: ["#7CF2E4"] }), this.totalClients)
    }
    if (this.state.churnTer === "New Zealand") {
      this.setState((prevState) => ({ churnTer: "NZ", chartColor: ["#F27CEA"] }), this.totalClients)
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ churnTer: "Global", chartColor: ["#2B85D0"] }), this.totalGlobalClients)
    }
  }

  totalGlobalClients = () => {
    this.setState((prevState) => ({ months: [], monthsText: [] }))
    this.createMonthsArray()
    const total = []

    this.state.months.forEach((month) => {
      let counter = []

      this.props.rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]

        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month && (
          invoice["product"] === this.state.annual ||
          invoice["product"] === this.state.project ||
          invoice["product"] === this.state.static ||
          invoice["product"] === this.state.budget
        )) {
          counter.push(invoice["client"])
        }
      })

      const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
      }

      let uniqClients = counter.filter(onlyUnique)

      total.push(uniqClients)
    })

    this.setState(prevState => ({
      clients: [...total]
    }), this.totalGlobalClientsDetail)

    return null
  }

  totalGlobalClientsDetail = () => {
    this.setState((prevState) => ({ months: [], monthsText: [] }))
    this.createMonthsArray()
    const total = []

    this.state.months.forEach((month) => {
      let counter = []

      this.props.rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month && (
          invoice["product"] === this.state.annual ||
          invoice["product"] === this.state.project ||
          invoice["product"] === this.state.static ||
          invoice["product"] === this.state.budget
        )) {
          counter.push(invoice)
        }
      })

      total.push(counter)
    })

    this.setState(prevState => ({
      detail: [...total]
    }), this.getLostClients)

    return null
  }


  totalClients() {
    this.setState((prevState) => ({ months: [], monthsText: [] }))
    this.createMonthsArray()
    const total = []

    this.state.months.forEach((month) => {
      let counter = []

      this.props.rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month && (invoice["territory"] === this.state.churnTer) && (
          invoice["product"] === this.state.annual ||
          invoice["product"] === this.state.project ||
          invoice["product"] === this.state.static ||
          invoice["product"] === this.state.budget
        )) {
          counter.push(invoice["client"])
        }
      })

      const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
      }

      let uniqClients = counter.filter(onlyUnique)

      total.push(uniqClients)
    })

    this.setState(prevState => ({
      clients: [...total]
    }), this.totalClientsDetail)

    return null
  }


  totalClientsDetail() {
    this.setState((prevState) => ({ months: [], monthsText: [] }))
    this.createMonthsArray()
    const total = []

    this.state.months.forEach((month) => {
      let counter = []

      this.props.rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month
          && (invoice["territory"] === this.state.churnTer) && (
            invoice["product"] === this.state.annual ||
            invoice["product"] === this.state.project ||
            invoice["product"] === this.state.static ||
            invoice["product"] === this.state.budget
          )
        ) {
          counter.push(invoice)
        }
      })

      total.push(counter)
    })

    this.setState(prevState => ({
      detail: [...total]
    }), this.getLostClients)

    return null

  }

  getLostClients = () => {
    this.setState((prevState) => ({ months: [], monthsText: [] }))
    this.createMonthsArray()
    let lostClients = []
    let lostClientsArray = []

    for (let i = 0; i < this.state.months.length - 1; i++) {
      lostClients = []
      this.state.clients[i].forEach((client) => this.state.clients[i + 1].includes(client) ? null : lostClients.push(client))
      lostClientsArray.push(lostClients)


    }
    let holdingArray = []
    for (let k = 0; k < lostClientsArray.length - 1; k++) {
      holdingArray.push([k + 1, lostClientsArray[k].length])
    }

    this.setState(previous => ({
      lost: [...lostClientsArray]
    }), this.getNewClients)
  }

  getNewClients = () => {
    this.setState((prevState) => ({ months: [], monthsText: [] }))
    this.createMonthsArray()
    let newClients = []
    let newClientsArray = []

    for (let i = 0; i < this.state.months.length - 1; i++) {
      newClients = []
      this.state.clients[i + 1].forEach((client) => {
        if (!this.state.clients[i].includes(client)) {
          newClients.push(client)
        }
      })
      newClientsArray.push(newClients)
    }

    let holdingArray = []
    for (let i = 0; i < newClientsArray.length - 1; i++) {
      holdingArray.push([i + 1, newClientsArray[i].length])
    }

    this.setState(previous => ({
      new: [...newClientsArray],
      newTest: [...holdingArray]
    }), this.getPrevTotal)


  }

  getPrevTotal = () => {
    let holdingArray = []
    this.state.clients.forEach((month) => {
      holdingArray.push(month.length)
    })

    this.setState((prevState) => ({
      totalTest: [...holdingArray]
    }), this.createChurnDataArray)

  }

  createChurnDataArray = () => {
    let churnDataArray = []

    for (let i = 0; i < this.state.lost.length; i++) {
      churnDataArray.push([this.state.lost[i].length, this.state.new[i].length, this.state.totalTest[i]])
    }

    this.setState((prevState => ({
      forChurnForumla: churnDataArray
    })), this.calculateChurn)
  }

  calculateChurn = () => {
    let lost = this.state.forChurnForumla[0][0]
    let news = this.state.forChurnForumla[0][1]
    let prevTotal = this.state.forChurnForumla[0][2]

    let churn = this.state.forChurnForumla
    let churnArray = [['TERRITORY', this.state.churnTer]]

    if (this.state.churnTer === "USA" || this.state.churnTer === "NZ" || this.state.churnTer === "UK") {
      for (let k = 9; k < churn.length - 1; k++) {
        churnArray.push([new Date(2015, k + 8, 0), ((churn[k][0] / (churn[k][1] + churn[k][2])) * 100)])
      }
    } else {
      for (let k = 0; k < churn.length - 1; k++) {
        churnArray.push([new Date(2015, k + 8, 0), ((churn[k][0] / (churn[k][1] + churn[k][2])) * 100)])
      }
    }

    this.setState((prevState) => ({
      chartData: churnArray
    }))

  }

  createMonthsArray = () => {
    const numberOfMonths = this.getNumberOfMonthsSinceJuly2015()

    let year = 2015
    let yearStep = 12

    for (let step = 0; step < numberOfMonths; step++) {
      let month = 7
      month += step

      if ((month % 12) === 0) {
        month = 12
      } else {
        month = month % 12
      }

      if (step >= 6) {
        yearStep++
        year = Math.floor(yearStep / 12) + 2015
        if (yearStep % 12 === 0) {
          year -= 1
        }
      }

      this.state.months.push(new Date(year, month, 0))
      this.state.monthsText.push(new Date(year, month, 0).toLocaleDateString().split(',')[0])
    }
  }

  getNumberOfMonthsSinceJuly2015 = () => {
    let today = new Date()
    let thisMonth = today.getMonth()
    let thisYear = today.getFullYear()
    let monthsOfYears = (thisYear - (2015 + 1)) * 12
    return monthsOfYears + thisMonth + 7
  }


  getLostValue = () => {
    this.setState((prevState) => ({ months: [], monthsText: [] }))
    this.createMonthsArray()
    let lostValue = []
    let lostValueArray = []

    if (this.state.lost.length > 0) {
      for (let i = 0; i < this.state.months.length - 1; i++) {
        lostValue = []
        this.state.lost[i].forEach((lostClient) => {
          let pos = this.state.detail[i].findIndex(i => i.client === lostClient)
          lostValue.push(this.state.detail[i][pos]["valuepermonth"])
        })
        lostValueArray.push(+lostValue.reduce((a, b) => a + b, 0).toFixed(2))
      }
    }

    //console.log(lostValueArray)
  }

  getExpansion = () => {
    this.setState((prevState) => ({ months: [], monthsText: [] }))
    this.createMonthsArray()
    let expanseValue = []
    let expanseValueArray = []


    if (this.state.new.length > 0) {
      for (let i = 0; i < this.state.months.length - 1; i++) {

        expanseValue = []
        this.state.new[i].forEach((newClient) => {
          let pos = this.state.detail[i + 1].findIndex(i => i.client === newClient)

          expanseValue.push(this.state.detail[i + 1][pos]["valuepermonth"])
        })

        expanseValueArray.push(+expanseValue.reduce((a, b) => a + b, 0).toFixed(2))
      }
    }
  }

  handleSelection = (event, data) => {
    event.persist()
    this.setState((prevState) => ({ churnTer: event.target.textContent }), this.updateChurnTer)
  }

  displayTable = () => {
    if (!isNaN(this.state.chartData[1][1])) {
      return (
        <div style={{ paddingTop: 12, paddingBottom: 30 }}>
          <Segment style={{ width: 1079 }}>
            <Grid>
              <Grid.Column width={4}>
                <Segment>
                  <h3 style={{ textAlign: "center" }}>Total Clients Lost September 2019</h3>
                  <h2 style={{ textAlign: "center" }}>{this.state.lost[this.state.lost.length - 2].length}</h2>
                  <ul>
                    {this.state.lost[this.state.lost.length - 2].map((client, index) => (
                      <li key={index}>{client}</li>
                    ))}
                  </ul>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment>
                  <h3 style={{ textAlign: "center" }}>Total Clients Added September 2019</h3>
                  <h2 style={{ textAlign: "center" }}>{this.state.new[this.state.new.length - 2].length}</h2>
                  <ul>
                    {this.state.new[this.state.new.length - 2].map((client, index) => (
                      <li key={index}>{client}</li>
                    ))}
                  </ul>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment>
                  <h3 style={{ textAlign: "center" }}>Total Clients At End of August 2019</h3>
                  <h2 style={{ textAlign: "center" }}>{this.state.forChurnForumla[this.state.forChurnForumla.length - 2][2]}</h2>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment>
                  <h3 style={{ textAlign: "center" }}>Monthly Churn Calculation</h3>
                  <h1 style={{ textAlign: "center" }}>{this.state.forChurnForumla[this.state.forChurnForumla.length - 2][0]} ÷ ({this.state.forChurnForumla[this.state.forChurnForumla.length - 2][1]} + {this.state.forChurnForumla[this.state.forChurnForumla.length - 2][2]})</h1>
                  {/* <h1 style={{ textAlign: "center" }}>({this.state.forChurnForumla[this.state.forChurnForumla.length - 2][1]} + {this.state.forChurnForumla[this.state.forChurnForumla.length - 4][2]})</h1> */}
                  <h1 style={{ textAlign: "center" }}> = {this.state.chartData[this.state.chartData.length - 1][1].toFixed(2)}%</h1>
                </Segment>
              </Grid.Column>
            </Grid>
          </Segment>
        </div >
      )
    }
  }

  displayChart = () => {
    const headingStyle = {
      textAlign: 'center'
    }
    const { annualActive, projectActive, staticActive, budgetActive } = this.state
    if (this.state.chartData.length > 2) {
      return (
        <Grid columns='equal' style={{ width: 1300 }}>
          <Grid.Column>
            <Segment style={{ width: 70, height: 513 }}>
              <br />
              <div>
                Annual
                <br />
                <br />
                <Checkbox toggle active={annualActive} onClick={this.handleClickAnnual} />
              </div>

              <br />
              <div>
                Project
                <br />
                <br />
                <Checkbox toggle active={projectActive} onClick={this.handleClickProject} />
              </div>

              <br />
              <div>
                Static
                <br />
                <br />
                <Checkbox toggle active={staticActive} onClick={this.handleClickStatic} />
              </div>
              <br />

              <div>
                Budget
                <br />
                <br />
                <Checkbox toggle active={budgetActive} onClick={this.handleClickBudget} />
              </div>
              <br />
              <br />
              <div style={headingStyle}>
                <br />
                <br />
              </div>
              {/* <div>
  <Button primary disabled={!this.state.loadButtonActive} onClick={this.totalClients}>
    Load Chart
  </Button>
</div> */}
            </Segment>
          </Grid.Column>
          <Grid.Column width={15}>
            <Segment style={{ width: 1000 }}>
              <div>
                <Chart
                  width={'984px'}
                  height={'484px'}
                  chartType="ScatterChart"
                  loader={<div>Loading Chart</div>}
                  data={this.state.chartData}
                  options={{
                    'vAxis': {
                      'title': 'Churn %'
                    },
                    'hAxis': {
                      'title': 'Date',
                      'format': 'MMM-yy'
                    },
                    'legend': { 'position': 'top' },
                    'chartArea': { 'width': '80%', 'height': '80%' },
                    subtitle: 'in millions of dollars (USD)',
                    crosshair: { trigger: 'both', orientation: 'both' },
                    colors: this.state.chartColor,
                    animation: {
                      startup: true,
                      easing: 'linear',
                      duration: 750,
                    },
                    trendlines: {
                      0: {
                        type: 'polynomial',
                        degree: 3,
                        labelInLegend: 'Trend'
                      },
                      1: {
                        type: 'polynomial',
                        degree: 3,
                        labelInLegend: 'Trend'
                      },
                      2: {
                        type: 'polynomial',
                        degree: 3,
                        labelInLegend: 'Trend'
                      },
                      3: {
                        type: 'polynomial',
                        degree: 3,
                        labelInLegend: 'Trend'
                      },
                    }
                  }}
                />
              </div>
              <div></div>
              <div>

              </div>


            </Segment>
          </Grid.Column>
        </Grid>



      )
    }
  }

  render() {
    { console.log(this.state.forChurnForumla[this.state.forChurnForumla.length - 1]) }
    const headingStyle = {
      textAlign: 'center'
    }

    const radioStyle = {
      textAlign: 'left'
    }

    const { value } = this.state
    return (
      <div style={{ paddingTop: 20 }}>
        <Segment style={{ width: 1079 }} >
          <div>
            <Dropdown
              placeholder="Select Territory"
              selection
              onChange={this.handleSelection}
              options={this.state.terOptions}
              value={value}
            />
          </div>
        </Segment>

        {this.displayChart()}


        {this.displayTable()}

      </div>

    )
  }
}

export default Churn