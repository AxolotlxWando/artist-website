import React, { Component } from 'react'
import App from 'components/App'
import { render } from 'react-dom'

import { createStore, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import DevTools from 'containers/DevTools'
import tutorialWriter from 'reducers/tutorialWriter'

import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import TutorialWriter from 'containers/TutorialWriter'
import TutorialViewer from 'containers/TutorialViewer'

require('sass/base/_all.scss')

class Faq extends Component {
  render () {
    return (
      <div>You are in the FAQ route</div>
    )
  }
}

const reducer = combineReducers({
  tutorialWriter: tutorialWriter,
  routing: routerReducer
})

const store = compose(
  DevTools.instrument()
)(createStore)(reducer)

const history = syncHistoryWithStore(browserHistory, store)

render(
  <div>
    <Provider store={store}>
      <div>
        <MuiThemeProvider>
          <Router history={history}>
            <Route path='/' component={App}>
              <IndexRoute component={TutorialWriter} />
              <Route path='faq' component={Faq} />
              <Route path='viewer' component={TutorialViewer} />
            </Route>
          </Router>
        </MuiThemeProvider>
        <DevTools />
      </div>
    </Provider>
  </div>,
  document.getElementById('root')
)
