import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);

async function initializeSheet() {
  await doc.loadInfo();
  
  let sheet = doc.sheetsByIndex[0];
  if (!sheet) {
    sheet = await doc.addSheet({ 
      title: 'Quiz Results',
      headerValues: ['name', 'email', 'issued']
    });
  }

  try {
    await sheet.loadHeaderRow();
  } catch (error: any) {
    if (error.message.includes('No header row')) {
      await sheet.setHeaderRow(['name', 'email', 'issued']);
      // Add empty row to commit headers
      await sheet.addRow({});
    }
  }
  return sheet;
}

export async function saveQuizData(name: string, email: string) {
  try {
    const sheet = await initializeSheet();
    await sheet.addRow({ name, email, issued: "No" });
    return true;
  } catch (error: any) {
    console.error('Google Sheets Error:', {
      sheetId: process.env.GOOGLE_SHEET_ID,
      error: error.message
    });
    throw error;
  }
}

export async function processUnissuedBadges() {
  const sheet = await initializeSheet();
  await sheet.loadHeaderRow();
  return await sheet.getRows();
}