import React from 'react'
import ReactDOM from 'react-dom'

import { firstTimeUrls } from './data'
import PageUrl from './pageUrl'
import Settings from './settings'

var appPage = document.getElementById('app')
var optionsPage = document.getElementById('options')

var urlJSON = browser.local.storage.get('urlJSON')
urlJSON = urlJSON || firstTimeUrls

if (appPage) {
  ReactDOM.render(
    <div>
      <h1>NetHelper</h1>
      {urlJSON.urls.map((url, idx) => <PageUrl key={idx} title={url.title} url={url.url} />)}
    </div>,
    appPage
  )
} else if (optionsPage) {
  ReactDOM.render(
    <Settings data={urlJSON} />,
    optionsPage
  )
}
