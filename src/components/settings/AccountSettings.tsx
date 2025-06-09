
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook } from "lucide-react";
import { UserProfile } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AccountSettingsProps {
  profile: UserProfile;
}

export const AccountSettings = ({ profile }: AccountSettingsProps) => {
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
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
      } catch (error) {
        console.error("Error fetching user identities:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserIdentities();
  }, []);
  
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
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account settings and connected services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Connected Accounts</h3>
            <p className="text-sm text-gray-500">
              Manage your connected social accounts and sign-in methods.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-6 w-6 border-4 border-blue-700 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="border rounded-md">
              <div className="flex items-center justify-between p-4 border-b">
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
                  <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200">Connected</Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleConnectGoogle}>Connect</Button>
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <Facebook className="text-blue-600" />
                  <div>
                    <p className="font-medium">Facebook</p>
                    <p className="text-xs text-gray-500">Sign in with Facebook</p>
                  </div>
                </div>
                {providers.includes('facebook') ? (
                  <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200">Connected</Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleConnectFacebook}>Connect</Button>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Password</h3>
            <p className="text-sm text-gray-500">
              Update your password to keep your account secure.
            </p>
            <Button variant="outline">Change Password</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
