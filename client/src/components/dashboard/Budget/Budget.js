import React, { Component } from 'react'

class Budget extends Component {
  constructor(props) {
    super(props)
    


    return {
      render() {
        const bills = props.rawSpend.map((bill) => 
          <li>{bill.debit}</li>
        )

        return (
          <div>
            <h1>Budget ... </h1>
            <ol>
              {bills}
            </ol>
            
          </div>
        )
      }
    }
  }
}

export default Budget


