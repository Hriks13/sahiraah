import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaYahoo } from "react-icons/fa";
import { 
  handleSecureOAuthLogin, 
  handleSecureLogin, 
  handleSecureSignup, 
  handleOAuthCallback 
} from "@/utils/authUtils";

// Helper function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Define a type that includes 'yahoo' as a valid provider
type ExtendedProvider = 'google' | 'facebook' | 'twitter' | 'apple' | 'github' | 'gitlab' | 'bitbucket' | 'azure' | 'discord' | 'linkedin' | 'slack' | 'spotify' | 'workos' | 'yahoo';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const navigate = useNavigate();

  // Check if already logged in or handle OAuth callback
  useEffect(() => {
    const init = async () => {
      // Handle OAuth callback first
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('code')) {
        const result = await handleOAuthCallback();
        if (result.success) {
          return; // Will redirect to dashboard
        }
      }

      // Check existing session
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard", { replace: true });
      }
    };
    
    init();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsLoading(true);
    await handleSecureLogin(email, password);
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupEmail || !signupPassword) {
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      return;
    }
    
    setIsLoading(true);
    const result = await handleSecureSignup(signupEmail, signupPassword);
    if (result.success) {
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
    }
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'yahoo') => {
    setSocialLoading(provider);
    const result = await handleSecureOAuthLogin(provider);
    if (!result.success) {
      setSocialLoading("");
    }
    // If successful, the function will redirect
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-blue-900">SahiRaah</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-blue-700 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-700 hover:bg-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#f0f6ff] px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 hover:bg-blue-50"
                    onClick={() => handleSocialLogin('google')}
                    disabled={!!socialLoading}
                  >
                    <FcGoogle className="h-5 w-5" />
                    {socialLoading === 'google' && <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 hover:bg-blue-50"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={!!socialLoading}
                  >
                    <FaFacebook className="h-5 w-5 text-blue-600" />
                    {socialLoading === 'facebook' && <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 hover:bg-blue-50"
                    onClick={() => handleSocialLogin('yahoo')}
                    disabled={!!socialLoading}
                  >
                    <FaYahoo className="h-5 w-5 text-purple-600" />
                    {socialLoading === 'yahoo' && <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-700 hover:bg-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#f0f6ff] px-2 text-gray-500">Or sign up with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 hover:bg-blue-50"
                    onClick={() => handleSocialLogin('google')}
                    disabled={!!socialLoading}
                  >
                    <FcGoogle className="h-5 w-5" />
                    {socialLoading === 'google' && <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 hover:bg-blue-50"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={!!socialLoading}
                  >
                    <FaFacebook className="h-5 w-5 text-blue-600" />
                    {socialLoading === 'facebook' && <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 hover:bg-blue-50"
                    onClick={() => handleSocialLogin('yahoo')}
                    disabled={!!socialLoading}
                  >
                    <FaYahoo className="h-5 w-5 text-purple-600" />
                    {socialLoading === 'yahoo' && <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-blue-700 hover:underline">Terms</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-700 hover:underline">Privacy Policy</Link>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
