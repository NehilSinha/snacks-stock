// Simple user session management for order tracking
export const getUserId = () => {
  if (typeof window === 'undefined') return null;
  
  let userId = localStorage.getItem('userId');
  if (!userId) {
    // Generate a simple user ID based on timestamp and random number
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
};

export const clearUserSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userId');
  }
};