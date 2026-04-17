// Google Apps Script for BZ Newsletter Subscribers
//
// Setup:
// 1. Create a Google Sheet called "BZ Subscribers"
// 2. Add headers in row 1: Email | Source | Date | IP
// 3. Go to Extensions > Apps Script
// 4. Paste this code
// 5. Deploy > New deployment > Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Copy the URL and set it as SUBSCRIBE_SHEET_URL env var in Vercel

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  // Check for duplicate
  var emails = sheet.getRange('A:A').getValues().flat();
  if (emails.includes(data.email)) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, message: 'already subscribed' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([
    data.email,
    data.source || 'unknown',
    data.date || new Date().toISOString(),
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok' })
  ).setMimeType(ContentService.MimeType.JSON);
}
