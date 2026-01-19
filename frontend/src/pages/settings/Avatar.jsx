import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function Avatar() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const onPick = () => fileRef.current?.click();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const onSave = () => {
    // POST /api/settings/avatar (multipart)
    toast.success("Avatar saved.");
    navigate("/settings");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>Upload and manage your profile photo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl overflow-hidden border border-border bg-muted flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm text-muted-foreground">No photo</span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFile}
                />
                <Button variant="outline" onClick={onPick}>Choose file</Button>
                <Button onClick={onSave} disabled={!previewUrl}>Save</Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Recommended: square image, at least 512×512. PNG or JPG.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
