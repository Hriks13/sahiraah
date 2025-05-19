
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PreferencesSettings = () => {
  return (
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
  );
};
