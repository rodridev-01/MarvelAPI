const publicKey = "8e7cb5ec3ca060ab1d9c2a445e74f3bf";
const privateKey = "c4570f8988634ee902df4e79a992d2da9ca0bdb2";
const ts = new Date().getTime();
const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

let offset = 0;
const limit = 72;
const apiUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

async function fetchCharacters(offset) {
    try {
        const response = await fetch(`${apiUrl}&offset=${offset}&limit=${limit}`);
        const data = await response.json();
        const characters = data.data.results;

        renderCharacterList(characters);
    } catch (error) {
        console.error("Error fetching Marvel characters:", error);
    }
}

function renderCharacterList(characters) {
    const characterList = document.getElementById("characterList");
    const characterImage = document.getElementById("characterImage");
    const characterName = document.getElementById("characterName");
    const characterDescription = document.getElementById("characterDescription");
    const characterComics = document.getElementById("characterComics");
    const characterSeries = document.getElementById("characterSeries");
    const characterEvents = document.getElementById("characterEvents");
    const characterAliases = document.getElementById("characterAliases");

    characterList.innerHTML = ""; 

    characters.forEach(character => {
        const div = document.createElement("div");
        div.className = "character-option";
        div.innerHTML = `
            <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
            <p>${character.name}</p>
        `;

        div.addEventListener("click", () => {
            characterImage.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
            characterName.textContent = character.name;
            characterDescription.textContent =
                character.description || "No description available.";

            // Mostrar los cómics
            characterComics.innerHTML = character.comics.items
                .slice(0, 5)
                .map(comic => `<li>${comic.name}</li>`)
                .join("");

            // Mostrar las series
            characterSeries.innerHTML = character.series.items
                .slice(0, 5)
                .map(series => `<li>${series.name}</li>`)
                .join("");

            // Mostrar eventos
            characterEvents.innerHTML = character.events.items
                .slice(0, 5)
                .map(event => `<li>${event.name}</li>`)
                .join("");

            // Mostrar los alias
            characterAliases.innerHTML = character.aliases || "No aliases available.";
        });

        characterList.appendChild(div);
    });
}

document.getElementById("prevPage").addEventListener("click", () => {
    if (offset >= limit) {
        offset -= limit;
        fetchCharacters(offset);
    }
});

document.getElementById("nextPage").addEventListener("click", () => {
    offset += limit;
    fetchCharacters(offset);
});

// Cargar la primera página
fetchCharacters(offset);
