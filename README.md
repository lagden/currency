# Currency

[![Build Status][ci-img]][ci] [![Coverage Status][coveralls-img]][coveralls]

[ci-img]: https://github.com/lagden/currency/actions/workflows/nodejs.yml/badge.svg
[ci]: https://github.com/lagden/currency/actions/workflows/nodejs.yml
[coveralls-img]: https://coveralls.io/repos/github/lagden/currency/badge.svg?branch=main
[coveralls]: https://coveralls.io/github/lagden/currency?branch=main
[number-format]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#syntax

The simple and tiny script for currency input mask

## Install

```
$ npm i @tadashi/currency
```

## API

### new Currency(input \[, opts\])

Constructs a new Currency instance for a given input element.

| parameter | type        | required | default            | description       |
| --------- | ----------- | -------- | ------------------ | ----------------- |
| input     | HTMLElement | yes      | -                  | The input element |
| opts      | Object      | no       | [see below](#opts) | Optional settings |

#### opts

| parameter     | type    | required | default                | description                             |
| ------------- | ------- | -------- | ---------------------- | --------------------------------------- |
| keyEvent      | String  | no       | input                  | The event type for input                |
| triggerOnBlur | Boolean | no       | false                  | Trigger event on blur                   |
| init          | Boolean | no       | false                  | Initialize masking on instance creation |
| backspace     | Boolean | no       | false                  | Handle backspace                        |
| maskOpts      | Object  | no       | [see below](#maskOpts) | Masking options                         |

#### maskOpts

| parameter | type            | required | default | description                                                              |
| --------- | --------------- | -------- | ------- | ------------------------------------------------------------------------ |
| digits    | Number          | no       | 2       | The number of digits after the decimal point                             |
| empty     | Boolean         | no       | false   | Allow empty value                                                        |
| locales   | String or Array | no       | pt-BR   | The locales to use for formatting - [Intl.NumberFormat()][number-format] |
| options   | Object          | no       | -       | Additional options for formatting - [Intl.NumberFormat()][number-format] |
| viaInput  | Boolean         | no       | false   | Specify if the value is coming directly from an input                    |

### getUnmasked()

Get the unmasked value of the input.

---

### Static methods

#### Currency.data(input)

Check if input has a Currency instance.

| parameter | type             | required | default | description       |
| --------- | ---------------- | -------- | ------- | ----------------- |
| input     | HTMLInputElement | yes      | -       | The input element |

#### Currency.masking(v \[, opts\])

Formats a numeric value as a currency string with masking.

| parameter | type   | required | default                | description     |
| --------- | ------ | -------- | ---------------------- | --------------- |
| v         | String | Number   | yes                    | -               |
| opts      | Object | no       | [see above](#maskOpts) | Masking options |

#### Currency.unmasking(v)

Convert a masked value into an unmasked numeric value.

| parameter | type   | required | default | description                                   |
| --------- | ------ | -------- | ------- | --------------------------------------------- |
| v         | String | yes      | -       | The masked input value.                       |
| digits    | Number | no       | 2       | The number of digits after the decimal point. |

## Usage

Codepen example: https://codepen.io/lagden/pen/jOrZVjg?editors=1010

```html
<input id="money" type="text" inputmode="numeric">

<script type="module">
	import Currency from 'https://unpkg.com/@tadashi/currency@{version}/src/currency.js'

	// Instance
	const mask = new Currency(money)

	// Static mode
	Currency.masking(1100) // => 1.100,00
</script>
```

## Buy Me a Coffee

BTC: bc1q7famhuj5f25n6qvlm3sssnymk2qpxrfwpyq7g4

## License

MIT © [Thiago Lagden](https://github.com/lagden)
