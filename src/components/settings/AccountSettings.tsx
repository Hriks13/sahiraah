
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Eye, EyeOff, Mail, Shield } from "lucide-react";
import { UserProfile } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AccountSettingsProps {
  profile: UserProfile;
}

export const AccountSettings = ({ profile }: AccountSettingsProps) => {
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  useEffect(() => {
    const fetchUserIdentities = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return;
        }
        
        // Get user's identities (connected providers)
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.identities) {
          const connectedProviders = user.identities.map(i => i.provider);
          setProviders(connectedProviders);
        }

        // Check if email is verified
        if (user?.email_confirmed_at) {
          setIsEmailVerified(true);
        }
      } catch (error) {
        console.error("Error fetching user identities:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserIdentities();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    setEmailVerificationLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: profile.email,
        options: {
          emailRedirectTo: `${window.location.origin}/settings`
        }
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your email and click the verification link.",
      });
    } catch (error: any) {
      toast({
        title: "Error sending verification email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setEmailVerificationLoading(false);
    }
  };
  
  const handleConnectGoogle = async () => {
    if (providers.includes('google')) {
      toast({
        title: "Already connected",
        description: "Your account is already connected to Google",
      });
      return;
    }
    
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/settings',
        }
      });
    } catch (error) {
      console.error("Error connecting Google:", error);
      toast({
        title: "Connection failed",
        description: "Could not connect to Google. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleConnectFacebook = async () => {
    if (providers.includes('facebook')) {
      toast({
        title: "Already connected",
        description: "Your account is already connected to Facebook",
      });
      return;
    }
    
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin + '/settings',
        }
      });
    } catch (error) {
      console.error("Error connecting Facebook:", error);
      toast({
        title: "Connection failed",
        description: "Could not connect to Facebook. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings and verification status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Verification Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Verification
                </h3>
                <p className="text-sm text-gray-500">
                  {isEmailVerified ? "Your email is verified" : "Verify your email for better security"}
                </p>
              </div>
              {!isEmailVerified && (
                <Button 
                  onClick={handleEmailVerification}
                  disabled={emailVerificationLoading}
                  className="w-full sm:w-auto"
                >
                  {emailVerificationLoading ? "Sending..." : "Send Verification Email"}
                </Button>
              )}
              {isEmailVerified && (
                <div className="flex items-center gap-2 text-green-600">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Password Change Section */}
          <div className="space-y-4">
            <h3 className="text-base font-medium">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={passwordLoading || !passwordForm.newPassword || !passwordForm.confirmPassword}
                className="w-full sm:w-auto"
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage your connected social accounts and sign-in methods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-6 w-6 border-4 border-blue-700 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="border rounded-md divide-y">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    <path d="M1 1h22v22H1z" fill="none"/>
                  </svg>
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-xs text-gray-500">Sign in with Google</p>
                  </div>
                </div>
                {providers.includes('google') ? (
                  <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200 w-full sm:w-auto">
                    Connected
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleConnectGoogle} className="w-full sm:w-auto">
                    Connect
                  </Button>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                <div className="flex items-center space-x-3">
                  <Facebook className="text-blue-600 h-6 w-6" />
                  <div>
                    <p className="font-medium">Facebook</p>
                    <p className="text-xs text-gray-500">Sign in with Facebook</p>
                  </div>
                </div>
                {providers.includes('facebook') ? (
                  <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200 w-full sm:w-auto">
                    Connected
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleConnectFacebook} className="w-full sm:w-auto">
                    Connect
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
