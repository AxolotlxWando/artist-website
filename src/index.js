import React from 'react'
import { render } from 'react-dom'

import { createStore } from 'redux'
import rootReducer from 'reducers'

import Timeline from 'containers/Timeline'

let store = createStore(rootReducer)

render(
  <Provider store={store}>
    <TimelineDocker />
  </Provider>,
  document.getElementById('root')
)
