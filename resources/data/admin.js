// admin.js
document.getElementById("gameForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const game = {
      date: formData.get("date"),
      opponent: formData.get("opponent"),
      ourScore: parseInt(formData.get("ourScore")),
      theirScore: parseInt(formData.get("theirScore")),
    };
  
    console.log("Game added:", game);
    // Later: push to JSON, API, or Firebase
  });
  
  document.getElementById("playerStatsForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const stats = {
      player: formData.get("player"),
      touchdowns: parseInt(formData.get("tds")),
      receptions: parseInt(formData.get("receptions")),
      yards: parseInt(formData.get("yards")),
    };
  
    console.log("Player stats updated:", stats);
    // Later: push to playerStats.json
  });

  //fetch schedule to grab the opponents
fetch("resources/data/schedule.json")
  .then(response => response.json())
  .then(data => {
    // Adjust for the specific season key
    const season = "Spring2025"; // You can make this dynamic later
    const games = data[season].games;

    // Extract unique opponents
    const opponents = [...new Set(games.map(game => game.opponent))];

    // Populate the dropdown
    const select = document.getElementById("opponentSelect");

    opponents.forEach(opponent => {
      const option = document.createElement("option");
      option.value = opponent;
      option.textContent = opponent;
      select.appendChild(option);
    });
  })
  .catch(error => console.error("Error loading schedule.json:", error));

//player names
fetch("resources/data/player-stats.json")
  .then(response => response.json())
  .then(data => {
    const players = data.players; // Access array

    const select = document.getElementById("playerSelect");

    players.forEach(player => {
      const option = document.createElement("option");
      option.value = player.name;
      option.textContent = player.name;
      select.appendChild(option);
    });
  })
  .catch(error => console.error("Error loading players-stats.json:", error));