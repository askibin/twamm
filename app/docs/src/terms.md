# Terms

- [Time In Force][timeInForce] - duration in seconds to exchange an A-token for B-token (or vice versa). 
- [Token Pair][tokenPair] - pair of tokens (A & B) available for exchange. Includes configuration, statistics, and other data for each supported token and the list of supported intervals of time (`Time In Force`) to do the exchange. 
- [Order][order] - the intent to exchange the number of `A`-token for a fair amount of `B`-token in a given time (`Time In Force`) with a specific `Pool`.  
- [Pool][pool] - describes the exchange between two tokens (selling or buying A for B) in a pair at a specific time (`Time In Force`).


[order]: https://github.com/askibin/twamm/blob/master/app/packages/twamm-types/%40types/twamm-types.d.ts#L16-L27 
[pool]: https://github.com/askibin/twamm/blob/master/app/packages/twamm-types/%40types/twamm-types.d.ts#L45-L54 
[timeInForce]: https://github.com/askibin/twamm/blob/master/app/packages/twamm-types/%40types/twamm-types.d.ts#L7
[tokenPair]: https://github.com/askibin/twamm/blob/master/app/packages/twamm-types/%40types/twamm-types.d.ts#L76-L100 
