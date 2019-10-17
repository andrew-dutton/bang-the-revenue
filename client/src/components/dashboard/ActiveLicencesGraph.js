import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import { Grid, Segment, Checkbox } from 'semantic-ui-react'
import { HotTable } from '@handsontable/react';

class ActiveLicencesGraph extends Component {
  constructor(props) {
    super(props)

    this.state = {
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
    this.handleClickAnnual = this.handleClickAnnual.bind(this)
    this.handleClickProject = this.handleClickProject.bind(this)
    this.handleClickStatic = this.handleClickStatic.bind(this)
    this.handleClickBudget = this.handleClickBudget.bind(this)
  }

  componentDidMount() {
    this.totalClients()
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
    let today = new Date()
    let thisMonth = today.getMonth()
    let thisYear = today.getFullYear()
    let monthsOfYears = (thisYear - (2015 + 1)) * 12
    return monthsOfYears + thisMonth + 7
  }

  createMonthsArray = () => {
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
    }

  }

  totalClients() {
    this.setState(prevState => ({ months: [] }))
    this.createMonthsArray()

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
    }))

    this.setState(prevState => ({
      canData: [...canTotal],
      currentCan: canTotal[canTotal.length - 2],
    }))

    this.setState(prevState => ({
      usaData: [...usaTotal],
      currentUsa: usaTotal[usaTotal.length - 2],
    }))

    this.setState(prevState => ({
      ukData: [...ukTotal],
      currentUk: ukTotal[ukTotal.length - 2],
    }))

    this.setState(prevState => ({
      nzData: [...nzTotal],
      currentNz: nzTotal[nzTotal.length - 2],
    }))

    this.setState((prevState) => ({
      loadButtonActive: false
    }))

    this.setState(prevState => ({
      ausDetail: ausDetLogged
    }))

    return null
  }

  displayTotal = () => {
    if (this.state.loadButtonActive === false) {
      return (this.state.currentAus + this.state.currentCan + this.state.currentUsa + this.state.currentUk + this.state.currentNz)
    } else {
      return ("...")
    }

  }

  displayDetails = () => {
    if ((this.state.currentAus + this.state.currentCan + this.state.currentUsa + this.state.currentUk + this.state.currentNz) > 0) {
      return (
        <Grid columns='equal' style={{ width: 1109, paddingBottom: 50, color: 'black' }}>
          <Grid.Column>
            <Segment>
              <h3><strong>Total: {this.displayTotal()}</strong></h3>
              <div id="hot-app">
                <HotTable
                  licenseKey="non-commercial-and-evaluation"
                  className={"htCenter"}
                  style={{ fontSize: 10, color: 'black' }}
                  cells={function (row, col) {
                    var cellPrp = {};
                    if (col === 0) {
                      if (col % 2 === 0) {
                        cellPrp.className = 'htLeft'
                      } else if (col === 1) {
                        cellPrp.className = 'htCenter'
                      }
                    } else {
                      cellPrp.className = 'htCenter htMiddle'
                    }
                    return cellPrp
                  }
                  }
                  htDimmed
                  manualColumnResize
                  wordWrap={false}
                  height={400}
                  editor={false}
                  columns={[{}, {}, {}, {}, {}, {}, {}, { type: "numeric", numericFormat: { pattern: "0,00" } }]}
                  columnSorting={true}
                  colWidths={[522, 50, 59, 75, 75, 75, 75, 60]}
                  rowHeaders={true}
                  colHeaders={this.state.table.colHeaders}
                  data={this.state.ausDetail[this.state.ausDetail.length - 2]} />
              </div>
            </Segment>
          </Grid.Column>
        </Grid>
      )
    }
  }

  render() {
    const headingStyle = {
      textAlign: 'center',
      width: 1300

    }
    const { annualActive, projectActive, staticActive, budgetActive } = this.state
    const data = {
      labels: [
        'Jul-15', 'Aug-15', 'Sep-15', 'Oct-15', 'Nov-15', 'Dec-15', 'Jan-16', 'Feb-16', 'Mar-16', 'Apr-16', 'May-16', 'Jun-16',
        'Jul-16', 'Aug-16', 'Sep-16', 'Oct-16', 'Nov-16', 'Dec-16', 'Jan-17', 'Feb-17', 'Mar-17', 'Apr-17', 'May-17', 'Jun-17',
        'Jul-17', 'Aug-17', 'Sep-17', 'Oct-17', 'Nov-17', 'Dec-17', 'Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18', 'Jun-18',
        'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18', 'Dec-18', 'Jan-19', 'Feb-19', 'Mar-19', 'Apr-19', 'May-19', 'Jun-19',
        'Jul-19', 'Aug-19', 'Sep-19'
      ],
      datasets: [
        {
          label: 'Australia',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,1,0.4)',
          borderColor: 'rgba(75,192,1,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: this.state.ausData,
          options: {
            trendlines: {
              type: 'polynomial',
              degree: 3

            },
            callbacks: {
              label: "Test"
            }

          }
        },
        {
          label: 'Canada',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(222,213,42,0.4)',
          borderColor: 'rgba(222,213,42,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: this.state.canData,
          trendlineLinear: {
            style: "rgba(255,105,180, .8)",
            lineStyle: "dotted|solid",
            width: 2
          }
        },
        {
          label: 'USA',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(234,77,49,0.4)',
          borderColor: 'rgba(234,77,49,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: this.state.usaData
        },
        {
          label: 'UK',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(49,234,212,0.4)',
          borderColor: 'rgba(49,234,212,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: this.state.ukData
        },
        {
          label: 'New Zealand',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(234,49,223,0.4)',
          borderColor: 'rgba(234,49,223,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: this.state.nzData
        }
      ]
    }

    return (
      <div style={{ paddingTop: 12 }}>
        <div>
          <div>

            {/* <p>Australia: {this.state.currentAus}</p>
            <p>Canada: {this.state.currentCan}</p>
            <p>USA: {this.state.currentUsa}</p>
            <p>UK: {this.state.currentUk}</p>
            <p>NZ: {this.state.currentNz}</p> */}
          </div>
          <Grid columns='equal' style={{ width: 1300 }}>
            <Grid.Column>
              <Segment style={{ width: 70, height: 513 }}>
                <br />
                <div>
                  Annual
                <br />
                  <br />
                  <Checkbox defaultChecked toggle active={annualActive} onClick={this.handleClickAnnual} />
                </div>

                <br />
                <div>
                  Project
                <br />
                  <br />
                  <Checkbox defaultChecked toggle active={projectActive} onClick={this.handleClickProject} />
                </div>

                <br />
                <div>
                  Static
                <br />
                  <br />
                  <Checkbox defaultChecked toggle active={staticActive} onClick={this.handleClickStatic} />
                </div>
                <br />

                <div>
                  Budget
                <br />
                  <br />
                  <Checkbox defaultChecked toggle active={budgetActive} onClick={this.handleClickBudget} />
                </div>
                <br />
                <br />
                <div style={headingStyle}>
                  <br />
                  <br />
                </div>
                {/* <div>
  <Button primary disabled={!this.state.loadButtonActive} onClick={this.totalClients}>
    Load Chart
  </Button>
</div> */}
              </Segment>
            </Grid.Column>
            <Grid.Column width={15}>
              <Segment style={{ width: 1000 }}>
                <Line
                  data={data}
                  options={{
                    scales: {
                      yAxes: [{
                        ticks: {
                          min: 0
                        }
                      }]
                    }
                  }} />
              </Segment>
            </Grid.Column>
          </Grid>
        </div>
        <div>
          {this.displayDetails()}
        </div>
      </div>
    )
  }
}

export default ActiveLicencesGraph
