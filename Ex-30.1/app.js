const getProfile = async (
  user,
  users,
  url = "https://api.github.com/users/"
) => {
  const errorDiv = document.querySelector(".error");
  errorDiv.innerText = "";
  try {
    const res = await fetch(url + user);
    if (!res.ok) {
      throw new Error(`Profile not found: ${res.status}`);
    }
    if (users.includes(user.toLowerCase())) {
      errorDiv.innerText = `User card is already displayed! try another`;
      return;
    } else {
      users.push(user.toLowerCase());
    }
    const data = await res.json();
    const userObj = {
      avatar: data.avatar_url,
      name: data.name,
      repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      url: data.html_url,
    };
    setDOMEl(userObj);
  } catch (err) {
    if (err.message === "Failed to fetch") {
      errorDiv.innerText = `Url is broken! ${err}. try again later.`;
    } else {
      errorDiv.innerText = err;
    }
    console.log(err);
  }
};

const setDOMEl = ({ avatar, name, repos, followers, following, url }) => {
  const card = document.createElement("div");
  const img = document.createElement("img");
  const header = document.createElement("h1");
  const info = document.createElement("p");
  card.classList.add("card");
  card.style.cursor = "pointer";
  img.src = avatar;
  header.textContent = name;
  info.innerText = `Public Repos: ${repos}
  Followers: ${followers} , Following: ${following}`;
  card.appendChild(img);
  card.appendChild(header);
  card.appendChild(info);
  document.querySelector(".container").appendChild(card);
  card.addEventListener("click", () => {
    open(url, "_blank");
  });
};

const readInput = () => {
  const users = [];
  const searchBtn = document.querySelector("#search");
  const inp = document.querySelector("#input");
  inp.focus();
  searchBtn.addEventListener("click", () => {
    getProfile(inp.value, users);
    inp.value = "";
    inp.focus();
  });
  inp.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      getProfile(inp.value, users);
      inp.value = "";
    }
  });
  document.body.addEventListener("keydown", () => inp.focus());
};

readInput();
