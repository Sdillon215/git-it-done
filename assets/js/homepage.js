var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function (user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    displayRepos(data, user);
                });
            } else {
                alert("Error: Github User Not Found");
            }
        })
        .catch(function(error) {
            // notice this '.catch()' getting chained onto the end of the '.then' method
            alert("Unable to connect to github");
        });
};

var formSubmitHandler = function (event) {
    event.preventDefault();
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a Github username");
    }
    // console.log(event);
};

var displayRepos = function (repos, searchTerm) {
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    console.log(repos);
    console.log(searchTerm);
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create an <a> element for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between aligh-center";
        // add href to <a> element with query parameter ?repo= ... repoName to pass to singlerepo.html
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repo name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a task element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    };
};

userFormEl.addEventListener("submit", formSubmitHandler);