'use strict'

const jsdom = require('jsdom')

const {JSDOM} = jsdom
const html = [
	'<input id="money" type="text">'
].join('')

const {window} = new JSDOM(html)
const {document} = window

global.document = document
global.window = window
global.HTMLElement = window.HTMLElement
global.HTMLInputElement = window.HTMLInputElement
