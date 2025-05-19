
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BookIcon, BellIcon } from "lucide-react";

interface PreferencesSettingsProps {
  userId?: string;
}

export const PreferencesSettings = ({ userId }: PreferencesSettingsProps) => {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [careerReason, setCareerReason] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

  useEffect(() => {
    // Load selected career path from local storage for specific user
    if (userId) {
      const userStr = localStorage.getItem(`sahiraah_user_career_${userId}`);
      if (userStr) {
        try {
          const careerData = JSON.parse(userStr);
          setSelectedCareer(careerData.career);
          setCareerReason(careerData.reason);
        } catch (error) {
          console.error("Error parsing career data:", error);
        }
      }

      // Also check if this data is in the user object
      const userData = localStorage.getItem("sahiraah_user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.selectedCareer) {
            setSelectedCareer(user.selectedCareer.career);
            setCareerReason(user.selectedCareer.reason);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Customize your experience and notification settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Career Path */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Selected Career Path</h3>
          <div className="flex items-center gap-2">
            {selectedCareer ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <BookIcon className="h-5 w-5 text-blue-700" />
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {selectedCareer}
                  </Badge>
                </div>
                {careerReason && (
                  <p className="text-sm text-gray-600 mt-2">{careerReason}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No career path selected yet. Take the career quiz to select a path.</p>
            )}
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Notification Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-blue-700" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-blue-700" />
                <Label htmlFor="app-notifications">App Notifications</Label>
              </div>
              <Switch 
                id="app-notifications" 
                checked={appNotifications} 
                onCheckedChange={setAppNotifications}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
