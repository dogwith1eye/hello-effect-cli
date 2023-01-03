import { pipe } from "@fp-ts/data/Function"
import * as Context from "@fp-ts/data/Context";
import * as Z from "@effect/io/Effect"
import * as Scope from "@effect/io/Scope";

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { promisify } from "node:util";

const createInterface = () =>
  Z.sync(() => readline.createInterface({ input, output }))

const askQuestion = (rl: readline.Interface) =>
  Z.tryCatchPromise(
    () => rl.question("What do you think of Node.js? "), // Promise<string>
    () => "askQuestion err" as const
  )

const printAnswer = (answer: string) =>
  Z.sync(() => console.log(`Thank you for your valuable feedback: ${answer}`))

const askAndPrint = (rl: readline.Interface) =>
  pipe(
    askQuestion(rl),
    // Z.flatMap((answer) => printAnswer(answer))
    Z.flatMap(printAnswer)
  )

const close = (rl: readline.Interface) =>
  Z.sync(() => rl.close())

export const readlineProgram = () =>
  Z.gen(function* ($) {
    const rl = yield* $(createInterface())
    const answer = yield* $(askQuestion(rl))
    const _ = yield* $(printAnswer(answer))
    yield* $(close(rl))
  })

export interface ReadlineInterface {
  readonly rl: readline.Interface;
}

export const FileDescriptor = Context.Tag<ReadlineInterface>();

export const resource: Z.Effect<Scope.Scope, never, ReadlineInterface> =
  Z.acquireRelease(
    pipe(
      Z.sync(() => readline.createInterface({ input, output })),
      Z.map((rl) => ({ rl })),
      Z.tap(() => Z.logInfo("ReadlineInterface acquired"))
    ),
    ({ rl }) =>
      pipe(
        Z.sync(() => rl.close()),
        Z.tap(() => Z.logInfo("ReadlineInterface released"))
      )
  )

export const readlineProgramScope = () =>
  pipe(
    resource,
    Z.flatMap((_) => askAndPrint(_.rl)),
    Z.scoped
  )