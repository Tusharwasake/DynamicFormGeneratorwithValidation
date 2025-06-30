import React, { useState } from "react";

const DynamicForm = ({ schema }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Handle input changes
  const handleInputChange = (name, value, type) => {
    let processedValue = value;

    // Process value based on type
    if (type === "number") {
      processedValue = value === "" ? "" : Number(value);
    } else if (type === "checkbox") {
      processedValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate individual field
  const validateField = (field, value) => {
    const fieldErrors = [];

    // Check required fields
    if (
      field.required &&
      (value === undefined || value === null || value === "")
    ) {
      fieldErrors.push(`${field.label} is required`);
      return fieldErrors;
    }

    // Skip validation if value is empty and field is not required
    if (
      !field.required &&
      (value === undefined || value === null || value === "")
    ) {
      return fieldErrors;
    }

    // Type-specific validations
    switch (field.type) {
      case "text":
        if (field.minLength && value.length < field.minLength) {
          fieldErrors.push(
            `${field.label} must be at least ${field.minLength} characters long`
          );
        }
        if (field.maxLength && value.length > field.maxLength) {
          fieldErrors.push(
            `${field.label} must be no more than ${field.maxLength} characters long`
          );
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          fieldErrors.push(`${field.label} must be a valid email address`);
        }
        if (field.minLength && value.length < field.minLength) {
          fieldErrors.push(
            `${field.label} must be at least ${field.minLength} characters long`
          );
        }
        if (field.maxLength && value.length > field.maxLength) {
          fieldErrors.push(
            `${field.label} must be no more than ${field.maxLength} characters long`
          );
        }
        break;

      case "number":
        if (isNaN(value)) {
          fieldErrors.push(`${field.label} must be a valid number`);
        } else {
          if (field.min !== undefined && value < field.min) {
            fieldErrors.push(`${field.label} must be at least ${field.min}`);
          }
          if (field.max !== undefined && value > field.max) {
            fieldErrors.push(
              `${field.label} must be no more than ${field.max}`
            );
          }
        }
        break;

      case "select":
        if (!field.options || !field.options.includes(value)) {
          fieldErrors.push(
            `${field.label} must be one of the available options`
          );
        }
        break;

      default:
        break;
    }

    return fieldErrors;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    schema.forEach((field) => {
      const fieldErrors = validateField(field, formData[field.name]);
      if (fieldErrors.length > 0) {
        newErrors[field.name] = fieldErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const response = await fetch("http://localhost:3000/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schema: schema,
          data: formData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmissionResult({
          success: true,
          message: result.message,
          data: formData,
        });
        console.log("Form submitted successfully:", formData);
      } else {
        setSubmissionResult({
          success: false,
          message: result.message,
          errors: result.errors,
        });
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        message:
          "Failed to submit form. Please make sure the backend server is running.",
        error: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form field based on type
  const renderField = (field) => {
    const fieldError = errors[field.name];
    const fieldValue = formData[field.name] || "";

    const commonClasses =
      "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const errorClasses = fieldError ? "border-red-500" : "border-gray-300";

    switch (field.type) {
      case "text":
      case "email":
        return (
          <div key={field.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={fieldValue}
              onChange={(e) =>
                handleInputChange(field.name, e.target.value, field.type)
              }
              className={`${commonClasses} ${errorClasses}`}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {fieldError && (
              <div className="mt-1">
                {fieldError.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              name={field.name}
              value={fieldValue}
              onChange={(e) =>
                handleInputChange(field.name, e.target.value, field.type)
              }
              className={`${commonClasses} ${errorClasses}`}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              min={field.min}
              max={field.max}
            />
            {fieldError && (
              <div className="mt-1">
                {fieldError.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              name={field.name}
              value={fieldValue}
              onChange={(e) =>
                handleInputChange(field.name, e.target.value, field.type)
              }
              className={`${commonClasses} ${errorClasses}`}
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {fieldError && (
              <div className="mt-1">
                {fieldError.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.name} className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name={field.name}
                checked={fieldValue || false}
                onChange={(e) =>
                  handleInputChange(field.name, e.target.checked, field.type)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {fieldError && (
              <div className="mt-1">
                {fieldError.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div key={field.name} className="mb-6">
            <p className="text-red-500">Unsupported field type: {field.type}</p>
          </div>
        );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dynamic Form</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {schema.map(renderField)}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            {isSubmitting ? "Submitting..." : "Submit Form"}
          </button>
        </div>
      </form>

      {/* Submission Result */}
      {submissionResult && (
        <div
          className={`mt-8 p-6 rounded-lg ${
            submissionResult.success
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <h3
            className={`font-semibold mb-4 ${
              submissionResult.success ? "text-green-900" : "text-red-900"
            }`}
          >
            {submissionResult.success ? "Success!" : "Submission Failed"}
          </h3>

          <p
            className={`mb-4 ${
              submissionResult.success ? "text-green-700" : "text-red-700"
            }`}
          >
            {submissionResult.message}
          </p>

          {submissionResult.success && (
            <div>
              <h4 className="font-medium text-green-900 mb-2">
                Submitted Data:
              </h4>
              <pre className="bg-green-100 p-4 rounded text-sm overflow-x-auto text-green-800">
                {JSON.stringify(submissionResult.data, null, 2)}
              </pre>
            </div>
          )}

          {submissionResult.errors && (
            <div>
              <h4 className="font-medium text-red-900 mb-2">
                Validation Errors:
              </h4>
              <pre className="bg-red-100 p-4 rounded text-sm overflow-x-auto text-red-800">
                {JSON.stringify(submissionResult.errors, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
