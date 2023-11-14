/* eslint unicorn/prefer-negative-index: 0 */

/**
 * Represents a utility for working with currency inputs.
 */
const instances = new Map()
const GUID = Symbol('GUID')

class Currency {
	/**
	 * Retrieves the instance associated with a given input element.
	 * @param {HTMLInputElement} input - The input element.
	 * @returns {Currency | undefined} The associated Currency instance, or undefined if not found.
	 */
	static data(input) {
		return instances.has(input[GUID]) && instances.get(input[GUID])
	}

	/**
	 * Determines the position of the decimal point in a currency value.
	 * @param {string} v - The currency value.
	 * @returns {number} The position of the decimal point.
	 */
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

	/**
	 * Splits a currency value into its parts.
	 * @param {string} v - The currency value.
	 * @returns {Object} An object containing the currency parts (minus, integer, and decimal).
	 * @private
	 */
	static #getParts(v) {
		const minus = [...String(v)].shift() === '-' ? '-' : ''
		const n = String(v).replaceAll(/\D/g, '').replaceAll(/^0+/g, '')
		const t = n.padStart(3, '0')
		const d = t.slice(-2)
		const i = t.slice(0, t.length - 2)
		return {
			minus,
			d,
			i,
		}
	}

	/**
	 * Converts a masked currency value to a numeric value.
	 * @param {string} v - The masked currency value.
	 * @returns {number} The numeric representation of the currency value.
	 */
	static unmasking(v) {
		const {
			minus,
			d,
			i,
		} = Currency.#getParts(v)
		return Number(`${minus}${i}.${d}`)
	}

	/**
	 * Formats a numeric value as a currency string with masking.
	 * @param {number|string} v - The numeric value or string to format.
	 * @param {Object} [opts] - Optional formatting options.
	 * @param {boolean} [opts.empty=false] - Whether to return an empty string for zero values.
	 * @param {string} [opts.locales='pt-BR'] - The locale to use for formatting.
	 * @param {Object} [opts.options] - Additional formatting options.
	 * @param {boolean} [opts.viaInput=false] - Whether the value is set via user input.
	 * @returns {string} The formatted and masked currency string.
	 */
	static masking(v, opts = {}) {
		const {
			empty = false,
			locales = 'pt-BR',
			options = {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			},
			viaInput = false,
		} = opts

		const nv = Number(v)
		if (Number.isNaN(nv) === false && viaInput === false) {
			v = new Intl.NumberFormat('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}).format(nv)
		}

		const {
			minus,
			d,
			i,
		} = Currency.#getParts(v)

		if (empty && i === '0' && d === '00' && minus === '') {
			return ''
		}

		const r = new Intl.NumberFormat(locales, options).format(`${minus}${i}.${d}`)
		return r
	}

	/**
	 * Constructs a new Currency instance for a given input element.
	 * @param {HTMLInputElement} input - The input element to associate with the instance.
	 * @param {Object} [opts] - Optional configuration options for the instance.
	 * @param {string} [opts.keyEvent='input'] - The type of key event to listen to.
	 * @param {boolean} [opts.triggerOnBlur=false] - Whether to trigger masking on blur.
	 * @param {boolean} [opts.init=false] - Whether to initialize masking on instance creation.
	 * @param {boolean} [opts.backspace=false] - Whether to handle backspace key input.
	 * @param {Object} [opts.maskOpts] - Additional options for masking.
	 * @throws {TypeError} Throws an error if the input is not an HTMLInputElement.
	 * @throws {TypeError} Throws an error if the input element is already associated with an instance.
	 */
	constructor(input, opts = {}) {
		this.opts = {
			keyEvent: 'input',
			triggerOnBlur: false,
			init: false,
			backspace: false,
			maskOpts: {},
			...opts,
		}

		this.opts.maskOpts.viaInput = true

		if (input instanceof globalThis.HTMLInputElement === false) {
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
			this.input.value = Currency.masking(this.input.value, {
				...this.opts.maskOpts,
				viaInput: false,
			})
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
	 * Converts the current masked input value to a numeric value.
	 * @returns {number} The numeric representation of the current input value.
	 */
	getUnmasked() {
		return Currency.unmasking(this.input.value)
	}

	/**
	 * Generates a unique ID for the instance.
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

	/**
	 * Event handler for masking input values.
	 * @param {Event} event - The input event.
	 */
	onMasking(event) {
		if (this.opts.backspace && event?.inputType === 'deleteContentBackward') {
			return
		}

		this.input.value = Currency.masking(this.input.value, this.opts.maskOpts)
		const pos = Currency.position(this.input.value)
		this.input.setSelectionRange(pos, pos)
	}

	/**
	 * Event handler for click events.
	 */
	onClick() {
		const pos = Currency.position(this.input.value)
		this.input.focus()
		this.input.setSelectionRange(pos, pos)
	}

	/**
	 * Destroys the Currency instance, removing event listeners and cleaning up.
	 */
	destroy() {
		this.input.value = Currency.unmasking(this.input.value)

		for (const _event of this.events) {
			this.input.removeEventListener(_event, this)
		}

		if (instances.has(this.input[GUID])) {
			instances.delete(this.input[GUID])
		}
	}

	/**
	 * Handles events by delegating to the appropriate event handler.
	 * @param {Event} event - The event to handle.
	 */
	handleEvent(event) {
		if (event.type === 'click') {
			this.onClick(event)
		} else {
			this.onMasking(event)
		}
	}
}

export default Currency
