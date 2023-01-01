#!/usr/bin/env node

const { program } = require('commander')

import * as Z from "@effect/io/Effect"

import { programUseFileDescriptorStupid, programUseFileDescriptorSmarter, programUseFileDescriptor } from './programScope'

program
  .version('0.1.0')
  .parse(process.argv)

const options = program.opts()

Z.unsafeRunPromise(programUseFileDescriptorStupid)
  .then(result => console.log(result))
  .catch(err => console.log(err))

Z.unsafeRunPromise(programUseFileDescriptorSmarter)
  .then(result => console.log(result))
  .catch(err => console.log(err))

Z.unsafeRunPromise(programUseFileDescriptor)
  .then(result => console.log(result))
  .catch(err => console.log(err))