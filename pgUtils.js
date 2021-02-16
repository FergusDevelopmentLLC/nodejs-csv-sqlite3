const fastcsv = require("fast-csv")
const request = require("request")
const { Client } = require('pg')

const parseCsvToPgFrom = async (url) => {

  const client = new Client()
  await client.connect()
  
  const targetTable = `csv_import_${ Date.now().toString() }`
  const inserts = []
  const csvData = []

  fastcsv.parseStream(request(url))
    .on('data', (data) => {
      csvData.push(data)
    })
    .on('end', async () => {
      
      let header = csvData.shift()//get the first header line
      
      //build insert statements dynamically
      csvData.forEach((columnValues) => {
        let insert = `INSERT INTO ${ targetTable } (${header.map(value => value).join(',')}) VALUES (${header.map((value, i) => `$${i + 1}`)});`
        //into the inserts array, push the parameterized sql statement and the array of parameters
        inserts.push([insert, [...columnValues]])// example: ['INSERT INTO targetTable (col1,col2,col3) VALUES ($1,$2,$3)]', ['-121.225442','38.185269','Elaine Mary Dornton Dvm']
      })

      try {

        const columnsString = header.map(column => `${column} character varying`).join(",")

        //TODO, parameters don't seem to work with this sql
        await client.query(`CREATE TABLE ${targetTable} ( ${columnsString} ) WITH ( OIDS=FALSE );`)
        
        //TODO, parameters don't seem to work with this sql
        await client.query(`ALTER TABLE ${targetTable} OWNER TO geodevdb;`)

        inserts.forEach(async insert => await client.query(insert[0], insert[1]))
        
      } catch (err) {
        console.log('error', err)
        await client.end()
      }
      
      return targetTable
  
  })
}

module.exports = { parseCsvToPgFrom }