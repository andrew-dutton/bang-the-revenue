import React, { Component } from 'react'
import { Dropdown, Segment, Table } from 'semantic-ui-react'
import DataIn from '../DataIn'
import ActiveLicences from '../../dashboard/ActiveLicences/ActiveLicences'
import RecurringRevenueGraph from '../RecurringRevenue/RecurringRevenueGraph'
import Churn from '../Churn/Churn'
import DashboardHeading from '../../dashboard/DashboardHeading'

class QR extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: props.rawData,
      forex: DataIn.rates,
      currentColor: 'yellow',
      months: [],
      quarterMonths: {
        Q1: ["July", "August", "September"],
        Q2: ["October", "November", "December"],
        Q3: ["January", "Febraury", "March"],
        Q4: ["April", "May", "June"]
      },
      quarters: DataIn.Quarters
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

    if (currentMonth === "January" || currentMonth === "February") {
      currentQuarter = "Q4"
    }

    if (currentMonth === "April" || currentMonth === "May") {
      currentQuarter = "Q3"
    }

    if (currentMonth === "July" || currentMonth === "August") {
      currentQuarter = "Q2"
    }

    if (currentMonth === "October" || currentMonth === "November") {
      currentQuarter = "Q1"
    }

    if (currentQuarter === "Q1" || currentQuarter === "Q2") {
      let nextYear = parseInt(currentYear) + 1
      currentFinYear = nextYear
    } else {
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
    this.setState({ stateChurn }, this.getActiveLicences)
  }

  displayQtrSelector = () => {
    let { quarters } = this.state

    return (
      <div>
        <Segment color="yellow" style={{ width: 1079 }}>
          <h2 style={{ textAlign: "center" }}>{"   "}
            <Dropdown
              inline
              options={quarters}
              defaultValue={quarters[0]['text']}
              onChange={(e, data) => this.setState(({ selectedQuarter: data.value }), this.getActiveLicences)}
            />
          </h2>
        </Segment>
      </div>
    )
  }

  getActiveLicences = () => {
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
        this.setState({ totalALForSelectedQtr, totalALForPrevQtr }, this.getLostClients)
      }
    })
  }

  getLostClients = () => {
    let { selectedQuarter, quarters } = this.state
    let { lost } = this.state.stateChurn
    quarters.forEach(qtr => {
      if (qtr.value === selectedQuarter) {
        let firstMonth = qtr.key

        if (!lost[firstMonth]) {
          return null
        }

        let month1 = lost[firstMonth - 1].length
        let month2 = lost[firstMonth].length
        let month3 = lost[firstMonth + 1].length

        let prevMonth2 = lost[firstMonth - 3].length
        let prevMonth3 = lost[firstMonth - 2].length
        let totalLostForSelectedQtr = month1 + month2 + month3
        let totalLostForPrevQtr = "N/A"

        let prevMonth1 = 0
        if (lost[firstMonth - 4]) {
          prevMonth1 = lost[firstMonth - 4].length
          totalLostForPrevQtr = prevMonth1 + prevMonth2 + prevMonth3
        } else {
          totalLostForPrevQtr = "N/A"
        }


        this.setState(prevState => ({ totalLostForSelectedQtr, totalLostForPrevQtr }), this.getNewClients)
      }
    })
  }

  getNewClients = () => {
    let { selectedQuarter, quarters } = this.state
    let newC = this.state.stateChurn.new
    quarters.forEach(qtr => {
      if (qtr.value === selectedQuarter) {
        let firstMonth = qtr.key

        let month1 = newC[firstMonth - 1].length
        let month2 = newC[firstMonth].length
        let month3 = newC[firstMonth + 1].length

        let prevMonth2 = newC[firstMonth - 3].length
        let prevMonth3 = newC[firstMonth - 2].length
        let totalNewForSelectedQtr = month1 + month2 + month3
        let totalNewForPrevQtr = "N/A"

        let prevMonth1 = 0
        if (newC[firstMonth - 4]) {
          prevMonth1 = newC[firstMonth - 4].length
          totalNewForPrevQtr = prevMonth1 + prevMonth2 + prevMonth3
        } else {
          totalNewForPrevQtr = "N/A"
        }

        this.setState(prevState => ({ totalNewForSelectedQtr, totalNewForPrevQtr }), this.getChurn)

      }
    })
  }

  getChurn = () => {
    let { selectedQuarter, quarters } = this.state
    let churn = this.state.stateChurn.chartData
    quarters.forEach(qtr => {
      if (qtr.value === selectedQuarter) {
        let firstMonth = qtr.key

        let month1 = churn[firstMonth][1]
        let month2 = churn[firstMonth + 1][1]
        let month3 = churn[firstMonth + 2][1]

        let totalChurnForSelectedQtr = 0
        let totalChurnForPrevQtr = 0

        if (qtr.key < 7) {
          totalChurnForSelectedQtr = month1 + month2 + month3

          this.setState({ totalChurnForSelectedQtr, totalChurnForPrevQtr: 0.0000001 }, this.getMRR)

        } else {
          let prevMonth1 = churn[firstMonth - 3][1]
          let prevMonth2 = churn[firstMonth - 2][1]
          let prevMonth3 = churn[firstMonth - 1][1]
          totalChurnForSelectedQtr = month1 + month2 + month3
          totalChurnForPrevQtr = prevMonth1 + prevMonth2 + prevMonth3

          this.setState(({ totalChurnForSelectedQtr, totalChurnForPrevQtr }), this.getMRR)
        }
      }
    })
  }

  getMRR = () => {
    let { ausDataRR, canDataRR, usaDataRR, ukDataRR, nzDataRR, } = this.state.stateRR
    let { selectedQuarter, forex, quarters } = this.state

    quarters.forEach(qtr => {
      if (qtr.value === selectedQuarter) {
        let firstMonth = qtr.key
        let pad = (n) => {
          return (n < 10) ? ("0" + n) : n
        }

        let month3 = this.state.months[firstMonth + 2].getMonth() + 1
        month3 = pad(month3)
        let year = this.state.months[firstMonth].getFullYear()
        let forexMonth3 = month3 + "/" + year
        let audcad3 = forex[forexMonth3]["AUD/CAD"]
        let audusd3 = forex[forexMonth3]["AUD/USD"]
        let audgbp3 = forex[forexMonth3]["AUD/GBP"]
        let audnzd3 = forex[forexMonth3]["AUD/NZD"]
        let aus3 = ausDataRR[firstMonth + 2]
        let can3 = canDataRR[firstMonth + 2] * audcad3
        let usd3 = usaDataRR[firstMonth + 2] * audusd3
        let gbp3 = ukDataRR[firstMonth + 2] * audgbp3
        let nzd3 = nzDataRR[firstMonth + 2] * audnzd3
        let mrrEndOfCurrentQtr = (aus3 + can3 + usd3 + gbp3 + nzd3).toFixed(0)

        this.setState({ mrrEndOfCurrentQtr })

      }
    })



  }


  displayReport = () => {
    if (!this.state.totalChurnForSelectedQtr || !this.state.totalChurnForPrevQtr) {
      return null
    }

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
                <Table.Cell>{this.state.totalLostForSelectedQtr}</Table.Cell>
                <Table.Cell>{this.state.totalLostForPrevQtr}</Table.Cell>
                <Table.Cell>{this.state.totalLostForSelectedQtr - this.state.totalLostForPrevQtr}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>New Clients</Table.Cell>
                <Table.Cell>{this.state.totalNewForSelectedQtr}</Table.Cell>
                <Table.Cell>{this.state.totalNewForPrevQtr}</Table.Cell>
                <Table.Cell>{this.state.totalNewForSelectedQtr - this.state.totalNewForPrevQtr}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Churn Rate</Table.Cell>
                <Table.Cell>{(this.state.totalChurnForSelectedQtr).toFixed(2)}%</Table.Cell>
                <Table.Cell>{(this.state.totalChurnForPrevQtr).toFixed(2)}%</Table.Cell>
                <Table.Cell>{(this.state.totalChurnForSelectedQtr - this.state.totalChurnForPrevQtr).toFixed(2)}%</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>MRR at end of Qtr</Table.Cell>
                <Table.Cell>{this.state.mrrEndOfCurrentQtr}</Table.Cell>
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
                <Table.Cell>Average Monthly NON-RR for Qtr</Table.Cell>
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
