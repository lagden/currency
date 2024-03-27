/* globals beforeEach expect test document */
/* eslint no-new: 0 */

import userEvent from '@testing-library/user-event'
import simulant from 'simulant'
import Currency from '../src/currency.js'

beforeEach(() => {
	document.body.innerHTML = '<input id="money" type="text">'
})

test('static mask number default', () => {
	const v = Currency.masking(1100)
	expect(v).toEqual('1.100,00')
})

test('Jorge Caetano', () => {
	const v = Currency.masking(223.22)
	expect(v).toEqual('223,22')
})

test('robsontenorio static', () => {
	const v = Currency.masking(88.2)
	const v2 = Currency.masking('88.2')
	expect(v).toEqual('88,20')
	expect(v2).toEqual('88,20')
})

test('robsontenorio via input', () => {
	const input = document.querySelector('#money')
	input.value = '88.2'
	const mask = new Currency(input, {init: true})
	expect(input.value).toEqual('88,20')
	expect(mask.getUnmasked()).toEqual(88.2)
	mask.destroy()
	expect(input.value).toEqual('88.2')
})

test('robsontenorio unmasking', () => {
	const v = Currency.masking(-88.2, {
		options: {
			style: 'currency',
			currency: 'BRL',
		},
	})
	const v2 = Currency.masking('88.2')
	expect(Currency.unmasking(v)).toEqual(-88.2)
	expect(Currency.unmasking(v2)).toEqual(88.2)
})

test('static mask number', () => {
	const v = Currency.masking(1100, {
		options: {
			style: 'currency',
			currency: 'BRL',
		},
	})
	expect(v).toEqual('R$\xa01.100,00')
})

test('static mask number negative', () => {
	const v = Currency.masking(-1100, {
		options: {
			style: 'currency',
			currency: 'BRL',
		},
	})
	expect(v).toEqual('-R$\xa01.100,00')
})

test('static mask number 0', () => {
	const v = Currency.masking(0, {
		options: {
			style: 'currency',
			currency: 'BRL',
		},
	})
	expect(v).toEqual('R$\xa00,00')
})

test('static mask number fraction', () => {
	const v = Currency.masking(5500, {
		options: {
			style: 'currency',
			currency: 'BRL',
		},
	})
	expect(v).toEqual('R$\xa05.500,00')
})

test('static mask number string', () => {
	const v = Currency.masking('1111', {
		options: {
			style: 'currency',
			currency: 'BRL',
		},
	})
	expect(v).toEqual('R$\xa01.111,00')
})

test('static mask number 0 empty', () => {
	const v = Currency.masking(0, {
		empty: true,
		options: {
			style: 'currency',
			currency: 'BRL',
		},
	})
	expect(v).toEqual('')
})

test('static mask number string fraction', () => {
	const v = Currency.masking('1111.00', {
		options: {
			style: 'currency',
			currency: 'BRL',
		},
	})
	expect(v).toEqual('R$\xa01.111,00')
})

test('static euro', () => {
	const v = Currency.masking('1111.00', {
		locales: 'de-DE',
		options: {
			style: 'currency',
			currency: 'EUR',
		},
	})
	expect(v).toEqual('1.111,00\xa0€')
})

test('static iceland', () => {
	const v = Currency.masking('1111.55', {
		locales: 'is',
		options: {
			style: 'currency',
			currency: 'ISK',
		},
	})
	expect(v).toEqual('1.112\xa0kr.')
})

test('input iceland', () => {
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

	expect(input.value).toEqual('13\xa0kr.')

	for (const char of '92') {
		input.value += char
		simulant.fire(input, 'input')
	}
	expect(input.value).toEqual('1.392\xa0kr.')

	mask.destroy()
})

test('input iceland negative value', () => {
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
	expect(input.value).toEqual('-2.468\xa0kr.')

	mask.destroy()
})

test('input', () => {
	const input = document.querySelector('#money')
	const mask = new Currency(input)
	for (const char of '1045') {
		input.value += char
		simulant.fire(input, 'input')
	}

	expect(input.value).toEqual('10,45')
	mask.destroy()
})

test('input init', () => {
	const input = document.querySelector('#money')
	input.value = '12.99'
	const mask = new Currency(input, {init: true})

	expect(input.value).toEqual('12,99')
	mask.destroy()
})

test('keyup', () => {
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

	expect(input.value).toEqual('1.111,99\xa0€')
	mask.destroy()
})

test('input backspace', async () => {
	const input = document.querySelector('#money')
	input.value = '111'
	const mask = new Currency(input, {
		init: true,
		backspace: true,
	})

	await userEvent.type(input, '{Backspace>6}')

	expect(input.value).toEqual('')
	mask.destroy()
})

test('blur', () => {
	const input = document.querySelector('#money')
	input.value = ''

	const mask = new Currency(input, {
		keyEvent: 'keyup',
		triggerOnBlur: true,
	})
	input.value = '1250'
	simulant.fire(input, 'blur')

	expect(input.value).toEqual('12,50')
	mask.destroy()
})

test('click', () => {
	const input = document.querySelector('#money')
	input.value = '1250'

	const mask = new Currency(input)
	simulant.fire(input, 'click')

	expect(input.value).toEqual('1250')
	mask.destroy()
})

test('options', () => {
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

	expect(input.value).toEqual('$15,000.99')
	mask.destroy()
})

test('get instance', () => {
	const input = document.querySelector('#money')
	const mask = new Currency(input)
	const _mask = Currency.data(input)

	expect(mask).toEqual(_mask)
	mask.destroy()
	_mask.destroy()
})

test('throws instanced', () => {
	expect(() => {
		const input = document.querySelector('#money')
		new Currency(input)
		new Currency(input)
	}).toThrow('The input has already been instanced. Use the static method `Currency.data(input)` to get the instance.')
})

test('throws sem input', () => {
	expect(() => {
		new Currency('not a input')
	}).toThrow('The input should be a HTMLInputElement')
})
