#!/usr/bin/env node

const { program } = require('commander')

import { pipe } from "@fp-ts/data/Function";
import * as Z from "@effect/io/Effect";
import * as ZL from "@effect/io/Layer";
import * as Scope from "@effect/io/Scope";
import * as Exit from "@effect/io/Exit";
import * as fs from "node:fs";
import { promisify } from "node:util";

import { Foo, Bar, FileDescriptor } from "./utils/contexts";

import { FooLive, BarLive, FileDescriptorLive, program1, program2 } from './programLayers'

program
  .version('0.1.0')
  .parse(process.argv)

const options = program.opts()

const makeAppRuntime = <R, E, A>(layer: ZL.Layer<R, E, A>) =>
  Z.gen(function* ($) {
    const scope = yield* $(Scope.make());
    const env = yield* $(ZL.buildWithScope(scope)(layer));
    const runtime = yield* $(pipe(Z.runtime<A>(), Z.provideEnvironment(env)));

    return {
      runtime,
      close: Scope.close(Exit.unit())(scope),
    };
  });

type AppLayer = Foo | Bar | FileDescriptor;

const appLayerLive: ZL.Layer<never, never, AppLayer> = pipe(
  FooLive,
  ZL.provideToAndMerge(BarLive),
  ZL.provideToAndMerge(FileDescriptorLive)
);

const promise = Z.unsafeRunPromise(makeAppRuntime(appLayerLive));
promise.then(({ runtime, close }) => {
  process.on("beforeExit", () => Z.unsafeRunPromise(close));
  runtime.unsafeRunPromise(program1);
  runtime.unsafeRunPromise(program2);
  runtime.unsafeRunPromise(program2);
});

/* prints out:
 *
 * FileDescriptor acquire { fd: 22 }
 * program1 { foo: 4 }
 * program2 { bar: 2 } { fd: 22 }
 * program2 { bar: 2 } { fd: 22 }
 * FileDescriptor release
 */
