# Google Spreadsheet Integration Setup Guide

## Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Nomad Crew Registrations" or any name you prefer
4. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
   The ID is the long string between `/d/` and `/edit`

## Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default `myFunction()` code
4. Copy and paste the entire content from `google-apps-script.js` file
5. Update the `SPREADSHEET_ID` variable with your actual spreadsheet ID:
   ```javascript
   const SPREADSHEET_ID = 'your_actual_spreadsheet_id_here';
   ```
6. Optionally, update the admin email for notifications:
   ```javascript
   const adminEmail = 'your-email@example.com';
   ```
7. Save the project (Ctrl+S) and give it a name like "Nomad Registration Handler"

## Step 3: Deploy the Web App

1. In Google Apps Script, click "Deploy" → "New deployment"
2. Click the gear icon next to "Type" and select "Web app"
3. Set the following configurations:
   - **Description**: "Nomad Registration Form Handler"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click "Deploy"
5. You may need to authorize the script:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to [Project Name] (unsafe)"
   - Click "Allow"
6. Copy the Web App URL provided (it will look like this):
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

## Step 4: Update Your Website

1. Open your `script.js` file
2. Find this line:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the Web App URL you copied

## Step 5: Test the Integration

1. Open your website in a browser
2. Click any "Register" button
3. Fill out the registration form
4. Submit the form
5. Check your Google Spreadsheet - the data should appear automatically!

## What Happens When Someone Registers:

1. **Form Submission**: User fills out and submits the registration form
2. **Data Processing**: JavaScript validates the form and sends data to Google Apps Script
3. **Spreadsheet Update**: Google Apps Script writes the data to your spreadsheet in real-time
4. **Email Notification**: (Optional) You receive an email notification about the new registration
5. **User Confirmation**: User sees a success message

## Spreadsheet Columns:

The spreadsheet will automatically create these columns:
- Timestamp
- Tour Name
- Full Name
- Email
- Phone
- Emergency Contact
- Emergency Phone
- Number of Participants
- Dietary Requirements
- Special Requests
- Terms Accepted
- Newsletter Subscription

## Optional Enhancements:

### Email Notifications
To enable email notifications when new registrations are received:
1. Uncomment this line in the Google Apps Script:
   ```javascript
   // MailApp.sendEmail(adminEmail, subject, body);
   ```
   Change it to:
   ```javascript
   MailApp.sendEmail(adminEmail, subject, body);
   ```

### Multiple Sheets
You can modify the script to create separate sheets for different tours by changing the sheet name based on the tour name.

### Data Validation
The script includes basic error handling and will log errors for debugging.

## Troubleshooting:

### If the form doesn't submit:
1. Check the browser console for errors (F12 → Console)
2. Verify the Google Apps Script URL is correct
3. Make sure the Google Apps Script is deployed with "Anyone" access

### If data doesn't appear in spreadsheet:
1. Check the Google Apps Script execution log for errors
2. Verify the spreadsheet ID is correct
3. Make sure the script has permission to access the spreadsheet

### CORS Issues:
The script uses `mode: 'no-cors'` to avoid CORS issues, which is why we don't get a detailed response from the server.

## Security Note:
Since the web app is set to "Anyone" access, make sure not to include sensitive operations in the script. The current setup only writes registration data, which is appropriate for this use case.
