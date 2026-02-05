const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
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
                    <button class="addToWatchlist">+ Watchlist</button>
                </div>
              <p class="description">${movie.Plot}</p>
            </div>
          </div>`;
    if (index + 1 !== movies.length) {
      context += `<div class="seperator"></div>`;
    }
  });

  document.getElementById("whenEmpty").style.display = "none";

  document.getElementById("movieContainer").innerHTML = context;

  IDs.forEach((id, index) => {
    document.getElementById(
      `${id}`
    ).style.backgroundImage = `url(${movies[index].Poster})`;
  });
}
