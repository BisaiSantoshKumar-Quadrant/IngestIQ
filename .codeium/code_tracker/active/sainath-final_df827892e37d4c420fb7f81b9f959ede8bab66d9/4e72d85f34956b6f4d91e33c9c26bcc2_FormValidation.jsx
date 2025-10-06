°import { useState } from 'react';

export const validateField = (name, value, rules = {}) => {
  const errors = {};

  if (rules.required && !value.trim()) {
    errors.required = `${name} is required`;
  }

  if (rules.email && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  if (rules.password && value) {
    if (value.length < 8) {
      errors.length = 'Password must be at least 8 characters';
    }
    
    if (!/[A-Z]/.test(value)) {
      errors.uppercase = 'Password must contain at least one uppercase letter';
    }
    
    if (!/[a-z]/.test(value)) {
      errors.lowercase = 'Password must contain at least one lowercase letter';
    }
    
    if (!/[0-9]/.test(value)) {
      errors.number = 'Password must contain at least one number';
    }
    
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
      errors.special = 'Password must contain at least one special character';
    }
  }

  if (rules.match && value !== rules.match.value) {
    errors.match = `${name} does not match ${rules.match.name}`;
  }

  if (rules.minLength && value.length < rules.minLength) {
    errors.minLength = `${name} must be at least ${rules.minLength} characters`;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.maxLength = `${name} must be less than ${rules.maxLength} characters`;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    
    if (touched[name]) {
      const fieldErrors = validateField(
        name, 
        value, 
        validationRules[name]
      );
      
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: fieldErrors
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    
    const fieldErrors = validateField(
      name, 
      value, 
      validationRules[name]
    );
    
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: fieldErrors
    }));
  };

  const validateForm = () => {
    const formErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const value = values[field] || '';
      const fieldErrors = validateField(
        field, 
        value, 
        validationRules[field]
      );
      
      if (fieldErrors) {
        formErrors[field] = fieldErrors;
      }
    });
    
    setErrors(formErrors);
    
    const allTouched = Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    return Object.keys(formErrors).length === 0;
  };

  const resetForm = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues
  };
};

export const FormError = ({ errors }) => {
  if (!errors) return null;
  
  const errorMessages = Object.values(errors);
  
  return (
    <div className="text-red-500 text-sm mt-1">
      {errorMessages.map((error, index) => (
        <div key={index}>{error}</div>
      ))}
    </div>
  );
};°"(df827892e37d4c420fb7f81b9f959ede8bab66d92¦file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/FormValidation.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final