import React from 'react'
import { HotTable } from '@handsontable/react';
import { Dimmer, Loader, Icon, Flag, Grid, Checkbox, Segment, Button } from 'semantic-ui-react'

const ChurnTable = props => {
	if(props.lostValues) {
	return (
		<div>
			<Segment color="blue" style={{ width: 1079 }}>
				<div>
					<h3 style={{ fontFamily: 'Titillium Web' }}>Clients who didn't renew in {props.currentMonth}</h3>
					<HotTable
						licenseKey="non-commercial-and-evaluation"
						className={"htCenter"}
						style={{ fontSize: 10, color: 'black' }}
						cells={function (row, col) {
							var cellPrp = {};
								if (col === 0) {
									cellPrp.className = 'htLeft'
								} else if (col === 10) {
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
						columns={[{}, {}, { type: "numeric", numericFormat: { pattern: "0,00.00" } }, {}, {}, {}, { type: "date" }, {}, { type: "date" }, { type: "date" }, { type: "numeric", numericFormat: { pattern: "0,00.00" } }]}
						columnSorting={true}
						colWidths={[350, 100, 55, 50, 50, 50, 70, 52, 70, 70, 60]}
						rowHeaders={true}
						colHeaders={props.colHeadersLost}
						data={props.lostValues[props.selectedMonth]} 
					/>
				</div>
			</Segment>
		</div>
	)}

	return null			

}

export default ChurnTable