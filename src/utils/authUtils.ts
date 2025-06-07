
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Enhanced auth state cleanup with more thorough cleaning
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  localStorage.removeItem('sahiraah_user');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.startsWith('__supabase')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.startsWith('__supabase')) {
      sessionStorage.removeItem(key);
    }
  });
  
  // Clear any OAuth state
  localStorage.removeItem('oauth_state');
  localStorage.removeItem('oauth_code_verifier');
};

// Enhanced OAuth provider type with better error handling
type ExtendedProvider = 'google' | 'facebook' | 'yahoo';

// Secure OAuth login with enhanced error handling and HTTPS enforcement
export const handleSecureOAuthLogin = async (provider: ExtendedProvider) => {
  try {
    // Ensure HTTPS in production
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isSecure && window.location.hostname !== 'localhost') {
      throw new Error('OAuth requires HTTPS. Please use a secure connection.');
    }

    // Clean up existing auth state
    cleanupAuthState();
    
    // Global sign out to clear any existing sessions
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.log('No existing session to clear');
    }

    // Configure OAuth with enhanced security options
    const redirectTo = `${window.location.origin}/dashboard`;
    
    const oauthOptions = {
      redirectTo,
      options: {
        redirectTo,
        scopes: provider === 'google' 
          ? 'openid profile email' 
          : provider === 'facebook' 
          ? 'email public_profile' 
          : 'openid profile email',
        skipBrowserRedirect: false,
        queryParams: {
          access_type: 'offline', // Enable refresh tokens
          prompt: 'select_account', // Allow account selection
        }
      }
    };

    console.log(`Initiating secure ${provider} OAuth flow...`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      ...oauthOptions
    });
    
    if (error) {
      throw error;
    }

    if (data?.url) {
      // Store OAuth state for security verification
      const state = crypto.randomUUID();
      localStorage.setItem('oauth_state', state);
      localStorage.setItem('oauth_provider', provider);
      
      // Redirect to OAuth provider
      window.location.href = data.url;
    }

    return { success: true };
  } catch (error: any) {
    console.error(`${provider} OAuth error:`, error);
    
    // Enhanced error messages
    let errorMessage = `Could not sign in with ${provider}`;
    if (error.message?.includes('HTTPS')) {
      errorMessage = 'Secure connection required for OAuth login';
    } else if (error.message?.includes('redirect')) {
      errorMessage = 'OAuth redirect configuration error';
    } else if (error.message?.includes('scope')) {
      errorMessage = 'OAuth permission scope error';
    }
    
    toast({
      title: "Authentication Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    return { success: false, error: errorMessage };
  }
};

// Handle OAuth callback with enhanced security checks
export const handleOAuthCallback = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = localStorage.getItem('oauth_state');
    const provider = localStorage.getItem('oauth_provider');

    // Verify state parameter for security
    if (state && storedState && state !== storedState) {
      throw new Error('OAuth state mismatch - possible CSRF attack');
    }

    if (code) {
      console.log('Processing OAuth callback...');
      
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        throw error;
      }

      if (data.session) {
        // Store user data and cleanup OAuth state
        localStorage.setItem("sahiraah_user", JSON.stringify(data.session.user));
        localStorage.removeItem('oauth_state');
        localStorage.removeItem('oauth_provider');
        
        // Show welcome message
        toast({
          title: "Welcome back!",
          description: `Successfully signed in with ${provider || 'OAuth provider'}`,
        });

        // Redirect to dashboard
        window.location.href = '/dashboard';
        return { success: true };
      }
    }

    return { success: false };
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    
    // Cleanup OAuth state on error
    localStorage.removeItem('oauth_state');
    localStorage.removeItem('oauth_provider');
    
    toast({
      title: "Authentication Error",
      description: error.message || "OAuth authentication failed",
      variant: "destructive",
    });
    
    return { success: false, error: error.message };
  }
};

// Email/password signup with enhanced security
export const handleSecureSignup = async (email: string, password: string, name?: string) => {
  try {
    // Clean up existing auth state
    cleanupAuthState();
    
    // Global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.log('No existing session to clear');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: name ? { name } : {},
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      throw error;
    }
    
    if (data.user) {
      toast({
        title: "Account created successfully!",
        description: "Please check your email to confirm your account.",
      });
      return { success: true };
    }
    
    return { success: false };
  } catch (error: any) {
    console.error("Signup error:", error);
    
    let errorMessage = "Failed to create account";
    if (error.message?.includes('already registered')) {
      errorMessage = "An account with this email already exists";
    } else if (error.message?.includes('password')) {
      errorMessage = "Password must be at least 6 characters long";
    }
    
    toast({
      title: "Signup Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    return { success: false, error: errorMessage };
  }
};

// Email/password login with enhanced security
export const handleSecureLogin = async (email: string, password: string) => {
  try {
    // Clean up existing auth state
    cleanupAuthState();
    
    // Global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.log('No existing session to clear');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    if (data.user && data.session) {
      // Store user data
      localStorage.setItem("sahiraah_user", JSON.stringify(data.user));
      
      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
      });

      // Force page reload to ensure clean state
      window.location.href = "/dashboard";
      return { success: true };
    }
    
    return { success: false };
  } catch (error: any) {
    console.error("Login error:", error);
    
    let errorMessage = "Invalid email or password";
    if (error.message?.includes('Email not confirmed')) {
      errorMessage = "Please check your email and confirm your account";
    } else if (error.message?.includes('Invalid login credentials')) {
      errorMessage = "Invalid email or password";
    }
    
    toast({
      title: "Login Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    return { success: false, error: errorMessage };
  }
};
