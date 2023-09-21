import { setCookie, getCookie, deleteCookie } from "./cookies.js";
const menuDiv = document.querySelector("#menu");
const gameDiv = document.querySelector("#game");

// Menü
const nameText = document.querySelector("#name");
let name1;
const map = document.querySelector("#map");
const games = document.querySelector("#games");
const isSaved = document.querySelector("#isSaved");
document.querySelector("#start").addEventListener("click", startGame);
const continueButton = document.querySelector("#continue");
continueButton.addEventListener("click", continueGame);
var pastGames;
//setCookie("pastGames", "");
//setCookie("savedGame", "");
refresh();

//Játék
const table = document.querySelector("tbody");
table.addEventListener("click", clickTile);
const output = document.querySelector("#output");
const time = document.querySelector("#time");
const saveGameButton = document
  .querySelector("#saveGame")
  .addEventListener("click", saveGame);
var storage;
let allTiles;
let mapSize;
let lightbulb = "&#128161;";
let yellow = "#FFEC1C";
let red = "#F08080";
let mapName;
let startTime;
let endTime;
let won;

function startGame() {
  if (nameText.value === "") return;
  won = false;
  name1 = nameText.value;
  menuDiv.hidden = true;
  gameDiv.hidden = false;
  output.innerText = name1 + " játszik";
  if (map.value == "map1") {
    mapName = "Könnyű";
    mapSize = 7;
    createMap(mapSize, [
      [0, 3, 1],
      [1, 1, 0],
      [1, 5, 2],
      [3, 0, -1],
      [3, 3, -1],
      [3, 6, -1],
      [5, 1, -1],
      [5, 5, 2],
      [6, 3, 3],
    ]);
  } else if (map.value == "map2") {
    mapName = "Haladó";
    mapSize = 7;
    createMap(mapSize, [
      [0, 2, 0],
      [0, 4, -1],
      [2, 0, -1],
      [2, 2, -1],
      [2, 4, 3],
      [2, 6, -1],
      [3, 3, 1],
      [4, 0, 2],
      [4, 2, -1],
      [4, 4, -1],
      [4, 6, -1],
      [6, 2, -1],
      [6, 4, 2],
    ]);
  } else if (map.value == "map3") {
    mapName = "Extrém";
    mapSize = 10;
    createMap(mapSize, [
      [0, 1, -1],
      [1, 5, 3],
      [1, 7, 2],
      [1, 9, -1],
      [2, 1, 0],
      [2, 2, -1],
      [2, 7, -1],
      [3, 4, -1],
      [4, 1, 1],
      [4, 4, -1],
      [4, 5, 1],
      [4, 6, -1],
      [5, 3, -1],
      [5, 4, -1],
      [5, 5, -1],
      [5, 8, 3],
      [6, 5, -1],
      [7, 2, 1],
      [7, 7, 0],
      [7, 8, -1],
      [8, 0, 3],
      [8, 2, -1],
      [8, 4, 0],
      [9, 8, 0],
    ]);
  }
}

function createMap(size, blackTiles) {
  allTiles = Array.from(Array(size), () => new Array(size));
  let counter = 0;
  for (let i = 0; i < size; i++) {
    const row = table.insertRow();
    for (let j = 0; j < size; j++) {
      if (
        counter < blackTiles.length &&
        i == blackTiles[counter][0] &&
        j == blackTiles[counter][1]
      ) {
        row.insertCell().style.backgroundColor = "black";
        allTiles[i][j] = ["black", blackTiles[counter][2]];
        if (blackTiles[counter][2] != -1) {
          table.rows[i].cells[j].innerHTML = "" + blackTiles[counter][2];
        } else {
          table.rows[i].cells[j].innerHTML = "";
        }
        counter++;
      } else {
        row.insertCell();
        allTiles[i][j] = ["white", 0];
      }
    }
  }
  startTime = Date.now();
  displayTime();
}

function displayTime() {
  time.innerText = "Eltelt idő: " + Math.floor((Date.now() - startTime) / 1000);
  setTimeout(() => displayTime(), 1000);
}

function saveGame() {
  storage = "" + map.value + "|" + name1 + "|" + (Date.now() - startTime) + "|";
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      if (table.rows[i].cells[j].value == "bulb") {
        storage += i + "," + j + "|";
      }
    }
  }
  setCookie("savedGame", storage);
  table.innerHTML = "";
  menuDiv.hidden = false;
  gameDiv.hidden = true;
  refresh();
}

function continueGame() {
  storage = getCookie("savedGame").split("|");
  map.value = storage[0];
  nameText.value = storage[1];
  startGame();
  startTime = Date.now() - parseInt(storage[2]);
  for (let i = 3; i < storage.length; i++) {
    if (storage[i] != "") {
      let position = storage[i].split(",");
      placeBulb(parseInt(position[0]), parseInt(position[1]));
    }
  }
}

