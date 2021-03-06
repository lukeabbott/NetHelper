import React from 'react'

export default class pageUrl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: props.title,
      url: props.url,
      baseUrl: props.baseUrl
    }
  }
  render () {
    var onKeyPress = (e) => {
      var key = e.which || e.keyCode
      if (key === 13) { // 13 is enter
        if (!e.target.classList.contains('page-choice')) {
          return
        }
        var chosenPage = this.state.baseUrl + this.state.url + e.target.value
        browser.tabs.create({
          url: chosenPage
        })
      }
    }
    return (
      <div>
        <input className='page-choice' type='text' placeholder={this.state.title} onKeyPress={onKeyPress} />
      </div>
    )
  }
}
