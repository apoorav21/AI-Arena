"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLeaderboardData } from "@/lib/firebaseActions";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<
    { modelName: string; votes: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getLeaderboardData();
        setLeaderboardData(data);
      } catch (error: any) {
        console.error("Error fetching leaderboard data:", error);
        setError(error.message || "Failed to fetch leaderboard data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>
            See which AI model is winning the most battles!
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isLoading ? (
            <p>Loading leaderboard data...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Model</TableHead>
                  <TableHead>Votes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData
                  .sort((a, b) => b.votes - a.votes) // Sort by votes in descending order
                  .map((item) => (
                    <TableRow key={item.modelName}>
                      <TableCell className="font-medium">{item.modelName}</TableCell>
                      <TableCell>{item.votes}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
