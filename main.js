import React from 'react'
import ReactDOM from 'react-dom'

import { data } from './data'
import PageUrl from './pageUrl'

ReactDOM.render(
  <div>
    <h1>NetHelper</h1>
    {data.urls.map((url, idx) => <PageUrl key={idx} title={url.title} url={url.url} />)}
  </div>,
  document.getElementById('app')
)
