import React, { Component } from 'react'
import { HotTable } from '@handsontable/react';
import { Search, Grid, Segment, Button, Checkbox } from 'semantic-ui-react'

class InvoiceSearch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      testData: 'testing ok',
      data: [],
      searchValue: '',
      headers: ["Invoice", "Date", "Client", "Description", "Product", "EB / NB", "EHQ / EIQ", "Item", "Account", "Stat Date",
        "End Date", "Days", "Months", "Spread", "Value Per Month", "Currency", "Territory", "FY", "Invoice Total", "Notes",
        "State", "Sector", "Industy", "id"]
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ searchValue: event.target.value })
  }

  handleSubmit(event) {
    alert('Client being searched for is: ' + this.state.searchValue)
    event.preventDefault()
  }

  createData = () => {
    const data = []
    this.props.rawData.forEach((invoice) => {
      data.push([
        invoice["invoice"],
        invoice["date"],
        invoice["client"],
        invoice["desc"],
        invoice["product"],
        invoice["ebvnb"],
        invoice["ehqveiq"],
        invoice["item"],
        invoice["account"],
        invoice["start"],
        invoice["end"],
        invoice["days"],
        invoice["months"],
        invoice["spreadmonths"],
        invoice["valuepermonth"],
        invoice["currency"],
        invoice["territory"],
        invoice["fy"],
        invoice["total"],
        invoice["notes"],
        invoice["state"],
        invoice["sector"],
        invoice["industy"],
        invoice["id"]
      ])
    })
    this.setState((prevState) => ({ data }))

  }

  handleClickView = () => {
    this.setState((prevState) => ({ viewCompact: !prevState.viewCompact }))
  }

  render() {

    return (
      // <div>
      //   <div>
      //     <h1>Invoice Search</h1>
      //     <form onSubmit={this.handleSubmit}>
      //       <label>
      //         Client:
      //       <input type="text" value={this.state.seachValue} onChange={this.handleChange} />
      //       </label>
      //       <input type="submit" value="Submit" />
      //     </form>
      //   </div>
      <div style={{ paddingTop: 20 }}>

        <Grid columns='equal' style={{ width: 1109 }}>
          <Grid.Column>
            <Segment>
              <div style={{ paddingBottom: 100 }}>
                <Button primary onClick={this.createData} >
                  Get Data
               </Button>
              </div>
              <div id="hot-app">
                <HotTable
                  licenseKey="non-commercial-and-evaluation"
                  style={{ fontSize: 10 }}
                  height={800}
                  filters={true}
                  dropdownMenu={true}
                  columnSorting={true}
                  rowHeaders={true}
                  colHeaders={this.state.headers}
                  data={this.state.data} />
              </div>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default InvoiceSearch