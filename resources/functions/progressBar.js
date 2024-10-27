// Fetch the progress bar and progress text elements
const progressBar = document.querySelector('.progress-bar');
const progressText = document.querySelector('.progress-text');

// Set up the current progress (games played) and total games
const seasonProgressSection = document.getElementById('season-progress');
const totalGames = parseInt(seasonProgressSection.getAttribute('data-total-games'), 10);

// Fetch the number of games played from your dataset
// For now, set a static number as an example:
const gamesPlayed = 2; // Update this variable weekly or make it dynamically fetchable

// Calculate the progress percentage
const updateProgressBar = (gamesPlayed) => {
    const progressPercentage = (gamesPlayed / totalGames) * 100;
    progressBar.style.width = `${progressPercentage}%`; // Adjust the width of the bar
    progressText.innerText = `${gamesPlayed} of ${totalGames} Games Played`; // Update text inside the bar
}

// Initialize progress on page load
document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch and calculate games played
    fetch('resources/data/schedule.json') // Update path to the correct location of your schedule.json
        .then(response => response.json())
        .then(data => {
            console.log("Fetched data:", data); // Log the fetched data structure
            if (!data.currentSeason || !data.currentSeason.games) throw new Error("Games data not found in JSON.");

            // Filter games that are marked as completed
            const gamesPlayed = data.currentSeason.games.filter(game => game.result !== "upcoming").length;

            // Call function to update the progress bar
            updateProgressBar(gamesPlayed);
        })
        .catch(error => console.error('Error fetching schedule:', error));
});