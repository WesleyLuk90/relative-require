const path = require('path')
const findMatchingModules = require('../lib/find-matching-modules')
const mockProjectPath = require('./helpers/mock-project-path')
const config = require('../config')
const projectPath = path.join(mockProjectPath, 'walk')

describe('findMatchingModules function', () => {
  beforeEach(() => {
    atom.config.set('relative-require.excludeDirs', config.excludeDirs.default)
  })

  it('should find the expected module paths', () => {
    waitsForPromise(() =>
      findMatchingModules(projectPath, ['fooBar']).then((modules) => {
        expect(modules.sort()).toEqual([
          path.join(projectPath, 'foo-bar.js'),
          path.join(projectPath, 'a', 'foo-bar.jsx'),
          path.join(projectPath, 'a', 'foo-bar.json'),
          path.join(projectPath, 'a', 'foo-bar.html'),
          path.join(projectPath, 'a', 'b', 'foo-bar.js'),
          path.join(projectPath, 'a', 'b', 'fooBar.js'),
          path.join(projectPath, 'a', 'b', 'foo_bar.js')
        ].sort())
      }))
  })

  it('should find the expected module paths when supplied with multiple modules', () => {
    waitsForPromise(() =>
      findMatchingModules(projectPath, ['fooBar', 'barBaz']).then((modules) => {
        expect(modules.sort()).toEqual([
          path.join(projectPath, 'foo-bar.js'),
          path.join(projectPath, 'bar-baz.js'),
          path.join(projectPath, 'a', 'foo-bar.jsx'),
          path.join(projectPath, 'a', 'foo-bar.json'),
          path.join(projectPath, 'a', 'foo-bar.html'),
          path.join(projectPath, 'a', 'b', 'foo-bar.js'),
          path.join(projectPath, 'a', 'b', 'fooBar.js'),
          path.join(projectPath, 'a', 'b', 'foo_bar.js')
        ].sort())
      }))
  })

  it('should ignore excluded directories', () => {
    waitsForPromise(() =>
      findMatchingModules(projectPath, ['a']).then((modules) => {
        expect(modules).toEqual([])
      }))
  })
})
