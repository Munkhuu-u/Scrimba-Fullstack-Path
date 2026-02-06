const body = document.getElementById("body");
const form = document.getElementById("form");
const header = document.getElementById("header");
const search = document.getElementById("search");
const watchlist = document.getElementById("watchlist");
const addToWatchlist = document.getElementById("addToWatchlist");
const movieContainer = document.getElementById("movieContainer");
let watchlistMovies = [];

watchlist.addEventListener("click", (e) => {
  e.preventDefault();
  handleWatchlist();
});

search.addEventListener("click", (e) => {
  e.preventDefault();
  handleSearch();
});

movieContainer.addEventListener("click", (e) => {
  console.log("add to watchlist clicked...");
  handleAddToWatchlist(e.target.dataset.addtowatchlist);
});

function handleWatchlist() {
  console.log("handlewatchlist clicked...");
  header.style.flexDirection = "row-reverse";
  watchlist.classList.remove("closed");
  watchlist.classList.add("opened");
  search.classList.remove("opened");
  search.classList.add("closed");
  form.style.display = "none";
  getFullParameters(JSON.parse(localStorage.getItem("myLeads")));
}

function handleSearch() {
  form.style.display = "flex";
  console.log("handleSearch clicked...");
  header.style.flexDirection = "row";
  search.classList.remove("closed");
  search.classList.add("opened");
  watchlist.classList.remove("opened");
  watchlist.classList.add("closed");
}

function handleAddToWatchlist(id) {
  console.log("handleAddToWatchlist working: ", id);
  watchlistMovies.push(id);
  console.log(watchlistMovies);
  localStorage.setItem("watchlistMovies", JSON.stringify(watchlistMovies));
}

form.addEventListener("submit", (e) => {
  console.log("submitted");
  e.preventDefault();
  e.target.movieName.blur();
  handleSubmit(e.target.movieName.value);
});

async function handleSubmit(name) {
  const res = await fetch(`http://www.omdbapi.com/?s=${name}&apikey=1e6b5110`);
  const data = await res.json();
  const imdbIDs = data.Search.map((movie) => movie.imdbID);
  getFullParameters(imdbIDs);
}

async function getFullParameters(IDs) {
  console.log("getFullParameters(IDs): ", IDs);
  let movies = [];
  for (const id of IDs) {
    const res = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=1e6b5110`);
    const data = await res.json();
    movies.push(data);
  }

  renderMovies(movies, IDs);
}

function renderMovies(movies, IDs) {
  let context = "";

  movies.forEach((movie, index) => {
    context += `<div class="movie">
            <div class="movieImage" id="${movie.imdbID}"></div>
            <div class="textArea">
                <div class="movieTitleContainer">
                    <p class="moiveTitle">${movie.Title}</p>
                    <p>⭐</p>
                    <p class="movieRating">${movie.Ratings[0].Value}</p>
                </div>
                <div class="movieProps">
                    <p class="duration">${movie.Runtime}</p>
                    <p class="genres">${movie.Genre}</p>
                    <button class="addToWatchlist" data-addToWatchlist="${movie.imdbID}"> + Watchlist</button>
                </div>
              <p class="description">${movie.Plot}</p>
            </div>
          </div>`;
    if (index + 1 !== movies.length) {
      context += `<div class="seperator"></div>`;
    }
  });

  document.getElementById("whenEmpty").style.display = "none";

  movieContainer.innerHTML = context;

  IDs.forEach((id, index) => {
    document.getElementById(
      `${id}`
    ).style.backgroundImage = `url(${movies[index].Poster})`;
  });
}
