// Function to get the userId from localStorage
export const getUserId = (): string | null => {
    let userId
    if (typeof window !== 'undefined') {
        const userId = localStorage.getItem('userId');
    console.log(`userId in util is ${userId}`);
    return userId;
    
  }
  return null; // Return null when running on the server
};

// Use this function for protected routes
 