import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// React
import React, { Component } from 'react'
import App from 'containers/App'
import { render } from 'react-dom'

// Redux
import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

// Redux middlewares, reducers
import thunk from 'redux-thunk'
// import DevTools from 'containers/DevTools'
import backpack from 'reducers/backpack'
import tutorialWriter from 'reducers/tutorialWriter'

// Redux Router
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// App
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
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(reducer)

const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history}>
        <Route path='/' component={App}>
          <IndexRoute component={TutorialWriter} />
          <Route path='faq' component={Faq} />
          <Route path='viewer' component={TutorialViewer} />
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
