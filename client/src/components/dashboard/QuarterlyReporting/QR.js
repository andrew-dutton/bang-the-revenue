import React, { Component } from 'react'
import { Dropdown, Segment, Table } from 'semantic-ui-react'
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
      data: props.rawData,
      forex: Forex.rates,
      currentColor: 'yellow',
      months: [],
      quarterMonths: {
        Q1: ["July", "August", "September"],
        Q2: ["October", "November", "December"],
        Q3: ["January", "Febraury", "March"],
        Q4: ["April", "May", "June"]
      },
      quarters: [
        {
          key: 48,
          text: "Q1 2020",
          value: "Q1 2020",
        },
        {
          key: 45,
          text: "Q4 2019",
          value: "Q4 2019",
        },
        {
          key: 42,
          text: "Q3 2019",
          value: "Q3 2019",
        },
        {
          key: 39,
          text: "Q2 2019",
          value: "Q2 2019",
        },
        {
          key: 36,
          text: "Q1 2019",
          value: "Q1 2019",
        },
        {
          key: 33,
          text: "Q4 2018",
          value: "Q4 2018",
        },
        {
          key: 30,
          text: "Q3 2018",
          value: "Q3 2018",
        },
        {
          key: 27,
          text: "Q2 2018",
          value: "Q2 2018",
        },
        {
          key: 24,
          text: "Q1 2018",
          value: "Q1 2018",
        },
        {
          key: 21,
          text: "Q4 2017",
          value: "Q4 2017",
        },
        {
          key: 18,
          text: "Q3 2017",
          value: "Q3 2017",
        },
        {
          key: 15,
          text: "Q2 2017",
          value: "Q2 2017",
        },
        {
          key: 12,
          text: "Q1 2017",
          value: "Q1 2017",
        },
        {
          key: 9,
          text: "Q4 2016",
          value: "Q4 2016",
        },
        {
          key: 6,
          text: "Q3 2016",
          value: "Q3 2016",
        },
        {
          key: 3,
          text: "Q2 2016",
          value: "Q2 2016",
        },
        {
          key: 0,
          text: "Q1 2016",
          value: "Q1 2016",
        }
      ]
    }

    this.displayQtrSelector = this.displayQtrSelector.bind(this)

  }

  componentDidMount() {
    this.createMonthsArray()
  }

  getNumberOfMonthsSinceJuly2015 = () => {
    return DataIn.MonthNumber
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

    this.setState(prevState => ({ currentQuarter, currentFinYear, selectedQuarter: currentQuarter + " " + currentFinYear }))
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
    this.setState({ stateChurn }, this.getCurrentQuarterAL)
  }

  getCurrentQuarterAL = () => {
    let { selectedQuarter, stateAL, quarters } = this.state
    let { ausData, canData, usaData, ukData, nzData } = stateAL



    quarters.forEach(qtr => {
      if (qtr.value === selectedQuarter) {
        let firstMonth = qtr.key
        let aus = ausData[firstMonth + 2]
        let can = canData[firstMonth + 2]
        let usa = usaData[firstMonth + 2]
        let uk = ukData[firstMonth + 2]
        let nz = nzData[firstMonth + 2]

        let ausPrev = ausData[firstMonth - 1]
        let canPrev = canData[firstMonth - 1]
        let usaPrev = usaData[firstMonth - 1]
        let ukPrev = ukData[firstMonth - 1]
        let nzPrev = nzData[firstMonth - 1]

        let totalALForSelectedQtr = aus + can + usa + uk + nz
        let totalALForPrevQtr = ausPrev + canPrev + usaPrev + ukPrev + nzPrev
        this.setState({ totalALForSelectedQtr, totalALForPrevQtr })
      }
    })

  }


  displayQtrSelector = () => {
    if (this.state.currentQuarter === "Q1") {
      let { currentQuarter, currentFinYear, stateAL, quarters } = this.state
      let endOfQ1Total = 0


      return (
        <div>
          <Segment color="yellow" style={{ width: 1079 }}>
            <h2 style={{ textAlign: "center" }}>{"   "}
              <Dropdown
                inline
                options={quarters}
                defaultValue={quarters[0]['text']}
                onChange={(e, data) => this.setState(({ selectedQuarter: data.value }), this.getCurrentQuarterAL)}
              />
            </h2>
          </Segment>
        </div>
      )
    }
  }

  displayReport = () => {
    return (
      <div>
        <Segment color="yellow" style={{ width: 1079, height: 950, marginTop: 12 }}>
          <Table width={16} compact textAlign={'center'} definition>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={4} />
                <Table.HeaderCell>This Quarter</Table.HeaderCell>
                <Table.HeaderCell>Previous Quarter</Table.HeaderCell>
                <Table.HeaderCell>Change</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Total Clients</Table.Cell>
                <Table.Cell>{this.state.totalALForSelectedQtr}</Table.Cell>
                <Table.Cell>{this.state.totalALForPrevQtr}</Table.Cell>
                <Table.Cell>{this.state.totalALForSelectedQtr - this.state.totalALForPrevQtr}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Lost Clients</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>New Clients</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Churn Rate</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>eHQ MMR</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>eIQ MMR</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Total MMR</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>eHQ Non-MMR</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>eIQ Non-MR</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Total Non-MMR</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>eHQ Avg Monthly NON-RR</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>eHQ Avg Monthly NON-RR</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>eHQ Accrued Revenue</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>eIQ Accrued Revenue</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Total Accrued Revenue</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Revenue Run Rate</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Total Invoiced</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Total Spent</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Net Cashflow</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Budgeted Global Spend</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Actual Global Spend</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Global Variance</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
                <Table.Cell>...</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Segment>
      </div>
    )
  }



  render() {
    if (this.state.months.length > 1) {
      return (
        <div style={{ paddingTop: 24, paddingBotton: 24 }}>
          <DashboardHeading title={"Quarterly Reporting"} currentColor={this.state.currentColor} />
          <ActiveLicences getDataFromAL={this.getDataFromAL} toRender={"QR"} rawData={this.state.data} />
          <RecurringRevenueGraph getDataFromRR={this.getDataFromRR} toRender={"QR"} forexData={this.state.forex} rawData={this.state.data} />
          <Churn getDataFromChurn={this.getDataFromChurn} toRender={"QR"} forexData={this.state.forex} rawData={this.state.data} />
          {this.displayQtrSelector()}
          {this.displayReport()}
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