import { db } from "./firebase.js";
import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// DOM elements
const seasonSelect = document.getElementById('season-select');
const seasonRecord = document.getElementById('seasonRecord');
const seasonTableBody = document.querySelector('#seasonTable tbody');

// Store grouped data
let seasonsData = {};

// 🔥 Load & group games from Firebase
function loadSchedule() {
  onSnapshot(collection(db, "games"), (snapshot) => {
    seasonsData = {}; // reset

    snapshot.forEach(docSnap => {
      const game = docSnap.data();
       
      // 🚫 Skip currentGame or anything without a season
        if (!game.season) return;
      
        const season = game.season;

      if (!seasonsData[season]) {
        seasonsData[season] = {
          games: [],
          wins: 0,
          losses: 0
        };
      }

      // Determine result
      let result = "upcoming";
      if (game.status === "completed") {
        if (game.teamScore > game.opponentScore) {
          result = "W";
          seasonsData[season].wins++;
        } else {
          result = "L";
          seasonsData[season].losses++;
        }
      }

      seasonsData[season].games.push({
        date: game.date,
        opponent: game.opponent,
        score: `${game.teamScore} - ${game.opponentScore}`,
        result,
        week: game.week
      });
    });

    populateSeasonDropdown();
  });
}

// 🔽 Populate dropdown
function populateSeasonDropdown() {
    seasonSelect.innerHTML = "";
  
    const seasons = Object.keys(seasonsData);
  
    // Sort seasons (latest first)
    seasons.sort((a, b) => b.localeCompare(a));
  
    seasons.forEach(season => {
      const option = document.createElement("option");
      option.value = season;
      option.textContent = season.replace("_", " ");
      seasonSelect.appendChild(option);
    });
  
    // ✅ Default to most recent season
    const currentSeason = seasons[0];
    seasonSelect.value = currentSeason;
  
    loadSeasonData(currentSeason);
  }

// 📊 Load selected season into table
function loadSeasonData(seasonKey) {
  const seasonData = seasonsData[seasonKey];

  seasonTableBody.innerHTML = "";
  seasonRecord.innerHTML = "";

  // Sort by week (important)
  seasonData.games.sort((a, b) => a.week - b.week);

  // Populate table
  seasonData.games.forEach(game => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${game.date}</td>
      <td>${game.opponent}</td>
      <td>${game.score}</td>
      <td>${game.result}</td>
    `;
    seasonTableBody.appendChild(row);
  });

  // Season record
  seasonRecord.innerHTML = `
    <h3>Season Record</h3>
    <p>Wins: ${seasonData.wins} | Losses: ${seasonData.losses}</p>
  `;
}

// Event listener
seasonSelect.addEventListener("change", () => {
  loadSeasonData(seasonSelect.value);
});

// Init
loadSchedule();