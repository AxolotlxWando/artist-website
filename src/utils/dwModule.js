import { markdown } from 'markdown'
import JsonML from 'jsonml-tools/jsonml-utils'

import addMeta from 'utils/dwModuleAddMeta'
import addPositionInfo from 'utils/dwModuleAddPositionInfo'

import {
  createContainers,
  getCurrentPage,
  getCurrentColumn
} from 'utils/dwModuleContainers'

function flatten (node, layout) {
  var containers = createContainers(node, layout)
  var currentPosition = 0
  var totalLinesInPage = JsonML.getAttribute(getCurrentPage(containers, currentPosition), 'elHeightByLines')
}

function compile (textRaw, layout) {
  // var containers = createContainers(layout)
  // console.log(containers)
  // var normalisedContent = []

  var module = markdown.parse(textRaw, 'Maruku')
  module = addMeta(module, null)
  module = addPositionInfo(module)
  // module = wrapContent(module, layout)

  // console.log(JSON.stringify(module))
  return module
}

export {compile}

const DWModule = {compile}
export default DWModule