function clickTile(e) {
  if (e.target.matches("td")) {
    const row = e.target.closest("tr").rowIndex;
    const col = e.target.closest("td").cellIndex;
    if (allTiles[row][col][0] == "white") {
      placeBulb(row, col);
    }
  }
}

function placeBulb(row, col) {
  const cell = table.rows[row].cells[col];
  if (cell.innerHTML == "") {
    cell.innerHTML = lightbulb;
    cell.value = "bulb";
    colorAllDirection(row, col, true);
    allTiles[row][col][1]++;
  } else {
    cell.innerHTML = "";
    cell.value = "";
    colorAllDirection(row, col, false);
    allTiles[row][col][1]--;
  }
}

function colorAllDirection(row, col, l) {
  colorInDirection(row + 1, col, 1, 0, l); //le
  colorInDirection(row - 1, col, -1, 0, l); //fel
  colorInDirection(row, col + 1, 0, 1, l); //jobbra
  colorInDirection(row, col - 1, 0, -1, l); //balra
}

function colorInDirection(row, col, rowx, colx, l) {
  let temp = -1;
  if (l) {
    temp = 1;
  }
  if (isInPlayArea(row, col) && !isBlack(row, col)) {
    allTiles[row][col][1] += temp;
    row += rowx;
    col += colx;
    colorAllTiles();
    setTimeout(() => colorInDirection(row, col, rowx, colx, l), 100);
  } else {
    colorAllTiles();
    if (checkWin() && !won) {
      won = true;
      endTime = Math.floor((Date.now() - startTime) / 1000);
      setTimeout(function () {
        alert("Gratulálok, " + endTime + " másodperc alatt nyertél!");
        setCookie(
          "pastGames",
          getCookie("pastGames") +
            name1 +
            " ideje a(z) " +
            mapName +
            " pályán: " +
            endTime +
            " másodperc." +
            "|"
        );
        table.innerHTML = "";
        menuDiv.hidden = false;
        gameDiv.hidden = true;
        refresh();
      }, 50);
    }
  }
}

function refresh() {
  games.innerHTML = "";
  pastGames = getCookie("pastGames").split("|");
  for (let i = 0; i < pastGames.length; i++) {
    if (pastGames[i] != "") {
      games.innerHTML += "<li>" + pastGames[i] + "</li>";
    }
  }
  if (getCookie("savedGame") == "") {
    isSaved.innerHTML = "Nincs";
    continueButton.disabled = true;
  } else {
    storage = getCookie("savedGame").split("|");
    isSaved.innerHTML = "Van, " + storage[1] + " mentése.";
    continueButton.disabled = false;
  }
}

function colorAllTiles() {
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      if (allTiles[i][j][0] == "white") {
        if (allTiles[i][j][1] == 0) {
          table.rows[i].cells[j].style.backgroundColor = "white";
        } else {
          if (table.rows[i].cells[j].value == "bulb" && allTiles[i][j][1] > 1) {
            table.rows[i].cells[j].style.backgroundColor = red;
          } else {
            table.rows[i].cells[j].style.backgroundColor = yellow;
          }
        }
      } else {
        if (isBlackCorrect(i, j)) {
          table.rows[i].cells[j].style.color = "lime";
        } else {
          table.rows[i].cells[j].style.color = "white";
        }
      }
    }
  }
}

function isBlack(row, col) {
  return allTiles[row][col][0] == "black";
}

function isInPlayArea(row, col) {
  return row < mapSize && row >= 0 && col < mapSize && col >= 0;
}

function isBlackCorrect(row, col) {
  let n = allTiles[row][col][1];
  if (n == -1) return true;
  let temp = 0;
  if (isInPlayArea(row + 1, col)) {
    if (table.rows[row + 1].cells[col].value == "bulb") {
      temp++;
    }
  }
  if (isInPlayArea(row - 1, col)) {
    if (table.rows[row - 1].cells[col].value == "bulb") {
      temp++;
    }
  }
  if (isInPlayArea(row, col + 1)) {
    if (table.rows[row].cells[col + 1].value == "bulb") {
      temp++;
    }
  }
  if (isInPlayArea(row, col - 1)) {
    if (table.rows[row].cells[col - 1].value == "bulb") {
      temp++;
    }
  }
  if (n == temp) return true;
  return false;
}

function checkWin() {
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      if (!isBlack(i, j)) {
        if (allTiles[i][j][1] == 0) {
          return false;
        }
        if (
          table.rows[i].cells[j].style.backgroundColor == "rgb(240, 128, 128)"
        ) {
          return false;
        }
      } else {
        if (!isBlackCorrect(i, j)) {
          return false;
        }
      }
    }
  }
  return true;
}
