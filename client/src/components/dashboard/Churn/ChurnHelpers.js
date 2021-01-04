import DataIn from '../DataIn'

export const createMonthsArray = () => {
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

      monthsText.push(new Date(year, month, 0).toLocaleDateString("en-GB").split(',')[0])
    }

    return [months, monthsText]
}

export const setStartingMonth = (months) => {
    let monthsOfYear = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ]

    let startingMonthNumber = months.length - 3

    let month = monthsOfYear[months[months.length - 2].getMonth()]
    let year = months[months.length - 2].getFullYear()

    let prevMonth = monthsOfYear[months[months.length - 3].getMonth()]
    let prevYear = months[months.length - 3].getFullYear()

    let theDate = month + " " + year
    let thePrevDate = prevMonth + " " + prevYear

    return [theDate, thePrevDate, startingMonthNumber]
  }

  export const totalGlobalClients = (months, rawData, annual, project, statics, budget) => {
    let clients = []

    months.forEach((month) => {
      let counter = []

      rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]

        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month && (
          invoice["product"] === annual ||
          invoice["product"] === project ||
          invoice["product"] === statics ||
          invoice["product"] === budget
        )) {
          counter.push(invoice["client"])
        }
      })

      const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
      }

      let uniqClients = counter.filter(onlyUnique)

      clients.push(uniqClients)
    })

    return clients
  }
  
 export const getLostClients = (months, clients) => {
    let lostClients = []
    let lost = []

    for (let i = 0; i < months.length - 1; i++) {
      lostClients = []
      clients[i].forEach((client) => clients[i + 1].includes(client) ? null : lostClients.push(client))
      lost.push(lostClients)
    }

    return lost
  }

  export const getNewClients = (months, clients) => {
    let newClients = []
    let newClientsArray = []

    for (let i = 0; i < months.length - 1; i++) {
      newClients = []
      clients[i + 1].forEach((client) => {
        if (!clients[i].includes(client)) {
          newClients.push(client)
        }
      })
      newClientsArray.push(newClients)
    }

    return newClientsArray
  }

  export const getPrevTotal = (clients) => {
    let prevTotals = []
    clients.forEach((month) => {
      prevTotals.push(month.length)
    })

    return prevTotals
  }

  export const createChurnDataArray = (lost, newClients, prevTotals) => {
    let churnDataArray = []

    for (let i = 0; i < lost.length; i++) {
      churnDataArray.push([lost[i].length, newClients[i].length, prevTotals[i]])
    }

    return churnDataArray
  }

  export const calculateChurn = (churnDataArray, churnTer) => {
    let churn = churnDataArray
    let churnArray = [['Date', churnTer]]

    for (let k = 0; k < churn.length - 1; k++) {
      churnArray.push([new Date(2015, k + 8, 0), ((churn[k][0] / (churn[k][2])) * 100)])
    }

   return churnArray
  }

  export const getValuesForLostClients = (selectedMonth, months, lost, rawData) => {
    let endOfThisMonth = months[selectedMonth + 1]
    let endOfLastMonth = months[selectedMonth] - 86400000

    let details = lost
    let holderArray = []
    for (let i = 0; i < months.length - 2; i++) {
      let holder = []
      for (let k = 0; k < details[i].length; k++) {
        rawData.forEach((invoice) => {
          let endString = invoice["end"]
          let endDateParts = endString.split("/")
          let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

          if (invoice["client"] === details[i][k]) {
            if ((end < endOfThisMonth && end > endOfLastMonth)) {
              holder.push([
                invoice["client"],
                invoice["status"],
                invoice["valuepermonth"],
                invoice["territory"],
                invoice["currency"],
                invoice["invoice"],
                invoice["date"],
                invoice["product"],
                invoice["start"],
                invoice["end"],
                invoice["total"]
              ])
            }
          }
        })
      }

      holderArray.push(holder)
    }

    let lostValues = holderArray

    return lostValues
  }

