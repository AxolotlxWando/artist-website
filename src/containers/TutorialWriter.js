// React & Redux
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

// Material UI
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import FlatButton from 'material-ui/FlatButton'

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
import {
  loadContent
} from 'actions/editorActions'

// Artist Website - Utils
import flatten from 'utils/flatten'

// Artist Website - Assets
import 'sass/components/tutorial-writer.scss'

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
    },
    loadContent: () => {
      dispatch(loadContent())
    }
  }
}

class TutorialWriter extends Component {
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
            title={<span style={styles.title}>Tutorial Writer</span>}
            iconElementLeft={<IconButton><NavigationClose /></IconButton>}
            iconElementRight={
              <div /*style={{height: '45px', border: '1px solid'}}*/>
                <FlatButton label='Save' style={{color: 'white', height: '45px'}} />  
                <FlatButton label='Preview' style={{color: 'white', height: '45px'}} />    
              </div>}
          /></div>
        <div className={'TocTimelineWorkspace'}>
          <Toc
            jsonMl={this.props.module.jsonMl}
            jsonMlRaw={this.props.rawContent.jsonMlRaw}

            viewPosition={this.props.viewPosition}
            highlightPosition={this.props.highlightPosition}
            activePosition={this.props.activePosition}
            viewPointerSeek={this.props.viewPointerSeek}
            highlightPointerSeek={this.props.highlightPointerSeek}
            activePointerSeek={this.props.activePointerSeek}

            loadContent={this.props.loadContent}
          />
          <div className={'TimelineWorkspace'}>
            <Timeline
              jsonMl={this.props.module.jsonMl}
              viewPosition={this.props.viewPosition}
              highlightPosition={this.props.highlightPosition}
              activePosition={this.props.activePosition}
            />
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
              <Editor 
                flattenedJsonMl={this.state.flattenedJsonMl}
              />
            </div>
          </div>
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
  }).isRequired,

  viewPosition: PropTypes.number.isRequired,
  highlightPosition: PropTypes.number.isRequired,
  activePosition: PropTypes.number.isRequired,

  viewPointerSeek: PropTypes.func.isRequired,
  highlightPointerSeek: PropTypes.func.isRequired,
  activePointerSeek: PropTypes.func.isRequired,

  loadContent: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorialWriter)
