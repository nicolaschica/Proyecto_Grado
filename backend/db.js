const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'proyecto_grado'
})

connection.connect(err => {
  if (err) throw err
  console.log('Conectado a MySQL')
})

module.exports = connection
