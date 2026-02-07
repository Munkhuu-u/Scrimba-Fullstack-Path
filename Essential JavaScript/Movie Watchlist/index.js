const body = document.getElementById("body");
const form = document.getElementById("form");
const header = document.getElementById("header");
const search = document.getElementById("search");
const watchlist = document.getElementById("watchlist");
const addToWatchlist = document.getElementById("addToWatchlist");
const movieContainer = document.getElementById("movieContainer");
const goToSearch = document.getElementById("goToSearch");

let watchlistOpened = false;

document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "goToSearch") {
    console.log("go to clicked");
    handleSearch();
  }
});

watchlist.addEventListener("click", (e) => {
  e.preventDefault();
  handleWatchlist();
});

search.addEventListener("click", (e) => {
  e.preventDefault();
  handleSearch();
});

movieContainer.addEventListener("click", (e) => {
  if (e.target.dataset.addtowatchlist) {
    if (watchlistOpened) {
      handleRemovefromWatchlist(e.target.dataset.addtowatchlist);
    } else {
      handleAddToWatchlist(e.target.dataset.addtowatchlist);
    }
  }
});

function handleWatchlist() {
  //   Styling rows start here
  movieContainer.innerHTML = `<p>Your watchlist is looking a little empty...</p><button id="goToSearch">+ Let's add some movies!</button>`;

  header.style.flexDirection = "row-reverse";
  watchlist.classList.remove("closed");
  watchlist.classList.add("opened");
  search.classList.remove("opened");
  search.classList.add("closed");
  form.style.display = "none";
  //   Styling rows end here

  watchlistOpened = true;

  console.log(JSON.parse(localStorage.getItem("watchlistMovies")) != null);

  if (JSON.parse(localStorage.getItem("watchlistMovies")) != null) {
    getFullParameters(JSON.parse(localStorage.getItem("watchlistMovies")));
  }
}

function handleSearch() {
  form.style.display = "flex";
  header.style.flexDirection = "row";
  search.classList.remove("closed");
  search.classList.add("opened");
  watchlist.classList.remove("opened");
  watchlist.classList.add("closed");
  watchlistOpened = false;
  movieContainer.innerHTML = `<img src="icons/film.svg" alt="film-icon" /><p>Start exploring</p>`;
}

function handleAddToWatchlist(id) {
  let watchlistMovies =
    JSON.parse(localStorage.getItem("watchlistMovies")) || [];

  watchlistMovies.push(id);
  localStorage.setItem("watchlistMovies", JSON.stringify(watchlistMovies));
}

function handleRemovefromWatchlist(id) {
  console.log("handleRemovefromWatchlist...", id);
  let watchlistMovies =
    JSON.parse(localStorage.getItem("watchlistMovies")) || [];

  watchlistMovies = watchlistMovies.filter((movie) => {
    return movie !== id;
  });

  localStorage.setItem("watchlistMovies", JSON.stringify(watchlistMovies));
  getFullParameters(JSON.parse(localStorage.getItem("watchlistMovies")));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.movieName.blur();
  handleSubmit(e.target.movieName.value);
});

async function handleSubmit(name) {
  const res = await fetch(`http://www.omdbapi.com/?s=${name}&apikey=1e6b5110`);
  const data = await res.json();

  if (data.Response === "True") {
    const imdbIDs = data.Search.map((movie) => movie.imdbID);
    getFullParameters(imdbIDs);
  } else {
    console.log("data: ", data);
    movieContainer.innerHTML =
      "<p>Unable to find what you’re looking for. Please try another search.</p>";
  }
}

async function getFullParameters(IDs) {
  console.log("getFullParameters", IDs);
  let movies = [];
  for (const id of IDs) {
    const res = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=1e6b5110`);
    const data = await res.json();
    movies.push(data);
  }

  renderMovies(movies, IDs);
}

function renderMovies(movies, IDs) {
  //   console.log("movies: ", movies);

  let context = "";

  movies.forEach((movie, index) => {
    const part1 = movie.Plot.substring(0, 80);
    const part2 = movie.Plot.substring(80, movie.Plot.length);

    context += `<div class="movie">
            <div class="movieImageContainer" id="">
                <img src="${
                  movie.Poster &&
                  movie.Poster.toLowerCase() !== "n/a" &&
                  movie.Poster.startsWith("http")
                    ? movie.Poster
                    : "images/holder.png"
                }" alt="${
      movie.Title
    }" onerror="this.onerror=null; this.src='./images/holder.png';">
            </div>
            <div class="textArea">
                <div class="movieTitleContainer">
                    <p class="moiveTitle">${movie.Title}</p>
                    <p>⭐</p>
                    <p class="movieRating">${
                      movie.Ratings?.[0] !== undefined
                        ? movie.Ratings[0].Value
                        : ""
                    }</p>
                </div>
                <div class="movieProps">
                    <p class="duration">${movie.Runtime}</p>
                    <p class="genres">${movie.Genre}</p>
                    <button class="addToOrRemoveFromWatchlist" data-addToWatchlist="${
                      movie.imdbID
                    }">Watchlist</button>
                </div>
              <div class="descriptionContainer">
                <span class="descFirst">${part1}</span>
                <span class="dots">...</span>
                <span class="descLast">${part2}</span>         
                <button class="readMoreBtn">Read more</button>
              </div>
            </div>
          </div>`;

    if (index + 1 !== movies.length) {
      context += `<div class="seperator"></div>`;
    }
  });

  //   console.log("context: ", context);

  movieContainer.innerHTML = context;

  if (watchlistOpened) {
    document.querySelectorAll(".addToOrRemoveFromWatchlist").forEach((el) => {
      el.style.backgroundImage = "url('icons/minus.svg')";
    });
  } else {
    document.querySelectorAll(".addToOrRemoveFromWatchlist").forEach((el) => {
      el.style.backgroundImage = "url('icons/plus.svg')";
    });
  }

  document.querySelectorAll(".readMoreBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const part2 = btn.previousElementSibling;
      const dots = part2.previousElementSibling;

      console.log(part2);
      console.log(part2.style.display);

      if (part2.style.display === "none" || part2.style.display === "") {
        console.log("true");
        part2.style.display = "inline";
        dots.style.display = "none";
        btn.innerText = "Read less";
      } else {
        console.log("false");
        part2.style.display = "none";
        console.log(part2.style.display);
        dots.style.display = "inline";
        btn.innerText = "Read more";
      }
    });
  });
}
