import React, { Component } from 'react'
import { Grid, Segment, Button, GridColumn, Radio } from 'semantic-ui-react'
import DashboardHeading from '../DashboardHeading'
import DataIn from '../DataIn'
import EIQChart from './EIQChart'
import DisplayMonth from '../DisplayMonth'
import EIQDisplayDetails from './EIQDisplayDetails'

class EIQ extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentColor: "purple",
      timePeriodValue: "allTime",
      renderSwitch: true,
      selectedTer: "Global",
      firstPass: 0
    }

    this.handleSelection = this.handleSelection.bind(this)
  }

  handleSelection = (event, data) => {
    event.persist()
    this.setState((prevState) => ({ selectedTer: event.target.textContent }), this.setStartingMonth)
  }

  updateCurrentMonth = (x) => {
    this.setState({selectedMonth: x}, this.setChangedMonth)
  }

  componentDidMount() {
    this.dateLabels()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.renderSwitch !== this.state.renderSwitch)
      return true
    return false
  }

  dateLabels = () => {
    this.setState({dateLabels: DataIn.Labels}, this.setMonthNumber)
  }

  handleTimeframeChange = (e, { value }) => this.setState({ value }, this.checkTimeFrameChange)

  checkTimeFrameChange = () => {
    if(this.state.timePeriodValue === "eiqLaunch") {
      this.startDateAllTime()
    } else {
      this.startDateAtEIQLaunch()
    }
  }

  startDateAtEIQLaunch = () => {
    this.setState({timePeriodValue: "eiqLaunch"}, this.setMonthNumberForEIQLaunch)
  }

  startDateAllTime = () => {
    this.setState({timePeriodValue: "allTime"}, this.setMonthNumber)
  }

  setMonthNumberForEIQLaunch = () => {
    let dateLabels = DataIn.Labels.slice(42)
    this.setState({dateLabels}, this.getAllData)
  }

  setMonthNumber = () => {
    this.setState({dateLabels: DataIn.Labels, numberOfMonths: DataIn.MonthNumber}, this.getAllData)
  }

  getAllData = props => {
    let data = this.props.rawData
    let eiqData = []
    let otherData = []

    data.forEach((invoice) => {
      if(invoice.ehqveiq === "EIQ") {
        eiqData.push(invoice)
      } else {
        otherData.push(invoice)
      }
    })

    this.setState({ eiqData, otherData }, this.createEIQMonths)
  }

  createEIQMonths = () => {
    const numberOfMonths = this.state.numberOfMonths

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

      if(month < 10) {
        month = "0" + month
      }

      months.push(month + "/" + year)
    }

    if(this.state.timePeriodValue === "eiqLaunch") {
      months = months.slice(42)
    }

    this.setState({ months }, this.setStartingMonth)
  }

  setStartingMonth = () => {
    let monthsOfYear = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ]

    let selectedMonth = this.state.months.length - 2 

    let m = monthsOfYear[parseInt(this.state.months[this.state.months.length-2].substring(0,2)) - 1]

    let y = this.state.months[this.state.months.length - 2].substring(3)

    this.setState((prevState) => ({ currentMonth: m + " " + y, selectedMonth }), this.getAUSTotals)
  }

  setChangedMonth = () => {
    let monthsOfYear = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ]

    let selectedMonth = this.state.selectedMonth

    if(this.state.timePeriodValue === "eiqLaunch") {
      selectedMonth -= 42
    } 


    let m = monthsOfYear[parseInt(this.state.months[selectedMonth].substring(0,2)) - 1]
    let y = this.state.months[selectedMonth].substring(3)
    this.setState((prevState) => ({ currentMonth: m + " " + y }), this.getAUSTotals)
  }

  getAUSTotals = () => {
    let adminsTotalAUS = []
    let advisoryTotalAUS = []
    let conciergeTotalAUS = []
    let onboardingTotalAUS = []
    let supportTotalAUS = []
    let trainingTotalAUS = []
    let months = this.state.months
    let eiqData = this.state.eiqData
    let adminsCounter = []
    let advisoryCounter = []
    let conciergeCounter = []
    let onboardingCounter = []
    let supportCounter = []
    let trainingCounter = []

    let ausDetails = []
  
    months.forEach((month) => {
      adminsCounter = []
      advisoryCounter = []
      conciergeCounter = []
      onboardingCounter = []
      supportCounter = []
      trainingCounter = []

      let detailsHolder = []

      eiqData.forEach((line) => {
        if(month === line.date.substring(3) && line.territory === "AUS" && line.product === "Admins") {
          adminsCounter.push(line.total)
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "AUS" && line.product === "Advisory") {
          advisoryCounter.push(line.total)
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "AUS" && line.product === "Concierge") {
          conciergeCounter.push(line.total)
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "AUS" && line.product === "Onboarding") {
          onboardingCounter.push(line.total)
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "AUS" && line.product === "Support") {
          supportCounter.push(line.total)
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "AUS" && line.product === "Training") {
          trainingCounter.push(line.total)
          detailsHolder.push(line)
        }
      })

      if(detailsHolder.length < 1) {
        ausDetails.push([])
      } else {
        ausDetails.push(detailsHolder)
      }

      if(adminsCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Australia")) {
        adminsTotalAUS.push(0)
      } else {
        adminsTotalAUS.push(adminsCounter.reduce((a, b) => a + b, 0))
      }

      if(advisoryCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Australia")) {
        advisoryTotalAUS.push(0)
      } else {
        advisoryTotalAUS.push(advisoryCounter.reduce((a, b) => a + b, 0))
      }

      if(conciergeCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Australia")) {
        conciergeTotalAUS.push(0)
      } else {
        conciergeTotalAUS.push(conciergeCounter.reduce((a, b) => a + b, 0))
      }

      if(onboardingCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Australia")) {
        onboardingTotalAUS.push(0)
      } else {
        onboardingTotalAUS.push(onboardingCounter.reduce((a, b) => a + b, 0))
      }

      if(supportCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Australia")) {
        supportTotalAUS.push(0)
      } else {
        supportTotalAUS.push(supportCounter.reduce((a, b) => a + b, 0))
      }

      if(trainingCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Australia")) {
        trainingTotalAUS.push(0)
      } else {
        trainingTotalAUS.push(trainingCounter.reduce((a, b) => a + b, 0))
      }
    })

    this.setState({
      adminsTotalAUS, 
      advisoryTotalAUS, 
      conciergeTotalAUS, 
      onboardingTotalAUS,
      supportTotalAUS, 
      trainingTotalAUS,
      ausDetails
    }, this.getUSATotals)
  }

  getUSATotals = () => {
    let rates = DataIn.rates
    let adminsTotalUSA = []
    let advisoryTotalUSA = []
    let conciergeTotalUSA = []
    let onboardingTotalUSA = []
    let supportTotalUSA = []
    let trainingTotalUSA = []
    let months = this.state.months
    let eiqData = this.state.eiqData
    let adminsCounter = []
    let advisoryCounter = []
    let conciergeCounter = []
    let onboardingCounter = []
    let supportCounter = []
    let trainingCounter = []

    let usaDetails = []

    months.forEach((month) => {
      adminsCounter = []
      advisoryCounter = []
      conciergeCounter = []
      onboardingCounter = []
      supportCounter = []
      trainingCounter = []

      let detailsHolder = []

      eiqData.forEach((line) => {
        if(month === line.date.substring(3) && line.territory === "USA" && line.product === "Admins") {
          adminsCounter.push(line.total * rates[month]["AUD/USD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "USA" && line.product === "Advisory") {
          advisoryCounter.push(line.total * rates[month]["AUD/USD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "USA" && line.product === "Concierge") {
          conciergeCounter.push(line.total * rates[month]["AUD/USD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "USA" && line.product === "Onboarding") {
          onboardingCounter.push(line.total * rates[month]["AUD/USD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "USA" && line.product === "Support") {
          supportCounter.push(line.total * rates[month]["AUD/USD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "USA" && line.product === "Training") {
          trainingCounter.push(line.total * rates[month]["AUD/USD"])
          detailsHolder.push(line)
        }
      })

      if(detailsHolder.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United States")) {
        usaDetails.push([])
      } else {
        usaDetails.push(detailsHolder)
      }

      if(adminsCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United States")) {
        adminsTotalUSA.push(0)
      } else {
        adminsTotalUSA.push(adminsCounter.reduce((a, b) => a + b, 0))
      }

      if(advisoryCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United States")) {
        advisoryTotalUSA.push(0)
      } else {
        advisoryTotalUSA.push(advisoryCounter.reduce((a, b) => a + b, 0))
      }

      if(conciergeCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United States")) {
        conciergeTotalUSA.push(0)
      } else {
        conciergeTotalUSA.push(conciergeCounter.reduce((a, b) => a + b, 0))
      }

      if(onboardingCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United States")) {
        onboardingTotalUSA.push(0)
      } else {
        onboardingTotalUSA.push(onboardingCounter.reduce((a, b) => a + b, 0))
      }

      if(supportCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United States")) {
        supportTotalUSA.push(0)
      } else {
        supportTotalUSA.push(supportCounter.reduce((a, b) => a + b, 0))
      }

      if(trainingCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United States")) {
        trainingTotalUSA.push(0)
      } else {
        trainingTotalUSA.push(trainingCounter.reduce((a, b) => a + b, 0))
      }
    })

    this.setState({
      adminsTotalUSA, 
      advisoryTotalUSA, 
      conciergeTotalUSA, 
      onboardingTotalUSA, 
      supportTotalUSA, 
      trainingTotalUSA, 
      usaDetails}, this.getCANTotals)
  }

  getCANTotals = () => {
    let rates = DataIn.rates
    let adminsTotalCAN = []
    let advisoryTotalCAN = []
    let conciergeTotalCAN = []
    let onboardingTotalCAN = []
    let supportTotalCAN = []
    let trainingTotalCAN = []
    let months = this.state.months
    let eiqData = this.state.eiqData
    let adminsCounter = []
    let advisoryCounter = []
    let conciergeCounter = []
    let onboardingCounter = []
    let supportCounter = []
    let trainingCounter = []

    let canDetails = []

    months.forEach((month) => {
      adminsCounter = []
      advisoryCounter = []
      conciergeCounter = []
      onboardingCounter = []
      supportCounter = []
      trainingCounter = []

      let detailsHolder = []

      eiqData.forEach((line) => {
        if(month === line.date.substring(3) && line.territory === "CAN" && line.product === "Admins") {
          adminsCounter.push(line.total * rates[month]["AUD/CAD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "CAN" && line.product === "Advisory") {
          advisoryCounter.push(line.total * rates[month]["AUD/CAD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "CAN" && line.product === "Concierge") {
          conciergeCounter.push(line.total * rates[month]["AUD/CAD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "CAN" && line.product === "Onboarding") {
          onboardingCounter.push(line.total * rates[month]["AUD/CAD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "CAN" && line.product === "Support") {
          supportCounter.push(line.total * rates[month]["AUD/CAD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "CAN" && line.product === "Training") {
          trainingCounter.push(line.total * rates[month]["AUD/CAD"])
          detailsHolder.push(line)
        }
      })

      if(detailsHolder.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Canada")) {
        canDetails.push([])
      } else {
        canDetails.push(detailsHolder)
      }

      if(adminsCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Canada")) {
        adminsTotalCAN.push(0)
      } else {
        adminsTotalCAN.push(adminsCounter.reduce((a, b) => a + b, 0))
      }

      if(advisoryCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Canada")) {
        advisoryTotalCAN.push(0)
      } else {
        advisoryTotalCAN.push(advisoryCounter.reduce((a, b) => a + b, 0))
      }

      if(conciergeCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Canada")) {
        conciergeTotalCAN.push(0)
      } else {
        conciergeTotalCAN.push(conciergeCounter.reduce((a, b) => a + b, 0))
      }

      if(onboardingCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Canada")) {
        onboardingTotalCAN.push(0)
      } else {
        onboardingTotalCAN.push(onboardingCounter.reduce((a, b) => a + b, 0))
      }

      if(supportCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Canada")) {
        supportTotalCAN.push(0)
      } else {
        supportTotalCAN.push(supportCounter.reduce((a, b) => a + b, 0))
      }

      if(trainingCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "Canada")) {
        trainingTotalCAN.push(0)
      } else {
        trainingTotalCAN.push(trainingCounter.reduce((a, b) => a + b, 0))
      }
    })

    this.setState({
      adminsTotalCAN, 
      advisoryTotalCAN, 
      conciergeTotalCAN, 
      onboardingTotalCAN, 
      supportTotalCAN, 
      trainingTotalCAN,
      canDetails}, this.getUKTotals)
  }

  getUKTotals = () => {
    let rates = DataIn.rates
    let adminsTotalUK = []
    let advisoryTotalUK = []
    let conciergeTotalUK = []
    let onboardingTotalUK = []
    let supportTotalUK = []
    let trainingTotalUK = []
    let months = this.state.months
    let eiqData = this.state.eiqData
    let adminsCounter = []
    let advisoryCounter = []
    let conciergeCounter = []
    let onboardingCounter = []
    let supportCounter = []
    let trainingCounter = []

    let ukDetails = []

    months.forEach((month) => {
      adminsCounter = []
      advisoryCounter = []
      conciergeCounter = []
      onboardingCounter = []
      supportCounter = []
      trainingCounter = []

      let detailsHolder = []

      eiqData.forEach((line) => {
        if(month === line.date.substring(3) && line.territory === "UK" && line.product === "Admins") {
          adminsCounter.push(line.total * rates[month]["AUD/GBP"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "UK" && line.product === "Advisory") {
          advisoryCounter.push(line.total * rates[month]["AUD/GBP"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "UK" && line.product === "Concierge") {
          conciergeCounter.push(line.total * rates[month]["AUD/GBP"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "UK" && line.product === "Onboarding") {
          onboardingCounter.push(line.total * rates[month]["AUD/GBP"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "UK" && line.product === "Support") {
          supportCounter.push(line.total * rates[month]["AUD/GBP"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "UK" && line.product === "Training") {
          trainingCounter.push(line.total * rates[month]["AUD/GBP"])
          detailsHolder.push(line)
        }
      })

      if(detailsHolder.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United Kingdom")) {
        ukDetails.push([])
      } else {
        ukDetails.push(detailsHolder)
      }

      if(adminsCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United Kingdom")) {
        adminsTotalUK.push(0)
      } else {
        adminsTotalUK.push(adminsCounter.reduce((a, b) => a + b, 0))
      }

      if(advisoryCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United Kingdom")) {
        advisoryTotalUK.push(0)
      } else {
        advisoryTotalUK.push(advisoryCounter.reduce((a, b) => a + b, 0))
      }

      if(conciergeCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United Kingdom")) {
        conciergeTotalUK.push(0)
      } else {
        conciergeTotalUK.push(conciergeCounter.reduce((a, b) => a + b, 0))
      }

      if(onboardingCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United Kingdom")) {
        onboardingTotalUK.push(0)
      } else {
        onboardingTotalUK.push(onboardingCounter.reduce((a, b) => a + b, 0))
      }

      if(supportCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United Kingdom")) {
        supportTotalUK.push(0)
      } else {
        supportTotalUK.push(supportCounter.reduce((a, b) => a + b, 0))
      }

      if(trainingCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "United Kingdom")) {
        trainingTotalUK.push(0)
      } else {
        trainingTotalUK.push(trainingCounter.reduce((a, b) => a + b, 0))
      }
    })

    this.setState({
      adminsTotalUK, 
      advisoryTotalUK, 
      conciergeTotalUK, 
      onboardingTotalUK, 
      supportTotalUK, 
      trainingTotalUK,
      ukDetails}, this.getNZTotals)
  }

  getNZTotals = () => {
    let rates = DataIn.rates
    let adminsTotalNZ = []
    let advisoryTotalNZ = []
    let conciergeTotalNZ = []
    let onboardingTotalNZ = []
    let supportTotalNZ = []
    let trainingTotalNZ = []
    let months = this.state.months
    let eiqData = this.state.eiqData
    let adminsCounter = []
    let advisoryCounter = []
    let conciergeCounter = []
    let onboardingCounter = []
    let supportCounter = []
    let trainingCounter = []

    let nzDetails = []

    months.forEach((month) => {
      adminsCounter = []
      advisoryCounter = []
      conciergeCounter = []
      onboardingCounter = []
      supportCounter = []
      trainingCounter = []

      let detailsHolder = []

      eiqData.forEach((line) => {
        if(month === line.date.substring(3) && line.territory === "NZ" && line.product === "Admins") {
          adminsCounter.push(line.total * rates[month]["AUD/NZD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "NZ" && line.product === "Advisory") {
          advisoryCounter.push(line.total * rates[month]["AUD/NZD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "NZ" && line.product === "Concierge") {
          conciergeCounter.push(line.total * rates[month]["AUD/NZD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "NZ" && line.product === "Onboarding") {
          onboardingCounter.push(line.total * rates[month]["AUD/NZD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "NZ" && line.product === "Support") {
          supportCounter.push(line.total * rates[month]["AUD/NZD"])
          detailsHolder.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "NZ" && line.product === "Training") {
          trainingCounter.push(line.total * rates[month]["AUD/NZD"])
          detailsHolder.push(line)
        }
      })

      if(detailsHolder.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "New Zealand")) {
        nzDetails.push([])
      } else {
        nzDetails.push(detailsHolder)
      }

      if(adminsCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "New Zealand")) {
        adminsTotalNZ.push(0)
      } else {
        adminsTotalNZ.push(adminsCounter.reduce((a, b) => a + b, 0))
      }

      if(advisoryCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "New Zealand")) {
        advisoryTotalNZ.push(0)
      } else {
        advisoryTotalNZ.push(advisoryCounter.reduce((a, b) => a + b, 0))
      }

      if(conciergeCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "New Zealand")) {
        conciergeTotalNZ.push(0)
      } else {
        conciergeTotalNZ.push(conciergeCounter.reduce((a, b) => a + b, 0))
      }

      if(onboardingCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "New Zealand")) {
        onboardingTotalNZ.push(0)
      } else {
        onboardingTotalNZ.push(onboardingCounter.reduce((a, b) => a + b, 0))
      }

      if(supportCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "New Zealand")) {
        supportTotalNZ.push(0)
      } else {
        supportTotalNZ.push(supportCounter.reduce((a, b) => a + b, 0))
      }

      if(trainingCounter.length < 1 || (this.state.selectedTer !== "Global" && this.state.selectedTer !== "New Zealand")) {
        trainingTotalNZ.push(0)
      } else {
        trainingTotalNZ.push(trainingCounter.reduce((a, b) => a + b, 0))
      }
    })

    this.setState({
      adminsTotalNZ, 
      advisoryTotalNZ, 
      conciergeTotalNZ, 
      onboardingTotalNZ, 
      supportTotalNZ, 
      trainingTotalNZ,
      nzDetails}, this.combineTerritoryTotals)
  }

  combineTerritoryTotals = () => {
    let adminsTotals = []
    let advisoryTotals = []
    let conciergeTotals = []
    let onboardingTotals = []
    let supportTotals = []
    let trainingTotals = []

    this.state.adminsTotalAUS.forEach((month, index) => {
      adminsTotals.push((month + this.state.adminsTotalUSA[index] + this.state.adminsTotalCAN[index] + this.state.adminsTotalNZ[index] + this.state.adminsTotalUK[index]).toFixed(0))
    })

    this.state.advisoryTotalAUS.forEach((month, index) => {
      advisoryTotals.push((month + this.state.advisoryTotalUSA[index] + this.state.advisoryTotalCAN[index] + this.state.advisoryTotalNZ[index] + this.state.advisoryTotalUK[index]).toFixed(0))
    })

    this.state.conciergeTotalAUS.forEach((month, index) => {
      conciergeTotals.push((month + this.state.conciergeTotalUSA[index] + this.state.conciergeTotalCAN[index] + this.state.conciergeTotalNZ[index] + this.state.conciergeTotalUK[index]).toFixed(0))
    })

    this.state.onboardingTotalAUS.forEach((month, index) => {
      onboardingTotals.push((month + this.state.onboardingTotalUSA[index] + this.state.onboardingTotalCAN[index] + this.state.onboardingTotalNZ[index] + this.state.onboardingTotalUK[index]).toFixed(0))
    })

    this.state.supportTotalAUS.forEach((month, index) => {
      supportTotals.push((month + this.state.supportTotalUSA[index] + this.state.supportTotalCAN[index] + this.state.supportTotalNZ[index] + this.state.supportTotalUK[index]).toFixed(0))
    })

    this.state.trainingTotalAUS.forEach((month, index) => {
      trainingTotals.push((month + this.state.trainingTotalUSA[index] + this.state.trainingTotalCAN[index] + this.state.trainingTotalNZ[index] + this.state.trainingTotalUK[index]).toFixed(0))
    })

    this.setState({ adminsTotals, advisoryTotals, conciergeTotals, onboardingTotals, supportTotals, trainingTotals }, this.checkTerritoryOrCombine)
  }

  checkTerritoryOrCombine = () => {
    let ter = this.state.selectedTer
    if(ter === "Global") {
      this.combineDetails()
    } else if(ter === "Australia") {
      this.setState({combinedEIQDetails: this.state.ausDetails}, this.getEIQTableData)

    } else if(ter === "Canada") {
      this.setState({combinedEIQDetails: this.state.canDetails}, this.getEIQTableData)
    
    } else if(ter === "United States") {
      this.setState({combinedEIQDetails: this.state.usaDetails}, this.getEIQTableData)
     
    } else if(ter === "United Kingdom") {
      this.setState({combinedEIQDetails: this.state.ukDetails}, this.getEIQTableData)
 
    } else if(ter === "New Zealand") {
      this.setState({combinedEIQDetails: this.state.nzDetails}, this.getEIQTableData)
  
    }
  }

  combineDetails = () => {
    let combinedEIQDetails = []
    let aus = this.state.ausDetails
    let usa = this.state.usaDetails
    let can = this.state.canDetails
    let uk = this.state.ukDetails
    let nz = this.state.nzDetails
    let month = this.state.selectedMonth


    for(let i = 0; i < aus.length; i++) {
      combinedEIQDetails.push(aus[i].concat(usa[i]).concat(can[i]).concat(uk[i]).concat(nz[i])) 
    }

    this.setState({combinedEIQDetails}, this.getEIQTableData)
  }

  getEIQTableData = () => {
    let selectedMonth = this.state.selectedMonth
    let data = []

    if(this.state.timePeriodValue === "eiqLaunch") {
      data = this.state.combinedEIQDetails[selectedMonth]
      selectedMonth -= 42
      if(selectedMonth < 0) {
        selectedMonth += 42
      }
    }

    data = this.state.combinedEIQDetails[selectedMonth]
    let tableData = []

    if(data) {
      data.forEach(line => {
        tableData.push([
          line["client"],
          line["item"],
          line["territory"], 
          line["invoice"], 
          line["date"], 
          line["product"], 
          line["start"],
          line["end"],
          line["total"]
          ])
      })
    }
    
    this.setState((prevState) => ({
      eiqTableData: tableData, renderSwitch: !prevState.renderSwitch }))
  }

  
  render() {
 
    return (
      <div style={{ paddingTop: 24, paddingBotton: 24 }}>
        <DashboardHeading title={"EngagementIQ"} currentColor={this.state.currentColor} />
        <Segment color={this.state.currentColor} style={{ width: 1079 }} >
            <div>
              <div style={{ fontFamily: 'Titillium Web', textAlign: 'center' }}>
                <Button basic={this.state.selectedTer !== "Global"} primary onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>Global</Button>
                <Button basic={this.state.selectedTer !== "Australia"} color="green" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>Australia</Button>
                <Button basic={this.state.selectedTer !== "Canada"} color="yellow" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>Canada</Button>
                <Button basic={this.state.selectedTer !== "United States"} color="red" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>United States</Button>
                <Button basic={this.state.selectedTer !== "United Kingdom"} color="teal" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>United Kingdom</Button>
                <Button basic={this.state.selectedTer !== "New Zealand"} color="purple" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>New Zealand</Button>
              </div>
            </div>
          </Segment>
          <Segment style={{ width: 1079 }}>
            <Grid columns={2}>
                <GridColumn>
                  <Segment color={this.state.currentColor}>
                    Select Data to Display:
                    <br />
                    <br />
                    <Grid columns={2}>
                      <GridColumn>
                      <Radio
                          label="All Time"
                          name="allTime"
                          value="allTime"
                          checked={this.state.timePeriodValue === "allTime"}
                          onChange={this.handleTimeframeChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="Since EIQ Launch"
                          name="eiqLaunch"
                          value="eiqLaunch"
                          checked={this.state.timePeriodValue === "eiqLaunch"}
                          onChange={this.handleTimeframeChange}
                          enabled="true"
                        />
                      </GridColumn>
                    </Grid>
                  </Segment>
                </GridColumn>
                {/* <GridColumn>
                  <Segment color={this.state.currentColor}>
                    Display Data by:
                    <br />
                    <br />
                    <Grid columns={2}>
                      <GridColumn>
                      <Radio
                          label="EIQ Data Only"
                          name="eiqOnly"
                          value="eiqOnly"
                          checked={this.state.value === "eiqOnly"}
                          onChange={this.handleComparisonChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="EIQ as added to EHQ"
                          name="eiqVehq"
                          value="eiqVehq"
                          checked={this.state.value === "eiqVehq"}
                          onChange={this.handleComparisonChange}
                          enabled="true"
                        />
                      </GridColumn>
                    </Grid>
                  </Segment>
                </GridColumn> */}

              </Grid>
          </Segment>
        <Segment style={{ width: 1079 }} color={this.state.currentColor}>
          <p style={{textAlign: "right", fontFamily: "Titillium Web"}}>Click on any bar to see the details of that month</p>
          <EIQChart 
            currentColor={this.state.currentColor}
            // selectedMonth={this.state.selecteMonth}
            // setChangedMonth={this.setChangedMonth}
            adminsData={this.state.adminsTotals}
            advisoryData={this.state.advisoryTotals}
            conciergeData={this.state.conciergeTotals}
            onboardingData={this.state.onboardingTotals}
            supportData={this.state.supportTotals}
            trainingData={this.state.trainingTotals}
            dateLabels={this.state.dateLabels}
            timePeriodValue={this.state.timePeriodValue}
            updateCurrentMonth={this.updateCurrentMonth.bind(this)}
            // updateCurrentMonth={this.updateCurrentMonth}
          />
        </Segment>
        <DisplayMonth currentMonth={this.state.currentMonth} currentColor={this.state.currentColor} />

        <EIQDisplayDetails 
          currentColor={this.state.currentColor}  
          data={this.state.eiqTableData}
        />

      </div>
    )
  }
}

export default EIQ