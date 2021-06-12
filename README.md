# Currency

[![Build Status][ci-img]][ci]
[![Coverage Status][coveralls-img]][coveralls]
[![XO code style][xo-img]][xo]

[ci-img]:        https://github.com/lagden/currency/workflows/Node.js%20CI/badge.svg
[ci]:            https://github.com/lagden/currency/actions?query=workflow%3A%22Node.js+CI%22
[coveralls-img]: https://coveralls.io/repos/github/lagden/currency/badge.svg?branch=main
[coveralls]:     https://coveralls.io/github/lagden/currency?branch=main
[xo-img]:        https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo]:            https://github.com/sindresorhus/xo


The simple and tiny script for currency input mask


## Install

```
$ npm i -S @tadashi/currency
```

## API


### new Currency(input \[, opts\])

parameter      | type                 | required    | default                | description
-----------    | -------------------- | ----------- | -------------------    | ------------
input          | HTMLInputElement     | yes         | -                      | Input element
opts           | Object               | no          | [see below](#opts)     | Options


#### opts

parameter      | type                 | required    | default                | description
-----------    | -------------------- | ----------- | -------------------    | ------------
keyEvent       | String               | no          | input                  | Event which trigger mask
triggerOnBlur  | Boolean              | no          | false                  | Trigger the mask when blur event occurs
init           | Boolean              | no          | false                  | Format value when create instance
backspace      | Boolean              | no          | false                  | Allow cleanup the input
maskOpts       | Object               | no          | [see below](#maskOpts) | Mask Options


#### maskOpts

parameter   | type                 | required    | default                    | description
----------- | -------------------- | ----------- | -------------------        | ------------
empty       | Boolean              | no          | false                      | Keep input empty if value is 0
locales     | String or Array      | no          | pt-BR                      | Same locales [Intl.NumberFormat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#syntax)
options     | Object               | no          | {minimumFractionDigits: 2} | Same options [Intl.NumberFormat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#syntax)


### Static methods


#### Currency.data(input)

Return the instance of `Currency` from `HTMLInputElement`.

parameter      | type                 | required    | default                | description
-----------    | -------------------- | ----------- | -------------------    | ------------
input          | HTMLInputElement     | yes         | -                      | Input element


#### Currency.masking(v \[, opts\])

Return the value formatted.

parameter      | type                 | required    | default                | description
-----------    | -------------------- | ----------- | -------------------    | ------------
v              | String               | yes         | -                      | Value which will be masked
opts           | Object               | no          | [see above](#maskOpts) | Mask Options



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
