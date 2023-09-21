

let pageNumber;
let totalPages = 0;
let currentState = "desc";
let currentDate = "descDate"
let favMovies = [];
let isDate = false;

const movieListSection = document.querySelector("#movie-list");
const nextBtn = document.querySelector("#next");
const backBtn = document.querySelector("#prev");
const pageNumberContainer = document.querySelector("#page-no");
const ratingToggle = document.querySelector("#rating-toggle");
const pagination = document.querySelector("#pagination");
const allBtn = document.querySelector("#all-btn");
const favBtn = document.querySelector("#fav-btn");
const no_result = document.querySelector("#no-fav");
const sort_date_btn = document.querySelector("#sort-date-btn");

const searchBar = document.querySelector("#search-bar-input");
const searchBtn = document.querySelector("#search-bar-button");

const SORT_ASC_TEXT = "Sort by highest rating";
const SORT_DESC_TEXT = "Sort by lowest rating";

const SORT_ASC = "popularity.asc";
const SORT_DESC = "popularity.desc";

const SORT_DATE_ASC = "primary_release_date.asc";
const SORT_DATE_DESC = "primary_release_date.desc";

const SORT_DATE_ASC_TEXT = "Sort by descending date";
const SORT_DATE_DESC_TEXT = "Sort by ascending date";


//SEARCH BUTTON 
searchBtn.addEventListener("click", () => {
  if (searchBar.value === "") {
    return;
  }

  if (favMovies.length === 0) {
    showMovies(1, "desc", null, "search", searchBar.value);
  } else {
    showMovies(1, "desc", favMovies, "search", searchBar.value);
  }

  if (no_result.classList.contains("show-no-result")) {
    no_result.classList.remove("show-no-result");
  }

  pagination.classList.add("pagination-hidden")
})

// FAVOUIRATE BUTTON
favBtn.addEventListener("click", () => {

  showMovies(1, "desc", favMovies);
  if (favMovies.length === 0) {
    no_result.classList.add("show-no-result");
  }
})

// ALL BUTTON
allBtn.addEventListener("click", () => {
  isDate = false;
  removeNavigationButtonsListner();
  if (ratingToggle.innerText === SORT_ASC_TEXT) {
    ratingToggle.innerText = SORT_DESC_TEXT;
  }
  if (no_result.classList.contains("show-no-result")) {
    no_result.classList.remove("show-no-result");
  }
  init();
})

// NEXT BUTTON
function handleNextButton() {
  if (pageNumber < totalPages) {
    pageNumber++;
    localStorage.setItem("pageNumber", pageNumber);
    if (isDate) {
      showMovies(pageNumber, currentDate);
    }
    else {
      showMovies(pageNumber, currentState);
    }
  }
}

// PREV BUTTON
function handleBackButton() {
  if (pageNumber > 1) {
    pageNumber--;
    localStorage.setItem("pageNumber", pageNumber);
    if (isDate) {
      showMovies(pageNumber, currentDate);
    }
    else {
      showMovies(pageNumber, currentState);
    }
  }
}

//  NAVIGATION FUNCTION -> (NEXT AND PREV EVENT LISTNER)
function addNavigationButtons() {
  nextBtn.addEventListener("click", handleNextButton);
  backBtn.addEventListener("click", handleBackButton);
}

//  REMOVE EVENT LISTNERS FROM BUTTONS
function removeNavigationButtonsListner() {
  nextBtn.removeEventListener("click", handleNextButton);
  backBtn.removeEventListener("click", handleBackButton);
  ratingToggle.removeEventListener("click", handleRating);
  sort_date_btn.removeEventListener("click", sortMovieByDate);
}

// SORT MOVIE BY RATING 
function handleRating(e) {
  currentState = currentState === "desc" ? "asc" : "desc";
  if (no_result.classList.contains("show-no-result")) {
    no_result.classList.remove("show-no-result");
  }
  pageNumber = 1;
  showMovies(pageNumber, currentState);
  e.target.innerText =
    currentState === "desc" ? SORT_DESC_TEXT : SORT_ASC_TEXT;
  isDate = false;
}

//  SORT BY MOVIE BY DATE 
function sortMovieByDate(e) {
  currentDate = currentDate === "descDate" ? "ascDate" : "descDate";
  if (no_result.classList.contains("show-no-result")) {
    no_result.classList.remove("show-no-result");
  }
  pageNumber = 1;
  showMovies(pageNumber, currentDate);
  e.target.innerText =
    currentDate === "descDate" ? SORT_DATE_DESC_TEXT : SORT_DATE_ASC_TEXT;
  isDate = true;
}

