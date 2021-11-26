#!/usr/bin/env node

import path from 'node:path'
import {promises, createWriteStream} from 'node:fs'
import {promisify} from 'node:util'
import child_process from 'node:child_process'

async function read(file, options = {}) {
	let filehandle
	let content
	try {
		filehandle = await promises.open(file, 'r')
		content = await filehandle.readFile(options)
	} finally {
		if (filehandle) {
			await filehandle.close()
		}
	}
	return content
}

const exec = promisify(child_process.exec)
const packageFile = path.resolve(process.cwd(), 'package.json')
const packageBuf = await read(packageFile)
const packageJson = JSON.parse(packageBuf)

const {dependencies, devDependencies} = packageJson

let cc = 0

function _error(message) {
	process.stderr.write(message)
	process.exit(1)
}

function getLatestVersionPackage(data, prop) {
	if (!data) {
		return Promise.resolve('no data to show')
	}

	const keys = Object.keys(data)
	return Promise.allSettled(
		keys.map(async name => {
			const cmd = `npm show ${name} version`
			try {
				let {stdout: version} = await exec(cmd)
				version = String(version).replace('\n', '')
				if (version && data[name] !== String(version)) {
					cc++
					process.stdout.write(`${name} --> ${version}\n`)
					packageJson[prop][name] = version
					return {name, version}
				}
			} catch {}
			return Promise.reject()
		}),
	)
}

try {
	await Promise.all([
		getLatestVersionPackage(dependencies, 'dependencies'),
		getLatestVersionPackage(devDependencies, 'devDependencies'),
	])

	createWriteStream(packageFile)
		.on('finish', () => {
			process.stdout.write(cc > 0 ? 'All writes are now complete.' : 'No updates')
		})
		.on('close', () => {
			process.exit(0)
		})
		.on('error', error => {
			_error(error.message)
		})
		.end(JSON.stringify(packageJson, undefined, '  '))
} catch (error) {
	_error(error.message)
}
