import React, { Component } from 'react'
import { Grid, Segment, GridColumn, Radio } from 'semantic-ui-react'
import CashflowChart from './CashflowChart'
import DashboardHeading from '../DashboardHeading'
import DataIn from '../DataIn'

class Cashflow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentColor: "yellow",
      value: "monthly",
      dataTypeValue: "invoiced",
      dataTimeValue: "all"
    }
  }

  componentDidMount() {
      this.loadAusData()
      this.loadSpendAusData()
  }

  loadSpendAusData = () => {
    const data = this.props.rawCashflow

    let anzsUnsorted = []
    let anzs = []

    data.forEach((item) => {
      let monthDigit = ""
      if (item.month < 10)  {
        monthDigit = "0" + item.month
      } else {
        monthDigit = item.month.toString() 
      }
      anzsUnsorted.push({
        date: item.year.toString() + "/" + monthDigit,
        amount: item.ANZS 
      })
    })

    anzsUnsorted.sort((a,b) => (a.date > b.date) ? 1 : -1)

    anzsUnsorted.forEach((item) => {
      anzs.push(Math.round(item.amount))
    })

    
    this.setState({ anzs }, this.loadSpendRates)
  }

  loadSpendRates = () => {
    const rates = DataIn.cfrates
    let canRates = []
    let usaRates = []
    let ukRates = []

    Object.keys(rates).forEach(month => {
      canRates.push(rates[month]["AUD/CAD"])
      usaRates.push(rates[month]["AUD/USD"])
      ukRates.push(rates[month]["AUD/GBP"])
    })

    this.setState({ canRates, usaRates, ukRates }, this.loadOtherSpendData)
  }

  loadOtherSpendData = () => {
    const data = this.props.rawCashflow
    const canRates = this.state.canRates
    const usaRates = this.state.usaRates
    const ukRates = this.state.ukRates
    const labels = DataIn.CashflowLabels
    let cansUnsorted = []
    let usasUnsorted = []
    let uksUnsorted = []
    let canCad = []
    let usaUsd = []
    let ukGbp = []
    let cans = []
    let usas = []
    let uks = []

    data.forEach((item) => {
      let monthDigit = ""
      if (item.month < 10)  {
        monthDigit = "0" + item.month
      } else {
        monthDigit = item.month.toString() 
      }
      cansUnsorted.push({
        date: item.year.toString() + "/" + monthDigit,
        amount: item.CANS 
      })
      usasUnsorted.push({
        date: item.year.toString() + "/" + monthDigit,
        amount: item.USAS 
      })
      uksUnsorted.push({
        date: item.year.toString() + "/" + monthDigit,
        amount: item.UKS 
      })
    })

    cansUnsorted.sort((a,b) => (a.date > b.date) ? 1 : -1)
    usasUnsorted.sort((a,b) => (a.date > b.date) ? 1 : -1)
    uksUnsorted.sort((a,b) => (a.date > b.date) ? 1 : -1)

    cansUnsorted.forEach((item) => {
      canCad.push(item.amount)
    })

    usasUnsorted.forEach((item) => {
      usaUsd.push(item.amount)
    })

    uksUnsorted.forEach((item) => {
      ukGbp.push(item.amount)
    })

    canCad.forEach((item, index) => {
      cans.push(Math.round(item * canRates[index]))
    })

    usaUsd.forEach((item, index) => {
      usas.push(Math.round(item * usaRates[index]))
    })

    ukGbp.forEach((item, index) => {
      uks.push(Math.round(item * ukRates[index]))
    })

    this.setState({ cans, usas, uks, labels }, this.checkSpendTimeframe)
  }

  checkSpendTimeframe = () => {
    if(this.state.value === "monthly") {
      this.checkTimeValue()
    } else if(this.state.value === "quarterly") {
      this.showQuarterlySpendData()
    } else {
      this.showAnnualSpendData()
    }
  }

  showQuarterlySpendData = () => {
    let quarters = DataIn.CashflowQuarters
    let anzsq = []
    let cansq = []
    let usasq = []
    let uksq = []
    let anz = []
    let can = []
    let usa = []
    let uk = []

    anzsq = this.arrayTo2DArray2(this.state.anzs, 3)
    cansq = this.arrayTo2DArray2(this.state.cans, 3)
    usasq = this.arrayTo2DArray2(this.state.usas, 3)
    uksq = this.arrayTo2DArray2(this.state.uks, 3)

    anzsq.forEach(qtr => {
      anz.push(qtr.reduce((a,b) => a+b, 0))
    })

    cansq.forEach(qtr => {
      can.push(qtr.reduce((a,b) => a+b, 0))
    })

    usasq.forEach(qtr => {
      usa.push(qtr.reduce((a,b) => a+b, 0))
    })

    uksq.forEach(qtr => {
      uk.push(qtr.reduce((a,b) => a+b, 0))
    })

    this.setState({
      anzs: anz,
      cans: can,
      usas: usa,
      uks: uk,
      labels: quarters
    })
  }

  showAnnualSpendData = () => {
    let years = DataIn.Years
    let anzs = this.state.anzs
    let cans = this.state.cans
    let usas = this.state.usas
    let uks = this.state.uks
    let anz = []
    let can = []
    let usa = []
    let uk = []

    let anzsa = this.arrayTo2DArray2(anzs, 12)
    let cansa = this.arrayTo2DArray2(cans, 12)
    let usasa = this.arrayTo2DArray2(usas, 12)
    let uksa = this.arrayTo2DArray2(uks, 12)

    anzsa.forEach(qtr => {
      anz.push(qtr.reduce((a,b) => a+b, 0))
    })

    cansa.forEach(qtr => {
      can.push(qtr.reduce((a,b) => a+b, 0))
    })

    usasa.forEach(qtr => {
      usa.push(qtr.reduce((a,b) => a+b, 0))
    })

    uksa.forEach(qtr => {
      uk.push(qtr.reduce((a,b) => a+b, 0))
    })

    this.setState({ 
      labels: years,
      anzs: anz,
      cans: can,
      usas: usa,
      uks: uk
    })
  }

  loadAusData = props => {
    const data = this.props.rawCashflow
    let anziUnsorted = []
    let anzi = []

    data.forEach((item) => {
      let monthDigit = ""
      if (item.month < 10)  {
        monthDigit = "0" + item.month
      } else {
        monthDigit = item.month.toString() 
      }
      anziUnsorted.push({
        date: item.year.toString() + "/" + monthDigit,
        amount: item.ANZI 
      })
    })

    anziUnsorted.sort((a,b) => (a.date > b.date) ? 1 : -1)

    anziUnsorted.forEach((item) => {
      anzi.push(Math.round(item.amount))
    })
    
    this.setState({ anzi }, this.loadRates)
  }

  loadRates = () => {
    const rates = DataIn.cfrates
    let canRates = []
    let usaRates = []
    let ukRates = []

    Object.keys(rates).forEach(month => {
      canRates.push(rates[month]["AUD/CAD"])
      usaRates.push(rates[month]["AUD/USD"])
      ukRates.push(rates[month]["AUD/GBP"])
    })

    this.setState({ canRates, usaRates, ukRates }, this.loadOtherData)
  }

  loadOtherData = () => {
    const data = this.props.rawCashflow
    const canRates = this.state.canRates
    const usaRates = this.state.usaRates
    const ukRates = this.state.ukRates
    const labels = DataIn.CashflowLabels
    let caniUnsorted = []
    let usaiUnsorted = []
    let ukiUnsorted = []
    let canCad = []
    let usaUsd = []
    let ukGbp = []
    let cani = []
    let usai = []
    let uki = []

    data.forEach((item) => {
      let monthDigit = ""
      if (item.month < 10)  {
        monthDigit = "0" + item.month
      } else {
        monthDigit = item.month.toString() 
      }
      caniUnsorted.push({
        date: item.year.toString() + "/" + monthDigit,
        amount: item.CANI 
      })
      usaiUnsorted.push({
        date: item.year.toString() + "/" + monthDigit,
        amount: item.USAI 
      })
      ukiUnsorted.push({
        date: item.year.toString() + "/" + monthDigit,
        amount: item.UKI 
      })
    })

    caniUnsorted.sort((a,b) => (a.date > b.date) ? 1 : -1)
    usaiUnsorted.sort((a,b) => (a.date > b.date) ? 1 : -1)
    ukiUnsorted.sort((a,b) => (a.date > b.date) ? 1 : -1)

    caniUnsorted.forEach((item) => {
      canCad.push(item.amount)
    })

    usaiUnsorted.forEach((item) => {
      usaUsd.push(item.amount)
    })

    ukiUnsorted.forEach((item) => {
      ukGbp.push(item.amount)
    })
   
    canCad.forEach((item, index) => {
      cani.push(Math.round(item * canRates[index]))
    })

    usaUsd.forEach((item, index) => {
      usai.push(Math.round(item * usaRates[index]))
    })

    ukGbp.forEach((item, index) => {
      uki.push(Math.round(item * ukRates[index]))
    })

    this.setState({ cani, usai, uki, labels }, this.checkInvoicedTimeFrame)

  }

  checkInvoicedTimeFrame = () => {
    if(this.state.value === "monthly") {
      this.checkTimeValue()
    } else if(this.state.value === "quarterly") {
      this.showQuarterlyData()
    } else {
      this.showAnnual()
    }
  }

  showAnnual = () => {
    let years = DataIn.Years
    let anzi = this.state.anzi
    let cani = this.state.cani
    let usai = this.state.usai
    let uki = this.state.uki
    let anz = []
    let can = []
    let usa = []
    let uk = []

    let anzia = this.arrayTo2DArray2(anzi, 12)
    let cania = this.arrayTo2DArray2(cani, 12)
    let usaia = this.arrayTo2DArray2(usai, 12)
    let ukia = this.arrayTo2DArray2(uki, 12)

    anzia.forEach(qtr => {
      anz.push(qtr.reduce((a,b) => a+b, 0))
    })

    cania.forEach(qtr => {
      can.push(qtr.reduce((a,b) => a+b, 0))
    })

    usaia.forEach(qtr => {
      usa.push(qtr.reduce((a,b) => a+b, 0))
    })

    ukia.forEach(qtr => {
      uk.push(qtr.reduce((a,b) => a+b, 0))
    })

    this.setState({ 
      labels: years,
      anzi: anz,
      cani: can,
      usai: usa,
      uki: uk
    })
  }

  arrayTo2DArray2 = (list, howMany) => {
    let idx = 0
    let result = []
  
    while (idx < list.length) {
      if (idx % howMany === 0) result.push([])
      result[result.length - 1].push(list[idx++])
    }
  
    return result
  }
  
  showQuarterlyData = () => {
    let quarters = DataIn.CashflowQuarters
    let anziq = []
    let caniq = []
    let usaiq = []
    let ukiq = []
    let anz = []
    let can = []
    let usa = []
    let uk = []

    anziq = this.arrayTo2DArray2(this.state.anzi, 3)
    caniq = this.arrayTo2DArray2(this.state.cani, 3)
    usaiq = this.arrayTo2DArray2(this.state.usai, 3)
    ukiq = this.arrayTo2DArray2(this.state.uki, 3)

    anziq.forEach(qtr => {
      anz.push(qtr.reduce((a,b) => a+b, 0))
    })

    caniq.forEach(qtr => {
      can.push(qtr.reduce((a,b) => a+b, 0))
    })

    usaiq.forEach(qtr => {
      usa.push(qtr.reduce((a,b) => a+b, 0))
    })

    ukiq.forEach(qtr => {
      uk.push(qtr.reduce((a,b) => a+b, 0))
    })

    this.setState({
      anzi: anz,
      cani: can,
      usai: usa,
      uki: uk,
      labels: quarters
    })
  }

  checkTimeValue = () => {
    if(this.state.dataTimeValue === "all") {
      return null
    }

    if(this.state.dataTimeValue === "14/15") {
      let anzi = this.state.anzi.slice(0,12)
      let cani = this.state.cani.slice(0,12)
      let usai = this.state.usai.slice(0,12)
      let uki = this.state.uki.slice(0,12)
      let anzs = this.state.anzs.slice(0,12)
      let cans = this.state.cans.slice(0,12)
      let usas = this.state.usas.slice(0,12)
      let uks = this.state.uks.slice(0,12)
      let labels = this.state.labels.slice(0,12)
      this.setState({anzi, cani, usai, uki, anzs, cans, usas, uks, labels})
    }

    if(this.state.dataTimeValue === "15/16") {
      let anzi = this.state.anzi.slice(12,24)
      let cani = this.state.cani.slice(12,24)
      let usai = this.state.usai.slice(12,24)
      let uki = this.state.uki.slice(12,24)
      let anzs = this.state.anzs.slice(12,24)
      let cans = this.state.cans.slice(12,24)
      let usas = this.state.usas.slice(12,24)
      let uks = this.state.uks.slice(12,24)
      let labels = this.state.labels.slice(12,24)
      this.setState({anzi, cani, usai, uki, anzs, cans, usas, uks, labels})
    }

    if(this.state.dataTimeValue === "16/17") {
      let anzi = this.state.anzi.slice(24,36)
      let cani = this.state.cani.slice(24,36)
      let usai = this.state.usai.slice(24,36)
      let uki = this.state.uki.slice(24,36)
      let anzs = this.state.anzs.slice(24,36)
      let cans = this.state.cans.slice(24,36)
      let usas = this.state.usas.slice(24,36)
      let uks = this.state.uks.slice(24,36)
      let labels = this.state.labels.slice(24,36)
      this.setState({anzi, cani, usai, uki, anzs, cans, usas, uks, labels})
    }

    if(this.state.dataTimeValue === "17/18") {
      let anzi = this.state.anzi.slice(36,48)
      let cani = this.state.cani.slice(36,48)
      let usai = this.state.usai.slice(36,48)
      let uki = this.state.uki.slice(36,48)
      let anzs = this.state.anzs.slice(36,48)
      let cans = this.state.cans.slice(36,48)
      let usas = this.state.usas.slice(36,48)
      let uks = this.state.uks.slice(36,48)
      let labels = this.state.labels.slice(36,48)
      this.setState({anzi, cani, usai, uki, anzs, cans, usas, uks, labels})
    }

    if(this.state.dataTimeValue === "18/19") {
      let anzi = this.state.anzi.slice(48,60)
      let cani = this.state.cani.slice(48,60)
      let usai = this.state.usai.slice(48,60)
      let uki = this.state.uki.slice(48,60)
      let anzs = this.state.anzs.slice(48,60)
      let cans = this.state.cans.slice(48,60)
      let usas = this.state.usas.slice(48,60)
      let uks = this.state.uks.slice(48,60)
      let labels = this.state.labels.slice(48,60)
      this.setState({anzi, cani, usai, uki, anzs, cans, usas, uks, labels})
    }

    if(this.state.dataTimeValue === "19/20") {
      let anzi = this.state.anzi.slice(60,72)
      let cani = this.state.cani.slice(60,72)
      let usai = this.state.usai.slice(60,72)
      let uki = this.state.uki.slice(60,72)
      let anzs = this.state.anzs.slice(60,72)
      let cans = this.state.cans.slice(60,72)
      let usas = this.state.usas.slice(60,72)
      let uks = this.state.uks.slice(60,72)
      let labels = this.state.labels.slice(60,72)
      this.setState({anzi, cani, usai, uki, anzs, cans, usas, uks, labels})
    }

    if(this.state.dataTimeValue === "20/21") {
      let anzi = this.state.anzi.slice(72,84)
      let cani = this.state.cani.slice(72,84)
      let usai = this.state.usai.slice(72,84)
      let uki = this.state.uki.slice(72,84)
      let anzs = this.state.anzs.slice(72,84)
      let cans = this.state.cans.slice(72,84)
      let usas = this.state.usas.slice(72,84)
      let uks = this.state.uks.slice(72,84)
      let labels = this.state.labels.slice(72,84)
      this.setState({anzi, cani, usai, uki, anzs, cans, usas, uks, labels})
    }

  }

  setGraphMax = () => {
    console.log('set max')
  }

  handleTimeframeChange = (e, { value }) => this.setState({ value }, this.checkDataChange)

  handleDataChange = (e, { value }) => this.setState({ dataTypeValue: value}, this.checkDataChange)

  handleTimeChange = (e, { value }) => this.setState({ dataTimeValue: value}, this.checkDataChange)

 

  checkDataChange = () => {
    if(this.state.dataTypeValue === "comparison") {
      this.loadComparison()
    } else if(this.state.dataTypeValue === "invoiced") {
      this.loadAusData()
    } else {
      this.loadSpendAusData()
    }
  }

  loadComparison = () => {
    this.loadAusData()
    this.loadSpendAusData()
  }

  render(props) {
    if(!this.state.anzi || !this.state.cani || !this.state.usai || !this.state.uki || !this.state.labels) {
      return null
    } else {
      return (
        <div style={{ paddingTop: 24, paddingBotton: 24 }}>
          <DashboardHeading title={"Cashflow Reporting"} currentColor={this.state.currentColor} />
            <Segment style={{ width: 1079 }}>
       
            <Grid columns={2}>
                <GridColumn>
                  <Segment color={this.state.currentColor}>
                    Select Data to Display:
                    <br />
                    <br />
                    <Grid columns={3}>
                      <GridColumn>
                      <Radio
                          label="Invoiced"
                          name="invoiced"
                          value="invoiced"
                          checked={this.state.dataTypeValue === "invoiced"}
                          onChange={this.handleDataChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="Spending"
                          name="spending"
                          value="spending"
                          checked={this.state.dataTypeValue === "spending"}
                          onChange={this.handleDataChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="Comparison"
                          name="comparison"
                          value="comparison"
                          checked={this.state.dataTypeValue === "comparison"}
                          onChange={this.handleDataChange}
                          enabled="true"
                        />
                      </GridColumn>
                    </Grid>
                  </Segment>
                </GridColumn>
                <GridColumn>
                  <Segment color={this.state.currentColor}>
                    Display Data by:
                    <br />
                    <br />
                    <Grid columns={3}>
                      <GridColumn>
                      <Radio
                          label="Month"
                          name="monthly"
                          value="monthly"
                          checked={this.state.value === "monthly"}
                          onChange={this.handleTimeframeChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="Quarter"
                          name="quarterly"
                          value="quarterly"
                          checked={this.state.value === "quarterly"}
                          onChange={this.handleTimeframeChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="Financial Year"
                          name="fy"
                          value="fy"
                          checked={this.state.value === "fy"}
                          onChange={this.handleTimeframeChange}
                          enabled="true"
                        />
                      </GridColumn>
                    </Grid>
                  </Segment>
                </GridColumn>
              </Grid>

              <Grid>
              {this.state.value === "monthly" ?
                <GridColumn>
                  <Segment color={this.state.currentColor}>
                    Select Financial Year to Display:
                    <br />
                    <br />
                    <Grid columns={8}>
                    <GridColumn>
                      <Radio
                          label="All"
                          name="all"
                          value="all"
                          checked={this.state.dataTimeValue === "all"}
                          onChange={this.handleTimeChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="14/15"
                          name="14/15"
                          value="14/15"
                          checked={this.state.dataTimeValue === "14/15"}
                          onChange={this.handleTimeChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="15/16"
                          name="15/16"
                          value="15/16"
                          checked={this.state.dataTimeValue === "15/16"}
                          onChange={this.handleTimeChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="16/17"
                          name="16/17"
                          value="16/17"
                          checked={this.state.dataTimeValue === "16/17"}
                          onChange={this.handleTimeChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="17/18"
                          name="17/18"
                          value="17/18"
                          checked={this.state.dataTimeValue === "17/18"}
                          onChange={this.handleTimeChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="18/19"
                          name="18/19"
                          value="18/19"
                          checked={this.state.dataTimeValue === "18/19"}
                          onChange={this.handleTimeChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="19/20"
                          name="19/20"
                          value="19/20"
                          checked={this.state.dataTimeValue === "19/20"}
                          onChange={this.handleTimeChange}
                          enabled="true"
                        />
                      </GridColumn>
                      <GridColumn>
                      <Radio
                          label="20/21"
                          name="20/21"
                          value="20/21"
                          checked={this.state.dataTimeValue === "20/21"}
                          onChange={this.handleTimeChange}
                          enabled="true"
                        />
                      </GridColumn>
                    </Grid>

          

                  </Segment>
                </GridColumn>
                :
                <div></div>
      }

              </Grid>
    
    
       
          
          </Segment>

            <CashflowChart
              currentColor={this.state.currentColor}
              anzi={this.state.anzi}
              cani={this.state.cani}
              usai={this.state.usai}
              uki={this.state.uki}
              anzs={this.state.anzs}
              cans={this.state.cans}
              usas={this.state.usas}
              uks={this.state.uks}
              labels={this.state.labels}
              timeFrameValue={this.state.value}
              dataTypeValue={this.state.dataTypeValue}
              dataTimeValue={this.state.dataTimeValue}
              graphMax={this.state.graphMax}
            />         
        </div>
      )
    }
  }
}

export default Cashflow