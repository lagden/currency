import userEvent from '@testing-library/user-event'
import { JSDOM } from 'jsdom'
import assert from 'node:assert/strict'
import { beforeEach, describe, it } from 'node:test'
import Currency from '../src/currency.js'

let window
let document

const simulant = {}
simulant.fire = (element, eventName) => {
	const event = new window.Event(eventName, { bubbles: true })
	element.dispatchEvent(event)
}

describe('Currency', () => {
	beforeEach(() => {
		const dom = new JSDOM(`<!DOCTYPE html><html><body><input id="money" type="text"></body></html>`)
		window = dom.window
		document = window.document
		globalThis.HTMLElement = window.HTMLElement
		globalThis.HTMLInputElement = window.HTMLInputElement
	})

	it('static mask number default', () => {
		const v = Currency.masking(1100)
		assert.equal(v, '1.100,00')
	})

	it('Jorge Caetano', () => {
		const v = Currency.masking(223.22)
		assert.equal(v, '223,22')
	})

	it('robsontenorio static', () => {
		const v = Currency.masking(88.2)
		const v2 = Currency.masking('88.2')
		assert.equal(v, '88,20')
		assert.equal(v2, '88,20')
	})

	it('robsontenorio via input', () => {
		const input = document.querySelector('#money')
		input.value = '88.2'
		const mask = new Currency(input, { init: true })
		assert.equal(input.value, '88,20')
		assert.equal(mask.getUnmasked(), 88.2)
		mask.destroy()
		assert.equal(input.value, '88.2')
	})

	it('robsontenorio unmasking', () => {
		const v = Currency.masking(-88.2, {
			options: {
				style: 'currency',
				currency: 'BRL',
			},
		})
		const v2 = Currency.masking('88.2')
		assert.equal(Currency.unmasking(v), -88.2)
		assert.equal(Currency.unmasking(v2), 88.2)
	})

	it('static mask number', () => {
		const v = Currency.masking(1100, {
			options: {
				style: 'currency',
				currency: 'BRL',
			},
		})
		assert.equal(v, 'R$\xa01.100,00')
	})

	it('static mask number negative', () => {
		const v = Currency.masking(-1100, {
			options: {
				style: 'currency',
				currency: 'BRL',
			},
		})
		assert.equal(v, '-R$\xa01.100,00')
	})

	it('static mask number 0', () => {
		const v = Currency.masking(0, {
			options: {
				style: 'currency',
				currency: 'BRL',
			},
		})
		assert.equal(v, 'R$\xa00,00')
	})

	it('static mask number fraction', () => {
		const v = Currency.masking(5500, {
			options: {
				style: 'currency',
				currency: 'BRL',
			},
		})
		assert.equal(v, 'R$\xa05.500,00')
	})

	it('static mask number string', () => {
		const v = Currency.masking('1111', {
			options: {
				style: 'currency',
				currency: 'BRL',
			},
		})
		assert.equal(v, 'R$\xa01.111,00')
	})

	it('static mask number 0 empty', () => {
		const v = Currency.masking(0, {
			empty: true,
			options: {
				style: 'currency',
				currency: 'BRL',
			},
		})
		assert.equal(v, '')
	})

	it('static mask number string fraction', () => {
		const v = Currency.masking('1111.00', {
			options: {
				style: 'currency',
				currency: 'BRL',
			},
		})
		assert.equal(v, 'R$\xa01.111,00')
	})

	it('static euro', () => {
		const v = Currency.masking('1111.00', {
			locales: 'de-DE',
			options: {
				style: 'currency',
				currency: 'EUR',
			},
		})
		assert.equal(v, '1.111,00\xa0€')
	})

	it('static iceland', () => {
		const v = Currency.masking('1111.55', {
			locales: 'is',
			options: {
				style: 'currency',
				currency: 'ISK',
			},
		})
		assert.equal(v, '1.112\xa0kr.')
	})

	it('input iceland', () => {
		const input = document.querySelector('#money')
		input.value = '12.99'
		const mask = new Currency(input, {
			init: true,
			maskOpts: {
				locales: 'is',
				options: {
					style: 'currency',
					currency: 'ISK',
				},
			},
		})

		assert.equal(input.value, '13\xa0kr.')

		for (const char of '92') {
			input.value += char
			simulant.fire(input, 'input')
		}
		assert.equal(input.value, '1.392\xa0kr.')

		mask.destroy()
	})

	it('input iceland negative value', () => {
		const input = document.querySelector('#money')
		const mask = new Currency(input, {
			maskOpts: {
				locales: 'is',
				options: {
					style: 'currency',
					currency: 'ISK',
				},
			},
		})

		for (const char of '-2468') {
			input.value += char
			simulant.fire(input, 'input')
		}
		assert.equal(input.value, '-2.468\xa0kr.')

		mask.destroy()
	})

	it('static arabic', () => {
		const v = Currency.masking('1911.55', {
			digits: 3,
			locales: 'ar-BH',
			options: {
				style: 'currency',
				currency: 'BHD',
			},
		})
		assert.equal(v, '‏١٬٩١١٫٥٥٠ د.ب.‏')
	})

	it('input arabic', () => {
		const input = document.querySelector('#money')
		input.value = '12.99'
		const mask = new Currency(input, {
			init: true,
			maskOpts: {
				digits: 3,
				locales: 'ar-BH',
				options: {
					style: 'currency',
					currency: 'BHD',
				},
			},
		})

		assert.equal(input.value, '‏١٢٫٩٩٠ د.ب.‏')

		for (const char of '92') {
			input.value += char
			simulant.fire(input, 'input')
		}
		assert.equal(input.value, '‏١٬٢٩٩٫٠٩٢ د.ب.‏')

		mask.destroy()
	})

	it('input', () => {
		const input = document.querySelector('#money')
		const mask = new Currency(input)
		for (const char of '1045') {
			input.value += char
			simulant.fire(input, 'input')
		}

		assert.equal(input.value, '10,45')
		mask.destroy()
	})

	it('input init', () => {
		const input = document.querySelector('#money')
		input.value = '12.99'
		const mask = new Currency(input, { init: true })

		assert.equal(input.value, '12,99')
		mask.destroy()
	})

	it('keyup', () => {
		const input = document.querySelector('#money')
		input.value = ''
		const mask = new Currency(input, {
			keyEvent: 'keyup',
			maskOpts: {
				locales: 'de-DE',
				options: {
					style: 'currency',
					currency: 'EUR',
				},
			},
		})

		for (const char of '111199') {
			input.value += char
			simulant.fire(input, 'keyup')
		}

		assert.equal(input.value, '1.111,99\xa0€')
		mask.destroy()
	})

	it('input backspace', async () => {
		const input = document.querySelector('#money')
		input.value = '111'
		const mask = new Currency(input, {
			init: true,
			backspace: true,
		})

		await userEvent.type(input, '{Backspace>6}')

		assert.equal(input.value, '')
		mask.destroy()
	})

	it('blur', () => {
		const input = document.querySelector('#money')
		input.value = ''

		const mask = new Currency(input, {
			keyEvent: 'keyup',
			triggerOnBlur: true,
		})
		input.value = '1250'
		simulant.fire(input, 'blur')

		assert.equal(input.value, '12,50')
		mask.destroy()
	})

	it('click', () => {
		const input = document.querySelector('#money')
		input.value = '1250'

		const mask = new Currency(input)
		simulant.fire(input, 'click')

		assert.equal(input.value, '1250')
		mask.destroy()
	})

	it('options', () => {
		const input = document.querySelector('#money')
		input.value = ''

		const mask = new Currency(input, {
			triggerOnBlur: true,
			maskOpts: {
				locales: 'en-US',
				options: {
					style: 'currency',
					currency: 'USD',
				},
			},
		})
		input.value = '1500099'
		simulant.fire(input, 'blur')

		assert.equal(input.value, '$15,000.99')
		mask.destroy()
	})

	it('get instance', () => {
		const input = document.querySelector('#money')
		const mask = new Currency(input)
		const _mask = Currency.data(input)

		assert.equal(mask, _mask)
		mask.destroy()
		_mask.destroy()
	})

	it('throws instanced', () => {
		const input = document.querySelector('#money')
		assert.throws(
			() => {
				new Currency(input)
				new Currency(input)
			},
			Error,
			'The input has already been instanced. Use the static method `Currency.data(input)` to get the instance.',
		)
	})

	it('throws sem input', () => {
		assert.throws(
			() => {
				new Currency('not a input')
			},
			Error, // Expected error type
			'The input should be a HTMLInputElement',
		)
	})

	it('input akavato', () => {
		const input = document.querySelector('#money')
		const mask = new Currency(input, {
			maskOpts: {
				locales: 'en-US',
				digits: 3,
				options: {
					useGrouping: false,
				},
			},
		})
		for (const char of '500000') {
			input.value += char
			simulant.fire(input, 'input')
		}

		assert.equal(input.value, '500.000')
		mask.destroy()
	})

	it('input no digits', () => {
		const input = document.querySelector('#money')
		const mask = new Currency(input, {
			maskOpts: {
				locales: 'en-US',
				digits: 0,
				options: {
					useGrouping: false,
				},
			},
		})
		for (const char of '500') {
			input.value += char
			simulant.fire(input, 'input')
		}

		assert.equal(input.value, '500')
		mask.destroy()
	})
})
