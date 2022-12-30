
import { pipe } from "@fp-ts/data/Function"
import * as E from "@fp-ts/data/Either";
import * as Z from "@effect/io/Effect";
import * as Context from "@fp-ts/data/Context";

export interface CustomRandom {
  readonly next: () => number;
}
export const CustomRandom = Context.Tag<CustomRandom>();

// Enough of this. It's time to build something real
function eitherFromRandom(random: number): E.Either<"fail", number> {
  return random > 0.5 ? E.right(random) : E.left("fail" as const);
}

export const randomCustomProgram = pipe(
  Z.service(CustomRandom), // Z.Effect<CustomRandom, never, CustomRandom>
  Z.map((random) => random.next()), // Z.Effect<never, never, number>
  Z.map(eitherFromRandom), // Z.Effect<never, never, Either<'fail', number>>
  Z.absolve // Z.Effect<never, 'fail', number>
);