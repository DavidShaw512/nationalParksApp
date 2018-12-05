//   App functionality: User must be able to:
// - Search for parks in one or more states, 
// - Set the max number of results (with a default of 10)
// - Search must trigger a call to NSP's API
// - Parks in the given state must be displayed on the page,
//   including at least: Full name, description, website URL

const apiKey = "aGY3kkfmaZKKSed2v71JywOpO5qKHYgxF5H3Ua6L";
const baseURL = "https://api.nps.gov/api/v1/parks"

// event listener
function handleSearchSubmit () {
    $('form').submit(event => {
        event.preventDefault();
        const stateCode = $("#js-state-code").val().toUpperCase();
        const maxResults = $("#js-max-results").val();
        console.log(stateCode);
        console.log(maxResults);
        getParksByState(stateCode, maxResults);
    });
}

// Formats the search parameters into a string that will be added 
// to the end of the base URL, joined by '&'
function formatSearchParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join("&");
    return queryItems;
}

// Fetches the relevant data from the API
function getParksByState(stateCode, maxResults) {
    const params = {
        // api_key: apiKey,
        stateCode,
        limit: maxResults
    };
    const queryString = formatSearchParams(params);
    const url = baseURL + '?' + queryString;

    console.log("Logging params and querystring in the getParksByState func");
    console.log(params);
    console.log(queryString);

    fetch(url)
        // .then(responseToJsonDebug)
        // .then(response => console.log(response))
        .then(responseToJsonIfOk)
        .then(displayResults)
        .catch(error => alert("Something went wrong"));
}

const responseToJsonDebug = response => response.json();

// Turn the fetch response to JSON if it returns a 200 code, or throw
// an error if it doesn't
function responseToJsonIfOk(response) {
    if (!response.ok) {
        throw new Error(response.status);
    }
    console.log(response.ok);
    console.log(response.json);
    return response.json();
}

// Format the search results into appendable HTML
function formatResults(arrayOfParks) {
    console.log(arrayOfParks);
    console.log(arrayOfParks.limit);
    console.log(arrayOfParks.data);
    // return "<p>testing</p>";
    return arrayOfParks.data.map(park => `
    <p><span class="park-name">${park.name}</span>
    <br>
    <span class="park-designation">${park.designation}</span>
    <br>
    <span class="park-description">${park.description}</span>
    <br>
    <a href="${park.url}" target="_blank">${park.url}</a>
    `).join("<hr>");
}

// Append the newly-formatted search results to the DOM
function displayResults(parkArray) {
    const results = formatResults(parkArray);
    console.log(results);
    $('#results-container').empty();
    $('#results-container').append(results);
}




// Load the app when the page loads
$(function() {
    console.log('All loaded up, awaiting input');
    handleSearchSubmit();
})