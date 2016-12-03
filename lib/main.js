var config = require('../config.json')
var activeItemSubscription = null
var npath = require('path')

function editorRequire() {
  var editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  var module = editor.getSelectedText()
  if (!module) return

  var textEditorRequire = require('./text-editor-require')
  var analyseSource = require('./analyse-source')

  var activePath = npath.parse(editor.getPath()).dir
  var projectPath = atom.project.relativizePath(activePath)[0]
  require('./load-package')(projectPath).then(pkg =>
      textEditorRequire(editor, module, analyseSource(editor.getText()), pkg.defaultImportStyle || 'require')
    ).catch((error) => {
      atom.notifications.addFatalError(error.message, {
        stack: error.stack
      })
    })
    .done()
}

function treeRequire() {
  var treeView = atom.packages.getActivePackage('tree-view')
  var editor = atom.workspace.getActiveTextEditor()

  if (!treeView || !editor) return

  var modules = treeView.mainModule.treeView.selectedPaths()
  if (!modules.length) return

  var fullPathRequire = require('./full-path-require')
  var analyseSource = require('./analyse-source')

  fullPathRequire(editor, modules, analyseSource(editor.getText()))
}

function dragDropRequire() {
  var editor = atom.workspace.getActiveTextEditor()
  if (!editor) return
  editor.editorElement.addEventListener('drop', treeRequire)
}

function activate() {
  dragDropRequire()
  activeItemSubscription = atom.workspace.onDidChangeActivePaneItem(dragDropRequire)
  atom.commands.add('atom-text-editor', { 'relative-require:require': editorRequire })
  atom.commands.add('atom-text-editor', 'relative-require:editorRequire', editorRequire)
  atom.commands.add('.tree-view .file', 'relative-require:treeViewRequire', treeRequire)
}

function deactivate() {
  activeItemSubscription.dispose()
}

module.exports = {
  config: config,
  activate: activate,
  deactivate: deactivate
}
