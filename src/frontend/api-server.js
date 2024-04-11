/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines-per-function */
import { request } from 'node:http'
import bodyParser from 'body-parser'
import { readFileSync } from 'fs'

const API_LIST = [
  '/config',
]

function readTargets() {
  return JSON.parse(readFileSync('../hardware/targets.json'))
}

function readModuleDefinitions() {
  const targets = readTargets()

  return Object.entries(targets).map(([vendorKey, modules]) => {
    const { name: vendor, ...types } = modules

    return {
      vendor,
      modules: Object.entries(types).map(([type, products]) => Object.entries(products).map(([productKey, product]) => ({
        name: product.product_name,
        definition: `${vendorKey}/${type}/${productKey}`,
      }))).flat(),
    }
  })
}

function proxyToTarget(targetHost, req, res) {
  console.log('Forwarding', req.method, req.url, 'to', targetHost)
  req.pipe(request(`${targetHost}${req.url}`, r => r.pipe(res)))
}

function readTargetDefinitions(targetModule) {
  const targets = readTargets()

  const [vendor, type, unit] = targetModule.split('/')
  const [side] = type.split('_')

  const { layout_file, overlay, ...definition } = targets[vendor][type][unit]

  return {
    ...definition,
    layout: {
      ...JSON.parse(readFileSync(`../hardware/${side.toUpperCase()}/${layout_file}`)),
      ...overlay,
    },
  }
}

function configureSimulatedTarget(targetVendor, targetModule) {
  console.log(`Configuring simulated target to be ${targetVendor} - ${targetModule}`)

  const target = readTargetDefinitions(targetModule)

  console.log('Selected target:', target)
}

function simulateTarget(targetModule, req, res) {
  res.statusCode = 500
  res.statusMessage = 'not implemented'
  res.end()
}

export default ({
  targetType = 'hardware',
  targetHost = 'http://10.0.0.1',
  targetVendor = '',
  targetModule = '',
} = {}) => ({
  name: 'api-server',
  /** @param {import('vite').ViteDevServer} server */
  configureServer(server) {
    server.middlewares.use('/set-target', bodyParser.json())
    server.middlewares.use('/list-targets', (req, res) => {
      res.appendHeader('content-type', 'application/json')
      res.end(JSON.stringify(readModuleDefinitions(), null, 2))
    })

    server.middlewares.use('/get-target', (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        type: targetType,
        host: targetHost,
        vendor: targetVendor,
        module: targetModule,
      }))
    })

    // eslint-disable-next-line complexity
    server.middlewares.use('/set-target', (req, res, next) => {
      if (req.body.type === 'hardware' && req.body.host) {
        targetType = req.body.type
        targetHost = req.body.host
        targetVendor = ''
        targetModule = ''
        res.end(`Proxy set to hardware at ${req.body.host}`)
      } else if (req.body.type === 'simulated' && req.body.module) {
        targetType = req.body.type
        targetHost = ''
        targetVendor = req.body.vendor
        targetModule = req.body.module
        configureSimulatedTarget(targetVendor, targetModule)
        res.end(`Proxy set to simulated module of type ${targetModule}`)
      } else {
        next()
      }
    })

    server.middlewares.use((req, res, next) => {
      if (API_LIST.includes(req.url)) {
        if (targetType === 'hardware') {
          proxyToTarget(targetHost, req, res)
        } else {
          simulateTarget(targetModule, req, res)
        }
      } else {
        next()
      }
    })
  },
})

