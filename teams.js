// teams.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }

    // Display user info
    document.getElementById('welcomeMessage').textContent = `Welcome, ${userData.name}`;
    document.getElementById('userTeam').textContent = `Team: ${userData.team}`;

    // Team data
    const teamData = {
        "Strategic Leaders": {
            image: "assets/strategic_leaders.png",
            notes: [
                "Monument Identity",
                "Referring to GODs",
                "Vision, Name",
                "PMP template",
                "Time Management",
                "Contingency Plan",
                "Meetings",
                "Resources: From Farmers-Workers To Builders",
                "Solution from Solvers"
            ]
        },
        "Builders": {
            image: "assets/builders.png",
            notes: [
                "Design of monument",
                "Template to Build",
                "Estimate quantities",
                "Requests:",
                "  - Concept: Leaders",
                "  - Stones: Leaders",
                "  - Food: Farmers",
                "  - Safety: workers"
            ]
        },
        "Workers": {
            image: "assets/workers.png",
            notes: [
                "Weapons Production",
                "Estimate quantities",
                "Receive orders from Leaders",
                "Efficiency Vs Time"
            ]
        },
        "Farmers": {
            image: "assets/farmers.png",
            notes: [
                "Food Production",
                "Estimate quantities",
                "Receive orders from Leaders",
                "Efficiency Vs Time"
            ]
        },
        "Riddles Solvers": {
            image: "assets/riddles_solvers.png",
            notes: [
                "Riddles",
                "Solutions are sent to Leaders as they will be converted into power cards"
            ]
        }
    };

    // Display team info
    const teamInfo = teamData[userData.team];
    if (teamInfo) {
        document.getElementById('teamImage').src = teamInfo.image;
        document.getElementById('teamTitle').textContent = userData.team;
        
        const notesList = document.getElementById('teamNotesList');
        teamInfo.notes.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note;
            notesList.appendChild(li);
        });
    } else {
        // Default to Strategic Leaders if team not found
        document.getElementById('teamImage').src = "assets/strategic_leaders.png";
        document.getElementById('teamTitle').textContent = "Team Not Found";
    }

    // Sign out button
    document.getElementById('signOutBtn').addEventListener('click', function() {
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
    });
});