export const getChurnTotalInAud = (months, monthsText, selectedMonth, forexData, lostValues) => {
    let churnTotalInAud = 0
    if (typeof monthsText[selectedMonth + 1] !== "undefined") {
      let forexMonth = monthsText[selectedMonth + 1].substring(3)
      let forex = forexData
      let data = lostValues[selectedMonth]
      let audArray = []
      let audcad = forex[forexMonth]["AUD/CAD"]
      let audusd = forex[forexMonth]["AUD/USD"]
      let audgbp = forex[forexMonth]["AUD/GBP"]
      let audnzd = forex[forexMonth]["AUD/NZD"]

      if (typeof data !== 'undefined') {
        data.forEach((invoice) => {
          if (invoice[4] === "CAD") {
            audArray.push(invoice[2] * audcad)
          } else if (invoice[4] === "USD") {
            audArray.push(invoice[2] * audusd)
          } else if (invoice[4] === "GBP") {
            audArray.push(invoice[2] * audgbp)
          } else if (invoice[4] === "NZD") {
            audArray.push(invoice[2] * audnzd)
          } else {
            audArray.push(invoice[2])
          }
        })

        churnTotalInAud = Math.round(audArray.reduce((a, b) => a + b, 0).toFixed(2))
      }

    }

    return churnTotalInAud
  }

  export const getValuesForNewClients = (selectedMonth, months, newClients, rawData) => {
    let startfThisMonth = months[selectedMonth + 1]
    let startOfLastMonth = months[selectedMonth]

    let details = newClients
    let holderArray = []

    for (let i = 0; i < months.length - 2; i++) {
      let holder = []
      for (let k = 0; k < details[i].length; k++) {
        rawData.forEach((invoice) => {
          let startString = invoice["start"]
          let startDateParts = startString.split("/")
          let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
          if (invoice["client"] === details[i][k]) {
            if ((start <= startfThisMonth) && (start > startOfLastMonth)) {
              holder.push([
                invoice["client"],
                invoice["valuepermonth"],
                invoice["territory"],
                invoice["currency"],
                invoice["invoice"],
                invoice["date"],
                invoice["product"],
                invoice["start"],
                invoice["end"],
                invoice["total"]
              ])
            }
          }
        })
      }

      holderArray.push(holder)
    }

    let newValues = holderArray

    return newValues
  }

  export const getAddedTotalInAud = (monthsText, selectedMonth, forexData, newValues, ) => {
    let addedTotalInAud = 0

    if (typeof monthsText[selectedMonth + 1] !== "undefined") {
      let forexMonth = monthsText[selectedMonth + 1].substring(3)
      let forex = forexData
      let data = newValues[selectedMonth]
      let audArray = []
      let audcad = forex[forexMonth]["AUD/CAD"]
      let audusd = forex[forexMonth]["AUD/USD"]
      let audgbp = forex[forexMonth]["AUD/GBP"]
      let audnzd = forex[forexMonth]["AUD/NZD"]

      if (typeof data !== 'undefined') {
        data.forEach((invoice) => {
          if (invoice[3] === "CAD") {
            audArray.push(invoice[1] * audcad)
          } else if (invoice[3] === "USD") {
            audArray.push(invoice[1] * audusd)
          } else if (invoice[3] === "GBP") {
            audArray.push(invoice[1] * audgbp)
          } else if (invoice[3] === "NZD") {
            audArray.push(invoice[1] * audnzd)
          } else {
            audArray.push(invoice[1])
          }
        })

        addedTotalInAud = Math.round(audArray.reduce((a, b) => a + b, 0).toFixed(2))
      }
    }
    return addedTotalInAud
  }

  export const checkTableToggle = (annualOn, projectOn, staticOn, budgetOn) => {
    if (annualOn === false && projectOn === false && staticOn === false && budgetOn === false) {
      return false
    } else {
      return true
    }
  }

	export const numberWithCommas = (x) => {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  export const totalClients = (months, rawData, annual, project, statics, budget, churnTer) => {
    const clients = []

    months.forEach((month) => {
      let counter = []

      rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month && (invoice["territory"] === churnTer) && (
          invoice["product"] === annual ||
          invoice["product"] === project ||
          invoice["product"] === statics ||
          invoice["product"] === budget
        )) {
          counter.push(invoice["client"])
        }
      })

      const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
      }

      let uniqClients = counter.filter(onlyUnique)
  
      clients.push(uniqClients)
    })

    return clients
  }

  export const totalGlobalClientsDetail = (months, rawData, annual, project, statics, support, budget) => {
    let detail = []
   
    months.forEach((month) => {
      let counter = []

      rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])

        if (start <= month && end >= month && (
          invoice["product"] === annual ||
          invoice["product"] === project ||
          invoice["product"] === statics ||
          invoice["product"] === budget ||
          invoice["product"] === support
        )) {
          counter.push(invoice)
        }
      })

      detail.push(counter)
    })


    return detail
  }

  export const totalClientsDetail = (months, rawData, annual, project, statics, budget, churnTer) => {
    const detail = []

    months.forEach((month) => {
      let counter = []

      rawData.forEach((invoice) => {
        let startString = invoice["start"]
        let startDateParts = startString.split("/")
        let start = new Date(startDateParts[2], startDateParts[1] - 1, +startDateParts[0])
        let endString = invoice["end"]
        let endDateParts = endString.split("/")
        let end = new Date(endDateParts[2], endDateParts[1] - 1, +endDateParts[0])
     
        if (start <= month && end >= month
          && (invoice["territory"] === churnTer) && (
            invoice["product"] === annual ||
            invoice["product"] === project ||
            invoice["product"] === statics ||
            invoice["product"] === budget ||
            invoice["product"] === "Support"
          )
        ) {
          counter.push(invoice)
        }
      })

      detail.push(counter)
    })

    return detail
  }
  
