# Government Application Form - API Integration

This document describes the API integration for the Government Application Submission System.

## API Endpoint

The form is integrated with the following API endpoint:
```
POST https://goat-govt-application-tracking-system-backend-production.up.railway.app/api/applications
```

## API Request Structure

The form submits data in the following format:

```json
{
  "name": "Ahmad Qureshi",
  "cnic": "35202-1234567-8",
  "phone": "03001234567",
  "email": "ahmad@example.com",
  "address": "123 Main Street",
  "applicationType": "6891cd64684fb9c64323baf6",
  "officer": "6891cd67eece2884e5091aff",
  "description": "Need a new electricity connection for my house.",
  "attachments": []
}
```

## Form Features

### 1. Registration Types
- **New Registration**: Requires full personal details (name, phone, email, address)
- **Existing User**: Only requires CNIC number

### 2. Form Validation
- CNIC format validation (00000-0000000-0)
- Pakistani phone number validation
- Email format validation (optional)
- Required field validation
- Description minimum length (10 characters)

### 3. Dynamic Data Loading
- Fetches available officers from `/officers` endpoint
- Fetches application types from `/application-types` endpoint
- Handles API failures gracefully with retry mechanism

### 4. User Experience
- Real-time form validation
- Character counter for description field
- Application summary before submission
- Confirmation dialog before final submission
- Success/error feedback
- Loading states and progress indicators

## API Dependencies

The form requires the following API endpoints to function:

1. **GET /officers** - Fetch available officers
2. **GET /application-types** - Fetch available application types
3. **POST /applications** - Submit new application

## Error Handling

The form includes comprehensive error handling for:
- Network errors
- API endpoint failures
- Validation errors
- Server errors
- User input errors

## File Upload

Currently, file attachments are collected but not uploaded to the API. The `attachments` field is sent as an empty array. Future implementation can include:
- File upload to cloud storage
- File validation
- Progress tracking
- File size limits

## Styling

The form uses a government-themed design with:
- Green color scheme (#00ce5a)
- Professional typography
- Responsive grid layout
- Material-UI components
- Custom styled components

## Usage

1. Fill in the required fields based on registration type
2. Select application type and assigned officer
3. Provide detailed description
4. Optionally attach supporting documents
5. Review application summary
6. Confirm submission
7. Receive confirmation with application ID

## Technical Implementation

- Built with React and Material-UI
- Uses axios for API communication
- Implements proper error boundaries
- Includes loading states and user feedback
- Responsive design for mobile and desktop
- Form validation and error handling
- Confirmation dialogs for user safety

## Future Enhancements

- File upload integration
- Application status tracking
- User authentication
- Application history
- Email notifications
- SMS confirmations
- Multi-language support
