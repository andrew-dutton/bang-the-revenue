import React from 'react'

const totalValue = props => {
  const totals = []

  if (props.rawData.length === 0) return <div></div>

  if (props.rawData.length > 0) {
    const sum = (a, b) => a + b;
    function currencyFormat(num) {
      return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    props.rawData.forEach((number) => {
      totals.push(number["total"])
    })

    const total = totals.reduce(sum)

    return (
      <div className="ui statistic">
        <div className="value" style={{ color: "blue" }}>
          {currencyFormat(total)}
        </div>
        <div className="label">
          Total value of all invoices
            </div>
      </div>
    )
  }
}

export default totalValue
