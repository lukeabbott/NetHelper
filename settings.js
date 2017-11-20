import React from 'react'

export default class pageUrl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: props.data
    }
  }

  setData = e => {
    e.preventDefault()
    console.log(e.target.value)
    let urls = e.target.value
    browser.storage.local.set({settings: JSON.parse(urls)})
    this.setState({data: urls})
  }
  render () {
    return (
      <textarea value={this.state.data} onChange={this.setData} />
    )
  }
}
