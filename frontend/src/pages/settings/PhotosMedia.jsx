import React, { useRef, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function PhotosMedia() {
  const fileRef = useRef(null);
  const [files, setFiles] = useState([]);

  const onPick = () => fileRef.current?.click();

  const onFiles = (e) => {
    const list = Array.from(e.target.files || []);
    if (!list.length) return;
    setFiles(list);
  };

  const onSave = () => {
    // POST /api/settings/media (multipart)
    toast.success("Media settings saved.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Photos & media</CardTitle>
            <CardDescription>Manage uploads and media preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={onFiles}
            />

            <div className="flex gap-2">
              <Button variant="outline" onClick={onPick}>Upload</Button>
              <Button onClick={onSave}>Save</Button>
            </div>

            <div className="border border-border rounded-xl p-4">
              <div className="font-semibold">Selected files</div>
              <div className="text-sm text-muted-foreground mt-1">
                {files.length ? `${files.length} file(s) selected` : "No files selected."}
              </div>
              {files.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                  {files.slice(0, 10).map((f) => (
                    <li key={`${f.name}-${f.size}`} className="truncate">
                      {f.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
