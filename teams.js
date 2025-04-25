// teams.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }

    // Load team data from external file
    const script = document.createElement('script');
    script.src = 'team-data.js';
    script.onload = function() {
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
    };
    document.head.appendChild(script);

    // Sign out button
    document.getElementById('signOutBtn')?.addEventListener('click', function() {
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
    });
});