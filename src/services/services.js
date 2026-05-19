export const addService = async () => {};
export const updateServiceStatus = async () => {};
export const getClientServices = async () => { return []; };
export const SERVICE_STEPS = {
  "GST Registration": ["Order Received", "Documents Verified", "Application Filed", "Completed"],
  "GST Return Filing": ["Order Received", "Data Collection", "Return Preparation", "Filed", "Completed"],
  "Trademark Registration": ["Order Received", "Name Search", "Application Filed", "Objection/Hearing", "Registered", "Completed"],
  "Company Incorporation": ["Order Received", "Name Approval", "Documents Signing", "Incorporation Filed", "Completed"],
  "LLP Registration": ["Order Received", "Name Approval", "Documents Signing", "Incorporation Filed", "Completed"],
  "Virtual Office": ["Order Received", "Agreement Signing", "Active", "Completed"]
};
