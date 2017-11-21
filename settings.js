import React from 'react'

export default class pageUrl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      urls: props.data.urls,
      baseUrl: props.data.baseUrl
    }
  }
  handleEvent = (e) => {
    e.preventDefault()
    return e.target.value
  }
  setUrls = (e) => {
    let urls = this.handleEvent(e)
    browser.storage.local.set({urls: JSON.parse(urls)})
    this.setState({urls: urls})
  }
  setbaseUrl = (e) => {
    let baseUrl = this.handleEvent(e)
    browser.storage.local.set({baseUrl: JSON.parse(baseUrl)})
    this.setState({baseUrl: baseUrl})
  }
  render () {
    return ([
      <textarea value={JSON.stringify(this.state.urls)} onChange={this.setUrls} />,
      <textarea value={JSON.stringify(this.state.baseUrl)} onChange={this.setBaseUrl} />
    ])
  }
}
