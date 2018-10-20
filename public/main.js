const form = document.getElementById('vote-form');
let event;

// Form submit event
form.addEventListener('submit', e => {
    const choice = document.querySelector('input[name="os"]:checked').value;
    const data   = { os: choice };
    
    // Create our request
    fetch('http://localhost:3000/poll', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(res => res.json())
        .catch(err => console.error(err));
        
    e.preventDefault();
});

fetch('http://localhost:3000/poll')
    .then(res => res.json())
    .then(data => {
        let votes = data.votes;
        let totalVotes = votes.length;
        document.querySelector('#chartTitle').textContent = `Total Votes: ${totalVotes}`;
        
        let voteCounts = {
            Windows: 0,
            MacOS: 0,
            Linux: 0,
            Other: 0
        };

        // Count vote points
        voteCounts = votes.reduce(
            (acc, vote) => ((acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc), {}
        );

        console.log(voteCounts);

        let dataPoints = [
            { label: 'Windows', y: voteCounts.Windows },
            { label: 'macOS', y: voteCounts.macOS },
            { label: 'Linux', y: voteCounts.Linux },
            { label: 'Other', y: voteCounts.Other }
        ];

        const chartContainer = document.querySelector('#chartContainer');

        if (chartContainer) {

            document.addEventListener('votesAdded', e => {
                document.querySelector('#chartTitle').textContent = `Total Votes: ${e.detail.totalVotes}`;
            })

            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                data: [{
                    type: 'column',
                    dataPoints: dataPoints
                }]
            });
            chart.render();

            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            var pusher = new Pusher('843cc95d1ae6dadd355b', {
                cluster: 'eu',
                forceTLS: true
            });

            var channel = pusher.subscribe('os-poll');
            channel.bind('os-vote', function (data) {
                dataPoints = dataPoints.map(dataPoint => {
                    if (dataPoint.label == data.os) {
                        dataPoint.y += data.points;
                        totalVotes += data.points;
                        event = new CustomEvent('votesAdded', {detail: { totalVotes: totalVotes }});
                        document.dispatchEvent(event);
                        return dataPoint;
                    } else {
                        return dataPoint;
                    }
                });
                chart.render();
            });
        }
    });
