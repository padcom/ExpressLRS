#!/usr/bin/env -S npx ts-node -T -P tsconfig.server.json

import express from 'express'
import { type Config } from './src/types'

const config: Config = {
  'options': {
    'wifi-on-interval': 60,
    'tlm-interval': 240,
    'fan-runtime': 30,
    'unlock-higher-power': false,
    'airport-uart-baud': 460800,
    'is-airport': false,
    'domain': 0,
    'customised': false,
    'flash-discriminator': 1104430002,
  },
  'config': {
    'uid': [
      219,
      98,
      2,
      190,
      93,
      86,
    ],
    'ssid': '',
    'mode': 'AP',
    'product_name': 'RadioMaster Ranger Micro 2.4GHz TX',
    'lua_name': 'RM Ranger Micro',
    'reg_domain': 'ISM2G4',
    'has-highpower': false,
    'uidtype': 'Flashed',
  },
}

const proxy = {
  config: {
    'is-proxy': false,
    'aux': 8,
    'proxy-uid': [0, 0, 0, 0, 0, 0],
  },
}

const app = express()
app.use(express.json())

app.get('/config', (req, res) => {
  res.send(config)
  res.end()
})

app.get('/options.json', (req, res) => {
  res.send(config.config)
  res.end()
})

app.post('/options.json', (req, res) => {
  config.config = req.body()
  res.end()
})

app.get('/proxy.json', (req, res) => {
  res.send(proxy.config)
  res.end()
})

app.post('/proxy.json', (req, res) => {
  proxy.config = req.body()
  res.end()
})

const listeners = app.listen(9000, () => {
  console.log('Listening on', listeners.address())
})
