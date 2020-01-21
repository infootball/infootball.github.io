const base_url = "https://api.football-data.org/v2";
const api_token = "adcbb9ea1998495fab96bf17b2b62c2d";

const fetchApi = function (url) {
  return fetch(url, {
    headers: {
      'X-Auth-Token': api_token
    }
  })
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getStandings() {
  if ("caches" in window) {
    caches.match(`${base_url}/competitions/2001/standings`).then(function (response) {
      if (response) {
        response.json().then(data => standingsComp(data));
      }
    });
  }

  fetchApi(`${base_url}/competitions/2001/standings`)
    .then(status)
    .then(json)
    .then(data => standingsComp(data))
    .catch(error);
}

function getTeamById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(`${base_url}/teams/${idParam}`).then(function (response) {
        if (response) {
          response.json().then(data => {
            teamByIdComp(data)
            resolve(data)
          })
        }
      });
    }

    fetchApi(`${base_url}/teams/${idParam}`)
      .then(status)
      .then(json)
      .then(data => {
        teamByIdComp(data)
        resolve(data)
      })
  })
}

function getFavoriteTeams() {
  getAll().then(function (teams) {
    var teamsHTML = ""

    if (0 !== teams.length) {
      teams.forEach(function (team) {
        teamsHTML += `
          <div class="col s12 m6">
            <div class="card center-align" style="margin-top: 24px;">
              <div class="card-image" style="padding: 24px; padding-bottom: 0px;">
                <img
                  src="${team.crestUrl}"
                  height="200"
                  style="object-fit: contain"
                  onerror="this.onerror=null;this.src='/default.jpg';"
                />
              </div>
              <div class="card-content">
                <a
                  class="card-title"
                  href="./team.html?id=${team.id}&favorited=true"
                >${team.name} (${team.shortName})</a>
                <div class="row">
                  <p class="col s12">Area</p>
                  <p class="col s12"><b>${team.area.name}</b></p>
                </div>
                <div class="row">
                  <p class="col s12">Address</p>
                  <p class="col s12"><b>${team.address}</b></p>
                </div>
                <div class="row">
                  <p class="col s12">Phone</p>
                  <p class="col s12"><b>${team.phone}</b></p>
                </div>
                <div class="row">
                  <p class="col s12">Email</p>
                  <a class="col s12" href="mailto:${team.email}" style="overflow-wrap: break-word;">${team.email}</a>
                </div>
                <div class="row">
                  <p class="col s12">Website</p>
                  <a class="col s12" href="${team.website}" style="overflow-wrap: break-word;">${team.website}</a>
                </div>
              </div>
            </div>
          </div>
        `;
      })
    } else {
      teamsHTML = '<h5>Tidak ada tim favorite :(</h5>'
    }
    document.getElementById("favorite-teams").innerHTML = teamsHTML
  })
}

function getFavoriteTeamById() {
  var urlParams = new URLSearchParams(window.location.search)
  var idParam = urlParams.get('id')

  getById(idParam).then(data => teamByIdComp(data))
}

