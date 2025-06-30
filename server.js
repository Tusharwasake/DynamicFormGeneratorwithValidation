import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// In-memory storage for submissions
let submissions = [];

// Validation functions
const validateField = (field, value, schema) => {
  const errors = [];

  // Check if required field is missing
  if (
    schema.required &&
    (value === undefined || value === null || value === "")
  ) {
    errors.push(`${schema.label} is required`);
    return errors;
  }

  // Skip validation if value is empty and field is not required
  if (
    !schema.required &&
    (value === undefined || value === null || value === "")
  ) {
    return errors;
  }

  // Type-specific validations
  switch (schema.type) {
    case "text":
      if (typeof value !== "string") {
        errors.push(`${schema.label} must be a string`);
      } else {
        if (schema.minLength && value.length < schema.minLength) {
          errors.push(
            `${schema.label} must be at least ${schema.minLength} characters long`
          );
        }
        if (schema.maxLength && value.length > schema.maxLength) {
          errors.push(
            `${schema.label} must be no more than ${schema.maxLength} characters long`
          );
        }
      }
      break;

    case "email":
      if (typeof value !== "string") {
        errors.push(`${schema.label} must be a string`);
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`${schema.label} must be a valid email address`);
        }
        if (schema.minLength && value.length < schema.minLength) {
          errors.push(
            `${schema.label} must be at least ${schema.minLength} characters long`
          );
        }
        if (schema.maxLength && value.length > schema.maxLength) {
          errors.push(
            `${schema.label} must be no more than ${schema.maxLength} characters long`
          );
        }
      }
      break;

    case "number":
      const numValue = Number(value);
      if (isNaN(numValue)) {
        errors.push(`${schema.label} must be a valid number`);
      } else {
        if (schema.min !== undefined && numValue < schema.min) {
          errors.push(`${schema.label} must be at least ${schema.min}`);
        }
        if (schema.max !== undefined && numValue > schema.max) {
          errors.push(`${schema.label} must be no more than ${schema.max}`);
        }
      }
      break;

    case "select":
      if (!schema.options || !schema.options.includes(value)) {
        errors.push(
          `${schema.label} must be one of: ${
            schema.options ? schema.options.join(", ") : "valid options"
          }`
        );
      }
      break;

    case "checkbox":
      if (typeof value !== "boolean") {
        errors.push(`${schema.label} must be a boolean value`);
      }
      break;

    default:
      errors.push(`Unknown field type: ${schema.type}`);
  }

  return errors;
};

const validateFormData = (schema, data) => {
  const errors = {};

  // Validate each field in the schema
  schema.forEach((fieldSchema) => {
    const fieldErrors = validateField(
      fieldSchema.name,
      data[fieldSchema.name],
      fieldSchema
    );
    if (fieldErrors.length > 0) {
      errors[fieldSchema.name] = fieldErrors;
    }
  });

  return errors;
};

// Routes
app.post("/submit-form", async (req, res) => {
  try {
    const { schema, data } = req.body;

    // Validate request body
    if (!schema || !Array.isArray(schema)) {
      return res.status(400).json({
        success: false,
        message: "Schema is required and must be an array",
      });
    }

    if (!data || typeof data !== "object") {
      return res.status(400).json({
        success: false,
        message: "Data is required and must be an object",
      });
    }

    // Validate form data against schema
    const validationErrors = validateFormData(schema, data);

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Store the submission
    const submission = {
      id: submissions.length + 1,
      timestamp: new Date().toISOString(),
      schema,
      data,
    };

    submissions.push(submission);

    res.status(200).json({
      success: true,
      message: "Form submitted successfully",
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Error processing form submission:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Bonus: Get all submissions
app.get("/submissions", (req, res) => {
  res.json({
    success: true,
    submissions: submissions.map((sub) => ({
      id: sub.id,
      timestamp: sub.timestamp,
      data: sub.data,
    })),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Form API is running" });
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
  console.log("Available endpoints:");
  console.log("  POST /submit-form - Submit form data");
  console.log("  GET /submissions - List all submissions");
  console.log("  GET /health - Health check");
});
