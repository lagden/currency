export default Currency;
/**
 * Class representing a Currency input masking utility.
 */
declare class Currency {
    /**
     * Check if input has a Currency instance.
     * @param {HTMLElement} input - The input element.
     * @returns {Currency|undefined} The Currency instance if exists, undefined otherwise.
     */
    static data(input: HTMLElement): Currency | undefined;
    /**
     * Get the position of the cursor in the input.
     * @param {string} v - The input value.
     * @returns {number} The position of the cursor.
     */
    static position(v: string): number;
    /**
     * Get the parts of a masked input value.
     * @param {string} v - The masked input value.
     * @param {number} [digits=2] - The number of digits after the decimal point.
     * @returns {Object} An object containing the parts of the input value.
     */
    static "__#1@#getParts"(v: string, digits?: number): any;
    /**
     * Convert a masked value into an unmasked numeric value.
     * @param {string} v - The masked input value.
     * @param {number} [digits=2] - The number of digits after the decimal point.
     * @returns {number} The unmasked numeric value.
     */
    static unmasking(v: string, digits?: number): number;
    /**
     * Mask a numeric value.
     * @param {string|number} v - The numeric value to be masked.
     * @param {Object} [opts={}] - Masking options.
     * @param {number} [opts.digits=2] - The number of digits after the decimal point.
     * @param {boolean} [opts.empty=false] - Allow empty value.
     * @param {string} [opts.locales='pt-BR'] - The locales to use for formatting.
     * @param {Object} [opts.options] - Additional options for formatting.
     * @param {boolean} [opts.viaInput=false] - Specify if the value is coming directly from an input.
     * @returns {string} The masked value.
     */
    static masking(v: string | number, opts?: {
        digits?: number;
        empty?: boolean;
        locales?: string;
        options?: any;
        viaInput?: boolean;
    }): string;
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
    constructor(input: HTMLElement, opts?: {
        keyEvent?: string;
        triggerOnBlur?: boolean;
        init?: boolean;
        backspace?: boolean;
        maskOpts?: any;
    });
    opts: {
        keyEvent: string;
        triggerOnBlur: boolean;
        init: boolean;
        backspace: boolean;
        maskOpts: any;
    };
    events: Set<any>;
    input: HTMLInputElement;
    /**
     * Get the unmasked value of the input.
     * @returns {number} The unmasked value.
     */
    getUnmasked(): number;
    /**
     * Handle masking on input event.
     * @param {Event} event - The input event.
     */
    onMasking(event: Event): void;
    /**
     * Handle click event.
     */
    onClick(): void;
    /**
     * Destroy the Currency instance.
     */
    destroy(): void;
    /**
     * Handle events.
     * @param {Event} event - The event to handle.
     */
    handleEvent(event: Event): void;
    #private;
}