/************
* COMPONENT *
************/
standingsComp = (data) => {
  var competition = data.competition
  var startDate = new Date(data.season.startDate)
  var endDate = new Date(data.season.endDate)
  var standings = data.standings

  var headerStandingHTML = `
    <div>
      <h2>${competition.name}</h2>
      <p>${String(startDate).substr(0, 3)}, ${startDate.getDate()}/${startDate.getMonth()}/${startDate.getFullYear()} - ${String(endDate).substr(0, 3)}, ${endDate.getDate()}/${endDate.getMonth()}/${endDate.getFullYear()}</p>
    </div>
  `

  var standingsHTML = "";
  standings.forEach(function (standing) {
    var clubHTML = "";
    standing.table.forEach(function (club) {
      imageUrl = club.team.crestUrl.replace(/^http:\/\//i, 'https://')
      clubHTML += `
        <tr>
          <td>${club.position}</td>
          <td>
            <div class="valign-wrapper">
              <img
                src="${imageUrl}"
                width="40"
                onerror="this.onerror=null;this.src='/default.jpg';"
              />
              <a href="./team.html?id=${club.team.id}" style="margin-left: 16px;">${club.team.name}</a>
            </div>
          </td>
          <td>${club.won}</td>
          <td>${club.draw}</td>
          <td>${club.lost}</td>
          <td>${club.points}</td>
        </tr>
      `
    })
    standingsHTML += `
    <table class="striped centered responsive-table" style="margin-top: 20px">
        <thead>
          <tr>
            <th>Position</th>
            <th>Club Name</th>
            <th>Won</th>
            <th>Draw</th>
            <th>Lost</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          ${clubHTML}
        </tbody>
      </table>
    `;
  });
  // Sisipkan komponen card ke dalam elemen dengan id #standings
  document.getElementById("standings").innerHTML = headerStandingHTML + standingsHTML;
  document.getElementById('preloader').style.display = 'none';
}

teamByIdComp = (data) => {
  // Objek JavaScript dari response.json() masuk lewat variabel data.
  var activeCompetitionsHTML = ''
  data.activeCompetitions.forEach(function (competition) {
    var tier = competition.plan.substr(5)
    activeCompetitionsHTML += `
      <tr>
        <td>${competition.area.name || '-'}</td>
        <td>${competition.name || '-'}</td>
        <td>${competition.code || '-'}</td>
        <td>${tier || '-'}</td>
      </tr>
    `;
  })

  var squadHTML = ''
  data.squad.forEach(function (player) {
    squadHTML += `
      <tr>
        <td>${player.name || '-'}</td>
        <td>${player.position || '-'}</td>
        <td>${player.nationality || '-'}</td>
        <td>${player.shirtNumber || '-'}</td>
      </tr>
    `;
  })
  var teamHTML = `
    <div class="row">
      <div class="col s12 l4">
        <div class="card center-align" style="margin-top: 24px;">
          <div class="card-image" style="padding: 24px; padding-bottom: 0px;">
            <img
              src="${data.crestUrl}"
              height="200"
              style="object-fit: contain"
              onerror="this.onerror=null;this.src='/default.jpg';"
            />
          </div>
          <div class="card-content">
            <p class="card-title">${data.name} (${data.shortName})</p>
            <div class="row">
              <p class="col s12">Area</p>
              <p class="col s12"><b>${data.area.name}</b></p>
            </div>
            <div class="row">
              <p class="col s12">Address</p>
              <p class="col s12"><b>${data.address}</b></p>
            </div>
            <div class="row">
              <p class="col s12">Phone</p>
              <p class="col s12"><b>${data.phone}</b></p>
            </div>
            <div class="row">
              <p class="col s12">Email</p>
              <a class="col s12" href="mailto:${data.email}" style="overflow-wrap: break-word;">${data.email}</a>
            </div>
            <div class="row">
              <p class="col s12">Website</p>
              <a class="col s12" href="${data.website}" style="overflow-wrap: break-word;">${data.website}</a>
            </div>
          </div>
        </div>
      </div>
      <div class="col s12 l8">
        <div>
          <h4>Active Competition</h4>
          <table class="striped centered responsive-table" style="margin-top: 20px">
            <thead>
              <tr>
                <th>Area</th>
                <th>Competition Name</th>
                <th>Code</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              ${activeCompetitionsHTML}
            </tbody>
          </table>
        </div>
      </div>
      <div class="col s12 l8">
        <div>
          <h4>Squad</h4>
          <table class="striped centered responsive-table" style="margin-top: 20px">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Nationality</th>
                <th>Shirt Number</th>
              </tr>
            </thead>
            <tbody>
              ${squadHTML}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById("body-content").innerHTML = teamHTML;
  document.getElementById('preloader').style.display = 'none';
}
