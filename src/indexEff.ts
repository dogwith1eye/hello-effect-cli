import * as Z from "@effect/io/Effect";

export interface Input {
  peppers: boolean
  pineapple: boolean
  bbqSauce: boolean
  cheeseType: string
}

export const orderPizzaEff = (toppings: Input) =>
  Z.sync(() => {
    let message = 'you ordered a pizza with:\n'
    if (toppings.peppers) message += '  - peppers\n'
    if (toppings.pineapple) message += '  - pineapple\n'
    if (toppings.bbqSauce) message += '  - bbq\n'
    message += `  - ${toppings.cheeseType} cheese`
    return {
      message
    }
  })