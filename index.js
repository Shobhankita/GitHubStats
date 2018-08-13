const axios = require('axios');

init = function () {
    var org = 'google';
    var baseUrl = 'https://api.github.com';
    var sortBy = 'forks';
    var maxRepos = 5, maxContributors = 3;
    var orgRepos = [];
    var accessToken = null;
    var fetchedOrgContributors = 0;

    var getOptions = accessToken != null ? {
        headers: {
            'Authorization' : 'token ' + accessToken
        }
    } : {};

    axios.get(`${baseUrl}/search/repositories?q=org:${org}&sort=${sortBy}`, getOptions).then(response => {
        if (response.status == 200) {
            searchResults = response.data;
            orgRepos = response.data.items.filter((item, index) => index < maxRepos).map(i => new OrgRepo(i));

            orgRepos.forEach(element => {
                axios.get(element.contributors_url, getOptions).then(resp => {
                    element.topContributors = resp.data.filter((d, index) => index < maxContributors).map(d => new Contributor(d));
                    fetchedOrgContributors++;
                }, error => {
                    console.log(error);
                });
            });
        }
    }, error => {
        console.log('An error has occurred!');
    });

    var interval = setInterval(() => {
        if (fetchedOrgContributors == 5) {
            clearInterval(interval);
            printRepos(orgRepos);
        }
    }, 500);
}

printRepos = function(orgRepos) {
    orgRepos.forEach(repo => {
        console.log('Repository Name: ' + repo.name);
        console.log('Number of Forks: ' + repo.forks_count);
        console.log('Contributors:');
        repo.topContributors.forEach(c => {
            console.log('\tContributor Username: ' + c.username);
            console.log('\tNumber of Commits: ' + c.commitCount);
        });

        console.log('\n\n');
    });
}

OrgRepo = function(args) {
    this.name = args.name;
    this.forks_count = args.forks_count;
    this.contributors_url = args.contributors_url;
    this.topContributors = [];
}

Contributor = function(args) {
    this.username = args.login;
    this.commitCount = args.contributions;
}

init();