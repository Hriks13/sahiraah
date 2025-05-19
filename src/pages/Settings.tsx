
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { PreferencesSettings } from "@/components/settings/PreferencesSettings";
import { UserProfile } from "@/types/user";

const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    try {
      localStorage.setItem("sahiraah_user", JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-blue-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Account Settings</h1>
      
      {profile && (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileForm profile={profile} onProfileUpdate={handleProfileUpdate} />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountSettings profile={profile} />
          </TabsContent>
          
          <TabsContent value="preferences">
            <PreferencesSettings />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Settings;
