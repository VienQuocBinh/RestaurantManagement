import { useState } from "react";

export function useForm(getFreshModelObject) {
  const [values, setValues] = useState(getFreshModelObject());
  const [errors, setErrors] = useState({});

  // Set values to the input fields (Ex: customerId: 1)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    // console.log(name + " " + value + " ");
  };
  // console.log(values); // async -> k để bên trong handleInputChange()

  const resetFormControls = () => {
    setValues(getFreshModelObject());
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetFormControls,
  };
}
