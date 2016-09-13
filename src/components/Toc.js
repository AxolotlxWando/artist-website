import React, { Component, PropTypes } from 'react'

import { markdown } from 'markdown'
import JsonML from 'jsonml-tools/jsonml-utils'

import 'sass/components/toc.scss'

class Toc extends Component {
  constructor (props) {
    super(props)
    this._selectionSelect = this._selectionSelect.bind(this)
  }
  _selectionSelect () {
    this.props.selectionSelect()
  }
  render () {
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
        TOC???
        {
          headings.map(
            (item, index) => {
              const Tag = 'h' + item[1].level
              const children = {__html: markdown.toHTML(['markdown'].concat(JsonML.getChildren(item)))}
              return (
                <Tag key={index} onClick={this.props.selectionSelect} dangerouslySetInnerHTML={children} />
              )
            }
          )
        }
      </div>
    )
  }
}

Toc.propTypes = {
  jsonMlRaw: PropTypes.array.isRequired,
  selectionSelect: PropTypes.func.isRequired
}

export default Toc
