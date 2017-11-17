import React from 'react'

export default class pageUrl extends React.Component {
  setData = e => browser.storage.local.set('urlJSON', e.target.value)
  render () {
    return (
      <textarea value={this.props.data} onChange={setData} />
    )
  }
}
