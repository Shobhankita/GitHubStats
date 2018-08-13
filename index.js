const axios = require('axios');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'org', alias: 'o', type: String },
    { name: 'repos', alias: 'r', type: Number },
    { name: 'contributors', alias: 'c', type: Number },
    { name: 'token', alias: 't', type: String }
]

const cmdArgs = commandLineArgs(optionDefinitions);

init = function () {
    var org = cmdArgs.org != null ? cmdArgs.org : 'google';
    var baseUrl = 'https://api.github.com';
    var sortBy = 'forks';
    var maxRepos = cmdArgs.repos != null ? cmdArgs.repos : 5;
    var maxContributors = cmdArgs.contributors != null ? cmdArgs.contributors : 3;
    var orgRepos = [];
    var accessToken = cmdArgs.token;
    var fetchedOrgs = 0;

    var getOptions = accessToken != null ? {
        headers: {
            'Authorization' : 'token ' + accessToken
        }
    } : {};

    axios.get(`${baseUrl}/search/repositories?q=org:${org}&sort=${sortBy}&per_page=${maxRepos}`, getOptions).then(response => {
        if (response.status == 200) {
            searchResults = response.data;
            orgRepos = response.data.items.map(i => new OrgRepo(i));

            orgRepos.forEach(element => {
                axios.get(element.contributors_url + '?per_page=' + maxContributors, getOptions).then(resp => {
                    element.topContributors = resp.data.map(d => new Contributor(d));
                    fetchedOrgs++;
                }, error => {
                    console.log(error);
                });
            });
        }
    }, error => {
        console.log('An error has occurred!');
    });

    var interval = setInterval(() => {
        if (fetchedOrgs == maxRepos) {
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

        console.log('\n');
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