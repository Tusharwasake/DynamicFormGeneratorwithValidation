# Dynamic Form Generator

A React application that dynamically generates forms from JSON schemas with validation.

## Features

- **Dynamic Form Generation**: Creates form fields based on JSON schema
- **Multiple Field Types**: Supports text, email, number, select, and checkbox fields
- **Real-time Validation**: Validates fields based on schema constraints
- **Error Display**: Shows validation errors inline
- **Schema Toggle**: Switch between different form schemas (bonus feature)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Backend Integration**: Submits form data to API endpoint

## Supported Field Types

- `text` - Text input with minLength/maxLength validation
- `email` - Email input with email format validation
- `number` - Number input with min/max validation
- `select` - Dropdown with predefined options
- `checkbox` - Boolean checkbox input

## Schema Constraints

- `required`: Boolean - Makes field mandatory
- `minLength`/`maxLength`: For text and email fields
- `min`/`max`: For number fields
- `options`: Array of strings for select fields

## Setup Instructions

### Prerequisites

- Node.js (version 14+)
- npm or yarn

### Installation

1. Navigate to the dynamic-form directory:

```bash
cd dynamic-form
```

2. Install dependencies:

```bash
npm install
```

3. Start the React development server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Backend Server

Make sure the backend API is running on `http://localhost:3000` for form submission to work.

## Project Structure

```
dynamic-form/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── DynamicForm.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Usage

1. The app loads with a default personal information form
2. Fill out the form fields according to the validation rules
3. Click "Submit Form" to send data to the backend
4. Use the "Switch to Business Info" button to toggle between schemas
5. View the current JSON schema at the bottom of the page

## Sample JSON Schema

```json
[
  {
    "label": "Name",
    "type": "text",
    "name": "name",
    "required": true,
    "minLength": 3
  },
  {
    "label": "Email",
    "type": "email",
    "name": "email",
    "required": true
  },
  {
    "label": "Age",
    "type": "number",
    "name": "age",
    "required": false,
    "min": 18,
    "max": 100
  },
  {
    "label": "Gender",
    "type": "select",
    "name": "gender",
    "required": true,
    "options": ["Male", "Female", "Other"]
  },
  {
    "label": "Subscribe to newsletter",
    "type": "checkbox",
    "name": "subscribe",
    "required": false
  }
]
```

## Form Validation

The form validates:

- Required fields are not empty
- Email fields have valid email format
- Text fields meet minLength/maxLength requirements
- Number fields are within min/max range
- Select fields have valid options selected

## Technologies Used

- React 18
- Tailwind CSS (via CDN)
- Modern ES6+ JavaScript
- Fetch API for HTTP requests

## Browser Support

Modern browsers supporting ES6+ features:

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
