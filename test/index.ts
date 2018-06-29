import '../src/prototype'
import { showHelpMessage } from '../src/help-message'
import { validateFile } from '../src/file-validator'
import { assert } from 'chai'
import 'mocha'
import 'mocha-sinon'

/* tslint:disable:no-unused-expression */

describe('help message', () => {
  it('should show help message', function () {
    this.sinon.stub(console, 'info')
    showHelpMessage()
    assert.isTrue((console.info as any).calledOnce)
  })
})

describe('String.prototype.removeAll', () => {
  it('should remove all spaces from string', () => {
    const original = 'The dog jumped over the cat.'
    const newString = original.removeAll(' ')

    assert.notEqual(newString, original)
    assert.equal(newString, 'Thedogjumpedoverthecat.')
  })
  it('should remove all newlines', () => {
    const original = 'The\ndog\njumped\nover\nthe\ncat.'
    const newString = original.removeAll('\n')

    assert.notEqual(newString, original)
    assert.equal(newString, 'Thedogjumpedoverthecat.')
  })
})

describe('file validator', () => {
  it('should not error for valid path', () => {
    assert.doesNotThrow(() => validateFile('./test/files/1.csv'))
  })
  it('should error for non-existant path', () => {
    assert.throws(() => validateFile('./NotReal.csv'))
  })
  it('should error for wrong file type', () => {
    assert.throws(() => validateFile('./package.json'))
  })
})
