import React, { Component } from 'react'
import ChurnTable from './ChurnTable'
import AddedTable from './AddedTable'
import DashboardHeading from '../../dashboard/DashboardHeading'
import DisplayMonth from '../../dashboard/DisplayMonth'
import DisplayTable from './DisplayTable'
import DisplayMRRTable from './DisplayMRRTable'
import DisplayChart from './DisplayChart'
import DisplayTerritories from './DisplayTerritories'
import * as CH from './ChurnHelpers'

class Churn extends Component {
	constructor(props) {
		super(props)

		this.state = {
			rollingAnnualChurnArray: [],
			rgbColor: "rgb(33,133,208,0.8)",
			terText: "Global",
			currentColor: "blue",
			scatter: false,
			rollingAnnual: false,
			wasSelectedMonthChanged: false,
			churnTer: "Global",
			churnDollars: false,
			annual: "Annual",
			project: "Project",
			statics: "Static",
			budget: "Budget Allocator",
			support: "Support",
			annualOn: true,
			projectOn: true,
			staticOn: true,
			budgetOn: true,
			annualActive: true,
			projectActive: true,
			budgetActive: true,
			staticActive: true,
			dimmer: false,
			table: {
				colHeadersLost: ["Client", "Status", "MRR", "Location", "Currency", "Invoice", "Date", "Licence", "Start", "End", "Total"],
        		colHeadersNew: ["Client", "MRR", "Location", "Currency", "Invoice", "Date", "Licence", "Start", "End", "Total"]
      }
		}
	}

	componentDidMount() {
		this.setupChurnData()
	}

	setupChurnData(props) {
		let churnDollars = this.state.churnDollars
		let rawData = this.props.rawData
		let annual = this.state.annual
		let project = this.state.project
		let statics = this.state.statics
		let budget = this.state.budget
		let support = this.state.support
		let churnTer = this.state.churnTer
		let forexData = this.props.forexData
		let annualOn = this.state.annualOn
		let projectOn = this.state.projectOn
		let staticOn = this.state.staticOn
		let budgetOn = this.state.budgetOn
		let [months, monthsText] = CH.createMonthsArray()
		let [clients, detail] = []
		let currentMonth = this.state.currentMonth
		let currentPrevMonth = this.state.currentPrevMonth
		let selectedMonth = this.state.selectedMonth
		let totalDataRR = CH.revenueTotals(months, rawData, churnTer, forexData, annual, project, statics, budget)

		if(!this.state.wasSelectedMonthChanged) {
			[currentMonth, currentPrevMonth, selectedMonth] = CH.setStartingMonth(months)
		} 

		if(churnTer === "Global") {
			clients = CH.totalGlobalClients(months, rawData,annual, project, statics, budget)
			detail = CH.totalGlobalClientsDetail(months, rawData, annual, project, statics, budget, support)
		} else {
			clients = CH.totalClients(months, rawData, annual, project, statics, budget, churnTer)
			detail = CH.totalClientsDetail(months, rawData, annual, project, statics, budget, churnTer)
		}

		let lost = CH.getLostClients(months, clients)
		let lostClientsValues = CH.getLostClientsValues(lost, churnTer, detail, forexData)
		let newClients = CH.getNewClients(months, clients)
		let newClientsValues = CH.getNewClientsValues(newClients, churnTer, detail, forexData)
		let prevTotals = CH.getPrevTotal(clients)
		let churnDataArray = CH.createChurnDataArray(lost, newClients, prevTotals)
		let lostValues = CH.getValuesForLostClients(selectedMonth, months, lost, rawData)
		let churnTotalInAud = CH.getChurnTotalInAud(months, monthsText, selectedMonth, forexData, lostValues)
		let newValues = CH.getValuesForNewClients(selectedMonth, months, newClients, rawData)
		let addedTotalInAud = CH.getAddedTotalInAud(monthsText, selectedMonth, forexData, newValues)
		let showTable = CH.checkTableToggle(annualOn, projectOn, staticOn, budgetOn)

		let MRRTotal = CH.numberWithCommas(totalDataRR[selectedMonth])

		let churnArray = []
		
		if(!churnDollars) {
			churnArray = CH.calculateChurn(churnDataArray, churnTer)
		} else {
			churnArray = CH.createGlobalChurndDollarArray(newClientsValues, lostClientsValues, months, totalDataRR)
		}

		let rollingAnnualChurnArray

		rollingAnnualChurnArray = CH.getRollingAnnualChurnArray(selectedMonth, lost, newClients, totalDataRR, clients, lostClientsValues, newClientsValues, churnDollars)
	
		let ARPUValuesArray = CH.getARPUValuesArray(totalDataRR, churnDataArray)
		console.log(rollingAnnualChurnArray)

		this.setState({
			currentMonth, selectedMonth, lostValues, newValues, showTable, lost, newClients, monthsText, MRRTotal, rollingAnnualChurnArray, ARPUValuesArray,
			churnDataArray, currentPrevMonth, churnArray, churnTotalInAud, detail, addedTotalInAud, months, totalDataRR, newClientsValues, lostClientsValues
		})
	}

