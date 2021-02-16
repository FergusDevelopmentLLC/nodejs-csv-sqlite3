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
      console.log('header', header)
      
      csvData.forEach((columnValues) => {
        let insert = `INSERT INTO ${ targetTable } (${header.map(value => value).join(',')}) VALUES (${header.map((value, i) => `$${i + 1}`)});`
        inserts.push([insert, [...columnValues]])
      })

      const columns = header.map((value) => {
        return `${value} character varying`
      }).join(",")
      
      //TODO, parameterize???
      const tableCreationSql = `CREATE TABLE ${targetTable}
                                ( ${columns} )
                                WITH (
                                  OIDS=FALSE
                                );`

      try {

        await client.query(tableCreationSql)
        await client.query( `ALTER TABLE ${targetTable} OWNER TO geodevdb;`)
        inserts.forEach(async insert => await client.query(insert[0], insert[1]))
        
      } catch (err) {
        console.log('error', err)
        await client.end()
      }
      
      return targetTable
  
  })
}

module.exports = { parseCsvToPgFrom }