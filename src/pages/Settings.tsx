
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  location?: string;
  bio?: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("sahiraah_user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setProfile(userData);
      
      // Initialize form fields
      setName(userData.name || "");
      setEmail(userData.email || "");
      setLocation(userData.location || "");
      setBio(userData.bio || "");
      setProfilePicture(userData.profilePicture || "");
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleSaveProfile = () => {
    setSaving(true);
    
    // Update profile in local storage
    const updatedProfile = {
      ...profile,
      name,
      email,
      location,
      bio,
      profilePicture
    };
    
    try {
      localStorage.setItem("sahiraah_user", JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-blue-900 text-xl">Loading...</div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Account Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and how others see you on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Avatar className="w-24 h-24">
                  {profilePicture ? (
                    <AvatarImage src={profilePicture} alt={name} />
                  ) : (
                    <AvatarFallback className="text-xl">{getInitials(name)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Profile Picture</h3>
                  <p className="text-sm text-gray-500">
                    This will be displayed on your profile and in your posts.
                  </p>
                  <Input
                    type="text"
                    placeholder="Profile picture URL"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                    className="max-w-md"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 py-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Your location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-blue-700 hover:bg-blue-800"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
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
                    {profile?.id?.startsWith('Google') ? (
                      <Button variant="outline" size="sm">Connected</Button>
                    ) : (
                      <Button variant="outline" size="sm">Connect</Button>
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
                    {profile?.id?.startsWith('Facebook') ? (
                      <Button variant="outline" size="sm">Connected</Button>
                    ) : (
                      <Button variant="outline" size="sm">Connect</Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                        <path fill="#5f01d1" d="M223.69,141.06H132l91.6,161.87Zm-91.6,229.87h91.67l-91.6-161.93Zm231.55-229.87h-91.6l91.6,161.87Zm0,229.87L272,230.67l-57.41,101.33L156.26,232.34,256,51.52l99.8,180.82L449,141.13,351.62,434.93l-91.55-161.87Z"/>
                      </svg>
                      <div>
                        <p className="font-medium">Yahoo</p>
                        <p className="text-xs text-gray-500">Sign in with Yahoo</p>
                      </div>
                    </div>
                    {profile?.id?.startsWith('Yahoo') ? (
                      <Button variant="outline" size="sm">Connected</Button>
                    ) : (
                      <Button variant="outline" size="sm">Connect</Button>
                    )}
                  </div>
                </div>
                
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
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your experience and notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Preferences settings will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
