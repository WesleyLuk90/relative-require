var acorn = require('acorn-jsx')
var astTypes = require('ast-types')

var acornOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  plugins: { jsx: true }
}

var isRequire = function(node) {
  return node.callee.type === 'Identifier' && node.callee.name === 'require'
}

module.exports = function(src, defaultType) {
  var ast = null
  var res = { require: 0, import: 0, pos: 0 }

  try {
    ast = acorn.parse(src, acornOptions)
  } catch (e) {
    return { type: defaultType || 'require', pos: 0 }
  }

  astTypes.visit(ast, {
    visitImportDeclaration: function(p) {
      res.pos = p.value.end
      res.import += 1
      this.traverse(p)
    },
    visitCallExpression: function(p) {
      if (!isRequire(p.node)) return false
      res.pos = p.value.end
      res.require += 1
      this.traverse(p)
    }
  })
  var type = defaultType || 'require'
  if (res.require > res.import) {
    type = 'require'
  } else if (res.import > res.require) {
    type = 'import'
  }
  return { type: type, pos: res.pos }
}
