
const asyncHandler = (functionToCall:() => {}) => async () => {
  try {
    await functionToCall();
  } catch (error) {
    
  }
};
