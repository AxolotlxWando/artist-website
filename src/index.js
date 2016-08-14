import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import React, { Component } from 'react'
import App from 'components/App'
import { render } from 'react-dom'

import { createStore, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import DevTools from 'containers/DevTools'
import backpack from 'reducers/backpack'
import tutorialWriter from 'reducers/tutorialWriter'

import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import TutorialWriter from 'containers/TutorialWriter'
import TutorialViewer from 'containers/TutorialViewer'

import 'sass/base/_all.scss'

class Faq extends Component {
  render () {
    return (
      <div>You are in the FAQ route</div>
    )
  }
}

const reducer = combineReducers({
  backpack: backpack,
  tutorialWriter: tutorialWriter,
  routing: routerReducer
})

const store = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
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
      </div>
    </Provider>
  </div>,
  document.getElementById('root')
)
