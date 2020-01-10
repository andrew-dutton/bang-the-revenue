import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import DisplayMonth from '../DisplayMonth'
import DisplayDetails from './DisplayDetails'
import LicenceToggles from '../LicenceToggles'
import DashboardHeading from '../DashboardHeading'
import ActiveLicencesChart from './ActiveLicencesChart'
import DataIn from '../DataIn'

class ActiveLicences extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentColor: 'green',
      ausData: [],
      canData: [],
      usaData: [],
      ukData: [],
      nzData: [],
      ausDetail: [],
      canDetail: [],
      usaDetail: [],
      ukDetail: [],
      nzDetai: [],
      months: [],
      annualOn: true,
      projectOn: true,
      staticOn: true,
      budgetOn: true,
      annual: "Annual",
      project: "Project",
      static: "Static",
      budget: "Budget Allocator",
      currentMonth: "",
      currentAus: 0,
      currentCan: 0,
      currentUsa: 0,
      currentUk: 0,
      currentNz: 0,
      loadButtonActive: true,
      annualActive: true,
      projectActive: true,
      staticActive: true,
      budgetActive: true,
      currentTotal: "Reload Chart",
      table: {
        colHeaders: ["Client", "Location", "Invoice", "Date", "Licence", "Start", "End", "Value"]
      }
    }

    this.totalClients = this.totalClients.bind(this)
    this.setStartingMonth = this.setStartingMonth.bind(this)
    this.setChangedMonth = this.setChangedMonth.bind(this)
    this.handleClickAnnual = this.handleClickAnnual.bind(this)
    this.handleClickProject = this.handleClickProject.bind(this)
    this.handleClickStatic = this.handleClickStatic.bind(this)
    this.handleClickBudget = this.handleClickBudget.bind(this)
  }

  componentDidMount() {
    this.createMonthsArray()
  }


  setStartingMonth = () => {
    let monthsOfYear = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ]

    let startingMonthNumber = this.state.months.length - 2

    let month = monthsOfYear[this.state.months[this.state.months.length - 2].getMonth()]
    let year = this.state.months[this.state.months.length - 2].getFullYear()

    let prevMonth = monthsOfYear[this.state.months[this.state.months.length - 3].getMonth()]
    let prevYear = this.state.months[this.state.months.length - 3].getFullYear()

    let theDate = month + " " + year
    let thePrevDate = prevMonth + " " + prevYear

    this.setState((prevState) => ({ currentMonth: theDate, currentPrevMonth: thePrevDate, selectedMonth: startingMonthNumber }), this.getData())
  }

  setChangedMonth = () => {
    let monthsOfYear = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ]

    let month = this.state.selectedMonth - 1

    if (this.state.months.length > 0) {
      let year = this.state.months[this.state.selectedMonth].getFullYear()

      let monthDisp

      if (this.state.selectedMonth > -1) {
        monthDisp = monthsOfYear[this.state.months[month + 1].getMonth()]
      }

      let theDate = monthDisp + " " + year

      this.setState((prevState) => ({ currentMonth: theDate }))
    }
  }

  handleClickAnnual = () => {
    if (this.state.annualOn) {
      this.setState((prevState) => ({ annual: "" }))
    } else {
      this.setState((prevState) => ({ annual: "Annual" }))
    }
    this.setState((prevState) => ({ annualActive: !prevState.annualActive, annualOn: !prevState.annualOn, loadButtonActive: true, currentTotal: "Reload" }), this.totalClients)
  }

  handleClickProject = () => {
    if (this.state.projectOn) {
      this.setState((prevState) => ({ project: "" }))
    } else {
      this.setState((prevState) => ({ project: "Project" }))
    }
    this.setState((prevState) => ({ projectActive: !prevState.projectActive, projectOn: !prevState.projectOn, loadButtonActive: true, currentTotal: "Reload" }), this.totalClients)
  }

  handleClickStatic = () => {
    if (this.state.staticOn) {
      this.setState((prevState) => ({ static: "" }))
    } else {
      this.setState((prevState) => ({ static: "Static" }))
    }
    this.setState((prevState) => ({ staticActive: !prevState.staticActive, staticOn: !prevState.staticOn, loadButtonActive: true, currentTotal: "Reload" }), this.totalClients)
  }

  handleClickBudget = () => {
    if (this.state.budgetOn) {
      this.setState((prevState) => ({ budget: "" }))
    } else {
      this.setState((prevState) => ({ budget: "Budget Allocator" }))
    }
    this.setState((prevState) => ({ budgetActive: !prevState.budgetActive, budgetOn: !prevState.budgetOn, loadButtonActive: true, currentTotal: "Reload" }), this.totalClients)
  }

  getNumberOfMonthsSinceJuly2015 = () => {
    console.log(this.props)
    // let today = new Date()

    // if (!this.state.dataIn) {
    //   today.setMonth(today.getMonth() - 1)
    // }

    // let thisMonth = today.getMonth()
    // let thisYear = today.getFullYear()
    // let monthsOfYears = (thisYear - (2015 + 1)) * 12

    // console.log(DataIn.MonthNumber)
    return DataIn.MonthNumber

    // return monthsOfYears + thisMonth + 7

    // let thisMonthNumber = DataIn.MonthNumber


  }

  createMonthsArray = () => {
    const numberOfMonths = this.getNumberOfMonthsSinceJuly2015()

    let year = 2015
    let yearStep = 12
    let months = []

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
    }

    this.setState({ months }, this.totalClients)
  }

  totalClients() {
    const ausTotal = []
    const canTotal = []
    const usaTotal = []
    const ukTotal = []
    const nzTotal = []

    let ausDetLogged = []

    this.state.months.forEach((month) => {
      const allDet = []

      const ausCounter = []
      const canCounter = []
      const usaCounter = []
      const ukCounter = []
      const nzCounter = []

      const ausType = []
      const canType = []
      const usaType = []
      const ukType = []
      const nzType = []

      this.props.rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month && (invoice["territory"] === "AUS") && (
          invoice["product"] === this.state.annual ||
          invoice["product"] === this.state.project ||
          invoice["product"] === this.state.static ||
          invoice["product"] === this.state.budget
        )) {
          ausCounter.push(invoice["client"])
          ausType.push(invoice["product"])
          allDet.push([
            invoice["client"],
            invoice["territory"],
            invoice["invoice"],
            invoice["date"],
            invoice["product"],
            invoice["start"],
            invoice["end"],
            invoice["total"]
          ])
        }

        if (start <= month && end >= month && (invoice["territory"] === "CAN") && (
          invoice["product"] === this.state.annual ||
          invoice["product"] === this.state.project ||
          invoice["product"] === this.state.static ||
          invoice["product"] === this.state.budget
        )) {
          canCounter.push(invoice["client"])
          canType.push(invoice["product"])
          allDet.push([
            invoice["client"],
            invoice["territory"],
            invoice["invoice"],
            invoice["date"],
            invoice["product"],
            invoice["start"],
            invoice["end"],
            invoice["total"]
          ])
        }

        if (start <= month && end >= month && (invoice["territory"] === "USA") && (
          invoice["product"] === this.state.annual ||
          invoice["product"] === this.state.project ||
          invoice["product"] === this.state.static ||
          invoice["product"] === this.state.budget
        )) {
          usaCounter.push(invoice["client"])
          usaType.push(invoice["product"])
          allDet.push([
            invoice["client"],
            invoice["territory"],
            invoice["invoice"],
            invoice["date"],
            invoice["product"],
            invoice["start"],
            invoice["end"],
            invoice["total"]
          ])
        }

        if (start <= month && end >= month && (invoice["territory"] === "UK") && (
          invoice["product"] === this.state.annual ||
          invoice["product"] === this.state.project ||
          invoice["product"] === this.state.static ||
          invoice["product"] === this.state.budget
        )) {
          ukCounter.push(invoice["client"])
          ukType.push(invoice["product"])
          allDet.push([
            invoice["client"],
            invoice["territory"],
            invoice["invoice"],
            invoice["date"],
            invoice["product"],
            invoice["start"],
            invoice["end"],
            invoice["total"]
          ])
        }

        if (start <= month && end >= month && (invoice["territory"] === "NZ") && (
          invoice["product"] === this.state.annual ||
          invoice["product"] === this.state.project ||
          invoice["product"] === this.state.static ||
          invoice["product"] === this.state.budget
        )) {
          nzCounter.push(invoice["client"])
          nzType.push(invoice["product"])
          allDet.push([
            invoice["client"],
            invoice["territory"],
            invoice["invoice"],
            invoice["date"],
            invoice["product"],
            invoice["start"],
            invoice["end"],
            invoice["total"]
          ])
        }
      })

      const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
      }

      let uniqAusClients = ausCounter.filter(onlyUnique)
      let uniqCanClients = canCounter.filter(onlyUnique)
      let uniqUsaClients = usaCounter.filter(onlyUnique)
      let uniqUkClients = ukCounter.filter(onlyUnique)
      let uniqNzClients = nzCounter.filter(onlyUnique)

      ausTotal.push(uniqAusClients.length)
      canTotal.push(uniqCanClients.length)
      usaTotal.push(uniqUsaClients.length)
      ukTotal.push(uniqUkClients.length)
      nzTotal.push(uniqNzClients.length)

      ausDetLogged.push(allDet)

    })

    this.setState(prevState => ({
      ausData: ausTotal,
      currentAus: ausTotal[ausTotal.length - 2],
      canData: [...canTotal],
      currentCan: canTotal[canTotal.length - 2],
      usaData: [...usaTotal],
      currentUsa: usaTotal[usaTotal.length - 2],
      ukData: [...ukTotal],
      currentUk: ukTotal[ukTotal.length - 2],
      nzData: [...nzTotal],
      currentNz: nzTotal[nzTotal.length - 2],
      loadButtonActive: false,
      ausDetail: ausDetLogged
    }), this.setStartingMonth)


    return null
  }

  updateCurrentMonth = (month) => {
    this.setState(prevState => ({ selectedMonth: month }), this.setChangedMonth)
  }

  getData = () => {
    if (this.props.toRender === "QR") {
      this.props.getDataFromAL(this.state)
    }
  }


  render(props) {
    if (this.props.toRender === "QR") {
      return null
    } else {
      return (
        <div style={{ paddingTop: 24, paddingBotton: 24 }}>
          <DashboardHeading title={"Active Licences"} currentColor={this.state.currentColor} />
          <Grid columns='equal' style={{ width: 1300 }}>
            <Grid.Column width={1}>
              <LicenceToggles
                currentColor={this.state.currentColor}
                defaultChecked={this.state.defaultChecked}
                annualActive={this.state.annualActive}
                projectActive={this.state.projectActive}
                staticActive={this.state.staticActive}
                budgetActive={this.state.budgetActive}
                handleClickAnnual={this.handleClickAnnual}
                handleClickProject={this.handleClickProject}
                handleClickBudget={this.handleClickBudget}
                handleClickStatic={this.handleClickStatic}
                headingStyle={this.headingStyle}
              />
            </Grid.Column>
            <Grid.Column width={15}>
              <ActiveLicencesChart
                currentColor={this.state.currentColor}
                selectedMonth={this.state.selecteMonth}
                setChangedMonth={this.setChangedMonth}
                ausData={this.state.ausData}
                canData={this.state.canData}
                usaData={this.state.usaData}
                ukData={this.state.ukData}
                nzData={this.state.nzData}
                updateCurrentMonth={this.updateCurrentMonth}
              />
            </Grid.Column>
          </Grid>
          <DisplayMonth
            currentMonth={this.state.currentMonth}
            currentColor={this.state.currentColor}
          />
          <DisplayDetails
            currentColor={this.state.currentColor}
            currentAus={this.state.currentAus}
            currentCan={this.state.currentCan}
            currentUsa={this.state.currentUsa}
            currentUk={this.state.currentUk}
            currentNz={this.state.currentNz}
            displayTotal={this.displayTotal}
            table={this.state.table}
            selectedMonth={this.state.selectedMonth}
            ausDetail={this.state.ausDetail}
            loadButtonActive={this.state.loadButtonActive}
            ausData={this.state.ausData}
            canData={this.state.canData}
            usaData={this.state.usaData}
            ukData={this.state.ukData}
            nzData={this.state.nzData}
          />
        </div>
      )
    }
  }
}

export default ActiveLicences
