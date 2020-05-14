import React, { Component } from 'react'
import { Segment, Grid } from 'semantic-ui-react'
import Chart from 'react-google-charts'
import DataIn from '../DataIn'


class ChurnDollars extends Component {
	static getDerivedStateFromProps(props, state) {
    if (props.annual !== state.annual) {
      return { annual: props.annual };
		}
		if (props.project !== state.project) {
      return { project: props.project };
		}
		if (props.static !== state.static) {
      return { static: props.static };
		}
		if (props.annual !== state.annual) {
      return { annual: props.annual };
		}
		if (props.budget !== state.budget) {
      return { budget: props.budget };
		}
		if (props.churnTer !== state.churnTer) {
      return { churnTer: props.churnTer };
    }
    return null;
	}
	
	constructor(props) {
		super(props)

		this.state = {
			chartData: [],
			chartColor: props.chartColor,
			months: [],
			forexData: props.forexData,
			totalDataRR: [],
			churnTer: props.churnTer,
			annual: props.annual,
			project: props.project,
			budget: props.budget,
			static: props.static,
			renderSwitch: true
		}
	}

	componentDidMount = () => {
		this.createForexArrays()
	}

	componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      this.createForexArrays();
    }
	}

	updateChurnValueFromParent = () => {
		if(this.state.selectedMonth) {
			console.log('child trigger')
			this.props.setChurnDollarsChurnValue(this.state.chartData[this.state.selectedMonth + 1][1])
		}
	}
	
	numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	}
	
	createForexArrays = () => {
		const rates = DataIn.rates
		let canRates = []
    let usaRates = []
		let ukRates = []
		let nzRates = []

    Object.keys(rates).forEach(month => {
      canRates.push(rates[month]["AUD/CAD"])
      usaRates.push(rates[month]["AUD/USD"])
			ukRates.push(rates[month]["AUD/GBP"])
			nzRates.push(rates[month]["AUD/NZD"])
		})
		
		this.setState({canRates, usaRates, ukRates, nzRates})

		this.createMonthsArray()
	}

	createMonthsArray = () => {
    const numberOfMonths = DataIn.MonthNumber

    let year = 2015
		let yearStep = 12
		let months = []
    let monthsText = []

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
		this.setState({ months, monthsText }, this.setMonthsOfYear)
	}

	setMonthsOfYear = () => {
		let monthsOfYear = [
					"January", "February", "March", "April", "May", "June", "July",
					"August", "September", "October", "November", "December"
		]

		let month = this.state.months[this.state.months.length - 2]
		let theYear = month.getFullYear()

		month = monthsOfYear[month.getMonth()]

		let fullDate = month + " " + theYear

		this.setState((prevState) => ({ monthName: fullDate }), this.setStartingRRValues)
	}

	setStartingRRValues = () => {
		let totalDataRR = 0
		let churnTer = this.state.churnTer

		if(churnTer === "AUS") {
			totalDataRR = [284210]
		} else if(churnTer === "CAN") {
			totalDataRR = [23311]
		} else if(churnTer === "USA") {
			totalDataRR = [0]
		} else if(churnTer === "UK") {
			totalDataRR = [784]
		} else if(churnTer === "NZ") {
			totalDataRR = [4909]
		} else {
			totalDataRR = [313214]
		}
		this.setState({totalDataRR}, this.revenueTotals)
	}

	revenueTotals() {
    const ausTotal = []
    const canTotal = []
    const usaTotal = []
    const ukTotal = []
    const nzTotal = []

    this.state.months.forEach((thisMonthEnd) => {
      let ausCounter = []
      let canCounter = []
      let usaCounter = []
      let ukCounter = []
      let nzCounter = []

      this.props.rawData.forEach((invoice) => {
        if (invoice["start"] !== "") {
          let startString = invoice["start"]
          let startDateParts = startString.split("/")
          let startContract = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])

          let endString = invoice["end"]
          let endDateParts = endString.split("/")
          let endContract = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

          let actualStartMonth = startContract.getMonth()
          let actualStartYear = startContract.getFullYear()

          let actualEndMonth = endContract.getMonth()
          let actualEndYear = endContract.getFullYear()


          let thisMonth = thisMonthEnd.getMonth()
          let thisYear = thisMonthEnd.getFullYear()

          let thisMonthBegin = new Date(thisYear, thisMonth, 1)

					if(this.state.churnTer === "AUS" || this.state.churnTer === "Global") {
						if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "AUS")) {
							if (invoice["spreadmonths"] > invoice["months"]) {
								// INVOICE DATES ARE NOT FIRST AND/OR LAST DAYS OF MONTH SO NEED PARTIAL CALCULATIONS
								if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
									// CONTRACT START DATE IS THIS MONTH, THEREFORE DIVIDE MONTH AMOUNT BY 30 AND TIMES BY REMAINING DAYS IN MONTH/*
									// EG INVOICE WITH $1000 MRR AND START DATE OF 24TH OF MONTH = ($1000 / 30) X (30-24) 

									ausCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
								} else if (actualEndMonth === thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
									ausCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
								} else {
									ausCounter.push(invoice["valuepermonth"])
								}
							} else {
								ausCounter.push(invoice["valuepermonth"])
							}
						}
					}

					if(this.state.churnTer === "CAN" || this.state.churnTer === "Global") {
						if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "CAN")) {
							if (invoice["spreadmonths"] > invoice["months"]) {
								if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
									canCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
								} else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
									canCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
								} else {
									canCounter.push(invoice["valuepermonth"])
								}
							} else {
								canCounter.push(invoice["valuepermonth"])
							}
						}
					}

					if(this.state.churnTer === "USA" || this.state.churnTer === "Global") {
						if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "USA")) {
							if (invoice["spreadmonths"] > invoice["months"]) {
								if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
									usaCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
								} else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
									usaCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
								} else {
									usaCounter.push(invoice["valuepermonth"])
								}
							} else {
								usaCounter.push(invoice["valuepermonth"])
							}
						}
					}

					if(this.state.churnTer === "UK" || this.state.churnTer === "Global") {
						if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "UK")) {
							if (invoice["spreadmonths"] > invoice["months"]) {
								if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
									ukCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
								} else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
									ukCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
								} else {
									ukCounter.push(invoice["valuepermonth"])
								}
							} else {
								ukCounter.push(invoice["valuepermonth"])
							}
						}
					}

					if(this.state.churnTer === "NZ" || this.state.churnTer === "Global") {
						if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "NZ")) {
							if (invoice["spreadmonths"] > invoice["months"]) {
								if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
									nzCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
								} else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
									nzCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
								} else {
									nzCounter.push(invoice["valuepermonth"])
								}
							} else {
								nzCounter.push(invoice["valuepermonth"])
							}
						}
					}
				}
      })

      ausTotal.push(Math.round(ausCounter.reduce((a, b) => a + b, 0)))
      canTotal.push(Math.round(canCounter.reduce((a, b) => a + b, 0)))
      usaTotal.push(Math.round(usaCounter.reduce((a, b) => a + b, 0)))
      ukTotal.push(Math.round(ukCounter.reduce((a, b) => a + b, 0)))
      nzTotal.push(Math.round(nzCounter.reduce((a, b) => a + b, 0)))
    })

    this.setState(prevState => ({
      ausData: [...ausTotal]
    }))

    this.setState(prevState => ({
      canData: [...canTotal]
    }))

    this.setState(prevState => ({
      usaData: [...usaTotal]
    }))

    this.setState(prevState => ({
      ukData: [...ukTotal]
    }))

    this.setState(prevState => ({
      nzData: [...nzTotal]
    }))

    let totalDataRR = this.state.totalDataRR
    let canRates = []
    let usaRates = []
    let ukRates = []
    let nzRates = []

    Object.keys(this.state.forexData).forEach(key => {
      canRates.push(this.state.forexData[key]["AUD/CAD"])
    })

    Object.keys(this.state.forexData).forEach(key => {
      usaRates.push(this.state.forexData[key]["AUD/USD"])
    })

    Object.keys(this.state.forexData).forEach(key => {
      ukRates.push(this.state.forexData[key]["AUD/GBP"])
    })

    Object.keys(this.state.forexData).forEach(key => {
      nzRates.push(this.state.forexData[key]["AUD/NZD"])
		})

    for (let i = 0; i < ausTotal.length; i++) {
      totalDataRR.push(Math.round(
        ausTotal[i] +
        (canTotal[i] * canRates[i]) +
        (usaTotal[i] * usaRates[i]) +
        (ukTotal[i] * ukRates[i]) +
        (nzTotal[i] * nzRates[i])
      ))

		}

		this.setState({totalDataRR}, this.totalGlobalClients)
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
          invoice["product"] === this.state.annual ||
          invoice["product"] === this.state.project ||
          invoice["product"] === this.state.static ||
					invoice["product"] === this.state.budget ||
					invoice["product"] === "Support"
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
    }), this.getGlobalClientDetail)
  }

	getGlobalClientDetail = () => {
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
          invoice["product"] === this.state.annual ||
          invoice["product"] === this.state.project ||
          invoice["product"] === this.state.static ||
          invoice["product"] === this.state.budget ||
					invoice["product"] === "Support"
        )) {
          counter.push(invoice)
        }
      })

      total.push(counter)
    })

    this.setState(prevState => ({ globalClientDetail: [...total]}), this.getGlobalLostClients)

  }

	getGlobalLostClients = () => {
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
	

		this.setState(previous => ({lost: [...lostClientsArray]}), this.getLostClientsValues)
	}

	getLostClientsValues = () => {
		let lostClients = this.state.lost
		let clientDetails = this.state.globalClientDetail
		let cad = this.state.canRates
		let usd = this.state.usaRates
		let gbp = this.state.ukRates
		let nzd = this.state.nzRates
		let lostValuesArray = []
		let churnTer = this.state.churnTer

		for(let i = 0; i < lostClients.length -1; i++) {
			let holder = []
			let holderTwo = []
			for(let k = 0; k < lostClients[i].length; k++) {
				clientDetails[i].forEach(array => {
					if(array["client"] === lostClients[i][k]) {
						if(array["territory"] === "AUS" && (churnTer === "AUS" || churnTer === "Global")) {
							holder.push(array["valuepermonth"])
						}
						
						if(array["territory"] === "CAN" && (churnTer === "CAN" || churnTer === "Global")) {
							holder.push(array["valuepermonth"] * cad[i+1])
						}

						if(array["territory"] === "USA" && (churnTer === "USA" || churnTer === "Global")) {
							holder.push(array["valuepermonth"] * usd[i+1])
						}

						if(array["territory"] === "UK" && (churnTer === "UK" || churnTer === "Global")) {
							holder.push(array["valuepermonth"] * gbp[i+1])
						}

						if(array["territory"] === "NZ" && (churnTer === "NZ" || churnTer === "Global")) {
							holder.push(array["valuepermonth"] * nzd[i+1])
						}
					}
				})
				holderTwo.push(holder)
			}
			lostValuesArray.push(Math.round(holderTwo.pop().reduce((a, b) => a + b, 0)))
		}	

		this.setState({lostValuesArray}, this.getGlobalNewClients)

	}

	getGlobalNewClients = () => {
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

    this.setState(previous => ({ new: [...newClientsArray] }), this.getNewClientsValues)
	}

	getNewClientsValues = () => {
		let newClients = this.state.new
		let clientDetails = this.state.globalClientDetail
		let cad = this.state.canRates
		let usd = this.state.usaRates
		let gbp = this.state.ukRates
		let nzd = this.state.nzRates
		let newValuesArray = []
		let churnTer = this.state.churnTer

		for(let i = 0; i < newClients.length -1; i++) {
			let holder = []
			let holderTwo = []
			for(let k = 0; k < newClients[i].length; k++) {
				clientDetails[i+1].forEach(array => {

		
					if(array["client"] === newClients[i][k]) {
						if(array["territory"] === "AUS" && (churnTer === "AUS" || churnTer === "Global")) {
							holder.push(array["valuepermonth"])

						}
						if(array["territory"] === "CAN" && (churnTer === "CAN" || churnTer === "Global")) {
							holder.push(array["valuepermonth"] * cad[i+1])
						}

						if(array["territory"] === "USA" && (churnTer === "USA" || churnTer === "Global")) {
							holder.push(array["valuepermonth"] * usd[i+1])
						}

						if(array["territory"] === "UK" && (churnTer === "UK" || churnTer === "Global")) {
							holder.push(array["valuepermonth"] * gbp[i+1])
						}

						if(array["territory"] === "NZ" && (churnTer === "NZ" || churnTer === "Global")) {
							holder.push(array["valuepermonth"] * nzd[i+1])
						}
					}
				})

				holderTwo.push(holder)

			}
			newValuesArray.push(Math.round(holderTwo.pop().reduce((a, b) => a + b, 0)))
		}	


		this.setState({newValuesArray}, this.createGlobalChurndDollarArray)
	}
	
	createGlobalChurndDollarArray = () => {
		let globalChurnDollarArray = [["Date", "Global"]]
		for(let i = 0; i < this.state.newValuesArray.length; i++) {
			globalChurnDollarArray.push( [ this.state.months[i+1], ( this.state.lostValuesArray[i] / (this.state.newValuesArray[i] + this.state.totalDataRR[i]) ) * 100  ] )
		}

		// console.log(this.state.lostValuesArray)
		// console.log(this.state.newValuesArray)

		// console.log(this.state.totalDataRR)


		this.setState({chartData: globalChurnDollarArray}, this.updateGraphColor)
	}

	updateGraphColor = () => {
		if(this.state.churnTer === "Global") {
			this.setState({chartColor: ["#2B85D0"]})
		}

		if(this.state.churnTer === "AUS") {
			this.setState({chartColor: ["#8CD75C"]})
		}

		if(this.state.churnTer === "CAN") {
			this.setState({chartColor: ["#fcba03"]})
		}

		if(this.state.churnTer === "USA") {
			this.setState({chartColor: ["#F28E7C"]})
		}

		if(this.state.churnTer === "UK") {
			this.setState({chartColor: ["#03fcd7"]})
		}

		if(this.state.churnTer === "NZ") {
			this.setState({chartColor: ["#F27CEA"]})
		}

		this.updateChurnValueFromParent()
	}

	

	render(props) {

		const chartEvents = [
      {
        eventName: "select",
        options: {
          tooltip: {
            trigger: "selection"
          }
        },
        callback: ({ chartWrapper }) => {
          const chart = chartWrapper.getChart().getSelection()[0].row;
					this.setState((prevState) => ({ selectedMonth: chart }))
					this.props.setChurnDollarsChurnValue(this.state.chartData[this.state.selectedMonth + 1][1])
					this.props.updateMonthInParent(chart)
        }
      }
		]	

		return (
			<Grid.Column width={15}>
				<Segment color="blue" style={{ width: 1000, fontFamily: 'Titillium Web' }}>
					<div style={{ fontFamily: 'Titillium Web' }}>
						<Chart
							width={'984px'}
							height={'484px'}
							chartEvents={chartEvents}
							chartType="ScatterChart"
							crosshair={{ trigger: "selection" }}
							tooltip={{ trigger: "selection" }}
							loader={<div>Loading Chart</div>}
							data={this.state.chartData}
							options={{
								'vAxis': {
									'title': 'Churn %',
									'titleTextStyle': {
										fontName: 'Titillium Web'
									}
								},
								'hAxis': {
									'title': 'Date',
									'format': 'MMM-yy'
								},
								pointSize: 8,
								legend: 'none',
								titleTextStyle: { fontName: 'Titillium Web', bold: false },
								title: 'You can click on any point in the scatter graph to see the churn breakdown for that month',
								'chartArea': { 'width': '90%', 'height': '80%' },
								colors: this.state.chartColor,
								animation: {
									startup: true,
									easing: 'linear',
									duration: 750,
								},
								trendlines: {
									0: {
										type: 'polynomial',
										degree: 3,
										labelInLegend: 'Trend',
										lineWidth: 7,
										opacity: .5
									}
								}
							}}
						/>
					</div>
				</Segment>
			</Grid.Column>
		)
	}
}

export default ChurnDollars