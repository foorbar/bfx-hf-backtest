'use strict'

const isSeedTS = require('../util/is_seed_ts')
const { onTrade, onSeedTrade } = require('bfx-hf-strategy')

/**
 * Called for incoming backtest trade messages
 *
 * @param {Object} btState
 * @param {*[]} msg
 * @return {Object} nextBtState
 */
module.exports = async (btState = {}, msg = []) => {
  const { strategy } = btState
  const [, symbol, trade = {}] = msg
  let nextStrategyState = strategy

  if (isSeedTS(trade.mts)) {
    nextStrategyState = await onSeedTrade(strategy, trade)
  } else {
    nextStrategyState = await onTrade(strategy, trade)
  }

  btState.lastPrice = trade.price
  btState.nTrades = btState.nTrades + 1
  btState.strategy = nextStrategyState

  return btState
}
