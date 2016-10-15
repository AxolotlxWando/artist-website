import { markdown } from 'markdown'
import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

import addMeta from 'utils/dwModuleAddMeta'
import addPositionInfo from 'utils/dwModuleAddPositionInfo'
import { createContainers } from 'utils/dwModuleContainers'

import { prepareContentForView } from 'utils/dwModule/prepareContentForView'

export default class DWModule {
  constructor (textRaw, layout) {
    this.jsonMl = markdown.parse(textRaw, 'Maruku')
    this.containers = createContainers(layout)
  }
  compile () {
    prepareContentForView()
    return
    this.jsonMl = addMeta(this.jsonMl)
    this.jsonMl = addPositionInfo(this.jsonMl, this.containers)
    // console.log(JsonML.toHTMLText(this.jsonMl))
  }
}
