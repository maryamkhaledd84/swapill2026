// REFRESH SUPABASE CLIENT CONNECTION
// Run this in browser console to refresh Supabase client cache

// Clear any cached data
if (typeof window !== 'undefined') {
  // Clear any existing Supabase client cache
  localStorage.removeItem('supabase.auth.token');
  localStorage.removeItem('supabase.auth.refreshToken');
  
  // Clear any user data cache
  localStorage.removeItem('swapill_user');
  
  console.log('=== SUPABASE CLIENT CACHE CLEARED ===');
  console.log('Please refresh the page and try saving a skill again');
  
  // Optionally reload the page
  // window.location.reload();
}
