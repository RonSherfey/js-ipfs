'use strict'

const { default: parseDuration } = require('parse-duration')

module.exports = {
  command: 'id',

  describe: 'Shows IPFS Node ID info',

  builder: {
    format: {
      alias: 'f',
      type: 'string',
      describe: 'Print Node ID info in the given format. Allowed tokens: <id> <aver> <pver> <pubkey> <addrs> <protocols>'
    },
    timeout: {
      type: 'string',
      coerce: parseDuration
    }
  },

  /**
   * @param {object} argv
   * @param {import('../types').Context} argv.ctx
   * @param {string} argv.format
   * @param {number} argv.timeout
   */
  async handler ({ ctx: { ipfs, print }, format, timeout }) {
    const id = await ipfs.id({
      timeout
    })

    if (format) {
      print(format
        .replace('<id>', id.id)
        .replace('<aver>', id.agentVersion)
        .replace('<pver>', id.protocolVersion)
        .replace('<pubkey>', id.publicKey)
        .replace('<addrs>', (id.addresses || []).map(addr => addr.toString()).join('\n'))
        .replace('<protocols>', (id.protocols || []).map(protocol => protocol.toString()).join('\n'))
      )

      return
    }

    print(JSON.stringify(id, null, 2))
  }
}
