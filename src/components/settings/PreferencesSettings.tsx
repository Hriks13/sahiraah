
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BookIcon, BellIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/toast/use-toast";

interface PreferencesSettingsProps {
  userId?: string;
}

export const PreferencesSettings = ({ userId }: PreferencesSettingsProps) => {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [careerReason, setCareerReason] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // Fetch selected career
        const { data: careerData, error: careerError } = await supabase
          .from('user_career_history')
          .select('*')
          .eq('user_id', userId)
          .eq('is_selected', true)
          .single();
        
        if (careerError && careerError.code !== 'PGRST116') {
          console.error("Error fetching selected career:", careerError);
        }
        
        if (careerData) {
          setSelectedCareer(careerData.career);
          setCareerReason(careerData.reason);
        }
        
        // Fetch notification preferences
        const { data: prefData, error: prefError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (prefError && prefError.code !== 'PGRST116') {
          console.error("Error fetching user preferences:", prefError);
        }
        
        if (prefData) {
          setEmailNotifications(prefData.email_notifications);
          setAppNotifications(prefData.app_notifications);
        } else {
          // Insert default preferences
          await supabase.from('user_preferences').insert({
            user_id: userId,
            email_notifications: true,
            app_notifications: true
          });
        }
      } catch (error) {
        console.error("Error in preferences fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreferences();
  }, [userId]);

  const handleEmailNotificationChange = async (checked: boolean) => {
    if (!userId) return;
    
    try {
      setEmailNotifications(checked);
      
      const { error } = await supabase
        .from('user_preferences')
        .update({ email_notifications: checked, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      
      if (error) throw error;
      
    } catch (error) {
      console.error("Error updating email notifications:", error);
      toast({ title: "Failed to update preferences", variant: "destructive" });
      setEmailNotifications(!checked); // Revert on error
    }
  };

  const handleAppNotificationChange = async (checked: boolean) => {
    if (!userId) return;
    
    try {
      setAppNotifications(checked);
      
      const { error } = await supabase
        .from('user_preferences')
        .update({ app_notifications: checked, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      
      if (error) throw error;
      
    } catch (error) {
      console.error("Error updating app notifications:", error);
      toast({ title: "Failed to update preferences", variant: "destructive" });
      setAppNotifications(!checked); // Revert on error
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Loading your preferences...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-spin h-8 w-8 border-4 border-blue-700 border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

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
                onCheckedChange={handleEmailNotificationChange}
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
                onCheckedChange={handleAppNotificationChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
