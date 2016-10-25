import JsonML from 'jsonml-tools/jsonml-utils'

export function getChildren (node) {
  var children = []
  var i = JsonML.hasAttributes(node) ? 2 : 1
  for (; i < node.length; i++) {
    children.push(node[i])
  }
  return children
}