//  SORTING FUNCTIONS (DATE & RATINGS)
function addPopularityButton() {
  ratingToggle.addEventListener("click", handleRating);
  sort_date_btn.addEventListener("click", sortMovieByDate);
}

// HEART CLICK HANDLER
function handleHeartClick(e, movie) {
  e.target.classList.toggle("fa-regular");
  e.target.classList.toggle("fa-solid");
  e.target.classList.toggle("red-heart");

  if (e.target.classList.contains("fa-solid")) {
    favMovies.push(movie);
  }
  else {
    favMovies = favMovies.filter((currentMovie) => {
      return currentMovie.id !== movie.id;
    })
  }

  localStorage.setItem("favMovies", JSON.stringify(favMovies));
  console.log(favMovies);

}

// SHOW MOVIES FUNCTION
async function showMovies(pageNumber = 1, sort_by = "desc", customMovieArray = null, currentUrl = "discover", userQuery = "") {

  movieListSection.innerText = "";
  let movieList;

  //FETCHING DATA FROM API BLOCK
  if (!customMovieArray || userQuery) {
    pagination.classList.remove("pagination-hidden");
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZGQ0MTM0ZThlZWJiYWM4Y2NlOTc5OGFhZTllNGUwOCIsInN1YiI6IjY0ZDUwNjU0ZjE0ZGFkMDBlM2I3MzcyZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dMtJNqWI4QlVQUAAHz4Yi60H800ef3qUIto-CGKMNt4'
      },
    };
    let response;
    response = await fetch(
      `https://api.themoviedb.org/3/${currentUrl}/movie?${userQuery ? `query=${userQuery}&` : ""}include_adult=false
    &language=en-US&page=${pageNumber}
    ${userQuery ? "" : `&sort_by=${sort_by === "asc" || sort_by === "ascDate" ? (sort_by === "asc" ? SORT_ASC : SORT_DATE_ASC) : (sort_by == "desc" ? SORT_DESC : SORT_DATE_DESC)}`}`,
      options
    );
    const json = await response.json();
    totalPages = json.total_pages;
    movieList = json.results;
  }
  // FAVOVIRITE BLOCK
  else {
    movieList = customMovieArray;
    pagination.classList.add("pagination-hidden")
  }

  // WHEN IF WILL EXECUTE ALL MOVIE WILL DISPLAY OR ELSE FAVOURITE MOVIES WILL DISPLAYS FROM BELOW LOOP
  for (let movie of movieList) {
    // movie section
    const movieTitle = document.createElement("h2");
    movieTitle.innerText = movie.title;
    const rating = document.createElement("p");
    rating.innerText = movie.vote_average;
    const movieDetails = document.createElement("section");
    movieDetails.appendChild(movieTitle);
    movieDetails.appendChild(rating);
    movieDetails.classList.add("movie-details");

    // image/ banner
    let banner = document.createElement("img");
    banner.src = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
    banner.classList.add("movie-poster");

    // footer
    const footer = document.createElement("footer");
    const date = document.createElement("p");
    date.innerText = `date ${movie.release_date}`;

    // heart
    const heart = document.createElement("i");
    heart.classList.add("fa-regular", "fa-heart", "like");
    // changing the state of heart type
    if (
      favMovies.find((currentMovie) => {
        return currentMovie.id === movie.id
      })
    ) {
      heart.classList.toggle("fa-regular");
      heart.classList.toggle("fa-solid");
      heart.classList.toggle("red-heart");
    }
    heart.id = movie.id;
    heart.addEventListener("click", (e) => {
      handleHeartClick(e, movie)
    });

    // appending to footer
    footer.appendChild(date);
    footer.appendChild(heart);
    // parent
    const movieElement = document.createElement("article");
    movieElement.classList.add("movie");
    movieElement.appendChild(banner);
    movieElement.appendChild(movieTitle);
    movieElement.appendChild(footer);
    movieListSection.appendChild(movieElement);
    pageNumberContainer.innerText = pageNumber;
  }

}


async function init() {
  // pageNumber = localStorage.getItem("pageNumber") ? Number.parseInt(localStorage.getItem("pageNumber")) : 1;
  pageNumber = 1;
  favMovies =
    localStorage.getItem("favMovies") ? JSON.parse(localStorage.getItem("favMovies")) : [];
  await showMovies(pageNumber);
  addNavigationButtons();
  addPopularityButton();
}

init();