// ============================================================
// Panela Solidária — Apps Script
// IMPORTANTE: abra pelo menu Extensões > Apps Script dentro
// da sua planilha do Google Sheets, cole este código e
// implante como Web App:
//   Executar como: Eu | Quem tem acesso: Qualquer pessoa
// ============================================================

var SHEET_NAME = 'Lançamentos';
var HEADERS    = ['Data', 'Descrição', 'Tipo', 'Valor', 'Observações', 'Categoria', 'Usuário', 'Remetente'];

// Retorna (ou cria) a aba com cabeçalhos corretos
function getSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Cria cabeçalhos se a linha 1 estiver vazia
  var firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var hasHeaders = firstRow.some(function(v) { return v !== ''; });
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function doGet(e) {
  var action = (e.parameter && e.parameter.action) ? e.parameter.action : 'get';
  try {
    if (action === 'insert') return handleInsert(e.parameter);
    if (action === 'delete') return handleDelete(e.parameter);
    return handleGet();
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ---- Leitura ------------------------------------------------
function handleGet() {
  var sheet = getSheet();
  var data  = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ rows: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, 'America/Sao_Paulo', 'yyyy-MM-dd');
      }
      row[headers[j]] = val;
    }
    rows.push(row);
  }
  return ContentService.createTextOutput(JSON.stringify({ rows: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---- Inserção -----------------------------------------------
function handleInsert(p) {
  var sheet   = getSheet();
  var headers = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var newRow  = new Array(headers.length).fill('');

  headers.forEach(function(h, i) {
    switch (h) {
      case 'Data':         newRow[i] = p.data        || ''; break;
      case 'Descrição':    newRow[i] = p.descricao   || ''; break;
      case 'Tipo':         newRow[i] = p.tipo        || ''; break;
      case 'Valor':        newRow[i] = parseFloat(p.valor) || 0; break;
      case 'Obs':
      case 'Observações':  newRow[i] = p.obs         || ''; break;
      case 'Categoria':    newRow[i] = p.categoria   || ''; break;
      case 'Usuário':      newRow[i] = p.usuario     || ''; break;
      case 'Remetente':    newRow[i] = p.remetente   || ''; break;
    }
  });

  sheet.appendRow(newRow);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---- Exclusão -----------------------------------------------
function handleDelete(p) {
  var sheet   = getSheet();
  var data    = sheet.getDataRange().getValues();
  var headers = data[0];

  var dataIdx  = headers.indexOf('Data');
  var descIdx  = headers.indexOf('Descrição');
  var valorIdx = headers.indexOf('Valor');
  var tipoIdx  = headers.indexOf('Tipo');

  for (var i = data.length - 1; i >= 1; i--) {
    var rowDate = data[i][dataIdx];
    if (rowDate instanceof Date) {
      rowDate = Utilities.formatDate(rowDate, 'America/Sao_Paulo', 'yyyy-MM-dd');
    } else {
      rowDate = rowDate.toString().split('T')[0];
    }
    var match =
      rowDate === p.data &&
      data[i][descIdx] === p.descricao &&
      Math.abs(parseFloat(data[i][valorIdx]) - parseFloat(p.valor)) < 0.01 &&
      data[i][tipoIdx] === p.tipo;

    if (match) { sheet.deleteRow(i + 1); break; }
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
