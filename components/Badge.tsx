"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Badge() {
  const [badgeStatus, setBadgeStatus] = useState<"pending" | "issued" | "error">("pending");
  const [badgeUrl, setBadgeUrl] = useState<string>("");

  useEffect(() => {
    const issueBadge = async () => {
      try {
        const response = await fetch("/api/issue-badge", { method: "POST" });
        const data = await response.json();
        if (!response.ok) throw new Error("Issuance failed");
        setBadgeUrl(data.issuedBadges?.[0]?.badgeUrl || "");
        setBadgeStatus("issued");
      } catch (error) {
        console.error("Badge issuance error:", error);
        setBadgeStatus("error");
      }
    };

    issueBadge();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4">Your Achievement</h1>
      
      {badgeStatus === "pending" && (
        <div className="text-blue-600">Issuing your badge...</div>
      )}
      
      {badgeStatus === "issued" && (
        <div className="text-green-600">
          <p className="text-lg">🎉 Congratulations!</p>
          <p>Your JSON Schema Expert badge has been issued!</p>
          <p>Link is {badgeUrl}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      )}
      
      {badgeStatus === "error" && (
        <div className="text-red-600">
          <p>Error issuing badge. Please try again later.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}