
var unzip  = require('unzip')
var concat = require('concat-stream')
var XML    = require('nice-xml')

module.exports = function (cb) {
  var strings = null, worksheet1 = null
  function parseSST (data) {
    strings = []
    XML.parse(data.toString())
      .sst.si.forEach(function (v) {
        strings.push(v.t)
      })
    if(worksheet1)
      parseWorkshee1(worksheet1)
  }

  var columns = {}

  function parseWorksheet1(data) {
    worksheet1 = worksheet1 || data
    if(!strings) return //we havn't parsed the Shared String Table yet...
    var tree = XML.parse(data.toString())
    var table = tree.worksheet.sheetData.row.map(function (row) {
      var cells = (Array.isArray(row.c) ? row.c : [row.c])
      return cells.reduce(function (row, cell) {
        if(cell.v) {
          var col = /[A-Z]+/.exec(cell.$.r)[0]
          row[col] = cell.$.t == 's' ? strings[cell.v] : cell.v
          columns[col] = true
        }
      return row
      }, {})
    })

    cb(null, table.map(function (obj) {
      var row = []
      for(var col in columns)
        row.push(obj[col] || null)
      return row
    }))
  }

  return unzip.Parse()
    .on('entry', function (entry) {
      if(entry.path == 'xl/sharedStrings.xml')
        entry.pipe(concat(parseSST))
      else if(entry.path == 'xl/worksheets/sheet1.xml')
        entry.pipe(concat(parseWorksheet1))
      else
        entry.resume()
    })
    .on('error', cb)
}

if(!module.parent && process.title !== 'browser') {
  if(process.stdin.isTTY)
    return console.error('USAGE: simple-xlxs < file > output.json')
  process.stdin.pipe(module.exports(function (err, table) {
    if(err) throw err
    console.log(JSON.stringify(table, null, 2))
  }))
}


