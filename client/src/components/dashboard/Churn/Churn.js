import React, { Component } from 'react'
import { Dimmer, Loader, Icon, Flag, Grid, Checkbox, Segment, Button } from 'semantic-ui-react'
import Chart from 'react-google-charts'
import { HotTable } from '@handsontable/react';
import DataIn from '../DataIn'
import ChurnDollars from './ChurnDollars'

import DisplayMonth from '../DisplayMonth'

class Churn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      churnDollars: false,
      clients: [],
      currentColor: "blue",
      renderSwitch: true,
      dimmer: false,
      amounts: [],
      newValues: [],
      forexData: props.forexData,
      lostValues: [],
      churnTotalInAud: 0,
      addedTotalInAud: 0,
      terText: "",
      lostValuesForTable: [],
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
      totalTest: [],
      totalText: [],
      annual: "Annual",
      project: "Project",
      static: "Static",
      budget: "Budget Allocator",
      annualActive: true,
      projectActive: true,
      budgetActive: true,
      staticActive: true,
      annualOn: true,
      projectOn: true,
      staticOn: true,
      budgetOn: true,
      chartColor: [],
      forChurnForumla: [],
      monthsText: [],
      chartData: [
        [],
        []
      ],
      totalLost: [],
      churnTer: "Global",
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
      }],
      table: {
        colHeadersLost: ["Client", "Status", "MRR", "Location", "Currency", "Invoice", "Date", "Licence", "Start", "End", "Total"],
        colHeadersNew: ["Client", "MRR", "Location", "Currency", "Invoice", "Date", "Licence", "Start", "End", "Total"]
      }
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
    this.updateChurnTer()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.renderSwitch !== this.state.renderSwitch)
      return true
    return false
  }

  checkTableToggle = () => {
    if (this.state.annualOn === false && this.state.projectOn === false && this.state.staticOn === false && this.state.budgetOn === false) {
      this.setState((prevState) => ({ showTable: false, renderSwitch: !prevState.renderSwitch }), this.setStartingMonth)
    } else {
      this.setState((prevState) => ({ showTable: true, renderSwitch: !prevState.renderSwitch }), this.getData)
    }
  }

  createMonthsArray = () => {
    const numberOfMonths = DataIn.MonthNumber

    let year = 2015
    let yearStep = 12
    let months = []
    let monthsText = []

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

      months.push(new Date(year, month, 0))

      monthsText.push(new Date(year, month, 0).toLocaleDateString("en-GB").split(',')[0])
    }

    this.setState({ months, monthsText }, this.setStartingMonth)
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

    this.setState((prevState) => ({ currentMonth: theDate, currentPrevMonth: thePrevDate, selectedMonth: startingMonthNumber }), this.getData)
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

    if (monthDisp === "January") {
      year++
    }

    let theDate = monthDisp + " " + year
    let thePrevDate = prevMonthDisp + " " + prevYear

    this.setState((prevState) => ({ currentMonth: theDate, currentPrevMonth: thePrevDate }), this.getValuesForLostClients)
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

  handleChartSelection = () => {
    if(this.state.churnDollars) {
      this.setState(prevState => ({churnDollars: false, renderSwitch: !prevState.renderSwitch}), this.createMonthsArray)
    } else {
      this.setState(prevState => ({churnDollars: true, renderSwitch: !prevState.renderSwitch}), this.createMonthsArray)
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
      new: [...newClientsArray]
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
    let churn = this.state.forChurnForumla
    let churnArray = [['Date', this.state.churnTer]]

    for (let k = 0; k < churn.length - 1; k++) {
      churnArray.push([new Date(2015, k + 8, 0), ((churn[k][0] / (churn[k][1] + churn[k][2])) * 100)])
    }

    this.setState((prevState) => ({
      chartData: churnArray
    }), this.getValuesForLostClients)
  }

  getValuesForLostClients = () => {
    let selectedMonth = this.state.selectedMonth
    let endOfThisMonth = this.state.months[selectedMonth + 1]
    let endOfLastMonth = this.state.months[selectedMonth] - 86400000

    let details = this.state.lost
    let holderArray = []
    for (let i = 0; i < this.state.months.length - 2; i++) {
      let holder = []
      for (let k = 0; k < details[i].length; k++) {
        this.props.rawData.forEach((invoice) => {
          let endString = invoice["end"]
          let endDateParts = endString.split("/")
          let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

          if (invoice["client"] === details[i][k]) {
            if ((end < endOfThisMonth && end > endOfLastMonth)) {
              holder.push([
                invoice["client"],
                invoice["status"],
                invoice["valuepermonth"],
                invoice["territory"],
                invoice["currency"],
                invoice["invoice"],
                invoice["date"],
                invoice["product"],
                invoice["start"],
                invoice["end"],
                invoice["total"]
              ])
            }
          }
        })
      }
      holderArray.push(holder)
    }
    this.setState((prevState) => ({ lostValues: holderArray }), this.getChurnTotalInAud)
  }

  getValuesForNewClients = () => {
    let selectedMonth = this.state.selectedMonth
    let startfThisMonth = this.state.months[selectedMonth + 1]
    let startOfLastMonth = this.state.months[selectedMonth]

    let details = this.state.new
    let holderArray = []

    for (let i = 0; i < this.state.months.length - 2; i++) {
      let holder = []
      for (let k = 0; k < details[i].length; k++) {
        this.props.rawData.forEach((invoice) => {
          let startString = invoice["start"]
          let startDateParts = startString.split("/")
          let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
          if (invoice["client"] === details[i][k]) {
            if ((start <= startfThisMonth) && (start > startOfLastMonth)) {
              holder.push([
                invoice["client"],
                invoice["valuepermonth"],
                invoice["territory"],
                invoice["currency"],
                invoice["invoice"],
                invoice["date"],
                invoice["product"],
                invoice["start"],
                invoice["end"],
                invoice["total"]
              ])
            }
          }
        })
      }
      holderArray.push(holder)
    }

    this.setState((prevState) => ({ newValues: holderArray }), this.getAddedTotalInAud)
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

  displayChurnTable = () => {
    return (
      <div>
        <Segment color="blue" style={{ width: 1079 }}>
          <div>
            <h3 style={{ fontFamily: 'Titillium Web' }}>Clients who didn't renew in {this.state.currentMonth}</h3>
            <HotTable
              licenseKey="non-commercial-and-evaluation"
              className={"htCenter"}
              style={{ fontSize: 10, color: 'black' }}
              cells={function (row, col) {
                var cellPrp = {};
                if (col === 0) {
                  cellPrp.className = 'htLeft'
                } else if (col === 10) {
                  cellPrp.className = 'htRight'
                } else if (col === 9) {
                  cellPrp.className = "htRight"
                } else {
                  cellPrp.className = "htCenter"
                }
                return cellPrp
              }
              }
              htDimmed
              manualColumnResize
              wordWrap={false}
              // height={400}
              editor={false}
              filters={true}
              columns={[{}, {}, { type: "numeric", numericFormat: { pattern: "0,00.00" } }, {}, {}, {}, { type: "date" }, {}, { type: "date" }, { type: "date" }, { type: "numeric", numericFormat: { pattern: "0,00.00" } }]}
              columnSorting={true}
              colWidths={[350, 100, 55, 50, 50, 50, 70, 52, 70, 70, 60]}
              rowHeaders={true}
              colHeaders={this.state.table.colHeadersLost}
              data={this.state.lostValues[this.state.selectedMonth]} />
          </div>
        </Segment>
      </div>

    )
  }

  displayAddedTable = () => {
    return (
      <div style={{ paddingTop: 15 }}>
        <Segment color="blue" style={{ width: 1079 }}>
          <h3 style={{ fontFamily: 'Titillium Web' }}>New clients with contracts beginning in {this.state.currentMonth}</h3>
          <HotTable
            licenseKey="non-commercial-and-evaluation"
            className={"htCenter"}
            style={{ fontSize: 10, color: 'black' }}
            cells={function (row, col) {
              var cellPrp = {};
              if (col === 0) {
                cellPrp.className = 'htLeft'
              } else if (col === 1) {
                cellPrp.className = 'htRight'
              } else if (col === 9) {
                cellPrp.className = "htRight"
              } else {
                cellPrp.className = "htCenter"
              }
              return cellPrp
            }
            }
            htDimmed
            manualColumnResize
            wordWrap={false}
            // height={400}
            editor={false}
            filters={true}
            columns={[{}, { type: "numeric", numericFormat: { pattern: "0,00.00" } }, {}, {}, {}, { type: "date" }, {}, { type: "date" }, { type: "date" }, { type: "numeric", numericFormat: { pattern: "0,00.00" } }]}
            columnSorting={true}
            colWidths={[450, 55, 50, 50, 50, 70, 52, 70, 70, 60]}
            rowHeaders={true}
            colHeaders={this.state.table.colHeadersNew}
            data={this.state.newValues[this.state.selectedMonth]} />
        </Segment>
      </div >
    )
  }

  getChurnTotalInAud = () => {
    let total = 0
    if (typeof this.state.monthsText[this.state.selectedMonth + 1] !== "undefined") {
      let forexMonth = this.state.monthsText[this.state.selectedMonth + 1].substring(3)
      let forex = this.state.forexData
      let data = this.state.lostValues[this.state.selectedMonth]
      let audArray = []
      let audcad = forex[forexMonth]["AUD/CAD"]
      let audusd = forex[forexMonth]["AUD/USD"]
      let audgbp = forex[forexMonth]["AUD/GBP"]
      let audnzd = forex[forexMonth]["AUD/NZD"]

      if (typeof data !== 'undefined') {
        data.forEach((invoice) => {
          if (invoice[4] === "CAD") {
            audArray.push(invoice[2] * audcad)
          } else if (invoice[4] === "USD") {
            audArray.push(invoice[2] * audusd)
          } else if (invoice[4] === "GBP") {
            audArray.push(invoice[2] * audgbp)
          } else if (invoice[4] === "NZD") {
            audArray.push(invoice[2] * audnzd)
          } else {
            audArray.push(invoice[2])
          }
        })

        total = Math.round(audArray.reduce((a, b) => a + b, 0).toFixed(2))
      }

    }

    this.setState((prevState) => ({ churnTotalInAud: total }), this.getValuesForNewClients)
  }

  getAddedTotalInAud = () => {
    let total = 0

    if (typeof this.state.monthsText[this.state.selectedMonth + 1] !== "undefined") {
      let forexMonth = this.state.monthsText[this.state.selectedMonth + 1].substring(3)
      let forex = this.state.forexData
      let data = this.state.newValues[this.state.selectedMonth]
      let audArray = []
      let audcad = forex[forexMonth]["AUD/CAD"]
      let audusd = forex[forexMonth]["AUD/USD"]
      let audgbp = forex[forexMonth]["AUD/GBP"]
      let audnzd = forex[forexMonth]["AUD/NZD"]

      if (typeof data !== 'undefined') {
        data.forEach((invoice) => {
          if (invoice[3] === "CAD") {
            audArray.push(invoice[1] * audcad)
          } else if (invoice[3] === "USD") {
            audArray.push(invoice[1] * audusd)
          } else if (invoice[3] === "GBP") {
            audArray.push(invoice[1] * audgbp)
          } else if (invoice[3] === "NZD") {
            audArray.push(invoice[1] * audnzd)
          } else {
            audArray.push(invoice[1])
          }
        })

        total = Math.round(audArray.reduce((a, b) => a + b, 0).toFixed(2))
      }

    }
    this.setState((prevState) => ({ addedTotalInAud: total }), this.checkTableToggle)
  }


  displayTable = () => {
    if (this.state.showTable) {
      return (
        <div style={{ paddingTop: 12, paddingBottom: 12, fontFamily: 'Titillium Web' }}>
          <Segment style={{ width: 1079, backgroundColor: '#F7F7F7' }}>
            <Dimmer active={this.state.dimmer}>
              <Loader>Loading</Loader>
            </Dimmer>
            <Grid>
              <Grid.Column width={4}>
                <Segment color="blue">
                  <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Total Clients Lost in<br />{this.state.currentMonth}</h3>
                  <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{this.state.lost[this.state.selectedMonth].length}</h2>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment color="blue">
                  <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Total Clients Added in<br />{this.state.currentMonth}</h3>
                  <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{this.state.new[this.state.selectedMonth].length}</h2>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment color="blue">
                  <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Total Clients At End of<br />{this.state.currentPrevMonth}</h3>
                  <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{this.state.forChurnForumla[this.state.selectedMonth][2]}</h2>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <div>
                  <Segment color="blue">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Churn Calculation<br />{this.state.currentMonth} </h3>
                    {/* <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{this.state.forChurnForumla[this.state.selectedMonth][0]} ÷ ({this.state.forChurnForumla[this.state.selectedMonth][1]} + {this.state.forChurnForumla[this.state.selectedMonth][2]})</h2> */}
                    {/* <h1 style={{ textAlign: "center" }}>({this.state.forChurnForumla[this.state.forChurnForumla.length - 2][1]} + {this.state.forChurnForumla[this.state.forChurnForumla.length - 4][2]})</h1> */}
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{this.state.chartData[this.state.selectedMonth + 1][1].toFixed(2)}%</h2>
                    {/* <div style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>
                      <Popup position={'bottom center'}
                        content='The Monthly Churn rate is calculated by dividing the number of clients we lost last month by the number of new clients added to the number of clients we had before the month started.' trigger={<Button icon='calculator' />}
                      />
                    </div> */}
                  </Segment>
                </div>
              </Grid.Column>
            </Grid>
          </Segment>
        </div >
      )
    }
  }

  displayMRRTable = () => {
    let todDisplay = <p>Cannot fetch Forex data...</p>

    if (typeof this.state.monthsText[this.state.selectedMonth + 1] !== "undefined") {
      let forexMonth = this.state.monthsText[this.state.selectedMonth + 1].substring(3)
      let forex = this.state.forexData
      todDisplay = (
        <div style={{ fontSize: 10, textAlign: "center", fontFamily: 'Titillium Web' }}>
          <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>AUD Exchange Rates</h3>
          <Grid>
            <Grid.Column width={8}>
              <p><Flag name="ca" />{(1 / (forex[forexMonth]["AUD/CAD"])).toFixed(4)}</p>
              <p><Flag name="us" />{(1 / (forex[forexMonth]["AUD/USD"])).toFixed(4)}</p>
            </Grid.Column>
            <Grid.Column width={8}>
              <p><Flag name="uk" />{(1 / (forex[forexMonth]["AUD/GBP"])).toFixed(4)}</p>
              <p><Flag name="nz" />{(1 / (forex[forexMonth]["AUD/NZD"])).toFixed(4)}</p>
            </Grid.Column>
          </Grid>
        </div>
      )
    }

    if (this.state.showTable) {
      let added = this.state.addedTotalInAud
      let churn = this.state.churnTotalInAud
      let net = Math.round((added - churn).toFixed(2))
      let displayTotal = this.numberWithCommas(net)
      let arrow = ""
      let color = ""
      if ((added - churn) < 0) {
        arrow = "caret down"
        color = "red"
      } else {
        arrow = "caret up"
        color = "green"
      }

      return (
        <div style={{ paddingTop: 12, paddingBottom: 12, fontFamily: 'Titillium Web' }}>
          <Segment style={{ width: 1079, backgroundColor: '#F7F7F7' }}>
            <Dimmer active={this.state.dimmer}>
              <Loader>Loading</Loader>
            </Dimmer>
            <Grid>
              <Grid.Column width={4}>
                <div>
                  <Segment color="blue">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>MRR Lost</h3>
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>A${this.numberWithCommas(this.state.churnTotalInAud)}</h2>
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column width={4}>
                <div>
                  <Segment color="blue">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>MRR Added</h3>
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>A${this.numberWithCommas(this.state.addedTotalInAud)}</h2>
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column width={4}>
                <div>
                  <Segment color="blue">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Net MRR Change</h3>
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}><Icon color={color} name={arrow}></Icon>A${displayTotal}<Icon color={color} name={arrow}></Icon></h2>
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column width={4}>
                <div>
                  <Segment color="blue">
                    {todDisplay}
                  </Segment>
                </div>
              </Grid.Column>
            </Grid>
          </Segment>
        </div >
      )
    }
  }

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
          this.setState((prevState) => ({ selectedMonth: chart }))
          this.setChangedMonth()
        }
      }
    ]

    const { annualActive, projectActive, staticActive, budgetActive } = this.state

    if (this.state.chartData.length > 2) {
      return (
        <Grid columns='equal' style={{ width: 1300, paddingTop: 12, fontFamily: 'Titillium Web' }}>
          <Grid.Column>
            <Segment color="blue" style={{ width: 70, height: 513 }}>
              <br />
              <br />
              <div>
                Annual
                <br />
                <br />
                <Checkbox toggle defaultChecked active={annualActive.toString()} onClick={this.handleClickAnnual} />
              </div>

              <br />
              <div>
                Project
                <br />
                <br />
                <Checkbox toggle defaultChecked active={projectActive.toString()} onClick={this.handleClickProject} />
              </div>

              <br />
              <div>
                Static
                <br />
                <br />
                <Checkbox toggle defaultChecked active={staticActive.toString()} onClick={this.handleClickStatic} />
              </div>
              <br />

              <div>
                Budget
                <br />
                <br />
                <Checkbox toggle defaultChecked active={budgetActive.toString()} onClick={this.handleClickBudget} />
              </div>
              <br />
              <br />
              <div style={headingStyle}>
                <br />
                <br />
              </div>
            </Segment>
          </Grid.Column>

          {this.state.churnDollars ?  <ChurnDollars rawData={this.props.rawData} forexData={this.props.forexData} /> :

          <Grid.Column width={15}>
            <Segment color="blue" style={{ width: 1000, fontFamily: 'Titillium Web' }}>
              <div style={{ fontFamily: 'Titillium Web' }}>
                <Chart
                  width={'984px'}
                  height={'482px'}
                  chartEvents={chartEvents}
                  chartType="ScatterChart"
                  crosshair={{ trigger: "selection" }}
                  tooltip={{ trigger: "selection" }}
                  loader={<div>Loading Chart</div>}
                  data={this.state.chartData}
                  options={{
                    'vAxis': {
                      'title': 'Churn %',
                      'titleTextStyle': {
                        fontName: 'Titillium Web'
                      }
                    },
                    'hAxis': {
                      'title': 'Date',
                      'format': 'MMM-yy'
                    },
                    pointSize: 8,
                    legend: 'none',
                    titleTextStyle: { fontName: 'Titillium Web', bold: false },
                    title: 'You can click on any point in the scatter graph to see the churn breakdown for that month',
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
                        labelInLegend: 'Trend',
                        lineWidth: 7,
                        opacity: .5
                      }
                    }
                  }}
                />
              </div>
            </Segment>
          </Grid.Column>         
         }
        </Grid>
      )
    }
  }

  getData = () => {
    if (this.props.toRender === "QR") {
      this.props.getDataFromChurn(this.state)
    }
  }

  render() {
    //  {console.log(this.state)}
    if (this.props.toRender === "QR") {
      return null
    } else {
      return (
        <div style={{ paddingTop: 24, fontFamily: 'Titillium Web' }}>
          <div style={{ paddingBottom: 12 }}>
            <Segment color="blue" style={{ width: 1079 }}>
              <h1 style={{ fontSize: 40, textAlign: "center", fontFamily: 'Titillium Web' }}>
                Client Churn
              </h1>
            </Segment>
          </div>
          <Segment color="blue" style={{ width: 1079 }} >
            <Grid columns={2}>
              <Grid.Column width={12}>
                <div style={{ fontFamily: 'Titillium Web', textAlign: 'left' }}>
                  <Button basic={this.state.churnTer !== "Global"} primary onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>Global</Button>
                  <Button basic={this.state.churnTer !== "AUS"} color="green" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>Australia</Button>
                  <Button basic={this.state.churnTer !== "CAN"} color="yellow" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>Canada</Button>
                  <Button basic={this.state.churnTer !== "USA"} color="red" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>United States</Button>
                  <Button basic={this.state.churnTer !== "UK"} color="teal" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>United Kingdom</Button>
                  <Button basic={this.state.churnTer !== "NZ"} color="purple" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>New Zealand</Button>
                </div> 
                </Grid.Column>
                <Grid.Column width={4}>
                <div style={{textAlign: "right"}}>
                  <Button color="black" basic={this.state.churnDollars} onClick={this.handleChartSelection} style={{ fontFamily: 'Titillium Web' }}>Client Number</Button>
                  <Button color="black" basic={!this.state.churnDollars} onClick={this.handleChartSelection} style={{ fontFamily: 'Titillium Web' }}>MRR Value</Button>
              </div>
          </Grid.Column>
        </Grid>
      </Segment>

         
          {this.displayChart()}
          

          <DisplayMonth currentMonth={this.state.currentMonth} currentColor={this.state.currentColor} />

          {this.displayTable()}

          {this.displayMRRTable()}


          {this.displayChurnTable()}
          {this.displayAddedTable()}


          <div style={{ paddingBottom: 100 }}></div>
        </div >
      )
    }
  }
}

export default Churn