import React from 'react'
import ReactDOM from 'react-dom'

import { data } from './data'
import PageUrl from './pageUrl'

ReactDOM.render(
  <div>
    <h1>NetHelper</h1>
    <PageUrl title={data.urls[0].title} url={data.urls[0].url} />
  </div>,
  document.getElementById('app')
)
