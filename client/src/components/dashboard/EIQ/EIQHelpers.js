export const testerOne = (props) => {
    console.log(props)
}

export const testerTwo = (props) => {
    console.log(props)
}


export const getEIQDataTest = props => {
    let data = props.rawData
    let eiqData = []

    data.forEach((invoice) => {
      if(invoice.ehqveiq === "EIQ") {
        eiqData.push(invoice)
      }
    })

    return eiqData
  }