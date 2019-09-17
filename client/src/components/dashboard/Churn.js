import React, { Component } from 'react'
import { Button, Card } from 'semantic-ui-react'

class Churn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      aus: [],
      detail: [],
      lost: [],
      new: [],
      months: [],
      monthsText: [],
      churnTer: "AUS"
    }

    this.totalClients = this.totalClients.bind(this)
    this.totalClientsDetail = this.totalClientsDetail.bind(this)
    this.getLostValue = this.getLostValue.bind(this)
    this.getExpansion = this.getExpansion.bind(this)
  }

  getNumberOfMonthsSinceJuly2015 = () => {
    let today = new Date()
    let thisMonth = today.getMonth()
    let thisYear = today.getFullYear()
    let monthsOfYears = (thisYear - (2015 + 1)) * 12
    return monthsOfYears + thisMonth + 7
  }

  createMonthsArray = () => {
    this.setState(previous => ({
      months: []
    }))
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

  getLostClients = () => {
    this.createMonthsArray()
    let lostClients = []
    let lostClientsArray = []

    for (let i = 0; i < this.state.months.length - 1; i++) {
      lostClients = []
      this.state.aus[i].forEach((client) => this.state.aus[i + 1].includes(client) ? null : lostClients.push(client))
      lostClientsArray.push(lostClients)
    }

    this.setState(previous => ({
      lost: [...lostClientsArray]
    }))
  }

  getNewClients = () => {
    this.createMonthsArray()
    let newClients = []
    let newClientsArray = []

    for (let i = 0; i < this.state.months.length - 1; i++) {
      newClients = []
      this.state.aus[i + 1].forEach((client) => {
        if (!this.state.aus[i].includes(client)) {
          newClients.push(client)
        }
      })
      newClientsArray.push(newClients)
    }

    this.setState(previous => ({
      new: [...newClientsArray]
    }))
  }




  totalClients() {
    this.createMonthsArray()
    const ausTotal = []

    this.state.months.forEach((month) => {
      let ausCounter = []

      this.props.rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month
          && (invoice["territory"] === this.state.churnTer)
        ) {
          ausCounter.push(invoice["client"])
        }
      })

      const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
      }

      let uniqAusClients = ausCounter.filter(onlyUnique)

      ausTotal.push(uniqAusClients)
    })

    this.setState(prevState => ({
      aus: [...ausTotal]
    }))

    return null
  }

  totalClientsDetail() {
    this.createMonthsArray()
    const ausTotal = []

    this.state.months.forEach((month) => {
      let ausCounter = []

      this.props.rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month
          && (invoice["territory"] === this.state.churnTer)
        ) {
          ausCounter.push(invoice)
        }
      })

      ausTotal.push(ausCounter)
    })

    this.setState(prevState => ({
      detail: [...ausTotal]
    }))

    return null
  }

  getLostValue = () => {
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
    this.createMonthsArray()
    let expanseValue = []
    let expanseValueArray = []


    if (this.state.new.length > 0) {
      for (let i = 0; i < this.state.months.length - 1; i++) {

        expanseValue = []
        this.state.new[i].forEach((newClient) => {
          let pos = this.state.detail[i + 1].findIndex(i => i.client === newClient)
          console.log(this.state.detail[i + 1][pos]["valuepermonth"])
          expanseValue.push(this.state.detail[i + 1][pos]["valuepermonth"])
        })
        expanseValueArray.push(+expanseValue.reduce((a, b) => a + b, 0).toFixed(2))
      }
    }

    console.log(expanseValueArray)
  }




  renderNewClients = () => {
    if (this.state.new.length === 0) {
      return null
    }

    return (
      <div>
        {this.state.new.map((item, index) => (
          <Card>
            <h2 key={index}>{this.state.monthsText[index + 1]},{item.length}</h2>
            <h4>{item.length} new client(s)</h4>
            {item.map((client, index) => (
              <p key={index}>{client}</p>
            ))}
          </Card>
        ))}
      </div>
    )
  }

  renderLostClients = () => {
    if (this.state.lost.length === 0) {
      return null
    }

    return (
      <div>
        {this.state.lost.map((item, index) => (
          <Card>
            <h2 key={index}>{this.state.monthsText[index + 1]},{item.length},{this.state.aus[index].length}</h2>
            <h4>{item.length} client(s) lost</h4>
            {item.map((client, index) => (
              <p key={index}>{client}</p>
            ))}
          </Card>
        ))}
      </div>
    )
  }

  render() {
    return (
      <div>
        <h1>Churn</h1>
        <Button primary onClick={this.totalClients}>
          Load All Clients
        </Button>
        <Button primary onClick={this.totalClientsDetail}>
          Load All Clients with Detail
        </Button>
        <br />
        <Button secondary onClick={this.getLostClients}>
          Get Lost Clients
        </Button>
        <Button secondary onClick={this.getNewClients}>
          Get New Clients
        </Button>
        <Button secondary onClick={this.getLostValue}>
          Get Lost Value
        </Button>
        <Button secondary onClick={this.getExpansion}>
          Get Expanded Value
        </Button>
        {/* {console.log(this.state.aus)} */}
        {/* {console.log(this.state.lost)} */}
        {/* {console.log(this.state.detail)} */}
        {this.renderLostClients()}
        {this.renderNewClients()}
      </div>
    )
  }
}

export default Churn