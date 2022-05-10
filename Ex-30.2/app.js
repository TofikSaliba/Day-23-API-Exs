const getMovie = async (
  movie,
  type,
  url = "http://www.omdbapi.com/?apikey=1150f23b&t="
) => {
  const errorDiv = document.querySelector(".error");
  errorDiv.innerText = "";
  try {
    const res = await fetch(`${url}${movie}&type=${type}`);
    if (!res.ok) {
      throw new Error(`Something went wrong ${res.status}`);
    }
    const data = await res.json();
    if (data.Error) {
      throw new Error(data.Error);
    }
    const movieObj = {
      poster: data.Poster,
      title: data.Title,
      genre: data.Genre,
      year: data.Year,
      plot: data.Plot,
      director: data.Director,
      actors: data.Actors,
      ratings: data.Ratings,
    };
    setDOMEl(movieObj);
  } catch (err) {
    if (err.message === "Failed to fetch") {
      errorDiv.innerText = `Url is broken! ${err}. try again later.`;
    } else {
      errorDiv.innerText = err;
    }
    console.log(err);
  }
};

const setDOMEl = (movie) => {
  document.querySelector(".container").style.display = "flex";
  const poster = document.querySelector("#poster");
  const ratings = document.querySelector(".ratings");
  const title = document.querySelector("#title");
  const genre = document.querySelector(".genre");
  const year = document.createElement("span");
  const plot = document.querySelector(".plot");
  const director = document.querySelector(".director");
  const actors = document.querySelector(".actors");
  poster.src =
    movie.poster === "N/A"
      ? "https://fireteller.com/wp-content/uploads/2020/09/Poster_Not_Available2.jpg"
      : movie.poster;
  let ratingStr = "";
  movie.ratings.forEach((rate, idx) => {
    if (rate.Source === "Rotten Tomatoes") {
      ratingStr += "Rotten Tomatoes: ";
    } else if (rate.Source === "Metacritic") {
      ratingStr += "Metacritic: ";
    } else {
      ratingStr += "Imdb: ";
    }
    ratingStr +=
      idx === movie.ratings.length - 1 ? rate.Value : rate.Value + " | ";
  });
  ratings.innerText = ratingStr;
  title.innerText = movie.title;
  year.innerText = " (" + movie.year + ")";
  title.appendChild(year);
  genre.innerText = movie.genre;
  plot.innerText = movie.plot;
  director.innerText = movie.director;
  actors.innerText = "Starring: " + movie.actors;
};

const readInput = () => {
  const select = document.querySelector("#select");
  const searchBtn = document.querySelector("#search");
  const errorDiv = document.querySelector(".error");
  const inp = document.querySelector("#input");
  inp.focus();
  searchBtn.addEventListener("click", () => {
    if (select.value === "Search type") {
      errorDiv.innerText = "Must choose search type!";
      return;
    }
    getMovie(inp.value, select.value);
    inp.value = "";
    inp.focus();
  });
  inp.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      if (select.value === "Search type") {
        errorDiv.innerText = "Must choose search type!";
        return;
      }
      getMovie(inp.value, select.value);
      inp.value = "";
    }
  });
  document.body.addEventListener("keydown", () => inp.focus());
};

readInput();
