import JsonML from 'jsonml-tools/jsonml-utils'
import FNV from 'utils/fnv'

function getPath (node, parent) {
  if (parent === null) {
    return '/'
  }
  return JsonML.getAttribute(parent, 'elPath') + JsonML.getAttribute(node, 'elHash')
}

function addPath (node, parent) {
  JsonML.addAttributes(node, {path: getPath(node, parent)})
  var children = JsonML.getChildren(node)
  for (let i = 0; i < children.length; i++) {
    if (!JsonML.isElement(children[i])) {
      addPath(children[i], node)
    }
  }
}

function addHash (node) {
  var childrenHash = ''
  var children = JsonML.getChildren(node)
  if (children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      var child = children[i]
      // text content node
      if (!JsonML.isElement(child)) {
        childrenHash = childrenHash + '?' + FNV.hash(child)
      } else {
      // element
        addHash(child)
        childrenHash = childrenHash + '?' + JsonML.getAttribute(child, 'elHash')
      }
    }
    childrenHash = childrenHash.substr(1)
  }
  JsonML.addAttributes(node, {hash: FNV.hash(childrenHash)})
}

export default function addMeta (node, parent = null) {
  if (!JsonML.isElement(node)) {
    console.log('DWModule.addMeta(): type checking failed, expecting JsonML element node')
  }
  addHash(node)
  addPath(node, parent)

  return node
}
