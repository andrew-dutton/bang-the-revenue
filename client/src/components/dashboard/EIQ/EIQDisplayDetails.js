import React from 'react'
import { Grid, Segment } from 'semantic-ui-react'
import { HotTable } from '@handsontable/react';

const EIQDisplayDetails = (props) => {
  const colHeaders = ["Client", "Item", "Location", "Invoice", "Date", "Product", "Start", "End", "Value"]
    
    return (
      <Grid columns='equal' style={{ width: 1109, paddingBottom: 50, color: 'black' }}>
        <Grid.Column>
          <Segment color={props.currentColor}>

            <div id="hot-app">
              <HotTable
                licenseKey="non-commercial-and-evaluation"
                className={"htCenter"}
                style={{ fontSize: 10, color: 'black' }}
                cells={function (row, col) {
                  var cellPrp = {};
                  if (col === 0 || col === 1) {
                    cellPrp.className = 'htLeft'
                  } else if (col === 2) {
                    cellPrp.className = 'htCenter'
                  } else if (col === 8) {
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
                height={400}
                editor={false}
                columns={[{}, {}, {}, {}, { type: "date" }, {}, { type: "date" }, { type: "date" }, { type: "numeric", numericFormat: { pattern: "0,00.00" } }]}
                columnSorting={true}
                colWidths={[350, 172, 50, 59, 75, 75, 75, 75, 60]}
                rowHeaders={true}
                dateFormat={'DD/MM/YYYY'}
                colHeaders={colHeaders}
                data={props.data} 
                />
            </div>
          </Segment>
        </Grid.Column>
      </Grid>
    )
}

export default EIQDisplayDetails
