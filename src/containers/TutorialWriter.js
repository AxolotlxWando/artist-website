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
    file: state.tutorialWriter.file,
    rawContent: state.tutorialWriter.rawContent,
    module: state.tutorialWriter.module,
    layout: state.tutorialWriter.layout
  }
}

function mapDispatchToProps (dispatch) {
  return {
    selectionSelect: () => {
      dispatch(selectionSelect())
    }
  }
}

class TutorialWriter extends Component {
  render () {
    const styles = {
      title: {
        cursor: 'pointer'
      }
    }
    const seekerStyle = {
      position: 'absolute',
      // top: '9px',
      top: '0px',

      margin: 0,
      // marginTop: '9px',
      padding: 0,
      zIndex: 100
      // backgroundColor: 'brown'
    }

    console.log('TutorialWirter: this.props.module.jsonML = ')
    console.log(this.props.module.jsonML)
    return (
      <div className={'TutorialWriter'}>
        <AppBar
          title={<span style={styles.title}>Title</span>}
          iconElementLeft={<IconButton><NavigationClose /></IconButton>}
          iconElementRight={<FlatButton label='Save' />}
        />
        <div className={'SeekerContainer'}>
          <Slider sliderStyle={seekerStyle}
            min={0}
            max={100}
            step={1}
            defaultValue={0}
          />
        </div>
        <div className={'Workspace'}>
          <Toc jsonMlRaw={this.props.rawContent.jsonMlRaw} selectionSelect={this.props.selectionSelect} />
          <div className={'TutorialWriter-Content'}>
            <Timeline />
            <MainViewport html={this.props.rawContent.html} jsonMlRaw={this.props.rawContent.jsonMlRaw} layout={this.props.layout} module={this.props.module} />
          </div>
          <Editor />
        </div>
      </div>
    )
  }
}

TutorialWriter.propTypes = {
  file: PropTypes.string.isRequired,

  rawContent: PropTypes.shape({
    text: PropTypes.string.isRequired,
    jsonMlRaw: PropTypes.array.isRequired,
    html: PropTypes.string.isRequired
  }).isRequired,

  module: PropTypes.shape({
    jsonMl: PropTypes.array.isRequired
  }).isRequired,

  layout: PropTypes.shape({
    paperWidth: PropTypes.number.isRequired,
    paperHeight: PropTypes.number.isRequired,
    pages: PropTypes.arrayOf(
      PropTypes.shape({
        columns: PropTypes.arrayOf(
          PropTypes.shape({
            height: PropTypes.number.isRequired,
            heightByLines: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired
          }).isRequired
        ).isRequired
      }).isRequired
    ).isRequired
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorialWriter)
