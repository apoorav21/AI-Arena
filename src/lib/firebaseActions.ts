// src/lib/firebaseActions.ts
import { db } from "./firebaseClient";
import { doc, getDoc, updateDoc, setDoc, increment, collection, getDocs } from "firebase/firestore";

// Add a vote
export async function addVote(modelName: string) {
  try {
    const modelRef = doc(db, "modelVotes", modelName);
    const modelDoc = await getDoc(modelRef);

    if (modelDoc.exists()) {
      await updateDoc(modelRef, { votes: increment(1) });
    } else {
      await setDoc(modelRef, { votes: 1 });
    }
  } catch (error: any) {
    console.error("Error adding vote to Firebase:", error);
    throw new Error(`Failed to add vote: ${error.message}`);
  }
}

// Get leaderboard data
export async function getLeaderboardData() {
  try {
    const modelVotesCollection = collection(db, "modelVotes");
    const modelVotesSnapshot = await getDocs(modelVotesCollection);
    return modelVotesSnapshot.docs.map(doc => ({
      modelName: doc.id,
      votes: Number(doc.data().votes || 0),
    }));
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error);
    throw new Error(`Failed to fetch leaderboard: ${error.message}`);
  }
}
