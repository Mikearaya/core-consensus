'use strict'

const webhookManager = require('./manager')
const database = require('./database')

/**
 * The struct used by the plugin container.
 * @type {Object}
 */
exports.plugin = {
  pkg: require('../package.json'),
  defaults: require('./defaults'),
  alias: 'webhooks',
  register: async (container, options) => {
    container.resolvePlugin('logger').info('Starting Webhooks...')

    await database.init(options.database)

    await webhookManager.init(options)

    return webhookManager
  }
}

/**
 * The database connection.
 * @type {Database}
 */
exports.database = database