# Currency

[![Build Status][ci-img]][ci]
[![Coverage Status][coveralls-img]][coveralls]
[![devDependency Status][devDep-img]][devDep]
[![XO code style][xo-img]][xo]

[ci-img]:        https://github.com/lagden/currency/workflows/Node.js%20CI/badge.svg
[ci]:            https://github.com/lagden/currency/actions?query=workflow%3A%22Node.js+CI%22
[coveralls-img]: https://coveralls.io/repos/github/lagden/currency/badge.svg?branch=main
[coveralls]:     https://coveralls.io/github/lagden/currency?branch=main
[devDep-img]:    https://david-dm.org/lagden/currency/dev-status.svg
[devDep]:        https://david-dm.org/lagden/currency#info=devDependencies
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
maskOpts       | Object               | no          | [see below](#maskOpts) | Mask Options


#### maskOpts

parameter      | type                 | required    | default                | description
-----------    | -------------------- | ----------- | -------------------    | ------------
prefix         | String               | no          | false                  | Show up in the begin
sufix          | String               | no          | false                  | Show up in the end
separator      | String               | no          | \u0020                 | Separator between prefix, sufix and value
decimal        | String               | no          | ,                      | Decimal separator
thousand       | String               | no          | .                      | Thousand separator


### Static methods


#### Currency.data(input)

Return the instance of `Currency` from `HTMLInputElement`.

parameter      | type                 | required    | default                | description
-----------    | -------------------- | ----------- | -------------------    | ------------
input          | HTMLInputElement     | yes         | -                      | Input element


#### Currency.masking(v \[, opts\])

Return the value formatted

parameter      | type                 | required    | default                | description
-----------    | -------------------- | ----------- | -------------------    | ------------
v              | String               | yes         | -                      | Value which will be masked
opts           | Object               | no          | [see below](#maskOpts) | Mask Options



## Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <title>Example</title>
  </head>
  <body>
    <input id="money" type="text" inputmode="numeric">
    <script type="module">
      import Currency from './node_modules/@tadashi/currency/dist/index.js'
      const el = document.getElementById('money')
      const mask = new Currency(el)
    </script>
  </body>
</html>
```


## License

MIT © [Thiago Lagden](http://lagden.in)
