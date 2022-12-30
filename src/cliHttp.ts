#!/usr/bin/env node

const { program } = require('commander')

import * as Z from "@effect/io/Effect"

import { httpProgram } from './programHttp'

program
  .version('0.1.0')
  .option('-id, --id', 'id of gist', '97459c0045f373f4eaf126998d8f65dc')
  .parse(process.argv)

const options = program.opts()
Z.unsafeRunPromise(httpProgram(options.id))
  .then(result => console.log(result))
  .catch(err => console.log(err))