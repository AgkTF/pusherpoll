const form = document.getElementById('vote-form');

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
        
        // Count vote points
        const voteCounts = votes.reduce(
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
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                title: {
                    text: `Total Votes: ${totalVotes}`
                },
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
                        return dataPoint;
                    } else {
                        return dataPoint;
                    }
                });
                chart.render();
            });
        }
    });
