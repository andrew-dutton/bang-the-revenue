import React from "react"

const numberOfInvoices = props => {

  const totalInvoices = []

  props.rawData.forEach((invoice) => {
    totalInvoices.push(invoice["invoice"])
  })

  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  }

  let uniqInvoices = totalInvoices.filter(onlyUnique)

  if (totalInvoices.length === 0) return <div></div>


  return (
    <div className="ui statistic">
      <div className="value" style={{ color: "black" }}>
        {uniqInvoices.length}
      </div>
      <div className="label">
        Total Number of Invoices
      </div>
    </div>
  )
}

export default numberOfInvoices
