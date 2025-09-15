"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://azure.storage/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const url = await res.text();
        setMessage(`Uploaded successfully: ${url}`);
        setFile(null);
        (document.getElementById("file-input") as HTMLInputElement).value = "";
      } else {
        const text = await res.text();
        setMessage(`Upload failed: ${text}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`Upload error: ${err.message}`);
      } else {
        setMessage("Upload error: unknown");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col gap-4 items-center bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="border border-gray-300 rounded px-3 py-2 w-full text-gray-800"
          />
          <button
              className={`mt-2 rounded px-4 py-2 w-full text-white ${
                  uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleUpload}
              disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
          {message && (
              <p
                  className={`text-sm mt-1 ${
                      message.startsWith("Uploaded") ? "text-green-600" : "text-red-600"
                  }`}
              >
                {message}
              </p>
          )}
        </div>
      </div>
  );
}
