import React, { Component } from 'react'
import DashboardHeading from '../DashboardHeading'
import { Grid, Segment, GridColumn, Radio } from 'semantic-ui-react'
import { HotTable } from '@handsontable/react';

class Upgrades extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        loading: false,
        currentColor: "pink",
        value: '',
        colHeaders: ["Invoice", "Date", "Client", "Product", "N/E", "HQ", "Start", "End","Months", "MRR", "Curreny", "Territory", "Total"]
      }
    }

    componentDidMount() {
      this.findUpgrades()
    }

    handleDisplayChange = (e, { value }) => this.setState({ value }, this.findUpgrades)


    findUpgrades = () => {
      const data = this.props.rawData
      const clientNames = []

      data.forEach(line => {
        clientNames.push(line.client)
      })

      let unique = Array.from(new Set(clientNames))

      let clientWithProjectLicence = []
      
      unique.forEach(name => {
        data.forEach(line => {
          if(line.client === name && line.product === "Project") {
            clientWithProjectLicence.push(line.client)
          }
        })
      })
     
      let clientWithBothLicences = []

      clientWithProjectLicence.forEach(name => {
        data.forEach(line => {
          if(line.client === name && line.product === "Annual") {
            clientWithBothLicences.push(line.client)
          }
        })
      })

      let uniqClientsWithBothLicences = Array.from(new Set(clientWithBothLicences))

      console.log(uniqClientsWithBothLicences)

      this.setState( {uniqClientsWithBothLicences} )




      this.createDataArray()
    }

    createDataArray = () => {
      const data = this.props.rawData
      const tableData = []
      console.log(this.state)
      if(this.state.value === "projectToAnnual" || this.state.value === "annualToStatic") {
        data.forEach(invoice => {
          if(this.state.uniqClientsWithBothLicences.includes(invoice.client) && (invoice.product === "Annual" || invoice.product === "Project")) {
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
      }
      this.setState((prevState) => ({ testData: tableData }))
    }

    // onChangeHandler = (e) => {
    //   this.setState({value: e.target.value}, this.createDataArray)
    // }
    
    render() {
      return (
        <div style={{ paddingTop: 24, paddingBotton: 24 }}>
          <DashboardHeading title={"Upgrades & Downgrades"} currentColor={this.state.currentColor} />   
          <div style={{ paddingTop: 14, paddingBottom: 12, fontFamily: 'Titillium Web' }}>
            <Segment style={{ width: 1079, fontFamily: 'Titillium Web' }}> 
              <Grid columns={2}>
                <GridColumn>
                  <Segment color={this.state.currentColor}>
                    <Grid columns={2}>
                      <GridColumn>
                        <Radio
                          label="Project to Annual"
                          name="projectToAnnual"
                          value="projectToAnnual"
                          checked={this.state.value === "projectToAnnual"}
                          onChange={this.handleDisplayChange}
                          
                        />
                      </GridColumn>
                      <GridColumn>
                        <Radio
                          label="Annual to Static"
                          name="annualToStatic"
                          value="annualToStatic"
                          checked={this.state.value === "annualToStatic"}
                          onChange={this.handleDisplayChange}
                          
                        />
                      </GridColumn>
                      {/* <GridColumn>
                        <Radio
                          label="Average Licence Value Per Client in AUD"
                          name="averages"
                          value="averages"
                          checked={this.state.value === "averages"}
                          onChange={this.handleDisplayChange}
                        />
                      </GridColumn> */}
                    </Grid>
                  </Segment>
                </GridColumn>
                <GridColumn>
                {this.state.value === "averages" ? 
                  <Segment color="green" style={{ textAlign: "center"}}>
                    <p>Note: Used five year average exchange rates to avoid distorting comparisons</p>
                    <p>USD: 0.72 &nbsp; &nbsp; &nbsp; CAD: 0.95   &nbsp; &nbsp; &nbsp;  GBP: 0.55  &nbsp; &nbsp; &nbsp;   NZD: 1.07</p>
                 </Segment>
                
                :

              <div></div>
                
                }
                </GridColumn>
              </Grid>
            </Segment>
          </div>
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
  
  export default Upgrades