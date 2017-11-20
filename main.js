import React from 'react'
import ReactDOM from 'react-dom'

import { initData } from './data'
import PageUrl from './pageUrl'
import Settings from './settings'

var appPage = document.getElementById('app')
var optionsPage = document.getElementById('options')
console.log(initData)
var loadUrlData = browser.storage.local.get({
  settings: initData
})
loadUrlData.then((result) => {
  console.log(result)
  if (appPage) {
    ReactDOM.render(
      <div>
        <h1>NetHelper</h1>
        {result.settings.urls.map((url, idx) => <PageUrl key={idx} title={url.title} url={url.url} />)}
      </div>,
      appPage
    )
  } else if (optionsPage) {
    ReactDOM.render(
      <Settings data={JSON.stringify(result.settings)} />,
      optionsPage
    )
  }
}, e => console.log(e))

