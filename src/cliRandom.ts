#!/usr/bin/env node

const { program } = require('commander')

import * as Z from "@effect/io/Effect"
import * as ZL from "@effect/io/Layer"
import { pipe } from "@fp-ts/data/Function"

import { randomProgram } from './programRandom'
import { CustomRandom, randomCustomProgram } from './programRandomCustom'

program
  .version('0.1.0')
  .parse(process.argv)

const options = program.opts()
Z.unsafeRunPromise(randomProgram)
  .then(result => console.log(result))
  .catch(err => console.log(err))

// Argument of type 'Effect<CustomRandom, "fail", number>' is not assignable
// to parameter of type 'Effect<never, "fail", number>'.
// Type 'CustomRandom' is not assignable to type 'never'.
// Z.unsafeRunPromise(randomCustomProgram)
//   .then(result => console.log(result))
//   .catch(err => console.log(err))

export const randomCustomProgramWithService = pipe(
  randomCustomProgram,
  Z.provideService(CustomRandom)({ next: Math.random })
)
Z.unsafeRunPromise(randomCustomProgramWithService)
  .then(result => console.log(result))
  .catch(err => console.log(err))

const randomCustomProgramLayer = ZL.succeed(CustomRandom)({ next: Math.random });
export const randomCustomProgramWithLayer = pipe(
  randomCustomProgram,
  Z.provideLayer(randomCustomProgramLayer)
)
Z.unsafeRunPromise(randomCustomProgramWithLayer)
  .then(result => console.log(result))
  .catch(err => console.log(err))