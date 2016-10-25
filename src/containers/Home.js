// React
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

// Material UI
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import FlatButton from 'material-ui/FlatButton'

import Slider from 'material-ui/Slider'

// Artist Website
import Toc from 'components/Toc'
import Timeline from 'containers/Timeline'
import MainViewport from 'containers/MainViewport'
import Editor from 'containers/Editor'

import { selectionSelect } from 'actions/tutorialWriterActions'

import 'sass/components/tutorial-writer.scss'

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

class Home extends Component {
  render () {
    const styles = {
    }

    console.log('TutorialWirter: this.props.module.jsonML = ')
    console.log(this.props.module.jsonML)
    console.log('')
    return (
      <div className={'Home'}>
        <div className={'SeekerContainer'}>
        </div>
        <div className={'AppBar'}>
          <AppBar
            title={<span style={styles.title}>Debbie & Wesley's Artist Website - Tutorial Writer</span>}
            iconElementLeft={<IconButton><NavigationClose /></IconButton>}
            iconElementRight={<FlatButton label='Save' />}
          /></div>
        <div className={'TocTimelineWorkspace'}>
          <Toc jsonMlRaw={this.props.rawContent.jsonMlRaw} selectionSelect={this.props.selectionSelect} />
          <div className={'TimelineWorkspace'}>
            <Timeline />
            <div className={'Workspace'}>
              <MainViewport html={this.props.rawContent.html} jsonMlRaw={this.props.rawContent.jsonMlRaw} layout={this.props.layout} module={this.props.module} />
              <Editor />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Home.propTypes = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
