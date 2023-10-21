# Currency

[![Build Status][ci-img]][ci]
[![Coverage Status][coveralls-img]][coveralls]

[ci-img]:        https://github.com/lagden/currency/actions/workflows/nodejs.yml/badge.svg
[ci]:            https://github.com/lagden/currency/actions/workflows/nodejs.yml
[coveralls-img]: https://coveralls.io/repos/github/lagden/currency/badge.svg?branch=main
[coveralls]:     https://coveralls.io/github/lagden/currency?branch=main


The simple and tiny script for currency input mask


## Install

```
$ npm i @tadashi/currency
```

## API

### new Currency(input \[, opts\])

Constructs a new Currency instance for a given input element.

parameter      | type                 | required    | default                | description
-----------    | -------------------- | ----------- | -------------------    | ------------
input          | HTMLInputElement     | yes         | -                      | The input element to associate with the instance.
opts           | Object               | no          | [see below](#opts)     | Optional configuration options for the instance.


#### opts

parameter      | type                 | required    | default                | description
-----------    | -------------------- | ----------- | -------------------    | ------------
keyEvent       | String               | no          | input                  | The type of key event to listen to
triggerOnBlur  | Boolean              | no          | false                  | Whether to trigger masking on blur
init           | Boolean              | no          | false                  | Whether to initialize masking on instance creation
backspace      | Boolean              | no          | false                  | Whether to handle backspace key input
maskOpts       | Object               | no          | [see below](#maskOpts) | Additional options for masking


#### maskOpts

parameter   | type                 | required    | default                    | description
----------- | -------------------- | ----------- | -------------------        | ------------
empty       | Boolean              | no          | false                      | Whether to return an empty string for zero values
locales     | String or Array      | no          | pt-BR                      | The locale to use for formatting - [Intl.NumberFormat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#syntax)
options     | Object               | no          | {minimumFractionDigits: 2} | Additional formatting options - [Intl.NumberFormat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#syntax)
viaInput    | Boolean              | no          | false                      | Whether the value is set via user input.


### getUnmasked()

Converts the current masked input value to a numeric value.

---


### Static methods

#### Currency.data(input)

Retrieves the instance associated with a given input element.

parameter      | type                 | required    | default                | description
-----------    | -------------------- | ----------- | -------------------    | ------------
input          | HTMLInputElement     | yes         | -                      | Input element


#### Currency.masking(v \[, opts\])

Formats a numeric value as a currency string with masking.

parameter      | type                 | required    | default                | description
-----------    | -------------------- | ----------- | -------------------    | ------------
v              | String               | yes         | -                      | Numeric value or string to format
opts           | Object               | no          | [see above](#maskOpts) | Mask Options


#### Currency.unmasking(v)

Converts a masked currency value to a numeric value.

parameter      | type                 | required    | default                | description
-----------    | -------------------- | ----------- | -------------------    | ------------
v              | String               | yes         | -                      | The masked currency value


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


## License

MIT © [Thiago Lagden](https://github.com/lagden)
