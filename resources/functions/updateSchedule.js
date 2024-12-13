const fs = require('fs');

//load the current schedule.json file
const filePath = 'resources/data/schedule.json';
let scheduleData;

try {
    scheduleData = JSON.parse(fs.readFileSync(filePath, 'utf-8')); 
} catch(error) {
    console.error("Error reading the file:", error);
    return;
}

/**
 * Add a game result to the specified season.
 * @param {string} season - The season to update (e.g., "Fall2024").
 * @param {string} date - The date of the game (MM-DD-YYYY).
 * @param {string} opponent - The name of the opponent.
 * @param {string} score - The score (e.g., "27 - 18").
 * @param {string} result - The result of the game ("Win" or "Loss").
 */


//function to add a game result
function addGameResult(season, date, opponent, score, result) {
    if(!scheduleData[season]) {
        console.error(`Season ${season} does not exist. Please create the new season first.`);
        return;
    }

    const seasonData = scheduleData[season];

    //Check for a duplicate game entry
    const duplicateGame = seasonData.games.find(
        (game) => game.date === date && game.opponent === opponent
    );
    if(duplicateGame) {
        console.log(`Game against ${opponent} on ${date} already exists.`);
        return;
    }

    const newGame = {
        date,
        opponent,
        score, 
        result
    }
    seasonData.games.push(newGame);

    //update the season record
    if(result.toLowerCase() === 'win') {
        seasonData.seasonRecord.wins += 1;
    } else if (result.toLowerCase() === 'loss'){
        seasonData.seasonRecord.losses += 1;
    } else {
        console.error("Invalid result. Please enter 'Win' or 'Loss'.")
        return;
    }

    try {
        fs.writeFileSync(filePath, JSON.stringify(scheduleData, null, 4));
        console.log(`Game added successfully to ${season}: ${opponent} on ${date} (${result}).`);
    } catch(error) {
        console.error("Error writing to the file:", error)
    }
}

//test
// addGameResult('Fall2024','3/1/2025', 'test opponent', '29-0', 'Draw');