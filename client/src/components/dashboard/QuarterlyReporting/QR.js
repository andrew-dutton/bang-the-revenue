import React, { Component } from 'react'
import { Dropdown, Segment } from 'semantic-ui-react'
import DataIn from '../DataIn'
import ActiveLicences from '../../dashboard/ActiveLicences/ActiveLicences'
import RecurringRevenueGraph from '../RecurringRevenue/RecurringRevenueGraph'
import Churn from '../Churn/Churn'
import Forex from '../../dashboard/Forex'
import DashboardHeading from '../../dashboard/DashboardHeading'

class QR extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dataIn: DataIn.DataIn,
      data: props.rawData,
      forex: Forex.rates,
      currentColor: 'yellow',
      months: [],
      quarters: [
        {
          key: "Q1 2020",
          text: "Q1 2020",
          value: "Q1 2020",
        },
        {
          key: "Q4 2019",
          text: "Q4 2019",
          value: "Q4 2019",
        },
        {
          key: "Q3 2019",
          text: "Q3 2019",
          value: "Q3 2019",
        },
        {
          key: "Q2 2019",
          text: "Q2 2019",
          value: "Q2 2019",
        },
        {
          key: "Q1 2019",
          text: "Q1 2019",
          value: "Q1 2019",
        },
        {
          key: "Q4 2018",
          text: "Q4 2018",
          value: "Q4 2018",
        },
        {
          key: "Q3 2018",
          text: "Q3 2018",
          value: "Q3 2018",
        },
        {
          key: "Q2 2018",
          text: "Q2 2018",
          value: "Q2 2018",
        },
        {
          key: "Q1 2018",
          text: "Q1 2018",
          value: "Q1 2018",
        },
        {
          key: "Q4 2017",
          text: "Q4 2017",
          value: "Q4 2017",
        },
        {
          key: "Q3 2017",
          text: "Q3 2017",
          value: "Q3 2017",
        },
        {
          key: "Q2 2017",
          text: "Q2 2017",
          value: "Q2 2017",
        },
        {
          key: "Q1 2017",
          text: "Q1 2017",
          value: "Q1 2017",
        },
        {
          key: "Q4 2016",
          text: "Q4 2016",
          value: "Q4 2016",
        },
        {
          key: "Q3 2016",
          text: "Q3 2016",
          value: "Q3 2016",
        },
        {
          key: "Q2 2016",
          text: "Q2 2016",
          value: "Q2 2016",
        },
        {
          key: "Q1 2016",
          text: "Q1 2016",
          value: "Q1 2016",
        },
        {
          key: "Q4 2015",
          text: "Q4 201,5",
          value: "Q4 201,5",
        },
        {
          key: "Q3 2015",
          text: "Q3 2015",
          value: "Q3 2015",
        },
        {
          key: "Q2 2015",
          text: "Q2 2015",
          value: "Q2 2015",
        },
        {
          key: "Q1 2015",
          text: "Q1 2015",
          value: "Q1 2015",
        }
      ]
    }

    this.displayLicenceData = this.displayLicenceData.bind(this)
    this.selecteQuarter = this.selecteQuarter.bind(this)
  }

  componentDidMount() {
    this.createMonthsArray()
  }

  getNumberOfMonthsSinceJuly2015 = () => {
    let today = new Date()

    if (!this.state.dataIn) {
      today.setMonth(today.getMonth() - 1)
    }

    let thisMonth = today.getMonth()
    let thisYear = today.getFullYear()
    let monthsOfYears = (thisYear - (2015 + 1)) * 12
    return monthsOfYears + thisMonth + 7
  }


  createMonthsArray = () => {
    const numberOfMonths = this.getNumberOfMonthsSinceJuly2015()

    let year = 2015
    let yearStep = 12
    let monthsHolder = []

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

      monthsHolder.push(new Date(year, month, 0))
      this.setState(prevState => ({ months: monthsHolder }), this.setStartingMonth)
    }
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

    this.setState((prevState) => ({ currentMonth: theDate, currentPrevMonth: thePrevDate, selectedMonth: startingMonthNumber }), this.setCurrentQaurter)
  }

  setCurrentQaurter = () => {
    let quarters = {
      Q1: ["July", "August", "September"],
      Q2: ["October", "November", "December"],
      Q3: ["January", "Febraury", "March"],
      Q4: ["April", "May", "June"]
    }

    let currentMonth = this.state.currentMonth.slice(0, this.state.currentMonth.indexOf(" "))
    let currentYear = this.state.currentMonth.slice(this.state.currentMonth.indexOf(" "))
    let currentQuarter = ""
    let currentFinYear = ""

    Object.keys(quarters).forEach((key) => {
      if (quarters[key].includes(currentMonth)) {
        currentQuarter = key
      }
    })

    if (currentQuarter === "Q1" || currentQuarter === "Q2") {
      let nextYear = parseInt(currentYear) + 1
      currentFinYear = nextYear
    } else {
      let lastYear = parseInt(currentYear) - 1
      currentFinYear = currentYear
    }

    this.setState(prevState => ({ currentQuarter, currentFinYear, selectedQuarter: currentQuarter }), this.getCurrentActiveLicences)
  }

  renderForQR = () => {
    this.setState({ render: "QR" })
  }

  getDataFromAL = (stateAL) => {
    this.setState({ stateAL })
  }

  getDataFromRR = (stateRR) => {
    this.setState({ stateRR })
  }

  getDataFromChurn = (stateChurn) => {
    this.setState({ stateChurn })
  }

  selecteQuarter = () => {

  }

  displayLicenceData = () => {
    if (this.state.currentQuarter === "Q1") {
      let { currentQuarter, currentFinYear, stateAL, quarters } = this.state
      let endOfQ1Total = 0

      console.log(this.state.selectedQuarter)

      return (
        <div>
          <Segment color="yellow" style={{ height: 1000, width: 1079 }}>
            <h4 style={{ display: 'inline' }}>
              Select Quarter to display:
            <h2 style={{ display: 'inline' }}>{"   "}
                <Dropdown
                  inline
                  options={quarters}
                  defaultValue={quarters[0]['text']}

                  onChange={(event, data) => this.setState({ selectedQuarter: data.value })}
                />
              </h2>
            </h4>
          </Segment>
        </div>
      )
    }
  }


  render() {
    if (this.state.months.length > 1) {
      return (
        <div style={{ paddingTop: 24, paddingBotton: 24 }}>
          <DashboardHeading title={"Quarterly Reporting"} currentColor={this.state.currentColor} />
          <ActiveLicences getDataFromAL={this.getDataFromAL} toRender={"QR"} rawData={this.state.data} />
          <RecurringRevenueGraph getDataFromRR={this.getDataFromRR} toRender={"QR"} forexData={this.state.forex} rawData={this.state.data} />
          <Churn getDataFromChurn={this.getDataFromChurn} toRender={"QR"} forexData={this.state.forex} rawData={this.state.data} />
          {this.selecteQuarter()}
          {this.displayLicenceData()}
        </div>
      )
    }

    return null

  }
}

export default QR






    // if (typeof (this.state.stateAL) !== "undefined") {
    //   console.log(this.state.stateAL)
    // }

    // if (typeof (this.state.stateRR) !== "undefined") {
    //   console.log(this.state.stateRR)
    // }

    // if (typeof (this.state.stateChurn) !== "undefined") {
    //   console.log(this.state.stateChurn)
    // }