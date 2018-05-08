'use strict'

const database = require('@arkecosystem/core-container').resolvePlugin('database')
const utils = require('../utils')
const schema = require('../schema/wallets')

/**
 * @type {Object}
 */
exports.index = {
  /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
  handler: async (request, h) => {
    const wallets = await database.wallets.paginate(utils.paginate(request))

    return utils.toPagination(request, wallets, 'wallet')
  },
  options: {
    validate: schema.index
  }
}

/**
 * @type {Object}
 */
exports.top = {
  /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
  handler: async (request, h) => {
    const wallets = await database.wallets.top(utils.paginate(request))

    return utils.toPagination(request, wallets, 'wallet')
  }
}

/**
 * @type {Object}
 */
exports.show = {
  /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
  handler: async (request, h) => {
    const wallet = await database.wallets.findById(request.params.id)

    return utils.respondWithResource(request, wallet, 'wallet')
  },
  options: {
    validate: schema.show
  }
}

/**
 * @type {Object}
 */
exports.transactions = {
  /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
  handler: async (request, h) => {
    const wallet = await database.wallets.findById(request.params.id)
    const transactions = await database.transactions.findAllByWallet(wallet, utils.paginate(request))

    return utils.toPagination(request, transactions, 'transaction')
  },
  options: {
    validate: schema.transactions
  }
}

/**
 * @type {Object}
 */
exports.transactionsSent = {
  /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
  handler: async (request, h) => {
    const wallet = await database.wallets.findById(request.params.id)
    const transactions = await database.transactions.findAllBySender(wallet.publicKey, utils.paginate(request))

    return utils.toPagination(request, transactions, 'transaction')
  },
  options: {
    validate: schema.transactionsSent
  }
}

/**
 * @type {Object}
 */
exports.transactionsReceived = {
  /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
  handler: async (request, h) => {
    const wallet = await database.wallets.findById(request.params.id)
    const transactions = await database.transactions.findAllByRecipient(wallet.address, utils.paginate(request))

    return utils.toPagination(request, transactions, 'transaction')
  },
  options: {
    validate: schema.transactionsReceived
  }
}

/**
 * @type {Object}
 */
exports.votes = {
  /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
  handler: async (request, h) => {
    const wallet = await database.wallets.findById(request.params.id)
    const transactions = await database.transactions.allVotesBySender(wallet.publicKey, utils.paginate(request))

    return utils.toPagination(request, transactions, 'transaction')
  },
  options: {
    validate: schema.votes
  }
}

/**
 * @type {Object}
 */
exports.search = {
  /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
  handler: async (request, h) => {
    const wallets = await database.wallets.search({
      ...request.payload,
      ...request.query,
      ...utils.paginate(request)
    })

    return utils.toPagination(request, wallets, 'wallet')
  },
  options: {
    validate: schema.search
  }
}