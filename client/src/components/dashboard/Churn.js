import React, { Component } from 'react'
import { Segment, Button, Card, Dropdown, Form, Radio } from 'semantic-ui-react'
import Chart from 'react-google-charts'

class Churn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      clients: [],
      detail: [],
      lost: [],
      new: [],
      months: [],
      lostTest: [],
      newTest: [],
      totalTest: [],
      totalText: [],
      forChurnForumla: [],
      monthsText: [],
      territories: ["AUS", "CAN", "USA", "UK", "NZ"],
      chartData: [
        ['TERRITORY', 'AUS'],
        [1, 1]
      ],
      totalLost: [],
      churnOrNew: "new",
      churnTer: "",
      terOptions: [{
        key: "Australia",
        text: "AUS",
        value: "AUS"
      }, {
        key: "Canada",
        text: "CAN",
        value: "CAN"
      }, {
        key: "United States",
        text: "USA",
        value: "USA"
      }, {
        key: "UK",
        text: "UK",
        value: "UK"
      }, {
        key: "New Zealand",
        text: "NZ",
        value: "NZ"
      }]
    }

    this.totalClients = this.totalClients.bind(this)
    this.totalClientsDetail = this.totalClientsDetail.bind(this)
    this.getLostValue = this.getLostValue.bind(this)
    this.getExpansion = this.getExpansion.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
  }

  totalClients() {
    this.createMonthsArray()
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
          && (invoice["territory"] === this.state.churnTer)
        ) {
          counter.push(invoice["client"])
        }
      })

      const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
      }

      let uniqAusClients = counter.filter(onlyUnique)

      total.push(uniqAusClients)
    })

    this.setState(prevState => ({
      clients: [...total]
    }), this.totalClientsDetail)

    return null
  }


  totalClientsDetail() {
    this.setState((prevState) => ({ months: [] }))
    this.createMonthsArray()
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
          && (invoice["territory"] === this.state.churnTer)
        ) {
          counter.push(invoice)
        }
      })

      total.push(counter)
    })

    if (this.state.churnOrNew === "churn") {
      this.setState(prevState => ({
        detail: [...total]
      }), this.getLostClients)

      return null
    }

    if (this.state.churnOrNew === "new") {
      this.setState(prevState => ({
        detail: [...total]
      }), this.getNewClients)
    }

    return null

  }

  getLostClients = () => {
    this.createMonthsArray()
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
    this.createMonthsArray()
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

    let churn = (lost / (news + prevTotal) * 100)

    console.log(churn)


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

  getNumberOfMonthsSinceJuly2015 = () => {
    let today = new Date()
    let thisMonth = today.getMonth()
    let thisYear = today.getFullYear()
    let monthsOfYears = (thisYear - (2015 + 1)) * 12
    return monthsOfYears + thisMonth + 7
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

  handleSelection = (event, data) => {
    event.persist()
    this.setState((prevState) => ({ churnTer: event.target.textContent }))
  }

  renderLostClients = () => {
    if (this.state.lost.length === 0) {
      return null
    }

    return (
      <div>
        {this.state.lost.map((item, index) => (
          <Card>
            <h2 key={index}>{this.state.monthsText[index + 1]},{item.length},{this.state.clients[index].length}</h2>
            <h4>{item.length} client(s) lost</h4>
            {item.map((client, index) => (
              <p key={index}>{client}</p>
            ))}
          </Card>
        ))}
      </div>
    )
  }

  handleChange = (e, { value }) => this.setState({ radioValue: value, churnOrNew: value })

  render() {

    const headingStyle = {
      textAlign: 'center'
    }

    const radioStyle = {
      textAlign: 'left'
    }
    const { radioValue } = this.state
    const { value } = this.state
    return (
      <div style={{ paddingTop: 20 }}>
        <Segment style={{ width: 1079 }} >
          <div style={{ paddingTop: 20 }}>
            <Dropdown
              placeholder="Select Territory"
              selection
              onChange={this.handleSelection}
              options={this.state.terOptions}
              value={value}
            />
            <Button primary onClick={this.totalClients}>
              Load Data
            </Button>
          </div>
          <Form style={radioStyle}>
            <Form.Field >
              <Radio
                style={{ "paddingRight": "20px" }}
                label='Churn'
                name='radioGroup'
                value='churn'
                checked={this.state.radioValue === 'churn'}
                onChange={this.revenueTotals}
                onClick={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label='New Clients'
                name='newClients'
                value='new'
                checked={this.state.radioValue === 'new'}
                onChange={this.revenueTotalsNON}
                onClick={this.handleChange}
              />
            </Form.Field>
          </Form>
        </Segment>

        <Segment style={{ width: 1079, height: 800 }}>
          <div>
            <Chart
              width={'1000px'}
              height={'700px'}
              chartType="ScatterChart"
              loader={<div>Loading Chart</div>}
              data={this.state.chartData}
              options={{
                'legend': { 'position': 'top' },
                'chartArea': { 'width': '80%', 'height': '80%' },
                subtitle: 'in millions of dollars (USD)',
                crosshair: { trigger: 'both', orientation: 'both' },
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
                  },
                }
              }}
            />
          </div>
          <div></div>
          <div>

          </div>

        </Segment>



        {/* <Button secondary onClick={this.getNewClients}>
          Get New Clients
        </Button>
        <Button secondary onClick={this.getLostValue}>
          Get Lost Value
        </Button>
        <Button secondary onClick={this.getExpansion}>
          Get Expanded Value
        </Button> */}
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