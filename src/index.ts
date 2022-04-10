import * as T from "@effect-ts/core/Effect"
import { pipe } from "@effect-ts/core/Function"

import * as R from "@effect-ts/node/Runtime"

import * as CliApp from "@effect-ts/cli/CliApp"
import * as Command from "@effect-ts/cli/Command"

const command = Command.make("hello")

const helloWorldApp = CliApp.make({
  name: "Hello Effect Cli",
  version: "0.0.1",
  command
})

pipe(
  T.succeedWith(() => process.argv.slice(2)),
  T.chain((args) =>
    pipe(
      helloWorldApp,
      CliApp.run(args, (_) => {
        return T.succeedWith(() => console.log("Hello Effect Cli"))
      }),
    ),
  ),
  R.runMain,
)

