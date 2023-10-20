/* globals HTMLInputElement */
/* eslint unicorn/prefer-negative-index: 0 */

const instances = new Map()
const GUID = Symbol('GUID')

class Currency {
	static data(input) {
		return instances.has(input[GUID]) && instances.get(input[GUID])
	}

	static position(v) {
		const nums = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'])
		const len = v.length

		let cc = 0
		for (let i = len - 1; i >= 0; i--) {
			if (nums.has(v[i])) {
				break
			}
			cc++
		}

		return String(v).length - cc
	}

	static masking(v, opts = {}) {
		const {
			empty = false,
			locales = 'pt-BR',
			options = {
				minimumFractionDigits: 2,
			},
		} = opts

		if (typeof v === 'number') {
			v = v.toFixed(2)
		}

		const minus = [...String(v)].shift() === '-' ? '-' : ''
		const n = String(v).replace(/\D/g, '').replace(/^0+/g, '')
		const t = n.padStart(3, '0')
		const d = t.slice(-2)
		const i = t.slice(0, t.length - 2)

		if (empty && i === '0' && d === '00' && minus === '') {
			return ''
		}

		const r = new Intl.NumberFormat(locales, options).format(`${minus}${i}.${d}`)
		return r
	}

	constructor(input, opts = {}) {
		this.opts = {
			keyEvent: 'input',
			triggerOnBlur: false,
			init: false,
			backspace: false,
			maskOpts: {},
			...opts,
		}

		if (input instanceof HTMLInputElement === false) {
			throw new TypeError('The input should be a HTMLInputElement')
		}

		// Check if element has an instance
		const instance = Currency.data(input)
		if (instance instanceof Currency) {
			throw new TypeError('The input has already been instanced. Use the static method `Currency.data(input)` to get the instance.')
		}

		this.events = new Set()
		this.input = input

		// Initialize
		if (this.opts.init) {
			this.input.value = Currency.masking(this.input.value, this.opts.maskOpts)
		}

		// Listener
		this.input.addEventListener(this.opts.keyEvent, this)
		this.events.add(this.opts.keyEvent)

		this.input.addEventListener('click', this)
		this.events.add('click')

		if (this.opts.triggerOnBlur) {
			this.input.addEventListener('blur', this)
			this.events.add('blur')
		}

		// Storage instance
		this.input[GUID] = this.#id()
		instances.set(this.input[GUID], this)
	}

	/**
	 * Generates a unique ID.
	 * @private
	 * @returns {string} The generated unique ID.
	 */
	#id() {
		/* istanbul ignore next */
		if (globalThis?.crypto?.randomUUID) {
			return globalThis.crypto.randomUUID().replaceAll('-', '')
		}
		return Number(Math.random()).toString(16).slice(2, 8) + Date.now().toString(16)
	}

	onMasking(event) {
		if (this.opts.backspace && event?.inputType === 'deleteContentBackward') {
			return
		}

		this.input.value = Currency.masking(this.input.value, this.opts.maskOpts)
		const pos = Currency.position(this.input.value)
		this.input.setSelectionRange(pos, pos)
	}

	onClick() {
		const pos = Currency.position(this.input.value)
		this.input.focus()
		this.input.setSelectionRange(pos, pos)
	}

	destroy() {
		for (const _event of this.events) {
			this.input.removeEventListener(_event, this)
		}

		if (instances.has(this.input[GUID])) {
			instances.delete(this.input[GUID])
		}
	}

	handleEvent(event) {
		if (event.type === 'click') {
			this.onClick(event)
		} else {
			this.onMasking(event)
		}
	}
}

export default Currency
