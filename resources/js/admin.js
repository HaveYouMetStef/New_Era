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
  updateDoc,
  addDoc,
  increment
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// DOM elements
const gameSelect = document.getElementById("games");
const teamScoreInput = document.getElementById("team-score");
const opponentScoreInput = document.getElementById("opponent-score");
const playerContainer = document.getElementById("player-stats-container");
const submitBtn = document.getElementById("submit-stats");

// Array of stats to track
const statTypes = ["touchdowns", "passing_touchdowns", "extra_points", "interceptions", "sacks"];

// 🔥 Add Play Functions (NEW)

async function addPassingTD(passerId, receiverId) {
  try {
    const selectedGameId = gameSelect.value;
    if (!selectedGameId) {
      alert("Select a game first");
      return;
    }

    // 1. Log the play
    await addDoc(collection(db, "games", selectedGameId, "plays"), {
      type: "passing_td",
      passer: passerId,
      receiver: receiverId,
      points: 6,
      createdAt: new Date()
    });

    // 2. Update passer stats
    await updateDoc(doc(db, "players", passerId), {
      "stats.spring_2026.passing_touchdowns": increment(1)
    });

    // 3. Update receiver stats
    await updateDoc(doc(db, "players", receiverId), {
      "stats.spring_2026.touchdowns": increment(1)
    });

    // 4. Update team score
    await updateDoc(doc(db, "games", selectedGameId), {
      teamScore: increment(6)
    });

    console.log("✅ Passing TD recorded!");
  } catch (error) {
    console.error("❌ Error adding passing TD:", error);
  }
}

async function addRushingTD(playerId) {
  try {
    const selectedGameId = gameSelect.value;
    if (!selectedGameId) return alert("Select a game first");

    await addDoc(collection(db, "games", selectedGameId, "plays"), {
      type: "rushing_td",
      player: playerId,
      points: 6,
      createdAt: new Date()
    });

    await updateDoc(doc(db, "players", playerId), {
      "stats.spring_2026.touchdowns": increment(1)
    });

    await updateDoc(doc(db, "games", selectedGameId), {
      teamScore: increment(6)
    });

    console.log("✅ Rushing TD recorded!");
  } catch (error) {
    console.error("❌ Error adding rushing TD:", error);
  }
}

async function addXP(playerId) {
  try {
    const selectedGameId = gameSelect.value;
    if (!selectedGameId) return alert("Select a game first");

    await addDoc(collection(db, "games", selectedGameId, "plays"), {
      type: "extra_point",
      player: playerId,
      points: 1,
      createdAt: new Date()
    });

    await updateDoc(doc(db, "players", playerId), {
      "stats.spring_2026.extra_points": increment(1)
    });

    await updateDoc(doc(db, "games", selectedGameId), {
      teamScore: increment(1)
    });

    console.log("✅ Extra Point recorded!");
  } catch (error) {
    console.error("❌ Error adding XP:", error);
  }
}

async function addINT(playerId) {
  try {
    const selectedGameId = gameSelect.value;
    if (!selectedGameId) return alert("Select a game first");

    await addDoc(collection(db, "games", selectedGameId, "plays"), {
      type: "interception",
      player: playerId,
      createdAt: new Date()
    });

    await updateDoc(doc(db, "players", playerId), {
      "stats.spring_2026.interceptions": increment(1)
    });

    console.log("✅ Interception recorded!");
  } catch (error) {
    console.error("❌ Error adding INT:", error);
  }
}

async function addSack(playerId) {
  try {
    const selectedGameId = gameSelect.value;
    if (!selectedGameId) return alert("Select a game first");

    await addDoc(collection(db, "games", selectedGameId, "plays"), {
      type: "sack",
      player: playerId,
      createdAt: new Date()
    });

    await updateDoc(doc(db, "players", playerId), {
      "stats.spring_2026.sacks": increment(1)
    });

    console.log("✅ Sack recorded!");
  } catch (error) {
    console.error("❌ Error adding Sack:", error);
  }
}

async function addOpponentScore(points) {
  try {
    const selectedGameId = gameSelect.value;
    if (!selectedGameId) return alert("Select a game first");

    await updateDoc(doc(db, "games", selectedGameId), {
      opponentScore: increment(points)
    });

    console.log("✅ Opponent score updated!");
  } catch (error) {
    console.error("❌ Error updating opponent score:", error);
  }
}

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

// 2️⃣b Populate all stat dropdowns for players
async function loadPlayerDropdowns() {
  const playersSnapshot = await getDocs(collection(db, "players"));

  const passerSelect = document.getElementById("passer-select");
  const receiverSelect = document.getElementById("receiver-select");
  const rushSelect = document.getElementById("rush-player-select");
  const xpSelect = document.getElementById("xp-player-select");
  const intSelect = document.getElementById("int-player-select");
  const sackSelect = document.getElementById("sack-player-select");

  playersSnapshot.forEach(playerDoc => {
    const player = playerDoc.data();

    const baseOption = document.createElement("option");
    baseOption.value = playerDoc.id;
    baseOption.textContent = player.name;

    // Passing TD dropdowns
    if (passerSelect) passerSelect.appendChild(baseOption.cloneNode(true));
    if (receiverSelect) receiverSelect.appendChild(baseOption.cloneNode(true));

    // Other stat dropdowns
    if (rushSelect) rushSelect.appendChild(baseOption.cloneNode(true));
    if (xpSelect) xpSelect.appendChild(baseOption.cloneNode(true));
    if (intSelect) intSelect.appendChild(baseOption.cloneNode(true));
    if (sackSelect) sackSelect.appendChild(baseOption.cloneNode(true));
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
  await loadPlayerDropdowns();
});

console.log("DB object:", db)

// 🎯 UI HOOK: Add Passing TD from dropdown selections
window.handleAddPassingTD = () => {
  const passerSelect = document.getElementById("passer-select");
  const receiverSelect = document.getElementById("receiver-select");

  const passerId = passerSelect?.value;
  const receiverId = receiverSelect?.value;

  if (!passerId || !receiverId) {
    alert("Please select both a passer and receiver");
    return;
  }

  addPassingTD(passerId, receiverId);
};

window.handleAddRushingTD = () => {
  const val = document.getElementById("rush-player-select").value;
  if (!val) return alert("Select player");
  addRushingTD(val);
};

window.handleAddXP = () => {
  const val = document.getElementById("xp-player-select").value;
  if (!val) return alert("Select player");
  addXP(val);
};

window.handleAddINT = () => {
  const val = document.getElementById("int-player-select").value;
  if (!val) return alert("Select player");
  addINT(val);
};

window.handleAddSack = () => {
  const val = document.getElementById("sack-player-select").value;
  if (!val) return alert("Select player");
  addSack(val);
};

window.handleOpponentScore = () => {
  const points = parseInt(document.getElementById("opponent-points").value);
  if (!points) return alert("Enter points");
  addOpponentScore(points);
};