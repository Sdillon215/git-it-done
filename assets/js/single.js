var issuesContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function () {
    // assigns query parameter passed from index.html to queryString
    var queryString = document.location.search;
    // splits the queryString at the = making an array with 2 elements then grabs the 2nd [1] array element and assigns to repoName
    var repoName = queryString.split("=")[1];
    if (repoName) {
        repoNameEl.textContent = repoName;
        // pass repoName to getRepoIssues
        getRepoIssues(repoName);
    } else {
        // redirect back to index.html if no repo name was given
        document.location.replace("./index.html");
    }
};

var getRepoIssues = function (repoName) {
    var apiUrl = "https://api.github.com/repos/" + repoName + "/issues?direction=asc";

    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        // pass data to dom function
                        displayIssues(data);
                        if (response.headers.get("Link")) {
                            displayWarning(repoName);
                        }
                    });
            } else {
                document.location.replace("./index.html");
            }
        });
};

var displayIssues = function (issues) {
    if (issues.length === 0) {
        issuesContainerEl.textContent = "This repo has no open issues.";
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        // create  link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issues
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        issuesContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function (repoName) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "see more issues on github.com";
    linkEl.setAttribute("href", "https://github.com/" + repoName + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();