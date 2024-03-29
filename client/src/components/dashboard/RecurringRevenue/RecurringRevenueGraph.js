import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import { Segment, Grid, Checkbox, Flag, GridColumn, Radio } from 'semantic-ui-react'
import { HotTable } from '@handsontable/react';
import DataIn from '../DataIn'
import DisplayMonth from '../DisplayMonth'

class RecurringRevenueGraph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      toggleActive: false,
      firstPassCount: 0,
      value: "local",
      totalToggleActive: false,
      currentColor: "orange",
      forexData: props.forexData,
      totalAUD: 0,
      selectedMonth: 0,
      annual: "Annual",
      project: "Project",
      static: "Static",
      budget: "Budget Allocator",
      support: "Support",
      months: [],
      monthsText: [],
      currentMonth: "",
      ausDataRR: [],
      canDataRR: [],
      usaDataRR: [],
      ukDataRR: [],
      nzDataRR: [],
      ausDataNON: [],
      canDataNON: [],
      usaDataNON: [],
      ukDataNON: [],
      nzDataNON: [],
      ausData: [],
      canData: [],
      usaData: [],
      ukData: [],
      nzData: [],
      tableData: [],
      tableDataNON: [],
      tableDataGlobal: [],
      symbolToDisplay: {
        "aus": "A",
        "usa": "A",
        "can": "C",
        "uk": "P",
        "nz": "N"
      },
      table: {
        colHeaders: ["Client", "MRR Value", "EHQ/EIQ", "Location", "Invoice", "Date", "Product", "Start", "End", "Value"],
        colHeadersNON: ["Client", "EHQ/EIQ", "Location", "Invoice", "Date", "Product", "Value"],
      }
    }

    this.revenueTotals = this.revenueTotals.bind(this)
    this.revenueTotalsNON = this.revenueTotalsNON.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.numberWithCommas = this.numberWithCommas.bind(this)
  }

  componentDidMount() {
    this.createMonthsArray()
  }

  createMonthsArray = () => {
    const numberOfMonths = this.getNumberOfMonthsSinceJuly2015()

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

      monthsText.push(new Date(year, month, 0).toLocaleDateString("en-GB").split(',')[0])
    }

      this.setState({ months, monthsText }, this.revenueTotals)
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

    if(this.state.firstPassCount === 0) {
      this.setState((prevState) => ({ currentMonth: theDate, currentPrevMonth: thePrevDate, selectedMonth: startingMonthNumber, firstPassCount: 1}), this.checkCurrency)
    } else {
      this.setState((prevState) => ({ currentMonth: theDate, currentPrevMonth: thePrevDate }), this.checkCurrency)
    }
  }


  checkCurrency = () => {
    if(this.state.value === "local") {
      this.setState({symbolToDisplay:{
        "aus": "A",
        "usa": "A",
        "can": "C",
        "uk": "£",
        "nz": "N"
      }})
      this.checkToggle()
    }
    
    if(this.state.value === "aud")  {
      this.setState({symbolToDisplay:{
        "aus": "A",
        "usa": "A",
        "can": "A",
        "uk": "A",
        "nz": "A"
      }})
      this.convertAllToAUD()
    }

    if(this.state.value === "usd") {
      this.setState({symbolToDisplay:{
        "aus": "U",
        "usa": "U",
        "can": "U",
        "uk": "U",
        "nz": "U"
      }})
      this.convertAllToUSD()
    }
  }

  checkToggle = () => {
    if(this.state.toggleActive === false) {
      this.calculateTotalAUD()
    } else {
      this.revenueTotalsNON()
    }
  }

  setChangedMonth = () => {
    let monthsOfYear = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ]

    let month = this.state.selectedMonth - 1
    let year = this.state.months[this.state.selectedMonth].getFullYear()

    let monthDisp

    if (this.state.selectedMonth > -1) {
      monthDisp = monthsOfYear[this.state.months[month + 1].getMonth()]
    }

    let theDate = monthDisp + " " + year

    this.setState((prevState) => ({ currentMonth: theDate }), this.calculateTotalAUD)
  }

  calculateTotalAUD = () => {

    let total = 2
    let totalsArray = []


    if(this.state.value === "local") {
      
      if ((typeof this.state.monthsText[this.state.selectedMonth] === "undefined")) {
        return null
      } else {
        let forexMonth = this.state.monthsText[this.state.selectedMonth].substring(3)
        let forex = this.state.forexData
  
        let audcad = forex[forexMonth]["AUD/CAD"]
        let audusd = forex[forexMonth]["AUD/USD"]
        let audgbp = forex[forexMonth]["AUD/GBP"]
        let audnzd = forex[forexMonth]["AUD/NZD"]
  
  
  
        if(this.state.value === "local") {
          totalsArray.push(Math.round(this.state.ausData[this.state.selectedMonth]))
          totalsArray.push(Math.round(this.state.canData[this.state.selectedMonth] * audcad))
          totalsArray.push(Math.round(this.state.usaData[this.state.selectedMonth] * audusd))
          totalsArray.push(Math.round(this.state.ukData[this.state.selectedMonth] * audgbp))
          totalsArray.push(Math.round(this.state.nzData[this.state.selectedMonth] * audnzd) ) 
        } else {
          totalsArray.push(this.state.ausData[this.state.selectedMonth])
          totalsArray.push(this.state.canData[this.state.selectedMonth])
          totalsArray.push(this.state.usaData[this.state.selectedMonth])
          totalsArray.push(this.state.ukData[this.state.selectedMonth])
          totalsArray.push(this.state.nzData[this.state.selectedMonth])
        }
  
        total = totalsArray.reduce((a, b) => a + b, 0).toFixed(0)
      }



    } else {


      if ((typeof this.state.monthsText[this.state.selectedMonth] === "undefined")) {
        return null
      } else {
        let forexMonth = this.state.monthsText[this.state.selectedMonth].substring(3)
        let forex = this.state.forexData
  
        let audcad = forex[forexMonth]["AUD/CAD"]
        let audusd = forex[forexMonth]["AUD/USD"]
        let audgbp = forex[forexMonth]["AUD/GBP"]
        let audnzd = forex[forexMonth]["AUD/NZD"]
  

        totalsArray.push(this.state.ausData[this.state.selectedMonth])
        totalsArray.push(this.state.canData[this.state.selectedMonth])
        totalsArray.push(this.state.usaData[this.state.selectedMonth])
        totalsArray.push(this.state.ukData[this.state.selectedMonth])
        totalsArray.push(this.state.nzData[this.state.selectedMonth])

  
        total = totalsArray.reduce((a, b) => a + b, 0).toFixed(0)
      }


    }

    

    this.setState((prevState) => ({ totalAUD: total }))
    




  }


  handleToggle = () => {
    if (this.state.toggleActive === false) {
      this.revenueTotalsNON()
      this.setState((prevState) => ({ toggleActive: !prevState.toggleActive }), this.calculateTotalAUD)
    } else {
      this.revenueTotals()
      this.setState((prevState) => ({ toggleActive: !prevState.toggleActive, tableDataNON: [] }), this.calculateTotalAUD)
    }
  }

  handleChange = (e, { value }) => this.setState({ value })

  handleCurrencyChange = (e, { value }) => this.setState({ value }, this.convertToOtherCurrency)



  convertToOtherCurrency = () => {
    if(this.state.value === "local") {

      this.createMonthsArray()
    }

    if(this.state.value === "aud") {
      this.createMonthsArray()
    }

    if(this.state.value === "usd") {
      this.createMonthsArray()
    }
  }

  convertAllToAUD = () => {
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

    let canAusRR = []
    let usaAusRR = []
    let ukAusRR = []
    let nzAusRR = []

    canRates.forEach((rate, index) => {
      canAusRR.push(Math.round(rate * this.state.canDataRR[index])) 
    })

    usaRates.forEach((rate, index) => {
      usaAusRR.push(Math.round(rate * this.state.usaDataRR[index])) 
    })

    ukRates.forEach((rate, index) => {
      ukAusRR.push(Math.round(rate * this.state.ukDataRR[index])) 
    })

    nzRates.forEach((rate, index) => {
      nzAusRR.push(Math.round(rate * this.state.nzDataRR[index])) 
    })

    this.setState(prevState => ({
      canData: [...canAusRR],
      usaData: [...usaAusRR],
      ukData: [...ukAusRR],
      nzData: [...nzAusRR]
    }), this.checkToggle)
  }

  convertAllToUSD = () => {
    console.log("USD not coded yet")

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

    let canAusRR = []
    let usaAusRR = []
    let ukAusRR = []
    let nzAusRR = []

    canRates.forEach((rate, index) => {
      canAusRR.push(Math.round(rate * this.state.canDataRR[index])) 
    })

    usaRates.forEach((rate, index) => {
      usaAusRR.push(Math.round(rate * this.state.usaDataRR[index])) 
    })

    ukRates.forEach((rate, index) => {
      ukAusRR.push(Math.round(rate * this.state.ukDataRR[index])) 
    })

    nzRates.forEach((rate, index) => {
      nzAusRR.push(Math.round(rate * this.state.nzDataRR[index])) 
    })

    this.setState(prevState => ({
      canData: [...canAusRR],
      usaData: [...usaAusRR],
      ukData: [...ukAusRR],
      nzData: [...nzAusRR]
    }), this.checkToggle)





  }


  getNumberOfMonthsSinceJuly2015 = () => {
    return DataIn.MonthNumber
  }

  revenueTotals() {
    const ausTotal = []
    const canTotal = []
    const usaTotal = []
    const ukTotal = []
    const nzTotal = []

    const detailLogged = []

    this.state.months.forEach((thisMonthEnd) => {
      let ausCounter = []
      let canCounter = []
      let usaCounter = []
      let ukCounter = []
      let nzCounter = []

      let allDet = []
      

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


          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "AUS") && (
            invoice["product"] === this.state.annual ||
            invoice["product"] === this.state.project ||
            invoice["product"] === this.state.static ||
            invoice["product"] === this.state.budget ||
            invoice["product"] === this.state.support
          )) {
            if (invoice["spreadmonths"] > invoice["months"]) {
              // INVOICE DATES ARE NOT FIRST AND/OR LAST DAYS OF MONTH SO NEED PARTIAL CALCULATIONS
              if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear() ) {
                // CONTRACT START DATE IS THIS MONTH, THEREFORE DIVIDE MONTH AMOUNT BY 30 AND TIMES BY REMAINING DAYS IN MONTH/*
                // EG INVOICE WITH $1000 MRR AND START DATE OF 24TH OF MONTH = ($1000 / 30) X (30-24) 
                ausCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
                allDet.push([
                  invoice["client"],
                  (invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())),
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              } else if (actualEndMonth === thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
                ausCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
                allDet.push([
                  invoice["client"],
                  (invoice["valuepermonth"] / 30) * (endContract.getDate()),
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              } else {

                ausCounter.push(invoice["valuepermonth"])
                allDet.push([
                  invoice["client"],
                  invoice["valuepermonth"],
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              }
            } else {

              ausCounter.push(invoice["valuepermonth"])
              allDet.push([
                invoice["client"],
                invoice["valuepermonth"],
                invoice["ehqveiq"],
                invoice["territory"],
                invoice["invoice"],
                invoice["date"],
                invoice["product"],
                invoice["start"],
                invoice["end"],
                invoice["total"]
              ])
            }
          }

          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "CAN") && (
            invoice["product"] === this.state.annual ||
            invoice["product"] === this.state.project ||
            invoice["product"] === this.state.static ||
            invoice["product"] === this.state.budget ||
            invoice["product"] === this.state.support
          )) {
            if (invoice["spreadmonths"] > invoice["months"]) {
              if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
                canCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
                allDet.push([
                  invoice["client"],
                  (invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())),
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {
                canCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
                allDet.push([
                  invoice["client"],
                  (invoice["valuepermonth"] / 30) * (endContract.getDate()),
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              } else {
                canCounter.push(invoice["valuepermonth"])
                allDet.push([
                  invoice["client"],
                  invoice["valuepermonth"],
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              }
            } else {
              canCounter.push(invoice["valuepermonth"])
              allDet.push([
                invoice["client"],
                invoice["valuepermonth"],
                invoice["ehqveiq"],
                invoice["territory"],
                invoice["invoice"],
                invoice["date"],
                invoice["product"],
                invoice["start"],
                invoice["end"],
                invoice["total"]
              ])
            }
          }

          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "USA") && (
            invoice["product"] === this.state.annual ||
            invoice["product"] === this.state.project ||
            invoice["product"] === this.state.static ||
            invoice["product"] === this.state.budget ||
            invoice["product"] === this.state.support
          )) {
            if (invoice["spreadmonths"] > invoice["months"]) {
              if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
                usaCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
                allDet.push([
                  invoice["client"],
                  (invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())),
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {

                usaCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
                allDet.push([
                  invoice["client"],
                  (invoice["valuepermonth"] / 30) * (endContract.getDate()),
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              } else {
                usaCounter.push(invoice["valuepermonth"])
                allDet.push([
                  invoice["client"],
                  invoice["valuepermonth"],
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              }
            } else {
              usaCounter.push(invoice["valuepermonth"])
              allDet.push([
                invoice["client"],
                invoice["valuepermonth"],
                invoice["ehqveiq"],
                invoice["territory"],
                invoice["invoice"],
                invoice["date"],
                invoice["product"],
                invoice["start"],
                invoice["end"],
                invoice["total"]
              ])
            }
          }

          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "UK") && (
            invoice["product"] === this.state.annual ||
            invoice["product"] === this.state.project ||
            invoice["product"] === this.state.static ||
            invoice["product"] === this.state.budget ||
            invoice["product"] === this.state.support
          )) {
            if (invoice["spreadmonths"] > invoice["months"]) {
              if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
                ukCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
                allDet.push([
                  invoice["client"],
                  (invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())),
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {

                ukCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
                allDet.push([
                  invoice["client"],
                  (invoice["valuepermonth"] / 30) * (endContract.getDate()),
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              } else {
                ukCounter.push(invoice["valuepermonth"])
                allDet.push([
                  invoice["client"],
                  invoice["valuepermonth"],
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              }
            } else {
              ukCounter.push(invoice["valuepermonth"])
              allDet.push([
                invoice["client"],
                invoice["valuepermonth"],
                invoice["ehqveiq"],
                invoice["territory"],
                invoice["invoice"],
                invoice["date"],
                invoice["product"],
                invoice["start"],
                invoice["end"],
                invoice["total"]
              ])
            }
          }

          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "NZ") && (
            invoice["product"] === this.state.annual ||
            invoice["product"] === this.state.project ||
            invoice["product"] === this.state.static ||
            invoice["product"] === this.state.budget ||
            invoice["product"] === this.state.support
          )) {
            if (invoice["spreadmonths"] > invoice["months"]) {
              if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {

                nzCounter.push((invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())))
                allDet.push([
                  invoice["client"],
                  (invoice["valuepermonth"] / 30) * (31 - (startContract.getDate())),
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              } else if (actualEndMonth <= thisMonthEnd.getMonth() && actualEndYear === thisMonthEnd.getFullYear()) {

                nzCounter.push((invoice["valuepermonth"] / 30) * (endContract.getDate()))
                allDet.push([
                  invoice["client"],
                  (invoice["valuepermonth"] / 30) * (endContract.getDate()),
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              } else {

                nzCounter.push(invoice["valuepermonth"])
                allDet.push([
                  invoice["client"],
                  invoice["valuepermonth"],
                  invoice["ehqveiq"],
                  invoice["territory"],
                  invoice["invoice"],
                  invoice["date"],
                  invoice["product"],
                  invoice["start"],
                  invoice["end"],
                  invoice["total"]
                ])
              }
            } else {
              nzCounter.push(invoice["valuepermonth"])
              allDet.push([
                invoice["client"],
                invoice["valuepermonth"],
                invoice["ehqveiq"],
                invoice["territory"],
                invoice["invoice"],
                invoice["date"],
                invoice["product"],
                invoice["start"],
                invoice["end"],
                invoice["total"]
              ])
            }
          }


        }
      })

      ausTotal.push(Math.round(ausCounter.reduce((a, b) => a + b, 0)))
      canTotal.push(Math.round(canCounter.reduce((a, b) => a + b, 0)))
      usaTotal.push(Math.round(usaCounter.reduce((a, b) => a + b, 0)))
      ukTotal.push(Math.round(ukCounter.reduce((a, b) => a + b, 0)))
      nzTotal.push(Math.round(nzCounter.reduce((a, b) => a + b, 0)))

      detailLogged.push(allDet)

    })

    this.setState(prevState => ({
      ausData: [...ausTotal],
      ausDataRR: [...ausTotal]
    }))

    this.setState(prevState => ({
      canData: [...canTotal],
      canDataRR: [...canTotal]
    }))

    this.setState(prevState => ({
      usaData: [...usaTotal],
      usaDataRR: [...usaTotal]
    }))

    this.setState(prevState => ({
      ukData: [...ukTotal],
      ukDataRR: [...ukTotal]
    }))

    this.setState(prevState => ({
      nzData: [...nzTotal],
      nzDataRR: [...nzTotal]
    }))

    this.setState((prevState) => ({
      tableData: [...detailLogged]
    }))

    const totalDataRR = []
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



    this.setState(prevState => ({ totalGlobalRR: totalDataRR }), this.setStartingMonth)

    return null
  }

  revenueTotalsNON() {

    const ausTotalNON = []
    const canTotalNON = []
    const usaTotalNON = []
    const ukTotalNON = []
    const nzTotalNON = []

    const detailLogged = []

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

    this.state.months.forEach((month, index) => {
      let ausCounter = []
      let canCounter = []
      let usaCounter = []
      let ukCounter = []
      let nzCounter = []

      let allDet = []

      this.props.rawData.forEach((invoice) => {
        let invDateString = invoice["date"]
        let invDateParts = invDateString.split("/")
        let invDate = new Date(invDateParts[2], invDateParts[1] - 1, +invDateParts[0])
        let monthStart = new Date(month.getFullYear(), month.getMonth(), 1)

        if (invoice["start"] === "" && (invDate >= monthStart && invDate <= month) && invoice["territory"] === "AUS") {
          ausCounter.push(invoice["total"])
          allDet.push([
            invoice["client"],
            invoice["ehqveiq"],
            invoice["territory"],
            invoice["invoice"],
            invoice["date"],
            invoice["product"],
            invoice["total"]
          ])
        }

        if (invoice["start"] === "" && (invDate >= monthStart && invDate <= month) && invoice["territory"] === "CAN") {
          canCounter.push(invoice["total"])
          allDet.push([
            invoice["client"],
            invoice["ehqveiq"],
            invoice["territory"],
            invoice["invoice"],
            invoice["date"],
            invoice["product"],
            invoice["total"]
          ])
        }

        if (invoice["start"] === "" && (invDate >= monthStart && invDate <= month) && invoice["territory"] === "USA") {
          usaCounter.push(invoice["total"])
          allDet.push([
            invoice["client"],
            invoice["ehqveiq"],
            invoice["territory"],
            invoice["invoice"],
            invoice["date"],
            invoice["product"],
            invoice["total"]
          ])
        }

        if (invoice["start"] === "" && (invDate >= monthStart && invDate <= month) && invoice["territory"] === "UK") {
          ukCounter.push(invoice["total"])
          allDet.push([
            invoice["client"],
            invoice["ehqveiq"],
            invoice["territory"],
            invoice["invoice"],
            invoice["date"],
            invoice["product"],
            invoice["total"]
          ])
        }

        if (invoice["start"] === "" && (invDate >= monthStart && invDate <= month) && invoice["territory"] === "NZ") {
          nzCounter.push(invoice["total"])
          allDet.push([
            invoice["client"],
            invoice["ehqveiq"],
            invoice["territory"],
            invoice["invoice"],
            invoice["date"],
            invoice["product"],
            invoice["total"]
          ])
        }
      })


      if(this.state.value === "local") {
        ausTotalNON.push(Math.round(ausCounter.reduce((a, b) => a + b, 0)))
        canTotalNON.push(Math.round(canCounter.reduce((a, b) => a + b, 0)))
        usaTotalNON.push(Math.round(usaCounter.reduce((a, b) => a + b, 0)))
        ukTotalNON.push(Math.round(ukCounter.reduce((a, b) => a + b, 0)))
        nzTotalNON.push(Math.round(nzCounter.reduce((a, b) => a + b, 0)))
      } else {

        // need convert each to aud before push

       
     


        ausTotalNON.push(Math.round(ausCounter.reduce((a, b) => a + b, 0)))
        canTotalNON.push(Math.round(canCounter.reduce((a, b) => a + b, 0) * canRates[index]))
        usaTotalNON.push(Math.round(usaCounter.reduce((a, b) => a + b, 0) * usaRates[index]))
        ukTotalNON.push(Math.round(ukCounter.reduce((a, b) => a + b, 0) * ukRates[index]))
        nzTotalNON.push(Math.round(nzCounter.reduce((a, b) => a + b, 0) * nzRates[index]))
      }
 
      detailLogged.push(allDet)
    })

    let ausDataToMerge = this.state.ausData
    let canDataToMerge = this.state.canData
    let usaDataToMerge = this.state.usaData
    let ukDataToMerge = this.state.ukData
    let nzDataToMerge = this.state.nzData

    let newAusArray = []
    let newCanArray = []
    let newUsaArray = []
    let newUkArray = []
    let newNzArray = []

    for (let i = 0; i < ausDataToMerge.length; i++) {
      newAusArray.push(ausDataToMerge[i] + ausTotalNON[i])
    }
    for (let i = 0; i < canDataToMerge.length; i++) {
      newCanArray.push(canDataToMerge[i] + canTotalNON[i])
    }

    for (let i = 0; i < usaDataToMerge.length; i++) {
      newUsaArray.push(usaDataToMerge[i] + usaTotalNON[i])
    }

    for (let i = 0; i < ukDataToMerge.length; i++) {
      newUkArray.push(ukDataToMerge[i] + ukTotalNON[i])
    }

    for (let i = 0; i < nzDataToMerge.length; i++) {
      newNzArray.push(nzDataToMerge[i] + nzTotalNON[i])
    }

    this.setState(prevState => ({
      ausData: [...newAusArray]
    }))

    this.setState(prevState => ({
      canData: [...newCanArray]
    }))

    this.setState(prevState => ({
      usaData: [...newUsaArray]
    }))

    this.setState(prevState => ({
      ukData: [...newUkArray]
    }))

    this.setState(prevState => ({
      nzData: [...newNzArray]
    }))

    this.setState((prevState) => ({
      tableDataNON: [...detailLogged]
    }))

    const totalDataRR = []
    


    if(this.state.value === "local") {
       for (let i = 0; i < newAusArray.length; i++) {
      totalDataRR.push(Math.round(
        newAusArray[i] +
        (newCanArray[i] * canRates[i]) +
        (newUsaArray[i] * usaRates[i]) +
        (newUkArray[i] * ukRates[i]) +
        (newNzArray[i] * nzRates[i])
      ))
      }
    } else {
      for (let i = 0; i < newAusArray.length; i++) {
        totalDataRR.push(Math.round(
          newAusArray[i] +
          newCanArray[i] +
          newUsaArray[i]) +
          newUkArray[i] +
        (newNzArray[i]
        ))
        }
    }

   

    this.setState(prevState => ({ totalGlobalRR: totalDataRR }), this.calculateTotalAUD)

    return null
  }


  displayDetails = () => {
    return (
      <div>
        <Grid columns='equal' style={{ width: 1109, paddingTop: 12, paddingBottom: 12, color: 'black' }}>
          <Grid.Column>
            <div>
              <Segment color="orange">
                <h3 style={{ fontFamily: 'Titillium Web' }}>Details of Recurring Revenue for {this.state.currentMonth}</h3>
                <div id="hot-app">
                  <HotTable
                    licenseKey="non-commercial-and-evaluation"
                    className={"htCenter"}
                    columns={[{}, { type: "numeric", numericFormat: { pattern: "0,00.00" } }, {}, {}, {}, { type: "date" }, {}, { type: "date" }, { type: "date" }, { type: "numeric", numericFormat: { pattern: "0,00.00" } }]}
                    style={{ fontSize: 10, color: 'black' }}
                    cells={function (row, col) {
                      var cellPrp = {};
                      if (col === 0) {
                        cellPrp.className = 'htLeft'
                      } else if (col === 1) {
                        cellPrp.className = 'htRight'
                      } else if (col === 9) {
                        cellPrp.className = "htRight"
                      } else {
                        cellPrp.className = "htCenter"
                      }
                      return cellPrp
                    }
                    }
                    htDimmed
                    manualColumnResize
                    wordWrap={false}
                    height={400}
                    editor={false}
                    filters={true}
                    dropdownMenu={false}
                    columnSorting={true}
                    colWidths={[430, 57, 45, 45, 53, 75, 75, 75, 75, 60]}
                    rowHeaders={true}
                    colHeaders={this.state.table.colHeaders}
                    data={this.state.tableData[this.state.selectedMonth]} />
                </div>
              </Segment>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    )
  }

  displayDetailsNON = () => {
    if (this.state.tableDataNON.length > 0) {
      return (
        <div>
          <Grid columns='equal' style={{ width: 1109, paddingBottom: 50, color: 'black' }}>
            <Grid.Column>
              <div>
                <Segment color="orange">
                  <h3 style={{ fontFamily: 'Titillium Web' }}>Non recurring products invoiced in {this.state.currentMonth}</h3>
                  <div id="hot-app">
                    <HotTable
                      licenseKey="non-commercial-and-evaluation"
                      className={"htCenter"}
                      columns={[{}, {}, {}, {}, { type: "date" }, {}, { type: "numeric", numericFormat: { pattern: "0,00.00" } }]}
                      style={{ fontSize: 10, color: 'black' }}
                      cells={function (row, col) {
                        var cellPrp = {};
                        if (col === 0) {
                          cellPrp.className = 'htLeft'
                        } else if (col === 6) {
                          cellPrp.className = 'htRight'
                        } else {
                          cellPrp.className = "htCenter"
                        }
                        return cellPrp
                      }
                      }
                      htDimmed
                      manualColumnResize
                      wordWrap={false}
                      height={400}
                      editor={false}
                      filters={true}
                      dropdownMenu={false}
                      columnSorting={true}
                      colWidths={[615, 45, 45, 60, 75, 75, 75, 60]}
                      rowHeaders={true}
                      colHeaders={this.state.table.colHeadersNON}
                      data={this.state.tableDataNON[this.state.selectedMonth]} />
                  </div>
                </Segment>
              </div>
            </Grid.Column>
          </Grid>
        </div>
      )
    }
  }

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  displayTable = () => {
    if (this.state.ausData.length > 0) {
      return (
        <div style={{ paddingTop: 12, paddingBottom: 12, fontFamily: 'Titillium Web' }}>
          <Segment style={{ width: 1079, backgroundColor: '#F7F7F7' }}>
            <Grid columns={5}>
              <Grid.Column>
                <div>
                  <Segment color="orange">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Australia<br />{this.state.currentMonth}</h3>
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{this.state.symbolToDisplay.aus} ${this.numberWithCommas(this.state.ausData[this.state.selectedMonth])}</h2>
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div>
                  <Segment color="orange">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Canada<br />{this.state.currentMonth}</h3>
       
                        <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{this.state.symbolToDisplay.can} ${this.numberWithCommas(this.state.canData[this.state.selectedMonth])}</h2>
           
                    
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div>
                  <Segment color="orange">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>United States<br />{this.state.currentMonth}</h3>
               
                        <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{this.state.symbolToDisplay.usa} ${this.numberWithCommas(this.state.usaData[this.state.selectedMonth])}</h2>
                     
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div>
                  <Segment color="orange">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>U.K.<br />{this.state.currentMonth} </h3>
                      {(this.state.value === "local") ? 
                        <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>£ {this.numberWithCommas(this.state.ukData[this.state.selectedMonth])}</h2>
                        :
                       <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{this.state.symbolToDisplay.uk} ${this.numberWithCommas(this.state.ukData[this.state.selectedMonth])}</h2>
                      }                  
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div>
                  <Segment color="orange">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>New Zealand<br />{this.state.currentMonth} </h3>
         
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{this.state.symbolToDisplay.nz} ${this.numberWithCommas(this.state.nzData[this.state.selectedMonth])}</h2>
             
                  </Segment>
                </div>
              </Grid.Column>
            </Grid>
          </Segment>
        </div >
      )
    }
  }

  displayConvertAusTable = () => {
    let toDisplay = <p>Cannot fetch Forex data...</p>

    if ((typeof this.state.monthsText[this.state.selectedMonth] === "undefined")) {
      return null
    } else {

      let forexMonth = this.state.monthsText[this.state.selectedMonth].substring(3)
      let forex = this.state.forexData

      toDisplay = (
        <div style={{ fontSize: 10, textAlign: "center", fontFamily: 'Titillium Web' }}>
          <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>AUD Exchange Rates</h3>
          <Grid>
            <Grid.Column width={8}>
              <p><Flag name="ca" />{(1 / (forex[forexMonth]["AUD/CAD"])).toFixed(4)}</p>
              <p><Flag name="us" />{(1 / (forex[forexMonth]["AUD/USD"])).toFixed(4)}</p>
            </Grid.Column>
            <Grid.Column width={8}>
              <p><Flag name="uk" />{(1 / (forex[forexMonth]["AUD/GBP"])).toFixed(4)}</p>
              <p><Flag name="nz" />{(1 / (forex[forexMonth]["AUD/NZD"])).toFixed(4)}</p>
            </Grid.Column>
          </Grid>
        </div>
      )
    }

    return (
      <div style={{ width: 1079, paddingTop: 12, paddingBottom: 12, fontFamily: 'Titillium Web' }}>
        <Segment>
          <Grid>
            <Grid.Column width={12}>
              <div>
                <Segment color="orange">

                  {(this.state.symbolToDisplay.aus === "A") ?
                    <div>
                      <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Global Recurring Revenue in AUD in {this.state.currentMonth}</h3>
                      <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{this.state.symbolToDisplay.aus} ${this.numberWithCommas(this.state.totalAUD)}</h2>
                    </div>
                  :
                    <div>
                      <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Global Recurring Revenue in USD in {this.state.currentMonth}</h3>
                      <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{this.state.symbolToDisplay.aus} ${this.numberWithCommas(this.state.totalAUD)}</h2>
                    </div>
                  }

                </Segment>
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <Segment color="orange">
                {toDisplay}
              </Segment>
            </Grid.Column>
          </Grid>
        </Segment>
      </div >
    )
  }

  // getData = () => {
  //   if (this.props.toRender === "QR") {
  //     this.props.getDataFromRR(this.state)
  //   }
  // }

  handleClickAnnual = () => {
    if (this.state.annual === "Annual") {
      this.setState((prevState) => ({ annual: "" }), this.createMonthsArray)
    } else {
      this.setState((prevState) => ({ annual: "Annual" }), this.createMonthsArray)
    }
  }

  handleClickProject = () => {
    if (this.state.project === "Project") {
      this.setState((prevState) => ({ project: "" }), this.createMonthsArray)
    } else {
      this.setState((prevState) => ({ project: "Project" }), this.createMonthsArray)
    }
  }

  handleClickStatic = () => {
    if (this.state.static === "Static") {
      this.setState((prevState) => ({ static: "" }), this.createMonthsArray)
    } else {
      this.setState((prevState) => ({ static: "Static" }), this.createMonthsArray)
    }
  }

  handleClickBudget = () => {
    if (this.state.budget === "Budget Allocator") {
      this.setState((prevState) => ({ budget: "" }), this.createMonthsArray)
    } else {
      this.setState((prevState) => ({ budget: "Budget Allocator" }), this.createMonthsArray)
    }
  }
  
  handleClickSupport = () => {
    if (this.state.support === "Support") {
      this.setState((prevState) => ({ support: "" }), this.createMonthsArray)
    } else {
      this.setState((prevState) => ({ support: "Support" }), this.createMonthsArray)
    }
	}

  render(props) {


    if (this.props.toRender === "QR") {
      return null
    } else {

      const { toggleActive } = this.state

      const data = {
        labels: DataIn.Labels,
        datasets: [
          {
            label: 'Global',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(15,113,242,0.8)',
            borderColor: 'rgba(15,113,242,0.8)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(15,113,242,0.8)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(15,113,242,0.8)',
            pointHoverBorderColor: 'rgba(15,113,242,0.8)',
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: this.state.totalGlobalRR
          },
          {
            label: 'Australia',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,1,0.8)',
            borderColor: 'rgba(75,192,1,0.8)',
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
            data: this.state.ausData
          },
          {
            label: 'Canada',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(222,213,42,0.8)',
            borderColor: 'rgba(222,213,42,0.8)',
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
            data: this.state.canData
          },
          {
            label: 'USA',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(234,77,49,0.8)',
            borderColor: 'rgba(234,77,49,0.8)',
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
            backgroundColor: 'rgba(49,234,212,0.8)',
            borderColor: 'rgba(49,234,212,0.8)',
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
            backgroundColor: 'rgba(234,49,223,0.8)',
            borderColor: 'rgba(234,49,223,0.8)',
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
        
        <div style={{ paddingTop: 24, paddingBotton: 24, width: 1079 }}>
          <div >
            <Segment color={"orange"}>
              <h1 style={{ fontSize: 40, textAlign: "center", fontFamily: 'Titillium Web' }}>
                Recurring Revenue
            </h1>
            </Segment>
          </div>
          <Segment stlye={{ widht: 1079 }}>
            <Grid columns={3}>
              <GridColumn>
                <div>
                  <Segment color="orange">
                    Add each month's non-recurring revenue to MRR
                    <br />
                    <br />
                    <Checkbox toggle active={toggleActive.toString()} onClick={this.handleToggle} />
                  </Segment>
                </div>
              </GridColumn>
              {/* <GridColumn>
                <div>
                  <Segment color="orange">
                    Display Annual Recurring Revenue (TTM)
                    <br />
                    <br />
                    <Checkbox toggle active={toggleActive.toString()} onClick={this.handleToggle} />
                  </Segment>
                </div>
              </GridColumn> */}
              <GridColumn>
                <Segment color="orange">
                  Chart data displayed in: 
                  <br />
                  <br />
                  <Grid columns={3}>
                    <GridColumn>
                      <Radio
                        label="Local"
                        name="local"
                        value="local"
                        checked={this.state.value === "local"}
                        onChange={this.handleCurrencyChange}
                        
                      />
                    </GridColumn>
                    <GridColumn>
                      <Radio
                        label="AUD"
                        name="aud"
                        value="aud"
                        checked={this.state.value === "aud"}
                        onChange={this.handleCurrencyChange}
                        
                      />
                    </GridColumn>
                    {/* <GridColumn>
                      <Radio
                        label="USD"
                        name="usd"
                        value="usd"
                        checked={this.state.value === "usd"}
                        onChange={this.handleCurrencyChange}
                        
                      />
                    </GridColumn> */}
                  </Grid>
                </Segment>
              </GridColumn>
            </Grid>
          </Segment>
          <Grid columns='equal' style={{ width: 1300, paddingTop: 12, fontFamily: 'Titillium Web' }}>
          <Grid.Column>
            <Segment color="orange" style={{ width: 70, height: 513 }}>
              <br />
              <br />
              <div>
                Annual
                <br />
                <br />
                <Checkbox toggle defaultChecked onClick={this.handleClickAnnual} />
              </div>
              <br />
              <div>
                Project
                <br />
                <br />
                <Checkbox toggle defaultChecked onClick={this.handleClickProject} />
              </div>
              <br />
              <div>
                Static
                <br />
                <br />
                <Checkbox toggle defaultChecked onClick={this.handleClickStatic} />
              </div>
              <br />

              <div>
                Budget
                <br />
                <br />
                <Checkbox toggle defaultChecked onClick={this.handleClickBudget} />
              </div>
              <br />

              <div>
                Support
                <br />
                <br />
                <Checkbox toggle defaultChecked onClick={this.handleClickSupport} />
              </div>


              <br />
              <div>
                <br />
                <br />
              </div>
            </Segment>
			  	</Grid.Column>
         <Grid.Column width={15}>
          <Segment color="orange" style={{ width: 1000 }} >
            <Line
              data={data}
              options={{
                'onClick': (event, item) => {
                  if (item.length > 0) {
                    this.setState((prevState) => ({ selectedMonth: item[0]["_index"] }), this.setChangedMonth)
                  }
                },
                'scales': {
                  xAxes: [{ 
                    stacked: false 
                  }],
                  yAxes: [{ 
                    stacked: false ,
                    ticks: {
                      beginAtZero: true,
                      callback: function(value, index, values) {
                        if(parseInt(value) >= 1000){
                           return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        } else {
                           return '$' + value;
                        }
                      }     
                    }
                  }]
              },
              tooltips: {
                mode: 'label',
                callbacks: {
                    afterTitle: function() {
                        window.total = 0;
                    },
                    label: function(tooltipItem, data) {
                        var corporation = data.datasets[tooltipItem.datasetIndex].label;
                        var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        window.total += parseInt(valor);
                        return corporation + ": $" + valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");             
                    }
                  }
              }
              }}
            />
          </Segment>
          </Grid.Column>
          </Grid>
          <div>
            <DisplayMonth currentMonth={this.state.currentMonth} currentColor={this.state.currentColor} />
          </div>
          <div>
            {this.displayConvertAusTable()}
            {this.displayTable()}
          </div>
          <div>
            {this.displayDetails()}
          </div>
          <div>
            {this.displayDetailsNON()}
          </div>
        </div >
      )
    }
  }
}

export default RecurringRevenueGraph