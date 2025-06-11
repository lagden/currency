const instances = new Map()
const GUID = Symbol('GUID')

/**
 * Class representing a Currency input masking utility.
 */
class Currency {
	/**
	 * Check if input has a Currency instance.
	 * @param {HTMLElement} input - The input element.
	 * @returns {Currency|undefined} The Currency instance if exists, undefined otherwise.
	 */
	static data(input) {
		return instances.has(input[GUID]) && instances.get(input[GUID])
	}

	/**
	 * Get the position of the cursor in the input.
	 * @param {string} v - The input value.
	 * @returns {number} The position of the cursor.
	 */
	static position(v) {
		const nums = new Set([
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'0',
			...'٠١٢٣٤٥٦٧٨٩',
			...'۰۱۲۳۴۵۶۷۸۹',
		])
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
	 * Get the parts of a masked input value.
	 * @param {string} v - The masked input value.
	 * @param {number} [digits=2] - The number of digits after the decimal point.
	 * @returns {Object} An object containing the parts of the input value.
	 */
	static #getParts(v, digits = 2) {
		const str = String(v)
		const minus = /-/.test(str) ? '-' : ''
		const n = str
			.replaceAll(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => (d.codePointAt(0) - 1632).toString()) // Convert Arabic numbers
			.replaceAll(/[۰۱۲۳۴۵۶۷۸۹]/g, (d) => (d.codePointAt(0) - 1776).toString()) // Convert Persian numbers
			.replaceAll(/\D/g, '')
			.replaceAll(/^0+/g, '')
		const t = n.padStart(digits + 1, '0')
		const d = t.slice(digits * -1)
		const i = t.slice(0, t.length - digits)
		return {
			minus,
			d,
			i,
		}
	}

	/**
	 * Convert a masked value into an unmasked numeric value.
	 * @param {string} v - The masked input value.
	 * @param {number} [digits=2] - The number of digits after the decimal point.
	 * @returns {number} The unmasked numeric value.
	 */
	static unmasking(v, digits) {
		const {
			minus,
			d,
			i,
		} = Currency.#getParts(v, digits)
		return Number(`${minus}${i}.${d}`)
	}

	/**
	 * Mask a numeric value.
	 * @param {string|number} v - The numeric value to be masked.
	 * @param {Object} [opts={}] - Masking options.
	 * @param {number} [opts.digits=2] - The number of digits after the decimal point.
	 * @param {boolean} [opts.empty=false] - Allow empty value.
	 * @param {Intl.LocalesArgument} [opts.locales='pt-BR'] - The locales to use for formatting.
	 * @param {Intl.NumberFormatOptions} [opts.options] - Additional options for formatting.
	 * @param {boolean} [opts.viaInput=false] - Specify if the value is coming directly from an input.
	 * @returns {string} The masked value.
	 */
	static masking(v, opts = {}) {
		const {
			digits = 2,
			empty = false,
			locales = 'pt-BR',
			options = {
				minimumFractionDigits: digits,
				maximumFractionDigits: digits,
			},
			viaInput = false,
		} = opts

		const specialCurrency = new Set(['ISK', 'JPY'])
		const isSpecial = specialCurrency.has(options?.currency)

		const nv = Number(v)
		const isNumber = Number.isNaN(nv) === false
		if (isNumber && viaInput === false && isSpecial === false) {
			v = new Intl.NumberFormat('en-US', {
				minimumFractionDigits: digits,
				maximumFractionDigits: digits,
			}).format(nv)
		}

		const {
			minus,
			d,
			i,
		} = Currency.#getParts(String(v), digits)

		const fillArray = (n) => {
			const result = []
			for (let i = 1; i <= n; i++) {
				result.push('0'.repeat(i))
			}
			return result
		}

		if (empty && i === '0' && fillArray(digits).includes(d) && minus === '') {
			return ''
		}

		let amount = `${minus}${i}.${digits > 0 ? d : 0}`
		if (isSpecial && viaInput) {
			const onlyNumbers = String(v).replaceAll(/\D/g, '')
			amount = `${minus}${onlyNumbers || 0}`
		}

		let result = new Intl.NumberFormat(locales, options).format(Number(amount))
		if (options.useGrouping === false) {
			result = Number(result).toFixed(digits)
		}

		return result
	}

	/**
	 * Constructor for Currency class.
	 * @param {HTMLElement} input - The input element.
	 * @param {Object} [opts={}] - Optional settings.
	 * @param {string} [opts.keyEvent='input'] - The event type for input.
	 * @param {boolean} [opts.triggerOnBlur=false] - Trigger event on blur.
	 * @param {boolean} [opts.init=false] - Initialize.
	 * @param {boolean} [opts.backspace=false] - Handle backspace.
	 * @param {Object} [opts.maskOpts={}] - Masking options.
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
	 * Get the unmasked value of the input.
	 * @returns {number} The unmasked value.
	 */
	getUnmasked() {
		return Currency.unmasking(this.input.value)
	}

	/**
	 * Generate a unique identifier.
	 * @returns {string} The unique identifier.
	 */
	#id() {
		/* c8 ignore start */
		if (globalThis?.crypto?.randomUUID) {
			return globalThis.crypto.randomUUID().replaceAll('-', '')
		}
		return Number(Math.random()).toString(16).slice(2, 8) + Date.now().toString(16)
		/* c8 ignore end */
	}

	/**
	 * Handle masking on input event.
	 * @param {Event} event - The input event.
	 */
	onMasking(event) {
		if (
			this.opts.backspace &&
			'inputType' in event &&
			event.inputType === 'deleteContentBackward'
		) {
			return
		}

		this.input.value = Currency.masking(this.input.value, this.opts.maskOpts)
		const pos = Currency.position(this.input.value)
		this.input.setSelectionRange(pos, pos)
	}

	/**
	 * Handle click event.
	 */
	onClick() {
		const pos = Currency.position(this.input.value)
		this.input.focus()
		this.input.setSelectionRange(pos, pos)
	}

	/**
	 * Destroy the Currency instance.
	 */
	destroy() {
		this.input.value = String(Currency.unmasking(this.input.value))

		for (const _event of this.events) {
			this.input.removeEventListener(_event, this)
		}

		if (instances.has(this.input[GUID])) {
			instances.delete(this.input[GUID])
		}
	}

	/**
	 * Handle events.
	 * @param {Event} event - The event to handle.
	 */
	handleEvent(event) {
		if (event.type === 'click') {
			this.onClick()
		} else {
			this.onMasking(event)
		}
	}
}

export default Currency
