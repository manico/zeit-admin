const _remove = require('lodash/remove')
const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const confidentialPath = path.join(__dirname, '../../confidential.json')
const app = express()
app.use(bodyParser.json())

const readConfidential = () => {
  const confidential = fs.readFileSync(confidentialPath)
  return JSON.parse(confidential)
}

const writeConfidential = (confidential) => {
  fs.writeFileSync(confidentialPath, JSON.stringify(confidential, null, 2))
}

app.post('/token', (req, res) => {
  const confidential = readConfidential()

  confidential.tokens.push(req.body.token)
  writeConfidential(confidential)

  res.json(req.body)
})

app.delete('/token/:name', (req, res) => {
  const confidential = readConfidential()

  const removed = _remove(confidential.tokens, (n) => {
    return n.name === req.params.name
  })

  if (removed && removed.length) {
    if (removed[0].active && confidential.tokens.length) {
      confidential.tokens[0].active = true
    }
  }

  writeConfidential(confidential)

  res.json(req.body)
})

module.exports = {
  path: '/auth',
  handler: app
}