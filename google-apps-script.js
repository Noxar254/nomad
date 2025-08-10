/**
 * Google Apps Script for Nomad Crew Registration Form
 * This script receives form data and writes it to a Google Spreadsheet
 * 
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Update the SPREADSHEET_ID with your Google Sheets ID
 * 5. Deploy as a web app with execute permissions for "Anyone"
 * 6. Copy the web app URL and update it in script.js
 */

// Replace with your Google Spreadsheet ID
// You can find this in the URL of your Google Sheet: 
// https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
const SPREADSHEET_ID = '1I3OdD91L80rM_hWatOV5RXAnTrXi0MLmqZpo7AGbkL8';

// Main function that handles POST requests
function doPost(e) {
  try {
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Write data to spreadsheet
    writeToSpreadsheet(data);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Registration data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error for debugging
    console.error('Error processing registration:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to save registration data'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to write data to the spreadsheet
function writeToSpreadsheet(data) {
  try {
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Get or create the 'Registrations' sheet
    let sheet = spreadsheet.getSheetByName('Registrations');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Registrations');
      
      // Add headers if this is a new sheet
      const headers = [
        'Timestamp',
        'Tour Name',
        'Full Name',
        'Email',
        'Phone',
        'Emergency Contact',
        'Emergency Phone',
        'Participants',
        'Dietary Requirements',
        'Special Requests',
        'Terms Accepted',
        'Newsletter Subscription'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format the header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#2ECC71');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }
    
    // Prepare the row data
    const rowData = [
      data.timestamp,
      data.tourName,
      data.fullName,
      data.email,
      data.phone,
      data.emergencyContact,
      data.emergencyPhone,
      data.participants,
      data.dietary,
      data.specialRequests,
      data.terms,
      data.newsletter
    ];
    
    // Add the new row
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, rowData.length);
    
    // Send email notification (optional)
    sendEmailNotification(data);
    
  } catch (error) {
    console.error('Error writing to spreadsheet:', error);
    throw error;
  }
}

// Optional: Send email notification when a new registration is received
function sendEmailNotification(data) {
  try {
    // Replace with your email address
    const adminEmail = 'your-email@example.com';
    
    const subject = `New Registration: ${data.tourName} - ${data.fullName}`;
    
    const body = `
New tour registration received:

Tour: ${data.tourName}
Participant: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Number of Participants: ${data.participants}

Emergency Contact: ${data.emergencyContact} (${data.emergencyPhone})

Dietary Requirements: ${data.dietary}
Special Requests: ${data.specialRequests}

Terms Accepted: ${data.terms}
Newsletter Subscription: ${data.newsletter}

Registration Time: ${data.timestamp}

Please follow up with the participant to confirm booking and provide payment details.
    `;
    
    // Send email (uncomment the line below and replace with your email)
    // MailApp.sendEmail(adminEmail, subject, body);
    
  } catch (error) {
    console.error('Error sending email notification:', error);
    // Don't throw error here as email failure shouldn't stop the registration
  }
}

// Test function to verify the script works (for debugging)
function testScript() {
  const testData = {
    timestamp: new Date().toLocaleString(),
    tourName: 'Test Tour',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+254700000000',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+254700000001',
    participants: '2',
    dietary: 'No allergies',
    specialRequests: 'None',
    terms: 'Yes',
    newsletter: 'Yes'
  };
  
  writeToSpreadsheet(testData);
  console.log('Test data written successfully');
}
