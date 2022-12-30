#!/usr/bin/env node

const { program } = require('commander')

import * as Z from "@effect/io/Effect"
import * as ZL from "@effect/io/Layer"
import * as Context from "@fp-ts/data/Context"
import { pipe } from "@fp-ts/data/Function"

import { Foo, Bar, programHell, programPurgatory, programParadise, programParadiseErr } from './programGenerator'
import { CustomRandom } from './programRandomCustom'

program
  .version('0.1.0')
  .parse(process.argv)

const options = program.opts()

const env = pipe(
  Context.empty(),
  Context.add(CustomRandom)({ next: Math.random }),
  Context.add(Foo)({ foo: 'foo' }),
  Context.add(Bar)({ bar: 'bar' })
);

export const programHellWithEnv = pipe(
  programHell,
  Z.provideEnvironment(env)
)
Z.unsafeRunPromise(programHellWithEnv)
  .then(result => console.log(result))
  .catch(err => console.log(err))

export const programPurgatoryWithEnv = pipe(
  programPurgatory,
  Z.provideEnvironment(env)
)
Z.unsafeRunPromise(programPurgatoryWithEnv)
  .then(result => console.log(result))
  .catch(err => console.log(err))

export const programParadiseWithEnv = pipe(
  programParadise,
  Z.provideEnvironment(env)
)
Z.unsafeRunPromise(programParadiseWithEnv)
  .then(result => console.log(result))
  .catch(err => console.log(err))

export const programParadiseErrWithEnv = pipe(
  programParadiseErr,
  Z.provideEnvironment(env)
)
Z.unsafeRunPromise(programParadiseErrWithEnv)
  .then(result => console.log(result))
  .catch(err => console.log(err))