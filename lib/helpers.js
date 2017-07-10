const fs = require('fs')
const find = require('lodash/fp/find')
const last = require('lodash/fp/last')
const split = require('lodash/fp/split')
const startsWith = require('lodash/fp/startsWith')
const trim = require('lodash/fp/trim')

const getSerialNumber = function getSerialNumber() {
  try {
    fs.accessSync('/proc/cpuinfo', fs.constants.R_OK)
  } catch (error) {
    return
  }

  const cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8')
  const line = find(startsWith('Serial'), split('\n', cpuinfo))
  return trim(last(split(':', line)))
}

module.exports = { getSerialNumber }
