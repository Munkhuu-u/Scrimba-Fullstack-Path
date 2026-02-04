const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit(e.target.movieName.value);
});

async function handleSubmit(name) {
  const res = await fetch(`http://www.omdbapi.com/?s=${name}&apikey=1e6b5110`);
  const data = await res.json();
  const imdbIDs = data.Search.map((movie) => movie.imdbID);
  getFullParameters(imdbIDs);
}

function getFullParameters(IDs) {
  let movies = new Array();
  IDs.forEach(async (id) => {
    const res = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=1e6b5110`);
    const data = await res.json();
    movies.push(data);
  });
  renderMovies(movies);
}

function renderMovies(movies) {
  console.log("movies: ", movies);
  let arr = Object.values(movies);
  console.log("arr: ", arr);
  console.log(typeof movies);
  let context = "";
  movies.forEach((movie) => {
    console.log("forEach working...");
    context += `<div class="movie">
        <div>
          <img src="${movie.Poster}" alt="poster-image">
        </div>
        <div class="textArea">
          <p class="moiveTitle">${movie.Title}</p>
          <div class="movieProps">
            <p class="duration">${movie.RunTime}</p>
            <p class="genres">${movie.Genre}</p>
            <button class="addToWatchlist">+</button>
          </div>
          <p class="description">${movie.Description}</p>
        </div>
      </div>`;
  });
  console.log("context: ", context);
  document.getElementById("movieContainer").innerHTML = context;
}
