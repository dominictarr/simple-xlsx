# simple-xlsx

get a table out of an excel spreadsheet.

## Example

``` js
fs.createReadStream('accounts.xlsx')
  .pipe(SimpleXlsx(function (err, table) {
    if(err) throw err
    console.log(table)
  })
```

## how it all works.

The excell spreadsheet format is a bit strange.
basically, it's XML files, inside a zip archive,
which sounds easy, but the great thing about this
is that it's easy to add more stuff when ever you feel like.

So, you unzip the archive, and then you look in the `xl/worksheets/work1.xml`
file. This contains the actual data, plus some style information
about how to display the columns. Except for long strings that would be too easy.
long strings are stored in the `xl/sharedStrings.xml` file,
and indexed by numbers in the worksheet (`<c t=s><v>{number}</v><c>`)

Pointers in a text format! There is also more style information
(fonts etc) in `xl/styles.xml` but never mind that.

This seems to work. I basically had to write it while trying to understand
other xlsx parsers that I was evaluating...


## DISCLAIMER OF WARRANTY

The Software is provided "AS IS" and "WITH ALL FAULTS,"
without warranty of any kind, including without limitation
the warranties of merchantability, fitness for a particular
purpose and non-infringement. The Licensor makes no warranty
that the Software is free of defects or is suitable for any
particular purpose. In no event shall the Licensor be
responsible for loss or damages arising from the installation
or use of the Software, including but not limited to any
indirect, punitive, special, incidental or consequential
damages of any character including, without limitation,
damages for loss of goodwill, work stoppage, computer failure
or malfunction, or any and all other commercial damages or
losses. The entire risk as to the quality and performance of
the Software is borne by you. Should the Software prove
defective, you and not the Licensor assume the entire cost of
any service and repair.

## License

MIT
