import React, { Component } from 'react'
import DashboardHeading from '../DashboardHeading'
import { Grid, Segment, Icon } from 'semantic-ui-react'
import { HotTable } from '@handsontable/react';

class SearchData extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        loading: false,
        currentColor: "teal",
        value: '',
        colHeaders: ["Invoice", "Date", "Client", "Product", "N/E", "HQ", "Start", "End","Months", "MRR", "Curreny", "Territory", "Total"]
      }
    }

    componentDidMount() {
      this.createDataArray()
    }

    createDataArray = () => {
      const data = this.props.rawData
      const tableData = []
      data.forEach(invoice => {
        if(invoice["client"].toLowerCase().includes(this.state.value.toLowerCase())) {
          tableData.push([
            invoice["invoice"],
            invoice["date"],
            invoice["client"],
            invoice["product"],
            invoice["ebvnb"],
            invoice["ehqveiq"],
            invoice["start"],
            invoice["end"],
            invoice["months"],
            invoice["valuepermonth"], // 12
            invoice["currency"],
            invoice["territory"],
            invoice["total"] // 20
          ])
        }
      })

      this.setState((prevState) => ({ testData: tableData }))
    }

    onChangeHandler = (e) => {
      this.setState({value: e.target.value}, this.createDataArray)
    }
    
    render() {
      return (
        <div style={{ paddingTop: 24, paddingBotton: 24 }}>
          <DashboardHeading title={"Data Search"} currentColor={this.state.currentColor} />   
          <Segment color={this.state.currentColor} style={{ width: 1079 }}>
            <p style={{ fontSize: 20, textAlign: "left", fontFamily: 'Titillium Web' }}>
              Search by Client:   <input
          value={this.state.value}
          onChange={e => this.onChangeHandler(e)}
  
        /> 
   
          <Icon onClick={() => this.setState({value: ""}, this.createDataArray)} color={"red"} name={"delete"}></Icon>
   
        
            </p>
          </Segment>  
            <Grid columns='equal' style={{ width: 1109, paddingBottom: 50, color: 'black' }}>
              <Grid.Column>
                <Segment color={this.state.currentColor}>
                    <div id="hot-app">
                    <HotTable
                        licenseKey="non-commercial-and-evaluation"
                        className={"htCenter"}
                        style={{ fontSize: 10, color: 'black' }}
                        cells={
                          function (row, col) {
                            var cellPrp = {};
                              if (col === 0 || col === 2 ) {
                                  cellPrp.className = 'htLeft'
                              } else if (col === 1) {
                                  cellPrp.className = 'htRight'
                              } else if (col ===  6|| col === 7 || col === 9 || col === 12) {
                                  cellPrp.className = 'htRight'
                              } else {
                                  cellPrp.className = 'htCenter htMiddle'
                              }
                              return cellPrp
                            }
                          }
                        htDimmed
                        manualColumnResize
                        wordWrap={false}
                        height={500}
                        editor={false}
                        columns={[{}, { type: "date" }, {}, {}, {}, {}, { type: "date" }, { type: "date" }, {}, { type: "numeric", numericFormat: { pattern: "0,00.00" } }, {}, {}, { type: "numeric", numericFormat: { pattern: "0,00.00" } }]}
                        columnSorting={true}
                        colWidths={[55, 70, 324, 90, 35, 35, 70, 70, 40, 52, 45, 45, 60]}
                        rowHeaders={true}
                        dateFormat={'DD/MM/YYYY'}
                        colHeaders={this.state.colHeaders}
                        data={this.state.testData}
                        />
                    </div>
                </Segment>
              </Grid.Column>
            </Grid>
          </div >
        )
    }
  }
  
  export default SearchData