// React & Redux
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

// Material UI
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionWork from 'material-ui/svg-icons/action/work'
import HardwareUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import HardwareDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

import Slider from 'material-ui/Slider'

// Artist Website - Components
import Toc from 'components/Toc'
import Timeline from 'containers/Timeline'
import MainViewport from 'containers/MainViewport'
import Editor from 'containers/Editor'

// Artist Website - Actioins
import {
  viewPointerSeek,
  highlightPointerSeek,
  activePointerSeek
} from 'actions/pointersActions'

// Artist Website - Utils
import flatten from 'utils/flatten'

// Artist Website - Assets
import 'sass/components/tutorial-viewer.scss'

function mapStateToProps (state) {
  return {
    file: state.tutorialWriter.file,
    rawContent: state.tutorialWriter.rawContent,
    module: state.tutorialWriter.module,
    layout: state.tutorialWriter.layout,

    viewPosition: state.tutorialWriter.pointers.viewPosition,
    highlightPosition: state.tutorialWriter.pointers.highlightPosition,
    activePosition: state.tutorialWriter.pointers.activePosition
  }
}

function mapDispatchToProps (dispatch) {
  return {
    viewPointerSeek: (position) => {
      dispatch(viewPointerSeek(position))
    },
    highlightPointerSeek: (position) => {
      dispatch(highlightPointerSeek(position))
    },
    activePointerSeek: (position) => {
      dispatch(activePointerSeek(position))
    }
  }
}

class TutorialViewer extends Component {
  constructor (props) {
    super(props)
    console.log('jsonMl = ')
    console.log(this.props.module.jsonMl)
    console.log('')
    this.state = {
      flattenedJsonMl: flatten(this.props.module.jsonMl)
    }
  }
  componentDidUpdate (prevProps) {
    if (
      typeof this.props.module === 'undefined' ||
      typeof this.props.module.jsonMl === 'undefined'
    ) {
      return
    }
    if (this.props.module.jsonMl !== prevProps.module.jsonMl) {
      console.log('flatten nextProps jsonMl = ')
      console.log(this.props.module.jsonMl)
      console.log('')
      this.setState({flattenedJsonMl: flatten(this.props.module.jsonMl)})
    }
  }
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
      // marginLeft: '9px',
      // marginTop: '9px',
      padding: 0,
      zIndex: 100
      // backgroundColor: 'brown'
    }

    console.log('TutorialWirter: this.props.module.jsonML = ')
    console.log(this.props.module.jsonML)
    console.log('')

    // console.log('last in tutorial writer flattened = ')
    // console.log(this.state.flattenedJsonMl)
    return (
      <div className={'TutorialWriter'}>
        <div className={'UpButton'}>
          <FloatingActionButton onClick={() => (this.onClick())}>
            <HardwareUp />
          </FloatingActionButton>
        </div>
        <div className={'DownButton'}>
          <FloatingActionButton /*style={{position: 'absolute', right: 20, top: '20px'}}*/ onClick={() => (this.onClick())}>
            <HardwareDown />
          </FloatingActionButton>
        </div>
        <div className={'SeekerContainer'}>
          <Slider sliderStyle={seekerStyle}
            min={0}
            max={100}
            step={1}
            defaultValue={0}
          />
        </div>
        <div className={'AppBar'}>
          <AppBar
            title={<span style={styles.title}>Tutorial Viewer</span>}
            iconElementLeft={<IconButton><NavigationClose /></IconButton>}
            iconElementRight={
              <div /*style={{height: '45px', border: '1px solid'}}*/>
                             {/*<FlatButton label='Save' style={{color: 'white', height: '45px'}} />  */}
                <FlatButton label='Bookmark' style={{color: 'white', height: '45px'}} />    
              </div>}
          /></div>
        <div className={'TocTimelineWorkspace'}>
          <Toc
            jsonMlRaw={this.props.rawContent.jsonMlRaw}

            viewPosition={this.props.viewPosition}
            highlightPosition={this.props.highlightPosition}
            activePosition={this.props.activePosition}
            viewPointerSeek={this.props.viewPointerSeek}
            highlightPointerSeek={this.props.highlightPointerSeek}
            activePointerSeek={this.props.activePointerSeek}
          />
          <div className={'TimelineWorkspace'}>
            {/*<Timeline
              jsonMl={this.props.module.jsonMl}
              viewPosition={this.props.viewPosition}
              highlightPosition={this.props.highlightPosition}
              activePosition={this.props.activePosition}
            />*/}
            <div className={'Workspace'}>
              <MainViewport
                compileFlag={false}
                layout={this.props.layout}
                module={this.props.module}
                flattenedJsonMl={this.state.flattenedJsonMl}

                // viewPosition={this.props.viewPosition}
                highlightPosition={this.props.highlightPosition}
                activePosition={this.props.activePosition}
                viewPointerSeek={this.props.viewPointerSeek}
                highlightPointerSeek={this.props.highlightPointerSeek}
                // activePointerSeek={this.props.activePointerSeek}
              />
              {/*<Editor />*/}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

TutorialViewer.propTypes = {
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
  }).isRequired,

  viewPosition: PropTypes.number.isRequired,
  highlightPosition: PropTypes.number.isRequired,
  activePosition: PropTypes.number.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorialViewer)
