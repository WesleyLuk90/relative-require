const analyseSource = require('../lib/analyse-source')

describe('analyseSource function', () => {
  it('should return the correct type for a source with only require statements', () => {
    expect(analyseSource('const foo = require(\'foo\')')).toEqual({
      type: 'require',
      pos: 26
    })
  })

  it('should return the correct type for a source with only import statements', () => {
    expect(analyseSource('import foo from \'foo\'')).toEqual({
      type: 'import',
      pos: 21
    })
  })
  it('should return the correct type for a source with only import statements and jsx', () => {
    expect(analyseSource('import foo from \'foo\'; const value = (<div />);')).toEqual({
      type: 'import',
      pos: 22
    })
  })

  it('should return type `require` for a source with the same number of require & import statements', () => {
    expect(analyseSource('const foo = require(\'foo\')\nimport foo from \'foo\'')).toEqual({
      type: 'require',
      pos: 48
    })
  })

  it('should return type `require` for a source with more require statements than import statements', () => {
    expect(analyseSource('const foo = require(\'foo\')\nconst bar = require(\'bar\')\nimport foo from \'foo\'')).toEqual({
      type: 'require',
      pos: 75
    })
  })

  it('should return type `import` for a source with more import statements than require statements', () => {
    expect(analyseSource('import foo from \'foo\'\nconst bar = require(\'bar\')\nimport bar from \'bar\'')).toEqual({
      type: 'import',
      pos: 70
    })
  })

  it('should return the default values when the active file source cannot be parsed', () => {
    expect(analyseSource('some invalid source')).toEqual({
      type: 'require',
      pos: 0
    })
  })

  it('should return import values when the active file has an export default statement', () => {
    expect(analyseSource('export default class MyClass {}')).toEqual({
      type: 'import',
      pos: 0
    })
  })
  it('should return import values when the active file has an export statement', () => {
    expect(analyseSource('export {value}')).toEqual({
      type: 'import',
      pos: 0
    })
  })
  it('should return import values when the active file has an export variable', () => {
    expect(analyseSource('export const val = 10')).toEqual({
      type: 'import',
      pos: 0
    })
  })
})
