import React, { Component, PropTypes } from 'react'

import { markdown } from 'markdown'
// JsonMl utils
import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

// Styles and Assets
import 'sass/components/toc.scss'
import 'assets/toc-background.png'
import 'assets/toc-item.png'
import 'assets/toc-item2.png'
import 'assets/toc-item3.png'

class Toc extends Component {
  constructor (props) {
    super(props)
    this._selectionSelect = this._selectionSelect.bind(this)
    this.onClickHeader = this.onClickHeader.bind(this)
  }
  onClickHeader (position) {
    console.log('Toc:onClickHeader(): elPosition = ' + position)
    if (typeof position !== 'undefined') {
      this.props.activePointerSeek(position)
    }
    this.props.loadContent()
  }
  _selectionSelect () {
    this.props.selectionSelect()
  }
  render () {
    if (
      typeof this.props.jsonMl === 'undefined' || this.props.jsonMl.length <= 0
    ) {
      return null
    }
    let jsonMlRaw = this.props.jsonMlRaw
    for (let i = 0; false && i < jsonMlRaw.length; i++) {
      if (jsonMlRaw[i][0] === 'header') {
        console.log(jsonMlRaw[1][1] + ' is a header')
        console.log('isElement = ' + jsonMlRaw.isElement(jsonMlRaw[i]))
        console.log('attributes = ' + JSON.stringify(JsonML.getAttributes(jsonMlRaw[i])))
        console.log('children = ' + jsonMlRaw.getChildren(jsonMlRaw[i]))
      }
    }

    /**
     * Note that from my tests, header are only top level elements, markdown
     * parser simply won't produce one that is inside some other tags.
     *
     * Which is a good thing since we have more structure and there is no need
     * to do recursions in order to extract them here.
     */
    var headings = []
    function extractHeadings (array) {
      for (let i = 0; i < array.length; i++) {
        var item = array[i]
        if (JsonML.isElement(item)) {
          if (JsonML.getTagName(item) === 'header') {
            headings.push(
              [item[0], item[1]].concat(
                JsonML.getChildren(item)
              )
            )
          }
          /**
           * 'this should not be neccessary since heading cannot be nested in any other element'
           * extractHeadings(item[0])
           */
        }
      }
    }
    extractHeadings(jsonMlRaw)
    if (headings.length <= 0) {
      return null
    }
    function setImgSize (array) {
      for (let i = 0; i < array.length; i++) {
        var item = array[i]
        if (JsonML.isElement(item)) {
          if (JsonML.getTagName(item) === 'img') {
            console.log('found an image!!!!')
            console.log('attribute href = ' + JsonML.getAttribute(item, 'href'))
            JsonML.setAttribute(item, 'height', '16px')
          }
          setImgSize(item)
        }
      }
    }
    setImgSize(headings)

    return (
      <div className={'Toc'}>
        <div className={'TocContainer'}>
          {
            headings.map(
              (item, index) => {
                const Tag = 'h' + JsonML.getAttributes(item).level
                const children = {__html: markdown.toHTML(['markdown'].concat(JsonML.getChildren(item)))}
                return (
                  <Tag key={index} className={Tag === 'h1' ? 'TocItemH1' : 'TocItem'} onClick={() => { this.onClickHeader(JsonML.getAttribute(item, 'elPosition')) }} dangerouslySetInnerHTML={children} />
                )
              }
            )
          }
        </div>
      </div>
    )
  }
}

Toc.propTypes = {
  // jsonMl: PropTypes.array.isRequired,

  viewPosition: PropTypes.number.isRequired,
  highlightPosition: PropTypes.number.isRequired,
  activePosition: PropTypes.number.isRequired,

  viewPointerSeek: PropTypes.func.isRequired,
  highlightPointerSeek: PropTypes.func.isRequired,
  activePointerSeek: PropTypes.func.isRequired,

  loadContent: PropTypes.func.isRequired
}

export default Toc
