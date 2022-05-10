const getCharacters = async (url = "https://swapi.dev/api/people/?page=") => {
  try {
    let random = (Math.random() * 8 + 1) | 0;
    const res = await fetch(url + random);
    if (!res.ok) {
      throw new Error(`Something went wrong ${res.status}`);
    }
    const peopleData = await res.json();
    const peopleArr = [];

    for (let person of peopleData.results) {
      const planet = await fetch(person.homeworld);
      const planetData = await planet.json();
      peopleArr.push({
        name: person.name,
        height: person.height,
        hairColor: person.hair_color,
        planet: { name: planetData.name, population: planetData.population },
      });
    }
    drawData(peopleArr);
  } catch (err) {
    console.log(err);
  }
};

const drawData = (people) => {
  const container = document.querySelector(".container");
  addTitleRow("Star Wars", container);
  addRow(
    ["name", "hair", "height", "planet name", "population"],
    container,
    "headerRow"
  );
  people.forEach((avatar) => {
    addRow(
      [
        avatar.name,
        avatar.hairColor,
        avatar.height,
        avatar.planet.name,
        avatar.planet.population,
      ],
      container,
      "dataRow"
    );
  });
};

const addTitleRow = (title, container) => {
  const titleBox = document.createElement("h1");
  titleBox.classList.add("title");
  titleBox.textContent = title;
  container.appendChild(titleBox);
};

const addRow = (arrOfData, container, className) => {
  const row = document.createElement("div");
  row.classList.add(className);
  arrOfData.forEach((e) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = e;
    row.appendChild(cell);
  });
  container.appendChild(row);
};

getCharacters();
