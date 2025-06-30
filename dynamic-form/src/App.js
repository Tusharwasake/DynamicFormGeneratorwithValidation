import React, { useState } from "react";
import DynamicForm from "./components/DynamicForm";

// Sample schemas for the bonus toggle feature
const schema1 = [
  {
    label: "Name",
    type: "text",
    name: "name",
    required: true,
    minLength: 3,
  },
  {
    label: "Email",
    type: "email",
    name: "email",
    required: true,
  },
  {
    label: "Age",
    type: "number",
    name: "age",
    required: false,
    min: 18,
    max: 100,
  },
  {
    label: "Gender",
    type: "select",
    name: "gender",
    required: true,
    options: ["Male", "Female", "Other"],
  },
  {
    label: "Subscribe to newsletter",
    type: "checkbox",
    name: "subscribe",
    required: false,
  },
];

const schema2 = [
  {
    label: "Company Name",
    type: "text",
    name: "company",
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  {
    label: "Business Email",
    type: "email",
    name: "businessEmail",
    required: true,
  },
  {
    label: "Employee Count",
    type: "number",
    name: "employeeCount",
    required: true,
    min: 1,
    max: 10000,
  },
  {
    label: "Industry",
    type: "select",
    name: "industry",
    required: true,
    options: [
      "Technology",
      "Healthcare",
      "Finance",
      "Education",
      "Manufacturing",
      "Other",
    ],
  },
  {
    label: "Annual Revenue",
    type: "number",
    name: "revenue",
    required: false,
    min: 0,
  },
  {
    label: "Accept Terms",
    type: "checkbox",
    name: "acceptTerms",
    required: true,
  },
];

function App() {
  const [currentSchema, setCurrentSchema] = useState(schema1);
  const [schemaName, setSchemaName] = useState("Personal Info");

  const toggleSchema = () => {
    if (currentSchema === schema1) {
      setCurrentSchema(schema2);
      setSchemaName("Business Info");
    } else {
      setCurrentSchema(schema1);
      setSchemaName("Personal Info");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dynamic Form Generator
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            A React form that dynamically generates fields based on JSON schema
            with validation
          </p>

          {/* Schema Toggle Button */}
          <button
            onClick={toggleSchema}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 mb-6"
          >
            Switch to{" "}
            {schemaName === "Personal Info" ? "Business Info" : "Personal Info"}{" "}
            Form
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Current Schema: {schemaName}
            </h3>
            <p className="text-sm text-blue-700">
              This form is dynamically generated from a JSON schema with
              validation rules
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <DynamicForm schema={currentSchema} />
        </div>

        {/* Schema Display */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">
            Current JSON Schema:
          </h3>
          <pre className="text-green-400 text-sm overflow-x-auto">
            {JSON.stringify(currentSchema, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
