// const playerContainer = document.getElementById("player-stats-container");

// // Example stats for input
// const statTypes = ["touchdowns", "passing_touchdowns", "extra_points", "interceptions", "sacks"];

// players.forEach(player => {
//   const row = document.createElement("div");
//   row.classList.add("player-row");

//   // Player name dropdown (or just a label if it's one input per player)
//   const nameLabel = document.createElement("label");
//   nameLabel.textContent = player.name;
//   row.appendChild(nameLabel);

//   // Add inputs for each stat type
//   statTypes.forEach(stat => {
//     const input = document.createElement("input");
//     input.type = "number";
//     input.min = 0;
//     input.id = `${player.name}-${stat}`;
//     input.placeholder = stat;
//     row.appendChild(input);
//   });

//   playerContainer.appendChild(row);
// });

// admin.js
import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// DOM elements
const gameSelect = document.getElementById("games");
const teamScoreInput = document.getElementById("team-score");
const opponentScoreInput = document.getElementById("opponent-score");
const playerContainer = document.getElementById("player-stats-container");
const submitBtn = document.getElementById("submit-stats");

// Array of stats to track
const statTypes = ["touchdowns", "passing_touchdowns", "extra_points", "interceptions", "sacks"];

// 1️⃣ Load games into dropdown
async function loadGames() {
  const gamesSnapshot = await getDocs(collection(db, "games"));
  gamesSnapshot.forEach(docSnap => {
    const game = docSnap.data();
    const option = document.createElement("option");
    option.value = docSnap.id;
    option.textContent = `${game.date} vs ${game.opponent}`;
    gameSelect.appendChild(option);
  });
}

// 2️⃣ Load players into the stat form
async function loadPlayers() {
  const playersSnapshot = await getDocs(collection(db, "players"));
  playersSnapshot.forEach(playerDoc => {
    const player = playerDoc.data();
    const row = document.createElement("div");
    row.classList.add("player-row");

    // Player name label
    const nameLabel = document.createElement("label");
    nameLabel.textContent = player.name;
    row.appendChild(nameLabel);

    // Stat inputs
    statTypes.forEach(stat => {
      const input = document.createElement("input");
      input.type = "number";
      input.min = 0;
      input.placeholder = stat;
      input.id = `${player.name}-${stat}`;
      row.appendChild(input);
    });

    playerContainer.appendChild(row);
  });
}

// 3️⃣ Submit stats to Firebase
submitBtn.addEventListener("click", async () => {
  const selectedGameId = gameSelect.value;
  if (!selectedGameId) return alert("Please select a game");

  const teamScore = parseInt(teamScoreInput.value) || 0;
  const opponentScore = parseInt(opponentScoreInput.value) || 0;

  // Build player stats object
  const playerStats = {};
  statTypes.forEach(stat => {
    const inputs = document.querySelectorAll(`input[id$="-${stat}"]`);
    inputs.forEach(input => {
      const playerName = input.id.split(`-${stat}`)[0];
      if (!playerStats[playerName]) playerStats[playerName] = {};
      playerStats[playerName][stat] = parseInt(input.value) || 0;
    });
  });

  try {
    // Update current game document
    await updateDoc(doc(db, "games", selectedGameId), {
      teamScore,
      opponentScore,
      playerStats,
    });

    alert("Game and player stats updated successfully!");
  } catch (error) {
    console.error("Error updating stats:", error);
    alert("Failed to update stats. Check console.");
  }
});

// 4️⃣ Initialize portal
window.addEventListener("DOMContentLoaded", async () => {
  await loadGames();
  await loadPlayers();
});

console.log("DB object:", db)

const snapshot = await getDocs(collection(db, "games"));
console.log("Games found:", snapshot.docs.length);