import React, { Component } from 'react'
import { Popup, Grid, Checkbox, Segment, Button, Card, Dropdown, Form, Radio } from 'semantic-ui-react'
import Chart from 'react-google-charts'

class Churn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      clients: [],
      terText: "",
      showTable: false,
      currentMonth: "",
      currentPrevMonth: "",
      currrentMonthNumber: 0,
      selectedMonth: 0,
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

  componentDidMount() {
    this.createMonthsArray()
    this.setStartingMonth()
  }

  checkTableToggle = () => {
    if (this.state.annualOn === false && this.state.projectOn === false && this.state.staticOn === false && this.state.budgetOn === false) {
      this.setState((prevState) => ({ showTable: false }), this.setStartingMonth)
    }
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

  setStartingMonth = () => {
    let monthsOfYear = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ]

    let startingMonthNumber = this.state.months.length - 3

    let month = monthsOfYear[this.state.months[this.state.months.length - 2].getMonth()]
    let year = this.state.months[this.state.months.length - 2].getFullYear()

    let prevMonth = monthsOfYear[this.state.months[this.state.months.length - 3].getMonth()]
    let prevYear = this.state.months[this.state.months.length - 3].getFullYear()

    let theDate = month + " " + year
    let thePrevDate = prevMonth + " " + prevYear

    this.setState((prevState) => ({ currentMonth: theDate, currentPrevMonth: thePrevDate, selectedMonth: startingMonthNumber }))
  }

  setChangedMonth = () => {
    let monthsOfYear = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ]

    let month = this.state.selectedMonth
    let year = this.state.months[this.state.selectedMonth].getFullYear()

    let prevMonth = this.state.selectedMonth - 1

    let monthDisp
    let prevMonthDisp
    let prevYear

    if (this.state.selectedMonth > -1) {
      monthDisp = monthsOfYear[this.state.months[month + 1].getMonth()]
      prevMonthDisp = monthsOfYear[this.state.months[prevMonth + 1].getMonth()]
      prevYear = this.state.months[this.state.selectedMonth].getFullYear()
    }

    if (monthDisp == "January") {
      year++
    }

    let theDate = monthDisp + " " + year
    let thePrevDate = prevMonthDisp + " " + prevYear

    this.setState((prevState) => ({ currentMonth: theDate, currentPrevMonth: thePrevDate }))
  }

  handleClickAnnual = () => {
    if (this.state.annualOn) {
      this.setState((prevState) => ({ annual: "" }))
    } else {
      this.setState((prevState) => ({ annual: "Annual" }))
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ annualActive: !prevState.annualActive, annualOn: !prevState.annualOn, showTable: true }), this.totalGlobalClients)
    } else {
      this.setState((prevState) => ({ annualActive: !prevState.annualActive, annualOn: !prevState.annualOn, loadButtonActive: true, showTable: true }), this.totalClients)
    }
  }

  handleClickProject = () => {
    if (this.state.projectOn) {
      this.setState((prevState) => ({ project: "" }))
    } else {
      this.setState((prevState) => ({ project: "Project" }))
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ projectActive: !prevState.projectActive, projectOn: !prevState.projectOn, loadButtonActive: true, showTable: true }), this.totalGlobalClients)
    } else {
      this.setState((prevState) => ({ projectActive: !prevState.projectActive, projectOn: !prevState.projectOn, loadButtonActive: true, showTable: true }), this.totalClients)
    }
  }

  handleClickStatic = () => {
    if (this.state.staticOn) {
      this.setState((prevState) => ({ static: "" }))
    } else {
      this.setState((prevState) => ({ static: "Static" }))
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ staticActive: !prevState.staticActive, staticOn: !prevState.staticOn, loadButtonActive: true, showTable: true }), this.totalGlobalClients)
    } else {
      this.setState((prevState) => ({ staticActive: !prevState.staticActive, staticOn: !prevState.staticOn, loadButtonActive: true, showTable: true }), this.totalClients)
    }
  }

  handleClickBudget = () => {
    if (this.state.budgetOn) {
      this.setState((prevState) => ({ budget: "" }))
    } else {
      this.setState((prevState) => ({ budget: "Budget Allocator" }))
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ budgetActive: !prevState.budgetActive, budgetOn: !prevState.budgetOn, loadButtonActive: true, showTable: true }), this.totalGlobalClients)
    } else {
      this.setState((prevState) => ({ budgetActive: !prevState.budgetActive, budgetOn: !prevState.budgetOn, loadButtonActive: true, showTable: true }), this.totalClients)
    }
  }

  updateChurnTer = () => {
    if (this.state.churnTer === "Australia") {
      this.setState((prevState) => ({ churnTer: "AUS", terText: "Australia", chartColor: ["#8CD75C"] }), this.totalClients)
    }
    if (this.state.churnTer === "Canada") {
      this.setState((prevState) => ({ churnTer: "CAN", terText: "Canada", chartColor: ["#fcba03"] }), this.totalClients)
    }
    if (this.state.churnTer === "United States") {
      this.setState((prevState) => ({ churnTer: "USA", terText: "United States", chartColor: ["#F28E7C"] }), this.totalClients)
    }
    if (this.state.churnTer === "United Kingdom") {
      this.setState((prevState) => ({ churnTer: "UK", terText: "U.K.", chartColor: ["#03fcd7"] }), this.totalClients)
    }
    if (this.state.churnTer === "New Zealand") {
      this.setState((prevState) => ({ churnTer: "NZ", terText: "New Zealand", chartColor: ["#F27CEA"] }), this.totalClients)
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ churnTer: "Global", terText: "Global", chartColor: ["#2B85D0"] }), this.totalGlobalClients)
    }
  }

  totalGlobalClients = () => {
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

    for (let k = 0; k < churn.length - 1; k++) {
      churnArray.push([new Date(2015, k + 8, 0), ((churn[k][0] / (churn[k][1] + churn[k][2])) * 100)])
    }

    this.setState((prevState) => ({
      chartData: churnArray
    }), this.checkTableToggle)
  }

  getLostValue = () => {
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
  }

  getExpansion = () => {
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
    this.setStartingMonth()
    event.persist()
    this.setState((prevState) => ({ churnTer: event.target.textContent }), this.updateChurnTer)
  }

  displayTable = () => {
    if (this.state.showTable) {
      return (
        <div style={{ paddingTop: 12, paddingBottom: 30 }}>
          <Segment style={{ width: 1079 }}>
            <Grid>
              <Grid.Column width={4}>
                <Segment>
                  <h3 style={{ textAlign: "center" }}>Total Clients Lost in<br />{this.state.currentMonth}</h3>
                  <h2 style={{ textAlign: "center" }}>{this.state.lost[this.state.selectedMonth].length}</h2>
                  <ul>
                    {this.state.lost[this.state.selectedMonth].map((client, index) => (
                      <li key={index}>{client}</li>
                    ))}
                  </ul>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment>
                  <h3 style={{ textAlign: "center" }}>Total Clients Added in<br />{this.state.currentMonth}</h3>
                  <h2 style={{ textAlign: "center" }}>{this.state.new[this.state.selectedMonth].length}</h2>
                  <ul>
                    {this.state.new[this.state.selectedMonth].map((client, index) => (
                      <li key={index}>{client}</li>
                    ))}
                  </ul>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment>
                  <h3 style={{ textAlign: "center" }}>Total Clients At End of<br />{this.state.currentPrevMonth}</h3>
                  <h2 style={{ textAlign: "center" }}>{this.state.forChurnForumla[this.state.selectedMonth][2]}</h2>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <div>
                  <Segment>
                    <h3 style={{ textAlign: "center" }}>Churn Calculation<br />{this.state.currentMonth} </h3>
                    <h2 style={{ textAlign: "center" }}>{this.state.forChurnForumla[this.state.selectedMonth][0]} ÷ ({this.state.forChurnForumla[this.state.selectedMonth][1]} + {this.state.forChurnForumla[this.state.selectedMonth][2]})</h2>
                    {/* <h1 style={{ textAlign: "center" }}>({this.state.forChurnForumla[this.state.forChurnForumla.length - 2][1]} + {this.state.forChurnForumla[this.state.forChurnForumla.length - 4][2]})</h1> */}
                    <h2 style={{ textAlign: "center" }}> = {this.state.chartData[this.state.selectedMonth + 1][1].toFixed(2)}%</h2>
                    <div style={{ textAlign: "center" }}>
                      <Popup
                        content='The Monthly Churn rate here is calculated by dividing the number of clients we lost last month by the number of new clients added to the number of clients we had before the month started' trigger={<Button icon='calculator' />}
                      />
                    </div>
                  </Segment>
                </div>
              </Grid.Column>
            </Grid>
          </Segment>
        </div >
      )
    }
  }

  displayChartMonth = () => {
    if (this.state.showTable) {
      return (
        <div style={{ paddingTop: 14 }}>
          <Segment style={{ width: 1079 }}>
            <h1 style={{ textAlign: "center" }}>{this.state.currentMonth}</h1>
            <h2 style={{ textAlign: "center" }}>{this.state.forChurnForumla[this.state.selectedMonth + 1][2]} Clients</h2>
            <h3 style={{ textAlign: "center" }}>{this.state.terText}</h3>
          </Segment>
        </div >
      )
    }
  }

  scrollToTable = () => {
    window.scrollTo({ top: 810, bottom: 0, behavior: 'smooth' })
  }

  displayChart = () => {
    const headingStyle = {
      textAlign: 'center'
    }

    const chartEvents = [
      {
        eventName: "select",
        options: {
          tooltip: {
            trigger: "selection"
          }
        },
        callback: ({ chartWrapper }) => {
          const chart = chartWrapper.getChart().getSelection()[0].row;
          this.setState((prevState) => ({ selectedMonth: chart }), this.scrollToTable)
          this.setChangedMonth()
        }
      }
    ]

    const { annualActive, projectActive, staticActive, budgetActive } = this.state
    if (this.state.chartData.length > 2) {
      return (
        <Grid columns='equal' style={{ width: 1300 }}>
          <Grid.Column>
            <Segment style={{ width: 70, height: 513 }}>
              <br />
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
            </Segment>
          </Grid.Column>
          <Grid.Column width={15}>
            <Segment style={{ width: 1000 }}>
              <div>
                <Chart
                  width={'984px'}
                  height={'484px'}
                  chartEvents={chartEvents}
                  chartType="ScatterChart"
                  crosshair={{ trigger: "selection" }}
                  tooltip={{ trigger: "selection" }}
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
                    legend: 'none',
                    'chartArea': { 'width': '90%', 'height': '80%' },
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
                      }
                    }
                  }}
                />
              </div>
            </Segment>
          </Grid.Column>
        </Grid>
      )
    }
  }

  render() {
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

        {this.displayChartMonth()}

        {this.displayTable()}

      </div>
    )
  }

}

export default Churn