const path = require("path")
const Promise = require("bluebird")
const glob = Promise.promisify(require("glob"))
const fs = require("fs-extra")
const debug = require("debug")("meshblu-connector-configurator-meshblu-json:configurator")
const { MeshbluConnectorDaemon } = require("meshblu-connector-daemon")

class MeshbluConnectorConfigurator {
  constructor({ connectorHome, pm2Home }) {
    this.pm2Home = pm2Home
    this.connectorHome = connectorHome
    this.connectorsPath = path.resolve(path.join(connectorHome, "connectors"))
    this.configuratorsPath = path.resolve(path.join(connectorHome, "config", "meshblu-json"))
  }

  configurate() {
    const globPath = path.join(this.configuratorsPath, "meshblu-connector-*", "*.json")
    debug(`Checking ${globPath} for files`)
    return glob(globPath).each(file => this.daemonize(file))
  }

  daemonize(file) {
    return fs.readJson(file).then(data => {
      const type = path.basename(path.dirname(file))
      const { uuid, token, domain } = data
      const { connectorsPath, pm2Home } = this
      debug(`Daemonizing ${uuid}:${type}`)
      const daemon = new MeshbluConnectorDaemon({ uuid, type, token, domain, connectorsPath, pm2Home })
      return daemon.start()
    })
  }
}

module.exports.MeshbluConnectorConfigurator = MeshbluConnectorConfigurator
