# Home

Twamm program is for exchanging *n* amount of token `A` for *m* amount of token `B` in a specific time (`Time In Force`).

Explanation of basic terms could be found [here][./terms.md].


## Request the exchange

Program's [`placeOrder`][https://github.com/askibin/twamm/blob/master/app/src/hooks/use-schedule-order.ts#L147-L148] is used to register the intent to exchange `A` for `B`.

Prerequisites:

- User have to specify the tokens (A & B) he interested in exchange with.
- User have to specify the amount of source token (A) to exchange for opposite one.
- User have to choose the specific time (`Time In Force`) to execute the exchange.
- User have to provide the liquidity to make that exchange happen.

When all settled, user should sign the intent to exchange.


### Supported intervals of time (`Time In Force`) and scheduling

Every `Token Pair` has the list of supported intervals of time ([`tif`][https://github.com/askibin/twamm/blob/master/app/packages/twamm-types/%40types/twamm-types.d.ts#L97]).

These intervals are the number of seconds to execute the exchange.

Any active process of exchange has an underlying `Pool`.

That means that we can split the intervals in two categories:
- interval which has the active pool with the time of expiration
- interval with no active pool (pool might be expired or there might be no pool at all)

Every `Token Pair` holds the information about the intervals available and the list of `Pool` indentificators (`counters`);

#### Scheduling

Choosing the interval, you might want to "delay" the execution for the interval duration.

That means:
- User chooses the interval end turns the schedule on
- Program will create the pool according the chosen interval (if not done yet); order execution won't be started
- Program will execute the order at the next pool with the same time (`Time In Force`)

Under the hood, to choose the interval, you have to specify the pool counter. In that perspective, scheduling means that we increase the counter by 1. [Here is the link][https://github.com/askibin/twamm/blob/master/app/packages/twamm-client-js/lib/time-in-force.ts#L19] for that.


