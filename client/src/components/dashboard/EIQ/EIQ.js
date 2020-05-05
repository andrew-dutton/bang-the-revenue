import React, { Component } from 'react'
import { Grid, Segment, Button, GridColumn, Radio } from 'semantic-ui-react'
import DashboardHeading from '../DashboardHeading'
import DataIn from '../DataIn'
import EIQChart from './EIQChart'
import DisplayMonth from '../DisplayMonth'

class EIQ extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentColor: "purple",
      timePeriodValue: "allTime"
    }
  }

  updateCurrentMonth = (x) => {
    this.setState({selectedMonth: x}, this.setChangedMonth)
  }

  componentDidMount() {
    this.dateLabels()
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
    this.setState({dateLabels}, this.getEIQData)
  }

  setMonthNumber = () => {
    this.setState({dateLabels: DataIn.Labels, numberOfMonths: DataIn.MonthNumber}, this.getEIQData)
  }

  getEIQData = props => {
    let data = this.props.rawData
    let eiqData = []

    data.forEach((invoice) => {
      if(invoice.ehqveiq === "EIQ") {
        eiqData.push(invoice)
      }
    })

    this.setState({ eiqData }, this.createEIQMonths)
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
    let adminsDetAUS = []
    let advisoryDetAUS = []
    let conciergeDetAUS = []
    let onboardingDetAUS = []
    let supportDetAUS = []
    let trainingDetAUS = []
    let months = this.state.months
    let eiqData = this.state.eiqData
    let adminsCounter = []
    let advisoryCounter = []
    let conciergeCounter = []
    let onboardingCounter = []
    let supportCounter = []
    let trainingCounter = []
    let adminsCounterDet = []
    let advisoryCounterDet = []
    let conciergeCounterDet = []
    let onboardingCounterDet = []
    let supportCounterDet = []
    let trainingCounterDet = []
  
    months.forEach((month) => {
      adminsCounter = []
      advisoryCounter = []
      conciergeCounter = []
      onboardingCounter = []
      supportCounter = []
      trainingCounter = []
      adminsCounterDet = []
      advisoryCounterDet = []
      conciergeCounterDet = []
      onboardingCounterDet = []
      supportCounterDet = []
      trainingCounterDet = []

      eiqData.forEach((line) => {
        if(month === line.date.substring(3) && line.territory === "AUS" && line.product === "Admins") {
          adminsCounter.push(line.total)
          adminsCounterDet.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "AUS" && line.product === "Advisory") {
          advisoryCounter.push(line.total)
          advisoryCounterDet.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "AUS" && line.product === "Concierge") {
          conciergeCounter.push(line.total)
          conciergeCounterDet.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "AUS" && line.product === "Onboarding") {
          onboardingCounter.push(line.total)
          onboardingCounterDet.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "AUS" && line.product === "Support") {
          supportCounter.push(line.total)
          supportCounterDet.push(line)
        }

        if(month === line.date.substring(3) && line.territory === "AUS" && line.product === "Training") {
          trainingCounter.push(line.total)
          trainingCounterDet.push(line)
        }
      })

      if(adminsCounter.length < 1) {
        adminsTotalAUS.push(0)
        adminsDetAUS.push(0)
      } else {
        adminsTotalAUS.push(adminsCounter.reduce((a, b) => a + b, 0))
        adminsDetAUS.push(adminsCounterDet)
      }

      if(advisoryCounter.length < 1) {
        advisoryTotalAUS.push(0)
        advisoryDetAUS.push(0)
      } else {
        advisoryTotalAUS.push(advisoryCounter.reduce((a, b) => a + b, 0))
        advisoryDetAUS.push([advisoryCounterDet])
      }

      if(conciergeCounter.length < 1) {
        conciergeTotalAUS.push(0)
        conciergeDetAUS.push(0)
      } else {
        conciergeTotalAUS.push(conciergeCounter.reduce((a, b) => a + b, 0))
        conciergeDetAUS.push(conciergeCounterDet)
      }

      if(onboardingCounter.length < 1) {
        onboardingTotalAUS.push(0)
        onboardingDetAUS.push(0)
      } else {
        onboardingTotalAUS.push(onboardingCounter.reduce((a, b) => a + b, 0))
        onboardingDetAUS.push(onboardingCounterDet)
      }

      if(supportCounter.length < 1) {
        supportTotalAUS.push(0)
        supportDetAUS.push(0)
      } else {
        supportTotalAUS.push(supportCounter.reduce((a, b) => a + b, 0))
        supportDetAUS.push(supportCounterDet)
      }

      if(trainingCounter.length < 1) {
        trainingTotalAUS.push(0)
        trainingDetAUS.push(0)
      } else {
        trainingTotalAUS.push(trainingCounter.reduce((a, b) => a + b, 0))
        trainingDetAUS.push(trainingCounterDet)
      }
    })

    this.setState({
      adminsTotalAUS, 
      adminsDetAUS, 
      advisoryTotalAUS, 
      advisoryDetAUS,
      conciergeTotalAUS, 
      conciergeDetAUS,
      onboardingTotalAUS,
      onboardingDetAUS, 
      supportTotalAUS, 
      supportDetAUS,
      trainingTotalAUS,
      trainingDetAUS
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

    months.forEach((month) => {
      adminsCounter = []
      advisoryCounter = []
      conciergeCounter = []
      onboardingCounter = []
      supportCounter = []
      trainingCounter = []

      eiqData.forEach((line) => {
        if(month === line.date.substring(3) && line.territory === "USA" && line.product === "Admins") {
          adminsCounter.push(line.total * rates[month]["AUD/USD"])
        }

        if(month === line.date.substring(3) && line.territory === "USA" && line.product === "Advisory") {
          advisoryCounter.push(line.total * rates[month]["AUD/USD"])
        }

        if(month === line.date.substring(3) && line.territory === "USA" && line.product === "Concierge") {
          conciergeCounter.push(line.total * rates[month]["AUD/USD"])
        }

        if(month === line.date.substring(3) && line.territory === "USA" && line.product === "Onboarding") {
          onboardingCounter.push(line.total * rates[month]["AUD/USD"])
        }

        if(month === line.date.substring(3) && line.territory === "USA" && line.product === "Support") {
          supportCounter.push(line.total * rates[month]["AUD/USD"])
        }

        if(month === line.date.substring(3) && line.territory === "USA" && line.product === "Training") {
          trainingCounter.push(line.total * rates[month]["AUD/USD"])
        }
      })

      if(adminsCounter.length < 1) {
        adminsTotalUSA.push(0)
      } else {
        adminsTotalUSA.push(adminsCounter.reduce((a, b) => a + b, 0))
      }

      if(advisoryCounter.length < 1) {
        advisoryTotalUSA.push(0)
      } else {
        advisoryTotalUSA.push(advisoryCounter.reduce((a, b) => a + b, 0))
      }

      if(conciergeCounter.length < 1) {
        conciergeTotalUSA.push(0)
      } else {
        conciergeTotalUSA.push(conciergeCounter.reduce((a, b) => a + b, 0))
      }

      if(onboardingCounter.length < 1) {
        onboardingTotalUSA.push(0)
      } else {
        onboardingTotalUSA.push(onboardingCounter.reduce((a, b) => a + b, 0))
      }

      if(supportCounter.length < 1) {
        supportTotalUSA.push(0)
      } else {
        supportTotalUSA.push(supportCounter.reduce((a, b) => a + b, 0))
      }

      if(trainingCounter.length < 1) {
        trainingTotalUSA.push(0)
      } else {
        trainingTotalUSA.push(trainingCounter.reduce((a, b) => a + b, 0))
      }
    })

    this.setState({adminsTotalUSA, advisoryTotalUSA, conciergeTotalUSA, onboardingTotalUSA, supportTotalUSA, trainingTotalUSA}, this.getCANTotals)
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

    months.forEach((month) => {
      adminsCounter = []
      advisoryCounter = []
      conciergeCounter = []
      onboardingCounter = []
      supportCounter = []
      trainingCounter = []

      eiqData.forEach((line) => {
        if(month === line.date.substring(3) && line.territory === "CAN" && line.product === "Admins") {
          adminsCounter.push(line.total * rates[month]["AUD/CAD"])
        }

        if(month === line.date.substring(3) && line.territory === "CAN" && line.product === "Advisory") {
          advisoryCounter.push(line.total * rates[month]["AUD/CAD"])
        }

        if(month === line.date.substring(3) && line.territory === "CAN" && line.product === "Concierge") {
          conciergeCounter.push(line.total * rates[month]["AUD/CAD"])
        }

        if(month === line.date.substring(3) && line.territory === "CAN" && line.product === "Onboarding") {
          onboardingCounter.push(line.total * rates[month]["AUD/CAD"])
        }

        if(month === line.date.substring(3) && line.territory === "CAN" && line.product === "Support") {
          supportCounter.push(line.total * rates[month]["AUD/CAD"])
        }

        if(month === line.date.substring(3) && line.territory === "CAN" && line.product === "Training") {
          trainingCounter.push(line.total * rates[month]["AUD/CAD"])
        }
      })

      if(adminsCounter.length < 1) {
        adminsTotalCAN.push(0)
      } else {
        adminsTotalCAN.push(adminsCounter.reduce((a, b) => a + b, 0))
      }

      if(advisoryCounter.length < 1) {
        advisoryTotalCAN.push(0)
      } else {
        advisoryTotalCAN.push(advisoryCounter.reduce((a, b) => a + b, 0))
      }

      if(conciergeCounter.length < 1) {
        conciergeTotalCAN.push(0)
      } else {
        conciergeTotalCAN.push(conciergeCounter.reduce((a, b) => a + b, 0))
      }

      if(onboardingCounter.length < 1) {
        onboardingTotalCAN.push(0)
      } else {
        onboardingTotalCAN.push(onboardingCounter.reduce((a, b) => a + b, 0))
      }

      if(supportCounter.length < 1) {
        supportTotalCAN.push(0)
      } else {
        supportTotalCAN.push(supportCounter.reduce((a, b) => a + b, 0))
      }

      if(trainingCounter.length < 1) {
        trainingTotalCAN.push(0)
      } else {
        trainingTotalCAN.push(trainingCounter.reduce((a, b) => a + b, 0))
      }
    })

    this.setState({adminsTotalCAN, advisoryTotalCAN, conciergeTotalCAN, onboardingTotalCAN, supportTotalCAN, trainingTotalCAN}, this.getUKTotals)
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

    months.forEach((month) => {
      adminsCounter = []
      advisoryCounter = []
      conciergeCounter = []
      onboardingCounter = []
      supportCounter = []
      trainingCounter = []

      eiqData.forEach((line) => {
        if(month === line.date.substring(3) && line.territory === "UK" && line.product === "Admins") {
          adminsCounter.push(line.total * rates[month]["AUD/GBP"])
        }

        if(month === line.date.substring(3) && line.territory === "UK" && line.product === "Advisory") {
          advisoryCounter.push(line.total * rates[month]["AUD/GBP"])
        }

        if(month === line.date.substring(3) && line.territory === "UK" && line.product === "Concierge") {
          conciergeCounter.push(line.total * rates[month]["AUD/GBP"])
        }

        if(month === line.date.substring(3) && line.territory === "UK" && line.product === "Onboarding") {
          onboardingCounter.push(line.total * rates[month]["AUD/GBP"])
        }

        if(month === line.date.substring(3) && line.territory === "UK" && line.product === "Support") {
          supportCounter.push(line.total * rates[month]["AUD/GBP"])
        }

        if(month === line.date.substring(3) && line.territory === "UK" && line.product === "Training") {
          trainingCounter.push(line.total * rates[month]["AUD/GBP"])
        }
      })

      if(adminsCounter.length < 1) {
        adminsTotalUK.push(0)
      } else {
        adminsTotalUK.push(adminsCounter.reduce((a, b) => a + b, 0))
      }

      if(advisoryCounter.length < 1) {
        advisoryTotalUK.push(0)
      } else {
        advisoryTotalUK.push(advisoryCounter.reduce((a, b) => a + b, 0))
      }

      if(conciergeCounter.length < 1) {
        conciergeTotalUK.push(0)
      } else {
        conciergeTotalUK.push(conciergeCounter.reduce((a, b) => a + b, 0))
      }

      if(onboardingCounter.length < 1) {
        onboardingTotalUK.push(0)
      } else {
        onboardingTotalUK.push(onboardingCounter.reduce((a, b) => a + b, 0))
      }

      if(supportCounter.length < 1) {
        supportTotalUK.push(0)
      } else {
        supportTotalUK.push(supportCounter.reduce((a, b) => a + b, 0))
      }

      if(trainingCounter.length < 1) {
        trainingTotalUK.push(0)
      } else {
        trainingTotalUK.push(trainingCounter.reduce((a, b) => a + b, 0))
      }
    })

    this.setState({adminsTotalUK, advisoryTotalUK, conciergeTotalUK, onboardingTotalUK, supportTotalUK, trainingTotalUK}, this.getNZTotals)
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

    months.forEach((month) => {
      adminsCounter = []
      advisoryCounter = []
      conciergeCounter = []
      onboardingCounter = []
      supportCounter = []
      trainingCounter = []

      eiqData.forEach((line) => {
        if(month === line.date.substring(3) && line.territory === "NZ" && line.product === "Admins") {
          adminsCounter.push(line.total * rates[month]["AUD/NZD"])
        }

        if(month === line.date.substring(3) && line.territory === "NZ" && line.product === "Advisory") {
          advisoryCounter.push(line.total * rates[month]["AUD/NZD"])
        }

        if(month === line.date.substring(3) && line.territory === "NZ" && line.product === "Concierge") {
          conciergeCounter.push(line.total * rates[month]["AUD/NZD"])
        }

        if(month === line.date.substring(3) && line.territory === "NZ" && line.product === "Onboarding") {
          onboardingCounter.push(line.total * rates[month]["AUD/NZD"])
        }

        if(month === line.date.substring(3) && line.territory === "NZ" && line.product === "Support") {
          supportCounter.push(line.total * rates[month]["AUD/NZD"])
        }

        if(month === line.date.substring(3) && line.territory === "NZ" && line.product === "Training") {
          trainingCounter.push(line.total * rates[month]["AUD/NZD"])
        }
      })

      if(adminsCounter.length < 1) {
        adminsTotalNZ.push(0)
      } else {
        adminsTotalNZ.push(adminsCounter.reduce((a, b) => a + b, 0))
      }

      if(advisoryCounter.length < 1) {
        advisoryTotalNZ.push(0)
      } else {
        advisoryTotalNZ.push(advisoryCounter.reduce((a, b) => a + b, 0))
      }

      if(conciergeCounter.length < 1) {
        conciergeTotalNZ.push(0)
      } else {
        conciergeTotalNZ.push(conciergeCounter.reduce((a, b) => a + b, 0))
      }

      if(onboardingCounter.length < 1) {
        onboardingTotalNZ.push(0)
      } else {
        onboardingTotalNZ.push(onboardingCounter.reduce((a, b) => a + b, 0))
      }

      if(supportCounter.length < 1) {
        supportTotalNZ.push(0)
      } else {
        supportTotalNZ.push(supportCounter.reduce((a, b) => a + b, 0))
      }

      if(trainingCounter.length < 1) {
        trainingTotalNZ.push(0)
      } else {
        trainingTotalNZ.push(trainingCounter.reduce((a, b) => a + b, 0))
      }
    })


    this.setState({adminsTotalNZ, advisoryTotalNZ, conciergeTotalNZ, onboardingTotalNZ, supportTotalNZ, trainingTotalNZ}, this.combineTerritoryTotals)
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

    this.setState({ adminsTotals, advisoryTotals, conciergeTotals, onboardingTotals, supportTotals, trainingTotals })
  }


  render() {
    return (
      <div style={{ paddingTop: 24, paddingBotton: 24 }}>
        <DashboardHeading title={"EngagementIQ"} currentColor={this.state.currentColor} />
        <Segment color={this.state.currentColor} style={{ width: 1079 }} >
            <div>
              <div style={{ fontFamily: 'Titillium Web', textAlign: 'center' }}>
                <Button basic={false} primary onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>Global</Button>
                <Button basic={this.state.churnTer !== "AUS"} color="green" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>Australia</Button>
                <Button basic={this.state.churnTer !== "CAN"} color="yellow" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>Canada</Button>
                <Button basic={this.state.churnTer !== "USA"} color="red" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>United States</Button>
                <Button basic={this.state.churnTer !== "UK"} color="teal" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>United Kingdom</Button>
                <Button basic={this.state.churnTer !== "NZ"} color="purple" onClick={this.handleSelection} style={{ fontFamily: 'Titillium Web' }}>New Zealand</Button>
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
                <GridColumn>
                  <Segment color={this.state.currentColor}>
                    Display Data by:
                    <br />
                    <br />
                    <Grid columns={3}>
                      <GridColumn>
                      <Radio
                          label="Month"
                          name="monthly"
                          value="monthly"
                          checked={this.state.value === "monthly"}
                          onChange={this.handleTimeframeChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="Quarter"
                          name="quarterly"
                          value="quarterly"
                          checked={this.state.value === "quarterly"}
                          onChange={this.handleTimeframeChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="Financial Year"
                          name="fy"
                          value="fy"
                          checked={this.state.value === "fy"}
                          onChange={this.handleTimeframeChange}
                          enabled="true"
                        />
                      </GridColumn>
                    </Grid>
                  </Segment>
                </GridColumn>

              </Grid>
          </Segment>
        <Segment style={{ width: 1079 }} color={this.state.currentColor}>
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
      </div>
    )
  }
}

export default EIQ