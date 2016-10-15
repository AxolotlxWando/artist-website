import { markdown } from 'markdown'
// import JsonMLUtils from 'jsonml-tools/jsonml-utils'
// import JsonMLHTML from 'jsonml-tools/jsonml-html'
// const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

import { prepareContentForViews } from 'dw-module/prepare-content-for-views'

class DWModule {
  constructor (textRaw, layout) {
    this.jsonMl = markdown.parse(textRaw, 'Maruku')
    console.log(this.jsonMl)
  }
  compile () {
    var compiled = prepareContentForViews(this.jsonMl)
    console.log(this.jsonMl)
    console.log(compiled)
  }
}

export default DWModule
