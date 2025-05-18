
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import ScrollToTop from "@/components/ScrollToTop";
import { Facebook, Mail, User } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This would be replaced with actual authentication
      console.log("Login with:", email, password);
      
      // Store user info in localStorage with extended expiration
      localStorage.setItem("sahiraah_user", JSON.stringify({ 
        id: "123", 
        email, 
        name: "Demo User",
        profilePicture: "",
        location: "New York, USA",
        bio: "I am a student looking for career guidance."
      }));
      
      toast.success("Login successful!");
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulating social login
    setTimeout(() => {
      localStorage.setItem("sahiraah_user", JSON.stringify({ 
        id: `${provider}_12345`, 
        email: `user@${provider.toLowerCase()}.com`, 
        name: `${provider} User`,
        profilePicture: "",
        location: "New York, USA",
        bio: "I am a student looking for career guidance."
      }));
      
      toast.success(`${provider} login successful!`);
      navigate("/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-6 flex flex-col bg-blue-50">
      <ScrollToTop />
      
      <div className="flex-grow flex items-center justify-center px-4 py-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-blue-900">Login to SahiRaah</CardTitle>
            <CardDescription className="text-center text-blue-700">
              Enter your credentials or use a social login
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="your.email@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-blue-700 hover:text-blue-900">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-700 hover:bg-blue-800"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login with Email"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-blue-50 px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                type="button" 
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("Google")}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                className="flex items-center justify-center"
                onClick={() => handleSocialLogin("Facebook")}
                disabled={isLoading}
              >
                <Facebook className="text-blue-600" />
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                className="flex items-center justify-center"
                onClick={() => handleSocialLogin("Yahoo")}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                  <path fill="#5f01d1" d="M223.69,141.06H132l91.6,161.87Zm-91.6,229.87h91.67l-91.6-161.93Zm231.55-229.87h-91.6l91.6,161.87Zm0,229.87L272,230.67l-57.41,101.33L156.26,232.34,256,51.52l99.8,180.82L449,141.13,351.62,434.93l-91.55-161.87Z"/>
                </svg>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-700 hover:text-blue-900 font-medium">
                Sign Up
              </Link>
            </div>
            <div className="text-xs text-center text-gray-500">
              By logging in, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
              .
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
