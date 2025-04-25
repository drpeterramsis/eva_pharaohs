// allteams.js
document.addEventListener('DOMContentLoaded', function() {
    // Load team data from external file
    const script = document.createElement('script');
    script.src = 'team-data.js';
    script.onload = function() {
        const container = document.getElementById('allTeamsContainer');
        
        // Create team cards for each team
        Object.entries(teamData).forEach(([teamName, teamInfo]) => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';
            
            // Create notes list HTML
            const notesList = teamInfo.notes.map(note => 
                `<li>${note}</li>`
            ).join('');
            
            teamCard.innerHTML = `
                <div class="team-header">
                    <h2>${teamName}</h2>
                </div>
                <div class="team-content">
                    <img src="${teamInfo.image}" alt="${teamName}" class="team-image">
                    <div class="team-notes">
                        <ul>${notesList}</ul>
                    </div>
                </div>
            `;
            
            container.appendChild(teamCard);
        });

        // Scroll to top on page load
        window.scrollTo(0, 0);
        document.querySelector('.menu-container').scrollTop = 0;
    };
    document.head.appendChild(script);
});