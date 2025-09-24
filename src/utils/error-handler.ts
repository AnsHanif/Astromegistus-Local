// utils/errorHandler.ts
export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message; // backend custom error
  }

  if (error?.response?.data?.error) {
    return error.response.data.error; // sometimes backend sends "error"
  }

  if (error?.message) {
    return error.message; // Axios / JS error
  }

  return 'Something went wrong. Please try again.'; // fallback
};
