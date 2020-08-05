import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import DataIn from '../DataIn'

class ChurnBox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      thisMonth: DataIn.Churn.thisMonth,
      lastMonth: DataIn.Churn.lastMonth,
      diff: DataIn.Churn.diff,
      monthName: "",
      months: []
    }
  }

  componentDidMount() {
    this.createMonthsArray()
  }

  createMonthsArray = () => {
    const numberOfMonths = DataIn.MonthNumber

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
    }

    let monthsOfYear = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ]

    let month = this.state.months[this.state.months.length - 2]
    let theYear = month.getFullYear()

    month = monthsOfYear[month.getMonth()]

    let fullDate = month + " " + theYear

    this.setState(({ monthName: fullDate }), this.setStartingMonth)
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

    this.setState((prevState) => ({ currentMonth: theDate, currentPrevMonth: thePrevDate, selectedMonth: startingMonthNumber }), this.totalGlobalClients)
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
          invoice["product"] === "Annual" ||
          invoice["product"] === "Project"
          // invoice["product"] === "Static" ||
          // invoice["product"] === "Budget Allocator"
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
    }), this.getLostClients)

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
    let churn = this.state.forChurnForumla
    let churnArray = [['Date', this.state.churnTer]]

    for (let k = 0; k < churn.length - 1; k++) {
      churnArray.push([new Date(2015, k + 8, 0), ((churn[k][0] / (churn[k][1] + churn[k][2])) * 100)])
    }

    this.setState((prevState) => ({
      chartData: churnArray
    }), this.getFinalArray)
  }

  getFinalArray = () => {
    let thisMonthChurn = this.state.chartData[this.state.selectedMonth + 1][1].toFixed(2)
    let diff = (this.state.chartData[this.state.selectedMonth + 1][1].toFixed(2) - this.state.chartData[this.state.selectedMonth][1].toFixed(2)).toFixed(2)
    this.setState({diff, thisMonthChurn})

    if(diff <= 0) {
      this.setState({arrow: "triangle down", arrowColor: "green"})
    } else {
      this.setState({arrow: "triangle up", arrowColor: "red"})
    }
  }

  boxSelected = () => {
      return (
        <div style={{ height: 150 }}>
          <h1 style={{ position: 'absolute', left: '50%', top: '75%', transform: 'translate(-50%, -50%)', fontFamily: 'Titillium Web' }}>{this.state.thisMonthChurn}%</h1>
          <h3 style={{ fontFamily: 'Titillium Web' }}>{this.state.monthName}</h3>
          <h4 style={{ fontFamily: 'Titillium Web' }}><Icon name={this.state.arrow} color={this.state.arrowColor} />{this.state.diff}%</h4>
        </div>
      )
  } 

  render() {
    return (
      <div>
        {this.boxSelected()}
      </div >
    )
  }
}

export default ChurnBox