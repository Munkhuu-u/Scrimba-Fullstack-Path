const fallbackMovies = [
  {
    title: "The Shawshank Redemption (1994)",
    plot:
      "Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency.",
  },
  {
    title: "The Martian (2015)",
    plot:
      "An astronaut stranded on Mars uses science and ingenuity to survive and signal for rescue.",
  },
  {
    title: "Interstellar (2014)",
    plot:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  },
  {
    title: "Knives Out (2019)",
    plot:
      "A detective investigates the death of a patriarch of an eccentric, combative family.",
  },
  {
    title: "Coco (2017)",
    plot:
      "A young boy journeys to the Land of the Dead to uncover the history of his music-loving family.",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  initHomePage();
  initQuestionPage();
  initMoviePage();
});

function initHomePage() {
  const startButton = document.getElementById("btn-start");
  if (!startButton) {
    return;
  }
  startButton.addEventListener("click", handleStart);
}

function handleStart() {
  const numPeopleInput = document.getElementById("num-people");
  const timeAvailableInput = document.getElementById("time-available");

  const numPeople = parseInt(numPeopleInput.value, 10);
  const timeAvailable = timeAvailableInput.value.trim();

  if (!numPeople || numPeople < 1) {
    numPeopleInput.focus();
    return;
  }

  sessionStorage.setItem("numPeople", numPeople);
  sessionStorage.setItem("timeAvailable", timeAvailable || "any");
  sessionStorage.setItem("currentPerson", 1);
  sessionStorage.setItem("responses", JSON.stringify([]));

  window.location.href = "./popchoice/question.html";
}

function initQuestionPage() {
  const nextButton = document.getElementById("btn-next");
  if (!nextButton) {
    return;
  }

  const numPeople = parseInt(sessionStorage.getItem("numPeople") || "1", 10);
  let currentPerson = parseInt(
    sessionStorage.getItem("currentPerson") || "1",
    10,
  );
  let responses = JSON.parse(sessionStorage.getItem("responses") || "[]");

  if (Number.isNaN(numPeople) || numPeople < 1) {
    window.location.href = "../index.html";
    return;
  }

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => selectChip(chip));
  });

  nextButton.addEventListener("click", handleNext);
  render();

  function render() {
    document.getElementById("person-number").textContent = currentPerson;

    const pct = ((currentPerson - 1) / numPeople) * 100;
    document.getElementById("progress-fill").style.width = `${pct}%`;

    document.getElementById("q-fav-movie").value = "";
    document.getElementById("q-island").value = "";
    document.querySelectorAll(".chip").forEach((chip) => {
      chip.classList.remove("active");
    });

    nextButton.textContent =
      currentPerson === numPeople ? "Get Movie" : "Next Person";
  }

  function selectChip(element) {
    const { group } = element.dataset;

    document
      .querySelectorAll(`.chip[data-group="${group}"]`)
      .forEach((chip) => chip.classList.remove("active"));

    element.classList.add("active");
  }

  function getChip(group) {
    const selectedChip = document.querySelector(
      `.chip[data-group="${group}"].active`,
    );

    return selectedChip ? selectedChip.dataset.val : null;
  }

  async function handleNext() {
    const data = {
      person: currentPerson,
      favMovie: document.getElementById("q-fav-movie").value.trim(),
      newOrClassic: getChip("newclassic"),
      mood: getChip("mood"),
      island: document.getElementById("q-island").value.trim(),
    };

    responses.push(data);
    sessionStorage.setItem("responses", JSON.stringify(responses));

    if (currentPerson < numPeople) {
      currentPerson += 1;
      sessionStorage.setItem("currentPerson", currentPerson);
      render();
      restartQuestionAnimation();
      return;
    }

    await fetchMovies(responses, nextButton);
  }
}

function restartQuestionAnimation() {
  const stack = document.querySelector(".question-stack");
  if (!stack) {
    return;
  }

  stack.classList.remove("stagger");
  void stack.offsetHeight;
  stack.classList.add("stagger");
}

