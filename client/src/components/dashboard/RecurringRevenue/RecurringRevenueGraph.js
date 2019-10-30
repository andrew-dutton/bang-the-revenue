import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import { Segment, Grid, Checkbox, Flag, Image, GridColumn } from 'semantic-ui-react'
import { HotTable } from '@handsontable/react';

import DisplayMonth from '../DisplayMonth'

class RecurringRevenueChart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      toggleActive: false,
      currentColor: "orange",
      forexData: this.props.forexData,
      totalAUD: 873822,
      selectedMonth: 0,
      months: [],
      monthsText: [],
      currentMonth: "",
      value: "Local",
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

    this.setState((prevState) => ({ currentMonth: theDate, currentPrevMonth: thePrevDate, selectedMonth: startingMonthNumber }), this.calculateTotalAUD)
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
      totalsArray.push(this.state.canData[this.state.selectedMonth] * audcad)
      totalsArray.push(this.state.usaData[this.state.selectedMonth] * audusd)
      totalsArray.push(this.state.ukData[this.state.selectedMonth] * audgbp)
      totalsArray.push(this.state.nzData[this.state.selectedMonth] * audnzd)

      total = totalsArray.reduce((a, b) => a + b, 0).toFixed(0)



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



  getNumberOfMonthsSinceJuly2015 = () => {
    let today = new Date()
    let thisMonth = today.getMonth()
    let thisYear = today.getFullYear()
    let monthsOfYears = (thisYear - (2015 + 1)) * 12

    return monthsOfYears + thisMonth + 7

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


          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "AUS")) {
            if (invoice["spreadmonths"] > invoice["months"]) {
              // INVOICE DATES ARE NOT FIRST AND/OR LAST DAYS OF MONTH SO NEED PARTIAL CALCULATIONS
              if (actualStartMonth === thisMonthEnd.getMonth() && actualStartYear === thisMonthEnd.getFullYear()) {
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

          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "CAN")) {
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

          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "USA")) {
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

          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "UK")) {
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

          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "NZ")) {
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
    }), this.setStartingMonth)

    return null
  }

  revenueTotalsNON() {
    const ausTotalNON = []
    const canTotalNON = []
    const usaTotalNON = []
    const ukTotalNON = []
    const nzTotalNON = []

    const detailLogged = []

    this.state.months.forEach((month) => {
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

      ausTotalNON.push(Math.round(ausCounter.reduce((a, b) => a + b, 0)))
      canTotalNON.push(Math.round(canCounter.reduce((a, b) => a + b, 0)))
      usaTotalNON.push(Math.round(usaCounter.reduce((a, b) => a + b, 0)))
      ukTotalNON.push(Math.round(ukCounter.reduce((a, b) => a + b, 0)))
      nzTotalNON.push(Math.round(nzCounter.reduce((a, b) => a + b, 0)))

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

    return null
  }


  displayDetails = () => {
    return (
      <div>
        <Grid columns='equal' style={{ width: 1109, paddingTop: 12, paddingBottom: 12, color: 'black' }}>
          <Grid.Column>
            <Image fluid label={{ as: 'a', color: 'orange', corner: 'right', icon: 'star' }} />
            <div>
              <Segment color="orange">
                <h3 style={{ fontFamily: 'Titillium Web' }}>Details of Recurring Revenue for {this.state.currentMonth}</h3>
                <div id="hot-app">
                  <HotTable
                    licenseKey="non-commercial-and-evaluation"
                    className={"htCenter"}
                    columns={[{}, { type: "numeric", numericFormat: { pattern: "0,00.00" } }, {}, {}, {}, {}, {}, {}, {}, { type: "numeric", numericFormat: { pattern: "0,00.00" } }]}
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
              <Image fluid label={{ as: 'a', color: 'orange', corner: 'right', icon: 'star' }} />
              <div>
                <Segment color="orange">
                  <h3 style={{ fontFamily: 'Titillium Web' }}>Non recurring products invoiced in {this.state.currentMonth}</h3>
                  <div id="hot-app">
                    <HotTable
                      licenseKey="non-commercial-and-evaluation"
                      className={"htCenter"}
                      columns={[{}, {}, {}, {}, {}, {}, { type: "numeric", numericFormat: { pattern: "0,00.00" } }]}
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
                <Image fluid label={{ as: 'a', color: 'orange', corner: 'right', icon: 'star' }} />
                <div>
                  <Segment color="orange">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Australia<br />{this.state.currentMonth}</h3>
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>A ${this.numberWithCommas(this.state.ausData[this.state.selectedMonth])}</h2>
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <Image fluid label={{ as: 'a', color: 'orange', corner: 'right', icon: 'star' }} />
                <div>
                  <Segment color="orange">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Canada<br />{this.state.currentMonth}</h3>
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>C ${this.numberWithCommas(this.state.canData[this.state.selectedMonth])}</h2>
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <Image fluid label={{ as: 'a', color: 'orange', corner: 'right', icon: 'star' }} />
                <div>
                  <Segment color="orange">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>United States<br />{this.state.currentMonth}</h3>
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>U ${this.numberWithCommas(this.state.usaData[this.state.selectedMonth])}</h2>
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <Image fluid label={{ as: 'a', color: 'orange', corner: 'right', icon: 'star' }} />
                <div>
                  <Segment color="orange">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>U.K.<br />{this.state.currentMonth} </h3>
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>£{this.numberWithCommas(this.state.ukData[this.state.selectedMonth])}</h2>
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <Image fluid label={{ as: 'a', color: 'orange', corner: 'right', icon: 'star' }} />
                <div>
                  <Segment color="orange">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>New Zealand<br />{this.state.currentMonth} </h3>
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>N ${this.numberWithCommas(this.state.nzData[this.state.selectedMonth])}</h2>
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
              <Image fluid label={{ as: 'a', color: 'orange', corner: 'right', icon: 'star' }} />
              <div>
                <Segment color="orange">
                  <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Global Recurring Revenue in AUD in {this.state.currentMonth}</h3>
                  <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>A ${this.numberWithCommas(this.state.totalAUD)}</h2>
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


  render() {
    const { toggleActive } = this.state

    const data = {
      labels: [
        'Jul-15', 'Aug-15', 'Sep-15', 'Oct-15', 'Nov-15', 'Dec-15', 'Jan-16', 'Feb-16', 'Mar-16', 'Apr-16', 'May-16', 'Jun-16',
        'Jul-16', 'Aug-16', 'Sep-16', 'Oct-16', 'Nov-16', 'Dec-16', 'Jan-17', 'Feb-17', 'Mar-17', 'Apr-17', 'May-17', 'Jun-17',
        'Jul-17', 'Aug-17', 'Sep-17', 'Oct-17', 'Nov-17', 'Dec-17', 'Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18', 'Jun-18',
        'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18', 'Dec-18', 'Jan-19', 'Feb-19', 'Mar-19', 'Apr-19', 'May-19', 'Jun-19',
        'Jul-19', 'Aug-19', 'Sept-19'
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
          data: this.state.ausData
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
          data: this.state.canData
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

      <div style={{ paddingTop: 24, paddingBotton: 24, width: 1079 }}>
        <div >
          <Segment color={"orange"}>
            <h1 style={{ fontSize: 40, textAlign: "center", fontFamily: 'Titillium Web' }}>
              Recurring Revenue
            </h1>
          </Segment>
        </div>
        <Segment stlye={{ widht: 1079 }}>
          <Grid width={16}>
            <GridColumn width={8}>
              <Image fluid label={{ as: 'a', color: 'orange', corner: 'right', icon: 'star' }} />
              <div>
                <Segment color="orange">
                  Dispaly Matt's <strong>"Total Recurring Accrued Monthly Revenue"</strong> Version
                  <br />
                  <br />
                  <Checkbox toggle active={toggleActive} onClick={this.handleToggle} />
                </Segment>
              </div>
            </GridColumn>
            <GridColumn width={8}>
              <Segment color="orange">
                Convert all figures to AUD (not yet active)
              <br />
                <br />
                <Checkbox disabled toggle active={toggleActive} />
              </Segment>
            </GridColumn>
          </Grid>
        </Segment>
        <Segment color="orange" style={{ width: 1079 }} >
          <Line
            data={data}
            options={{
              scales: {
                yAxes: [{
                  ticks: {
                    suggestedMax: 600000
                  }
                }]
              },
              'onClick': (event, item) => {
                if (item.length > 0) {
                  this.setState((prevState) => ({ selectedMonth: item[0]["_index"] }), this.setChangedMonth)
                }
              }
            }}
          />
        </Segment>
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

export default RecurringRevenueChart