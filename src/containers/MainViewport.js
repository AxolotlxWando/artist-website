// React
import React, { Component, PropTypes } from 'react'

// Material UI
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'

// JsonMl Utils
import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

// Artist Website
import ContentNode from 'components/ContentNode'

// Styles
import 'github-markdown-css/github-markdown.css'
import 'sass/components/main-viewport.scss'

// Assets
// import 'assets/tmp.jpg'
import 'assets/wood_textures/wood1.jpg'
import 'assets/wood_textures/wood2.jpg'
import 'assets/wood_textures/wood3.jpg'
import 'assets/wood_textures/wood4.jpg'
import 'assets/wood_textures/wood5.jpg'
import 'assets/wood_textures/wood5-gs.jpg'
import 'assets/wood_textures/wood6.jpg'
import 'assets/wood_textures/wood7.jpg'
import 'assets/wood_textures/wood8.jpg'
import 'assets/wood_textures/wood9.jpg'

class MainViewport extends Component {
  constructor (props) {
    super(props)
    this.updateResultJsonMl = this.updateResultJsonMl.bind(this)
    this.state = {currPosition: 0, resultJsonMl: []}
  }
  getChildContext () {
    return {currPosition: this.state.currPosition}
  }
  updateCurrPosition (height) {

  }
  updateResultJsonMl (resultJsonMl) {
    this.setState({
      resultJsonMl: resultJsonMl
    })
  }
  componentDidMount () {
    if (typeof this.props.module.jsonMl !== 'undefined' && this.props.compileFlag) {
      console.log('resultJsonMl:')
      console.log(JSON.stringify(this.state.resultJsonMl))
    }
  }
  render () {
    const onMouseDownHandler = (e) => {
      // console.log('onMouseDown()')
      // console.log('e.button = ' + e.button)
    }
    const onDragHandler = (e) => {
      // console.log('onClick()')
      // console.log('e.button = ' + e.button)
      // console.log('e.buttons = ' + e.buttons)
    }

    // console.log('this.props.layout = ' + this.props.layout)
    // console.log('this.props.module.jsonMl = ' + this.props.module.jsonMl[0])

    var bodyComponent
    if (
      typeof this.props.layout !== 'undefined' &&
      typeof this.props.module.jsonMl !== 'undefined' &&
      this.props.module.jsonMl.length > 0
    ) {
      // console.log('???success')
      const paperStyle = {
        display: 'inline-block',
        position: 'relative',
        height: this.props.layout.paperHeight + 'rem',
        width: this.props.layout.paperWidth + 'rem',
        margin: 5.5 / 3 * 2 / 4.181818182 + 'rem' + ' ' + 5.5 / 3 * 2 / 4.181818182 + 'rem',
        // display: 'inline-block',

        fontSize: 0.5625 + 'rem',

        // border: '2px solid blue',
        whiteSpace: 'nowrap',
        verticalAlign: 'top'
      }

      if (this.props.compileFlag) {
        var updateResultJsonMl = this.updateResultJsonMl
        console.log(updateResultJsonMl)
        return (
          <Paper style={paperStyle} zDepth={3} key={0}>
            <div className={'Column'}
              style={{
                position: 'absolute',
                frontSize: 0.5625 + 'rem',
                left: 3.6875 + 'em',
                top: 5.1875 + 'em',
                width: 23 + 1 + 2 / 9 + 'em'
              }}
            >
              <div className={'markdown-body'}>
                <ContentNode
                  flattenedJsonMl={this.props.flattenedJsonMl}
                  updateResultJsonMl={this.updateResultJsonMl}
                  node={this.props.module.jsonMl}
                  start={0}
                  end={9999}
                  compileFlag={this.props.compileFlag}
                />
              </div>
            </div>
          </Paper>
        )
      }

      var jsonMl = this.props.module.jsonMl
      var layout = this.props.module.layout
      console.log('  ++++++ width = ' + layout.paperWidth + 'rem')
      console.log('  ++++++ elHeight = ' + JsonML.getAttribute(jsonMl, 'elHeight'))
      var numOfPages = Math.ceil(JsonML.getAttribute(jsonMl, 'elHeight') / 106)
      var pages = []
      for (let i = 0; i < numOfPages/* && i < 1*/; i++) {
        var layoutPage = layout.pages[0]
        var layoutColumns = layoutPage.columns
        if (this.props.compileFlag) layoutColumns.length = 1
        // console.log('layoutColumns = ' + layoutColumns)
        // console.log('layoutColumns.length = ' + layoutColumns.length)
        // console.log('mainViewport flattened = ')
        // console.log(this.props.flattenedJsonMl)
        var pageSize = layoutColumns[0].height * 3
        pages.push(
          <Paper style={paperStyle} zDepth={3} key={pages.length - 1}>
            {layoutColumns.map((layoutColumn, i) => {
              return (
                <div className={'markdown-body'} key={i}>
                  <div className={'Column'}
                    style={{
                      position: 'absolute',
                      frontSize: layoutColumn.fontSize + 'rem',
                      left: layoutColumn.x + 'em',
                      top: layoutColumn.y + 'em',
                      height: layoutColumn.height + 'em',
                      width: layoutColumn.width + 1 + 2 / 9 + 'em'
                    }}
                  >
                    <ContentNode
                      flattenedJsonMl={this.props.flattenedJsonMl}
                      updateResultJsonMl={this.updateResultJsonMl}

                      // viewPosition={this.props.viewPosition}
                      highlightPosition={this.props.highlightPosition}
                      activePosition={this.props.activePosition}
                      viewPointerSeek={this.props.viewPointerSeek}
                      highlightPointerSeek={this.props.highlightPointerSeek}
                      // activePointerSeek={this.props.activePointerSeek}

                      node={jsonMl}
                      start={pageSize * (pages.length) + layoutColumn.height * i}
                      end={pageSize * (pages.length) + layoutColumn.height * (i + 1) + layoutColumn.y}
                    />
                  </div>
                </div>
              )
            })}
          </Paper>
        )
      }
      // bodyComponent = (
      //   <div className={'Pages'}>
      //     <Paper style={paperStyle} zDepth={3}>
      //       <div className={'markdown-body'}>
      //         <ContentNode node={this.props.module.jsonMl} />
      //       </div>
      //     </Paper>
      //     <Paper style={paperStyle} zDepth={3}>
      //       Second page
      //     </Paper>
      //   </div>
      // )
      bodyComponent = (
        <div className={'Pages'}>
          {pages} )
        </div>
      )
      // console.log('MainViewport: layout, module.jsonMl')
    } else {
      bodyComponent = (
        <div className={'Pages'}>
          <Paper zDepth={3}>
            <div>
              Loading content...
              <CircularProgress />
            </div>
          </Paper>
        </div>
      )
    }
    return (
      <div
        className={'MainViewport'}
        onMouseDown={onMouseDownHandler}
        onDrag={onDragHandler}
      >
        {bodyComponent}
      </div>
    )
  }
}

MainViewport.childContextTypes = {
  currPosition: React.PropTypes.number
}

MainViewport.propTypes = {
  // html: PropTypes.string.isRequired,
  // jsonMlRaw: PropTypes.array.isRequired,

  module: PropTypes.shape({
    jsonMl: PropTypes.array.isRequired
  }).isRequired,
  flattenedJsonMl: PropTypes.array.isRequired,

  layout: PropTypes.shape({
    paperHeight: PropTypes.number.isRequired,
    paperWidth: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        height: PropTypes.number.isRequired,
        heightByLines: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired
      })
    ).isRequred
  }).isRequired,

  // viewPosition: PropTypes.number.isRequired,
  highlightPosition: PropTypes.number.isRequired,
  activePosition: PropTypes.number.isRequired,

  viewPointerSeek: PropTypes.func.isRequired,
  highlightPointerSeek: PropTypes.func.isRequired
}

export default MainViewport
