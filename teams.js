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
            // Set team image
            document.getElementById('teamImage').src = teamInfo.image;
            document.getElementById('teamTitle').textContent = userData.team;

            // Set team-specific background
            setBackgroundByTeam(userData.team);

            // Display team notes
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

            // Set default background
            setBackgroundByTeam('Strategic Leaders');
        }
    };
    document.head.appendChild(script);

    // Function to update background based on team name
    function setBackgroundByTeam(team) {
        const backgroundImage = {
            'Strategic Leaders': 'assets/back_leaders.mp4',
            'Builders': 'assets/back_builders.mp4',
            'Workers': 'assets/back_workers.mp4',
            'Farmers': 'assets/back_farmers.mp4',
            'Riddle Solvers': 'assets/back_solvers.mp4'
        };

        const videoElement = document.querySelector('.background'); // assuming this is your background element
        if (videoElement) {
            const videoSrc = backgroundImage[team] || 'assets/gen_back.mp4';
            videoElement.src = videoSrc;
        }
    }

    // Sign out button
    document.getElementById('signOutBtn')?.addEventListener('click', function() {
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
    });
});
