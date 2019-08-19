import React, { Component } from "react"

class List extends Component {
  render() {
    const ausList = []
    const canList = []
    const usaList = []
    const ukList = []
    const nzList = []
    const ausproducts = []
    const canproducts = []
    const usaproducts = []
    const ukproducts = []
    const nzproducts = []
    const ausmmr = []
    const canmmr = []
    const usammr = []
    const ukmmr = []
    const nzmmr = []

    const arraus = []
    const arrcan = []
    const arrusa = []
    const arruk = []
    const arrnz = []

    const ausdet = []
    const candet = []
    const usadet = []
    const ukdet = []
    const nzdet = []

    const cantest = []


    const monthStart = new Date('2019-06-01') - 86400000
    const month = new Date('2019-07-01') - 86400000


    this.state.rawData.forEach((invoice) => {
      let startString = invoice["start"]
      let startDateParts = startString.split("/")
      let invDateString = invoice["date"]
      let invDateParts = invDateString.split("/")
      let invDate = new Date(invDateParts[2], invDateParts[1] - 1, +invDateParts[0])

      let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
      let endString = invoice["end"]
      let endDateParts = endString.split("/")
      let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

      if (start <= month && end >= month && (invoice["territory"] === "AUS")) {
        ausList.push(invoice["client"])
        ausproducts.push(invoice["product"])
        ausmmr.push(invoice["valuepermonth"])
      }

      if (start <= month && end >= month && (invoice["territory"] === "CAN")) {
        canList.push(invoice["client"])
        canproducts.push(invoice["product"])
        canmmr.push(invoice["valuepermonth"])
      }

      if (start <= month && end >= month && (invoice["territory"] === "USA")) {
        usaList.push(invoice["client"])
        usaproducts.push(invoice["product"])
        usammr.push(invoice["valuepermonth"])
      }

      if (start <= month && end >= month && (invoice["territory"] === "UK")) {
        ukList.push(invoice["client"])
        ukproducts.push(invoice["product"])
        ukmmr.push(invoice["valuepermonth"])
      }

      if (start <= month && end >= month && (invoice["territory"] === "NZ")) {
        nzList.push(invoice["client"])
        nzproducts.push(invoice["product"])
        nzmmr.push(invoice["valuepermonth"])
      }

      if (invoice["start"] === "" && (invDate > monthStart && invDate < month) && invoice["territory"] === "AUS") {
        arraus.push(invoice["total"])
        ausdet.push(invoice["client"], invoice["item"])
      }

      if (invoice["start"] === "" && (invDate > monthStart && invDate < month) && invoice["territory"] === "CAN") {
        arrcan.push(invoice["total"])
        candet.push(invoice["client"], invoice["item"])
      }

      if (invoice["start"] === "" && (invDate > monthStart && invDate < month) && invoice["territory"] === "USA") {
        arrusa.push(invoice["total"])
        usadet.push(invoice["client"], invoice["item"])
      }

      if (invoice["start"] === "" && (invDate > monthStart && invDate < month) && invoice["territory"] === "UK") {
        arruk.push(invoice["total"])
        ukdet.push(invoice["client"], invoice["item"])
      }

      if (invoice["start"] === "" && (invDate > monthStart && invDate < month) && invoice["territory"] === "NZ") {
        arrnz.push(invoice["total"])
        nzdet.push(invoice["client"], invoice["item"])
      }

    })


    // console.log(ausList)
    // console.log(nzList)
    //console.log(ausproducts)

    // console.log(usaList)
    console.log(ausdet)
    console.log(candet)
    console.log(usadet)
    console.log(ukdet)
    console.log(nzdet)
    console.log(
      (arraus.reduce((a, b) => a + b, 0)) +
      (arrnz.reduce((a, b) => a + b, 0) * .95)
    )

    console.log(arrcan.reduce((a, b) => a + b, 0))
    console.log(arrusa.reduce((a, b) => a + b, 0))
    console.log(arruk.reduce((a, b) => a + b, 0))
    console.log(cantest)

    return null
  }
}



export default List


