const express = require('express')
const sqliteUtils = require('./sqliteUtils.js')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// url = `https://gist.githubusercontent.com/FergusDevelopmentLLC/2d2ef2fe6bf41bb7f10cb7a87efbb803/raw/1aaea6621e64892fd1fc9642bb14a729c892ffe8/animal_hospitals_ca.csv`
// let url = `https://gist.githubusercontent.com/FergusDevelopmentLLC/f0ea84b0d4d50604c405f5b74db1b498/raw/863d21945fe993f224ee8ad3771930568568a7c3/category.csv`
url = `https://gist.githubusercontent.com/FergusDevelopmentLLC/ea92be31b5382266079042e50d4f7de6/raw/2cdd490a0b43b4e3b9906f2bc2e269ec6a63dc61/comedians.csv`
sqliteUtils.parseCsvToSqliteFrom(url)

app.get('/', (req, res, next) => {
  res.status(200).json(`Hello from nodejs-csv-sqlite3. The current server date/time is: ${new Date()}`)
})

const server = app.listen(4070, () => {
  console.log('App listening at port %s', server.address().port)
})