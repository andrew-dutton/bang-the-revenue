import React from 'react'
import { Grid, Segment } from 'semantic-ui-react'
import { HotTable } from '@handsontable/react';

const displayDetails = (props) => {

  const displayTotal = () => {
    if (props.loadButtonActive === false) {
      return (
        props.ausData[props.selectedMonth] +
        props.canData[props.selectedMonth] +
        props.usaData[props.selectedMonth] +
        props.ukData[props.selectedMonth] +
        props.nzData[props.selectedMonth]
      )
    } else {
      return ("...")
    }
  }

  if ((props.currentAus + props.currentCan + props.currentUsa + props.currentUk + props.currentNz) > 0) {
    return (
      <Grid columns='equal' style={{ width: 1109, paddingBottom: 50, color: 'black' }}>
        <Grid.Column>
          <Segment color={props.currentColor}>
            <h3><strong>Total: {displayTotal()}</strong></h3>
            <div id="hot-app">
              <HotTable
                licenseKey="non-commercial-and-evaluation"
                className={"htCenter"}
                style={{ fontSize: 10, color: 'black' }}
                cells={function (row, col) {
                  var cellPrp = {};
                  if (col === 0) {
                    cellPrp.className = 'htLeft'
                  } else if (col === 1) {
                    cellPrp.className = 'htCenter'
                  } else if (col === 7) {
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
                columns={[{}, {}, {}, {}, {}, {}, {}, { type: "numeric", numericFormat: { pattern: "0,00.00" } }]}
                columnSorting={true}
                colWidths={[522, 50, 59, 75, 75, 75, 75, 60]}
                rowHeaders={true}
                dateFormat={'DD/MM/YYYY'}
                colHeaders={props.table.colHeaders}
                data={props.ausDetail[props.selectedMonth]} />
            </div>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }

  return null
}

export default displayDetails
