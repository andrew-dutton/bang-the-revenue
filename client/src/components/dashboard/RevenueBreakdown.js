import React from 'react'

const revenueBreakdown = props => {
  const sub = []

  props.rawData.forEach((invoice) => {
    if (invoice["desc"] === "EHQ Licence")
      sub.push(invoice["total"])
  })

  const sum = (a, b) => a + b;

  if (sub.length < 1) {
    return null
  }

  const total = sub.reduce(sum)

  function currencyFormat(num) {
    return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  return (
    <div className="ui statistic">
      <div className="value" style={{ color: "green" }}>
        {currencyFormat(total)}
      </div>
      <div className="label">
        Total value of invoices with type of Subscription
      </div>
    </div>
  )

}

export default revenueBreakdown
