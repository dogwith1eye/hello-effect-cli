import { pipe } from "@fp-ts/data/Function"
import * as Z from "@effect/io/Effect"

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const createInterface = () =>
  Z.succeed(readline.createInterface({ input, output }))

const askQuestion = (rl:readline.Interface) =>
  Z.tryCatchPromise(
    () => rl.question("What do you think of Node.js? "), // Promise<string>
    () => "askQuestion err" as const
  )

const printAnswer = (answer:string) =>
  Z.succeed(console.log(`Thank you for your valuable feedback: ${answer}`))

const close = (rl:readline.Interface) =>
  Z.succeed(rl.close())

// export const readlineProgram = () =>
//   pipe(
//     createInterface(),
//     Z.flatMap(askQuestion),
//     Z.flatMap(printAnswer)
//     Z.flatMap(close) //don't have access to rl
//   );

export const readlineProgram = () =>
  Z.gen(function* ($) {
    const rl = yield* $(createInterface())
    const answer = yield* $(askQuestion(rl))
    const _ = yield* $(printAnswer(answer))
    yield* $(close(rl))
  })