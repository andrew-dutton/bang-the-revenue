import React from 'react'
import { HotTable } from '@handsontable/react';
import { Segment } from 'semantic-ui-react'


const addedTable = props => {
    if(props.newValues) {
    return (
      <div style={{ paddingTop: 15 }}>
        <Segment color="blue" style={{ width: 1079 }}>
          <h3 style={{ fontFamily: 'Titillium Web' }}>New clients with contracts beginning in {props.currentMonth}</h3>
          <HotTable
            licenseKey="non-commercial-and-evaluation"
            className={"htCenter"}
            style={{ fontSize: 10, color: 'black' }}
            cells={function (row, col) {
              var cellPrp = {};
              if (col === 0) {
                cellPrp.className = 'htLeft'
              } else if (col === 1) {
                cellPrp.className = 'htRight'
              } else if (col === 9) {
                cellPrp.className = "htRight"
              } else {
                cellPrp.className = "htCenter"
              }
              return cellPrp
            }
            }
            htDimmed
            manualColumnResize
            wordWrap={false}
            // height={400}
            editor={false}
            filters={true}
            columns={[{}, { type: "numeric", numericFormat: { pattern: "0,00.00" } }, {}, {}, {}, { type: "date" }, {}, { type: "date" }, { type: "date" }, { type: "numeric", numericFormat: { pattern: "0,00.00" } }]}
            columnSorting={true}
            colWidths={[450, 55, 50, 50, 50, 70, 52, 70, 70, 60]}
            rowHeaders={true}
            colHeaders={props.colHeadersNew}
            data={props.newValues[props.selectedMonth]} />
        </Segment>
      </div >
    )}

    return null
  }

  export default addedTable