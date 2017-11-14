import React from 'react'
import ReactDOM from 'react-dom'

import { data } from './data'
import PageUrl from './pageUrl'

var appPage = document.getElementById('app')
var optionsPage = document.getElementById('options')

if (appPage) {
  ReactDOM.render(
    <div>
      <h1>NetHelper</h1>
      {data.urls.map((url, idx) => <PageUrl key={idx} title={url.title} url={url.url} />)}
    </div>,
    appPage
  )
} else if (optionsPage) {
  ReactDOM.render(
    <div>
      <h1>NetHelper</h1>
      <h2>Urls</h2>
      {data.urls.map((url, idx) => <p key={idx}>{url.title}</p>)}
    </div>,
    optionsPage
  )
}
