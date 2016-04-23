let debug = require('debug')('wolfram:prettify')

const PIPE = ' | '
const PIPE_RE = / ?\| ?/g
const EOL_RE = /\n/g
const LEADING_PAREN_RE = /^\(/g
const PIPE_INSIDE_PARENS_RE = /\([^|)]*\|[^)]*\)/g
const INSIDE_PARENS_RE = /\([^)]*\)/g

export default function prettifyWolframAlphaResponseText (text, pod) {
  text = text.replace(/[ \t]+/g, ' ').trim()

  if (text === '(none)') {
    return ''
  }

  // remove smt like “(MSFT | NASDAQ | ...)” because it screws up our pipe splitting
  text = text.replace(PIPE_INSIDE_PARENS_RE, '').replace(/\s+\n/g, '\n').trim()

  let hasEOL = (text.indexOf('\n') >= 0)
  let hasSpace = (text.replace(PIPE_RE, '').indexOf(' ') >= 0)
  let hasComma = (text.indexOf(',') >= 0)
  let hasSemicolon = (text.indexOf(';') >= 0)
  let hasPipe = (text.indexOf(PIPE) >= 0)

  let lines = text.split(EOL_RE)
  let fields = lines.map((line) => line.split(PIPE_RE))
  let firstLine = lines[0]
  let firstLineFields = fields[0]
  let first = firstLineFields[0]

  let dataRows = fields.slice(1).filter((row) => (row.length === firstLineFields.length) && !!(row[0]))
  let commentRows = fields.slice(1).filter(isCommentRow)

  let isRegularTable = (first === '' && firstLineFields.length > 1)
  let isKeyValueTable = (!isRegularTable && firstLineFields.length === 2 && (1 + dataRows.length + commentRows.length === fields.length))

  debug('lines = %s', JSON.stringify(lines, null, 2))

  if (pod.id === 'Anagram') {
    return secondLevel(replace(text, '', ', '))
  }

  if (!hasEOL && !hasPipe) {
    return secondLevel(text)
  }

  if (isRegularTable) {
    if (dataRows.length === 0) {
      return ''
    }
    return formatTable(firstLineFields, dataRows)
  }

  if (isKeyValueTable) {
    let rows = fields.filter((row) => (row.length !== 2 || !!row[0] && !!row[1]))
    rows = rows.map((row) => (row.length === 2 ? row.map(killComments) : row))
    return rows.map((row) => row.map(secondLevel).join(' ')).join('; ')

    // if (first === 'median') {
    //   return secondLevel('Median ' + firstLineFields[1])
    // }

    return secondLevel(replace(text, ' ', '; '))
  }

  if (hasEOL && hasPipe) {
    if (hasComma && hasSemicolon) {
      return secondLevel(text)
    } else if (hasComma) {
      return secondLevel(replace(text, '; ', null))
    } else {
      return secondLevel(replace(text, ', ', null))
    }
  }

  if (hasPipe) {
    if (hasComma && hasSemicolon) {
      return secondLevel(text)
    } else if (hasComma) {
      return secondLevel(replace(text, '; ', null))
    } else {
      return secondLevel(replace(text, ', ', null))
    }
  }

  if (hasEOL) {
    if (lines.length === 2 && lines[1].match(LEADING_PAREN_RE)) {
      return secondLevel(replace(text, null, ' '))
    }

    if (hasComma && hasSemicolon) {
      return secondLevel(text)
    } else if (hasComma) {
      return secondLevel(replace(text, null, '; '))
    } else {
      return secondLevel(replace(text, null, ', '))
    }
  }

  return secondLevel(text)
}

function replace (text, pipe, eol) {
  if (eol != null) {
    text = text.replace(EOL_RE, eol)
  }
  if (pipe != null) {
    text = text.replace(PIPE_RE, pipe)
  }
  return text
}

function secondLevel (text) {
  text = text.replace(/\) \(/g, '; ')
  text = text.replace(/[(] /g, '(')
  text = text.replace(/ [)]/g, ')')
  text = text.replace(/ {2,}]/g, ' ')
  return text.trim()
}

function formatTable (headers, rows) {
  let lines = []
  for (let c = 0; c < headers.length; ++c) if (!!headers[c]) {
      let o = formatTableColumn(headers[c], c, rows)
      if (o) {
        lines.push(o)
      }
  }
  return lines.join('\n')
}

function formatTableColumn (header, c, rows) {
  let values = []
  for (let row of rows) {
    let rh = row[0]
    let v = row[c]
    if (v) {
      values.push(`${secondLevel(v)} (${secondLevel(rh)})`)
    }
  }

  if (values.length > 0) {
    return `${secondLevel(header)}: ${values.join(', ')}`
  } else {
    return ''
  }
}

function killComments (text) {
  return text.replace(INSIDE_PARENS_RE, '')
}

function isCommentRow (row) {
  return (row.length === 1 && row[0].match(LEADING_PAREN_RE))
}
