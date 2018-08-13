## Usage

```
node index.js //Gets Google's top 5 repos.
node index.js -o microsoft //Gets Microsoft's top 5 repos with top 3 contributors in each.
node index.js -o microsoft -r 3 //Gets Microsoft's top 3 repos with top 3 contributors in each.
node index.js -o microsoft -r 3 -c 2 //Gets Microsoft's top 3 repos with top 2 contributors in each.
node index.js --org=microsoft --repos=3 --contributors=2 //Gets Microsoft's top 3 repos with top 2 contributors in each.
```