export const revenueTotals = (months, rawData, churnTer, forexData, annual, project, statics, budget) => {

  const ausTotal = []
  const canTotal = []
  const usaTotal = []
  const ukTotal = []
  const nzTotal = []

  months.forEach((thisMonthEnd) => {
    let ausCounter = []
    let canCounter = []
    let usaCounter = []
    let ukCounter = []
    let nzCounter = []

    rawData.forEach((invoice) => {
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

        if(churnTer === "AUS" || churnTer === "Global") {
          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "AUS") && (
            invoice["product"] === annual ||
            invoice["product"] === project ||
            invoice["product"] === statics ||
            invoice["product"] === budget ||
            invoice["product"] === "Support"
          )) {
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

        if(churnTer === "CAN" || churnTer === "Global") {
          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "CAN") && (
            invoice["product"] === annual ||
            invoice["product"] === project ||
            invoice["product"] === statics ||
            invoice["product"] === budget ||
            invoice["product"] === "Support"
          )) {
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

        if(churnTer === "USA" || churnTer === "Global") {
          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "USA") && (
            invoice["product"] === annual ||
            invoice["product"] === project ||
            invoice["product"] === statics ||
            invoice["product"] === budget || 
            invoice["product"] === "Support"
          )) {
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

        if(churnTer === "UK" || churnTer === "Global") {
          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "UK") && (
            invoice["product"] === annual ||
            invoice["product"] === project ||
            invoice["product"] === statics ||
            invoice["product"] === budget ||
            invoice["product"] === "Support"
          )) {
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

        if(churnTer === "NZ" || churnTer === "Global") {
          if (startContract <= thisMonthEnd && endContract >= thisMonthBegin && (invoice["territory"] === "NZ") && (
            invoice["product"] === annual ||
            invoice["product"] === project ||
            invoice["product"] === statics ||
            invoice["product"] === budget ||
            invoice["product"] === "Support"
          )) {
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


  let canRates = []
  let usaRates = []
  let ukRates = []
  let nzRates = []

  Object.keys(forexData).forEach(key => {
    canRates.push(forexData[key]["AUD/CAD"])
  })

  Object.keys(forexData).forEach(key => {
    usaRates.push(forexData[key]["AUD/USD"])
  })

  Object.keys(forexData).forEach(key => {
    ukRates.push(forexData[key]["AUD/GBP"])
  })

  Object.keys(forexData).forEach(key => {
    nzRates.push(forexData[key]["AUD/NZD"])
  })

  let totalDataRR = []

  if(churnTer === "Global") {
    for (let i = 0; i < ausTotal.length; i++) {
      totalDataRR.push(Math.round(
        ausTotal[i] +
        (canTotal[i] * canRates[i]) +
        (usaTotal[i] * usaRates[i]) +
        (ukTotal[i] * ukRates[i]) +
        (nzTotal[i] * nzRates[i])
      ))
    }


    return totalDataRR
  }

 
  if(churnTer === "AUS") {
    totalDataRR = ausTotal
    return totalDataRR
  }

  if(churnTer === "CAN") {
    for (let i = 0; i < ausTotal.length; i++) {
      totalDataRR.push(Math.round(
        (canTotal[i] * canRates[i])))
    }
    return totalDataRR
  }

  if(churnTer === "USA") {
    for (let i = 0; i < ausTotal.length; i++) {
      totalDataRR.push(Math.round(
        (usaTotal[i] * usaRates[i])))
    }
    return totalDataRR
  }

  if(churnTer === "UK") {
    for (let i = 0; i < ausTotal.length; i++) {
      totalDataRR.push(Math.round(
        (ukTotal[i] * ukRates[i])))
    }
    return totalDataRR
  }

  if(churnTer === "NZ") {
    for (let i = 0; i < ausTotal.length; i++) {
      totalDataRR.push(Math.round(
        (nzTotal[i] * nzRates[i])))
    }
    return totalDataRR
  }

  return null
}

export const getLostClientsValues = (lost, churnTer, detail, forexData) => {
  let canRates = []
  let usaRates = []
  let ukRates = []
  let nzRates = []

  Object.keys(forexData).forEach(key => {
    canRates.push(forexData[key]["AUD/CAD"])
  })

  Object.keys(forexData).forEach(key => {
    usaRates.push(forexData[key]["AUD/USD"])
  })

  Object.keys(forexData).forEach(key => {
    ukRates.push(forexData[key]["AUD/GBP"])
  })

  Object.keys(forexData).forEach(key => {
    nzRates.push(forexData[key]["AUD/NZD"])
  })

  let lostClients = lost
  let clientDetails = detail
  let cad = canRates
  let usd = usaRates
  let gbp = ukRates
  let nzd = nzRates
  let lostValuesArray = []

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

    if(holderTwo.length > 0) {
      lostValuesArray.push(Math.round(holderTwo.pop().reduce((a, b) => a + b, 0)))
    }	else {
      lostValuesArray.push(0)
    }
  }

  return lostValuesArray
}

export const getNewClientsValues = (newClients, churnTer, detail, forexData) => {
  let canRates = []
  let usaRates = []
  let ukRates = []
  let nzRates = []

  Object.keys(forexData).forEach(key => {
    canRates.push(forexData[key]["AUD/CAD"])
  })

  Object.keys(forexData).forEach(key => {
    usaRates.push(forexData[key]["AUD/USD"])
  })

  Object.keys(forexData).forEach(key => {
    ukRates.push(forexData[key]["AUD/GBP"])
  })

  Object.keys(forexData).forEach(key => {
    nzRates.push(forexData[key]["AUD/NZD"])
  })

  let clientDetails = detail
  let cad = canRates
  let usd = usaRates
  let gbp = ukRates
  let nzd = nzRates
  let newValuesArray = []

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

   

    if(holderTwo[0] && holderTwo[0].length > 0) {
      newValuesArray.push(Math.round(holderTwo[0].reduce((a, b) => a + b, 0)))
    }	else {
      newValuesArray.push(0)
    }
  }	

  return newValuesArray
}

export const createGlobalChurndDollarArray = (newValuesArray, lostValuesArray, months, totalDataRR) => {
  
  let globalChurnDollarArray = [["Date", "Global"]]
  for(let i = 0; i < newValuesArray.length; i++) {
    globalChurnDollarArray.push( [ months[i+1], ( lostValuesArray[i] / (totalDataRR[i]) ) * 100  ] )
  }

  return globalChurnDollarArray
}

export const getRollingAnnualChurnArray = (selectedMonth, lost, newClients, totalDataRR, clients, lostClientsValues, newClientsValues, churnDollars) => {
  let rollingLostArray = []
  let rollingNewArray = []
  let rollingLostDollarsArray = []
  let rollingNewDollarsArray = []
  let lostValuesArray = lostClientsValues
  let newValuesArray = newClientsValues
  let clientsArray = []

  let rollingAnnualChurnArray = []
  let rollingAnnualDollarsChurnArray = []

 

  for(let i = 0; i <= lostClientsValues.length; i++) {
    rollingLostArray.push(lost[i].length)
    rollingNewArray.push(newClients[i].length)
    clientsArray.push(clients[i].length)
    rollingLostDollarsArray.push(lostValuesArray[i])
    rollingNewDollarsArray.push(newValuesArray[i])
    }

  let lostForForumula = []
  let newForFormula = []
 
  let lostValuesForFormula = []
  let newValuesForFormula = []
  let mrrValueForFormula = totalDataRR.slice(11)

  for(let i = lostClientsValues.length; i > 11; i--) {
    lostForForumula.push(rollingLostArray.slice(i-12, i).reduce((a,b) => a + b, 0))
    newForFormula.push(rollingNewArray.slice(i-12, i).reduce((a,b) => a + b, 0))
    lostValuesForFormula.push(rollingLostDollarsArray.slice(i-12, i).reduce((a,b) => a + b,0))
    newValuesForFormula.push(rollingNewDollarsArray.slice(i-12,i).reduce((a,b) => a + b, 0))
  }

  lostValuesForFormula.reverse()
  newValuesForFormula.reverse()

  lostForForumula.reverse()
  newForFormula.reverse()

  for (let k=0; k < lostForForumula.length; k++) {
    rollingAnnualChurnArray.push(parseFloat(((lostForForumula[k] / (clientsArray[k]))*100).toFixed(2)))
    rollingAnnualDollarsChurnArray.push(parseFloat(((lostValuesForFormula[k] / (mrrValueForFormula[k]))*100).toFixed(2)))
  }


  let result

  if(!churnDollars) {
    result = rollingAnnualChurnArray
  } else {
    result = rollingAnnualDollarsChurnArray
  }
  return result
}

export const getARPUValuesArray = (totalDataRR, churnDataArray) => {
  let ARPUValuesArray = []

  churnDataArray.forEach((dataMonth, index) => {
    if(index>11) {
    ARPUValuesArray.push(Math.round((totalDataRR[index] / dataMonth[2]*12)))
    }
  })

   return ARPUValuesArray
}