async function fetchMovies(responses, button) {
  button.textContent = "Finding your movie…";
  button.disabled = true;

  const duration = sessionStorage.getItem("timeAvailable") || "any";

  const summary = responses
    .map(
      (response) =>
        `Person ${response.person}: Fav movie — "${response.favMovie || "none"}". Mood: ${response.mood || "any"}. New or Classic: ${response.newOrClassic || "any"}. Island person: "${response.island || "none"}".`,
    )
    .join(" ");

  const prompt = `What movie best fits this group?\n${summary}`;

  try {
    const response = await fetch("/api/movieRecommendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        responses,
        peopleCount: responses.length,
        duration,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const imageResponse = await fetch("https://api.themoviedb.org/3/movie/11",{
      method: "GET",
      headers: {"Authorization": "Bearer <<access_token>>"},
      body: JSON.stringify({
        messages:
      })
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    const movies = normalizeMoviesResponse(data);

    sessionStorage.setItem("movies", JSON.stringify(movies));
    sessionStorage.setItem("movieIndex", "0");
    window.location.href = "movie.html";
  } catch (error) {
    console.error(error);
    sessionStorage.setItem("movies", JSON.stringify(fallbackMovies));
    sessionStorage.setItem("movieIndex", "0");
    window.location.href = "movie.html";
  }
}

function normalizeMoviesResponse(data) {
  const payload = data && typeof data === "object" && "movie" in data ? data.movie : data;

  if (data?.status && data.status !== "Success" && !payload) {
    throw new Error(data.message || "Movie recommendation failed");
  }

  const movies = Array.isArray(payload) ? payload : payload ? [payload] : [];
  const normalized = movies.map(normalizeMovie).filter(Boolean);

  if (!normalized.length) {
    throw new Error("Movie response was empty");
  }

  return normalized;
}

function normalizeMovie(movie) {
  if (!movie || typeof movie !== "object") {
    return null;
  }

  const posterURL =
    movie.posterURL ||
    movie.posterUrl ||
    movie.poster_url ||
    movie.imageURL ||
    movie.imageUrl ||
    movie.image ||
    movie.url ||
    "";
  const releaseYear = movie.releaseYear || extractReleaseYear(movie.title);
  const title = movie.title || "Untitled Movie";
  const plot = movie.plot || movie.description || movie.content || "No description available.";

  return {
    title,
    plot,
    content: movie.content || plot,
    director: movie.director || "",
    genre: movie.genre || "",
    rating: movie.rating ?? "",
    stars: Array.isArray(movie.stars) ? movie.stars : [],
    writers: Array.isArray(movie.writers) ? movie.writers : [],
    posterURL,
    releaseYear: releaseYear || "",
  };
}

function extractReleaseYear(title) {
  const match = title?.match(/\((\d{4})\)/);
  return match ? match[1] : "";
}

function initMoviePage() {
  const movieView = document.getElementById("movie-view");
  const nextMovieButton = document.getElementById("btn-next-movie");

  if (!movieView || !nextMovieButton) {
    return;
  }

  const rawMovies = sessionStorage.getItem("movies");
  if (!rawMovies) {
    window.location.href = "../index.html";
    return;
  }

  const movies = JSON.parse(rawMovies);
  let movieIndex = parseInt(sessionStorage.getItem("movieIndex") || "0", 10);

  nextMovieButton.addEventListener("click", nextMovie);

  setTimeout(() => {
    document.getElementById("loading-view").classList.add("is-hidden");
    movieView.classList.remove("is-hidden");
    showMovie(movies[movieIndex], movieIndex, movies.length);
  }, 900);

  function showMovie(movie, index, totalMovies) {
    document.getElementById("movie-title").textContent = movie.title;
    document.getElementById("movie-desc").textContent =
      movie.plot || movie.description || movie.content || "No description available.";
    nextMovieButton.textContent = index === totalMovies - 1 ? "Start Over" : "Next Movie";

    const posterWrap = document.getElementById("poster-wrap");
    const oldImage = posterWrap.querySelector("img");
    const placeholder = posterWrap.querySelector(".poster-placeholder");

    if (oldImage) {
      oldImage.remove();
    }

    if (placeholder) {
      placeholder.classList.remove("is-hidden");
    }

    const titleOnly = movie.title.replace(/\s*\(\d{4}\)\s*$/, "").trim();
    const year = movie.releaseYear || extractReleaseYear(movie.title);
    const query = encodeURIComponent(titleOnly);

    const image = new Image();
    let triedOmdbFallback = false;

    image.onload = () => {
      if (placeholder) {
        placeholder.classList.add("is-hidden");
      }

      image.className = "poster-image";
      image.alt = movie.title;
      posterWrap.insertBefore(
        image,
        posterWrap.querySelector(".poster-overlay"),
      );
    };
    image.onerror = () => {
      if (movie.posterURL && !triedOmdbFallback) {
        triedOmdbFallback = true;
        image.src = `https://img.omdbapi.com/?t=${query}&y=${year}&apikey=trilogy&h=400`;
      }
    };
    image.src = movie.posterURL || `https://img.omdbapi.com/?t=${query}&y=${year}&apikey=trilogy&h=400`;
  }

  function nextMovie() {
    if (movieIndex >= movies.length - 1) {
      sessionStorage.removeItem("movieIndex");
      sessionStorage.removeItem("movies");
      sessionStorage.removeItem("currentPerson");
      sessionStorage.removeItem("responses");
      sessionStorage.removeItem("numPeople");
      sessionStorage.removeItem("timeAvailable");
      window.location.href = "../index.html";
      return;
    }

    movieIndex += 1;
    sessionStorage.setItem("movieIndex", movieIndex);

    movieView.style.animation = "none";
    void movieView.offsetHeight;
    movieView.style.animation = "";

    showMovie(movies[movieIndex], movieIndex, movies.length);
  }
}