  handleTerSelection = (event) => {
    event.persist()
    this.setState((prevState) => ({ churnTer: event.target.textContent }), this.updateChurnTer)
	}

	updateChurnTer = () => {
    if (this.state.churnTer === "Australia") {
      this.setState((prevState) => ({ churnTer: "AUS", rgbColor: "rgba(75,192,1,0.8)", terText: "Australia", chartColor: ["#8CD75C"] }), this.setupChurnData)
    }
    if (this.state.churnTer === "Canada") {
      this.setState((prevState) => ({ churnTer: "CAN", rgbColor: "rgba(222,213,42,0.8)", terText: "Canada", chartColor: ["#fcba03"] }), this.setupChurnData)
    }
    if (this.state.churnTer === "United States") {
      this.setState((prevState) => ({ churnTer: "USA", rgbColor: "rgba(234,77,49,0.8)", terText: "United States", chartColor: ["#F28E7C"] }), this.setupChurnData)
    }
    if (this.state.churnTer === "United Kingdom") {
      this.setState((prevState) => ({ churnTer: "UK", rgbColor: "rgba(49,234,212,0.8)", terText: "U.K.", chartColor: ["#03fcd7"] }), this.setupChurnData)
    }
    if (this.state.churnTer === "New Zealand") {
      this.setState((prevState) => ({ churnTer: "NZ", rgbColor: "rgba(234,49,223,0.8)", terText: "New Zealand", chartColor: ["#F27CEA"] }), this.setupChurnData)
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ churnTer: "Global", rgbColor: "rgb(33,133,208,0.8)",  terText: "Global", chartColor: ["#2B85D0"] }), this.setupChurnData)
    }
	}
	
	setChangedMonth = (month) => {
    let monthsOfYear = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
		]

    let year = this.state.months[month].getFullYear()


    let monthDisp
    let prevMonthDisp
		let prevYear
		
    if (this.state.selectedMonth > -1) {
      monthDisp = monthsOfYear[this.state.months[month + 1].getMonth()]
      prevMonthDisp = monthsOfYear[this.state.months[month].getMonth()]
      prevYear = this.state.months[month].getFullYear()
    }

    if (monthDisp === "January") {
      year++
    }

    let theDate = monthDisp + " " + year
		let thePrevDate = prevMonthDisp + " " + prevYear

    this.setState((prevState) => ({ currentMonth: theDate, currentPrevMonth: thePrevDate, selectedMonth: month, wasSelectedMonthChanged: true }), this.setupChurnData)
  }
	
	handleClickAnnual = () => {
    if (this.state.annualOn) {
      this.setState((prevState) => ({ annual: "" }))
    } else {
      this.setState((prevState) => ({ annual: "Annual" }))
    }

    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ annualActive: !prevState.annualActive, annualOn: !prevState.annualOn, showTable: true }), this.setupChurnData)
    } else {
      this.setState((prevState) => ({ annualActive: !prevState.annualActive, annualOn: !prevState.annualOn, loadButtonActive: true, showTable: true }), this.setupChurnData)
    }
  }

  handleClickProject = () => {
    if (this.state.projectOn) {
      this.setState((prevState) => ({ project: "" }))
    } else {
      this.setState((prevState) => ({ project: "Project" }))
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ projectActive: !prevState.projectActive, projectOn: !prevState.projectOn, loadButtonActive: true, showTable: true }), this.setupChurnData)
    } else {
      this.setState((prevState) => ({ projectActive: !prevState.projectActive, projectOn: !prevState.projectOn, loadButtonActive: true, showTable: true }), this.setupChurnData)
    }
  }

  handleClickStatic = () => {
    if (this.state.staticOn) {
      this.setState((prevState) => ({ statics: "" }))
    } else {
      this.setState((prevState) => ({ statics: "Static" }))
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ staticActive: !prevState.staticActive, staticOn: !prevState.staticOn, loadButtonActive: true, showTable: true }), this.setupChurnData)
    } else {
      this.setState((prevState) => ({ staticActive: !prevState.staticActive, staticOn: !prevState.staticOn, loadButtonActive: true, showTable: true }), this.setupChurnData)
    }
  }

  handleClickBudget = () => {
    if (this.state.budgetOn) {
      this.setState((prevState) => ({ budget: "" }))
    } else {
      this.setState((prevState) => ({ budget: "Budget Allocator" }))
    }
    if (this.state.churnTer === "Global") {
      this.setState((prevState) => ({ budgetActive: !prevState.budgetActive, budgetOn: !prevState.budgetOn, loadButtonActive: true, showTable: true }), this.setupChurnData)
    } else {
      this.setState((prevState) => ({ budgetActive: !prevState.budgetActive, budgetOn: !prevState.budgetOn, loadButtonActive: true, showTable: true }), this.setupChurnData)
    }
	}
	
	handleChurnStyleChartSelection = () => {
    if(this.state.churnDollars) {
      this.setState(prevState => ({churnDollars: false }), this.setupChurnData)
		}

		if(!this.state.churnDollars) {
      this.setState(prevState => ({churnDollars: true }), this.setupChurnData)
    }
	}
	
	handleChartTypeSelection = () => {
		if(this.state.scatter) {
      this.setState(prevState => ({scatter: false, rollingAnnual: true }), this.setupChurnData)
		}

		if(!this.state.scatter) {
      this.setState(prevState => ({scatter: true, rollingAnnual: false }), this.setupChurnData)
    }
	}


	render() {
		return (
			<div style={{ paddingTop: 24, fontFamily: 'Titillium Web' }}>
				<DashboardHeading 
					currentColor={"blue"}
					title={"Client Churn"}
				/>
				<DisplayTerritories 
					churnTer={this.state.churnTer}
					handleTerSelection={this.handleTerSelection}
					handleChurnStyleChartSelection={this.handleChurnStyleChartSelection}
					churnDollars={this.state.churnDollars}
					scatter={this.state.scatter}
					rollingAnnual={this.state.rollingAnnual}
					handleChartTypeSelection={this.handleChartTypeSelection}
				/>
				<DisplayChart 
					annualActive={this.state.annualActive}
					projectActive={this.state.projectActive}
					budgetActive={this.state.budgetActive}
					staticActive={this.state.staticActive}
					churnArray={this.state.churnArray}
					chartColor={this.state.chartColor}
					setChangedMonth={this.setChangedMonth}
					handleClickAnnual={this.handleClickAnnual}
					handleClickBudget={this.handleClickBudget}
					handleClickProject={this.handleClickProject}
					handleClickStatic={this.handleClickStatic}
					churnDollars={this.state.churnDollars}
					scatter={this.state.scatter}
					rollingAnnualChurnArray={this.state.rollingAnnualChurnArray}
					newClientsValues={this.state.newClientsValues}
					lostClientsValues={this.state.lostClientsValues}
					totalDataRR={this.state.totalDataRR}
					churnTer={this.state.churnTer}
					rgbColor={this.state.rgbColor}
					terText={this.state.terText}
				/>
				<DisplayMonth 
					currentMonth={this.state.currentMonth} 
					currentColor={this.state.currentColor} 
				/>
				<DisplayTable
					showTable={this.state.showTable}
					dimmer={this.state.dimmer}
					currentMonth={this.state.currentMonth}
					currentPrevMonth={this.state.currentPrevMonth}
					lost={this.state.lost}
					selectedMonth={this.state.selectedMonth}
					newClients={this.state.newClients}
					churnDataArray={this.state.churnDataArray}
					churnDollars={this.state.churnDollars}
					churnArray={this.state.churnArray}
					rollingAnnualChurnArray={this.state.rollingAnnualChurnArray}
				/>
				<DisplayMRRTable 
					monthsText={this.state.monthsText}
					selectedMonth={this.state.selectedMonth}
					forexData={this.props.forexData}
					addedTotalInAud={this.state.addedTotalInAud}
					churnTotalInAud={this.state.churnTotalInAud}
					dimmer={this.state.dimmer}
					showTable={this.state.showTable}
					churnDollars={this.state.churnDollars}
					totalDataRR={this.state.totalDataRR}
					currentMonth={this.state.currentMonth}
					currentPrevMonth={this.state.currentPrevMonth}
					MRRTotal={this.state.MRRTotal}
				/>
				<ChurnTable 
					currentMonth={this.state.currentMonth}
					selectedMonth={this.state.selectedMonth}
					colHeadersLost={this.state.table.colHeadersLost}
					lostValues={this.state.lostValues}
				/>
				<AddedTable 
					currentMonth={this.state.currentMonth}
					selectedMonth={this.state.selectedMonth}
					colHeadersNew={this.state.table.colHeadersNew}
					newValues={this.state.newValues}
				/>
			</div>	
		)
	} 
}

export default Churn