import React from 'react'

export default class pageUrl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: props.title,
      url: props.url
    }
  }
  render () {
    var onKeyPress = (e) => {
      var key = e.which || e.keyCode
      if (key === 13) { // 13 is enter
        if (!e.target.classList.contains('page-choice')) {
          return
        }
        var chosenPage = 'https://system.na2.netsuite.com' + this.state.url + e.target.value
        browser.tabs.create({
          url: chosenPage
        })
      }
    }
    return (
      <div>
        <label>{this.state.title}</label>
        <input className='page-choice' type='text' onKeyPress={onKeyPress} />
      </div>
    )
  }
}
