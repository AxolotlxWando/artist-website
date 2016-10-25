
import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

export function getCurrentPage (containers, position) {
  for (let i = 0; i < containers.length; i++) {
    var page = containers[i]
    if (
      page.position < position &&
      position < page.position + page.heightByLines
    ) {
      return i
    }
  }
}

export function getCurrentColumn (containers, position) {
  for (let i = 0; i < containers.length; i++) {
    var page = containers[i]
    for (let j = 0; j < page.length; j++) {
      var column = page[j]
      if (
        column.position < position &&
        position < column.position + column.heightByLines
      ) {
        return j
      }
    }
  }
}
