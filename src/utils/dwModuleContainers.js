import {JsonML} from 'jsonml-tools/jsonml-utils'

export function createContainers (layout) {
  var currentPosition = 0
  console.log(layout)

  var elPages = []
  for (let i = 0; i < layout.pages.length; i++) {
    var elColumns = ['div']
    JsonML.addAttributes(elColumns, {position: currentPosition})
    for (let j = 0; j < layout.pages[i].columns.length; j++) {
      var heightByLines = layout.pages[i].columns[j].heightByLines

      var elColumn = ['div']
      JsonML.addAttributes(elColumn, {elHeightByLines: heightByLines, position: currentPosition})
      currentPosition += heightByLines
    }
    JsonML.addAttributes(elColumns, {elHeightByLines: currentPosition - ((i === 0) ? 0 : elPages[i - 1].position)})
    elPages.push(elColumns)
  }

  return elPages
}

export function getCurrentPage (containers, position) {
  for (let i = 0; i < containers.length; i++) {
    var page = containers[i]
    if (
      page.position < position &&
      position < page.position + page.heightByLines
    ) {
      return page
    }
  }
}

export function getCurrentColumn (containers, position) {
  for (let i = 0; i < containers.length; i++) {
    var page = containers[i]
    for (let j = 0; j < page.length; i++) {
      var column = page[j]
      if (
        column.position < position &&
        position < column.position + column.heightByLines
      ) {
        return column
      }
    }
  }
}
