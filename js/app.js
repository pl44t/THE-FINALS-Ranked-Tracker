// Data handling
let data = {
  playerName: '',
  currentRS: 0,
  sessions: [],
  activeSession: null,
  accentColor: '#d21f3c'
};

let charts = {};

// Accent color presets
const ACCENT_PRESETS = [
  { name: 'Red', value: '#d21f3c' },
  { name: 'Blue', value: '#1e90ff' },
  { name: 'Green', value: '#2ecc71' },
  { name: 'Orange', value: '#e67e22' },
  { name: 'Purple', value: '#9b59b6' },
  { name: 'Cyan', value: '#00bcd4' },
  { name: 'Yellow', value: '#f1c40f' },
  { name: 'Pink', value: '#e91e63' }
];

// Init
function init() {
  loadData();
  applyAccentColor(data.accentColor);
  // Restore active session if exists
  if (data.activeSession) {
    document.getElementById('startSessionBtn').style.display = 'none';
    document.getElementById('endSessionBtn').style.display = 'block';
    document.getElementById('gameInputSection').style.display = 'block';
  }
  updateDisplay();
  renderSessions();
  renderAccentPresets();
}

function applyAccentColor(color) {
  document.documentElement.style.setProperty('--accent', color);
  data.accentColor = color;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function renderAccentPresets() {
  const container = document.getElementById('accentPresets');
  if (!container) return;
  container.innerHTML = ACCENT_PRESETS.map(preset => `
    <button type="button" class="accent-preset ${preset.value === data.accentColor ? 'active' : ''}"
      style="background: ${preset.value}; width: 36px; height: 36px; border-radius: 50%; border: 3px solid ${preset.value === data.accentColor ? '#fff' : 'transparent'}; cursor: pointer; transition: transform 0.1s, border-color 0.1s;"
      onclick="setAccentColor('${preset.value}')"
      title="${preset.name}"></button>
  `).join('');
}

function setAccentColor(color) {
  applyAccentColor(color);
  saveData();
  renderAccentPresets();
  if (document.getElementById('charts').classList.contains('active')) {
    renderCharts();
  }
}

function loadData() {
  const saved = localStorage.getItem('finalsTracker');
  if (saved) {
    data = JSON.parse(saved);
  }
}

function saveData() {
  localStorage.setItem('finalsTracker', JSON.stringify(data));
}

function getRank(rs) {
  if (rs >= 50000) return { name: 'Ruby', file: 'ruby.png' };
  if (rs >= 47500) return { name: 'Diamond 1', file: 'diamond1.png' };
  if (rs >= 45000) return { name: 'Diamond 2', file: 'diamond2.png' };
  if (rs >= 42500) return { name: 'Diamond 3', file: 'diamond3.png' };
  if (rs >= 40000) return { name: 'Diamond 4', file: 'diamond4.png' };
  if (rs >= 37500) return { name: 'Platinum 1', file: 'plat1.png' };
  if (rs >= 35000) return { name: 'Platinum 2', file: 'plat2.png' };
  if (rs >= 32500) return { name: 'Platinum 3', file: 'plat3.png' };
  if (rs >= 30000) return { name: 'Platinum 4', file: 'plat4.png' };
  if (rs >= 27500) return { name: 'Gold 1', file: 'gold1.png' };
  if (rs >= 25000) return { name: 'Gold 2', file: 'gold2.png' };
  if (rs >= 22500) return { name: 'Gold 3', file: 'gold3.png' };
  if (rs >= 20000) return { name: 'Gold 4', file: 'gold4.png' };
  if (rs >= 17500) return { name: 'Silver 1', file: 'silver1.png' };
  if (rs >= 15000) return { name: 'Silver 2', file: 'silver2.png' };
  if (rs >= 12500) return { name: 'Silver 3', file: 'silver3.png' };
  if (rs >= 10000) return { name: 'Silver 4', file: 'silver4.png' };
  if (rs >= 7500) return { name: 'Bronze 1', file: 'bronze1.png' };
  if (rs >= 5000) return { name: 'Bronze 2', file: 'bronze2.png' };
  if (rs >= 2500) return { name: 'Bronze 3', file: 'bronze3.png' };
  return { name: 'Bronze 4', file: 'bronze4.png' };
}

function getRankBounds(rankName) {
  const bounds = {
    'Bronze 4': { min: 0, max: 2500 },
    'Bronze 3': { min: 2500, max: 5000 },
    'Bronze 2': { min: 5000, max: 7500 },
    'Bronze 1': { min: 7500, max: 10000 },
    'Silver 4': { min: 10000, max: 12500 },
    'Silver 3': { min: 12500, max: 15000 },
    'Silver 2': { min: 15000, max: 17500 },
    'Silver 1': { min: 17500, max: 20000 },
    'Gold 4': { min: 20000, max: 22500 },
    'Gold 3': { min: 22500, max: 25000 },
    'Gold 2': { min: 25000, max: 27500 },
    'Gold 1': { min: 27500, max: 30000 },
    'Platinum 4': { min: 30000, max: 32500 },
    'Platinum 3': { min: 32500, max: 35000 },
    'Platinum 2': { min: 35000, max: 37500 },
    'Platinum 1': { min: 37500, max: 40000 },
    'Diamond 4': { min: 40000, max: 42500 },
    'Diamond 3': { min: 42500, max: 45000 },
    'Diamond 2': { min: 45000, max: 47500 },
    'Diamond 1': { min: 47500, max: 50000 },
    'Ruby': { min: 50000, max: Infinity }
  };
  return bounds[rankName] || { min: 0, max: 2500 };
}

function updateDisplay() {
  document.getElementById('currentRS').textContent = data.currentRS;
  document.getElementById('manualRS').value = data.currentRS;
  document.getElementById('playerName').value = data.playerName;

  const displayName = data.playerName || 'PLAYER';
  document.getElementById('playerDisplayName').textContent = displayName;

  const rank = getRank(data.currentRS);
  document.getElementById('rankDisplay').textContent = rank.name;
  document.getElementById('rankIcon').src = `images/${rank.file}`;
}

// Navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  if (pageId === 'charts') setTimeout(renderCharts, 100);
}

// Session management
function startSession() {
  data.activeSession = {
    id: Date.now(),
    date: new Date().toISOString(),
    games: []
  };
  saveData();
  document.getElementById('startSessionBtn').style.display = 'none';
  document.getElementById('endSessionBtn').style.display = 'block';
  document.getElementById('gameInputSection').style.display = 'block';
}

function endSession() {
  if (!data.activeSession || data.activeSession.games.length === 0) {
    cancelSession();
    return;
  }
  data.sessions.unshift(data.activeSession);
  data.activeSession = null;
  saveData();
  renderSessions();
  document.getElementById('startSessionBtn').style.display = 'block';
  document.getElementById('endSessionBtn').style.display = 'none';
  document.getElementById('gameInputSection').style.display = 'none';
  document.getElementById('gameForm').reset();
}

function cancelSession() {
  data.activeSession = null;
  saveData();
  document.getElementById('startSessionBtn').style.display = 'block';
  document.getElementById('endSessionBtn').style.display = 'none';
  document.getElementById('gameInputSection').style.display = 'none';
}

// Game management
let editingGame = null; // { sessionId, gameIndex }

function addGame(event) {
  event.preventDefault();
  const seed = document.getElementById('seed').value;
  const rsChange = parseInt(document.getElementById('rsChange').value);
  const position = document.getElementById('position').value;
  const note = document.getElementById('note').value;
  const map = document.getElementById('map').value;

  if (!data.activeSession && !editingGame) return;

  const game = { seed, rsChange, position, note, map };

  if (editingGame) {
    const session = findSession(editingGame.sessionId);
    if (session) {
      session.games[editingGame.gameIndex] = game;
    }
    editingGame = null;
    document.getElementById('submitGameBtn').textContent = 'Add Game';
    document.getElementById('cancelEditBtn').style.display = 'none';
  } else {
    data.activeSession.games.push(game);
  }

  recalculateRS();
  saveData();
  updateDisplay();
  renderSessions();
  document.getElementById('gameForm').reset();
}

function findSession(sessionId) {
  if (data.activeSession && data.activeSession.id === sessionId) return data.activeSession;
  return data.sessions.find(s => s.id === sessionId);
}

function editGame(sessionId, gameIndex) {
  const session = findSession(sessionId);
  if (!session) return;

  const game = session.games[gameIndex];
  editingGame = { sessionId, gameIndex };

  document.getElementById('seed').value = game.seed;
  document.getElementById('rsChange').value = game.rsChange;
  document.getElementById('position').value = game.position;
  document.getElementById('note').value = game.note || '';
  document.getElementById('map').value = game.map || '';

  document.getElementById('startSessionBtn').style.display = 'none';
  document.getElementById('endSessionBtn').style.display = 'block';
  document.getElementById('gameInputSection').style.display = 'block';
  document.getElementById('submitGameBtn').textContent = 'Save Changes';
  document.getElementById('cancelEditBtn').style.display = 'inline-flex';
  document.getElementById('seed').focus();
}

function cancelEdit() {
  editingGame = null;
  document.getElementById('gameForm').reset();
  document.getElementById('submitGameBtn').textContent = 'Add Game';
  document.getElementById('cancelEditBtn').style.display = 'none';
  if (!data.activeSession) {
    document.getElementById('startSessionBtn').style.display = 'block';
    document.getElementById('endSessionBtn').style.display = 'none';
    document.getElementById('gameInputSection').style.display = 'none';
  }
}

function recalculateRS() {
  let rs = 0;
  const allGames = getAllGames();
  allGames.forEach(g => rs += g.rsChange);
  data.currentRS = rs;
}

// Get all games from all sessions (oldest to newest for chart progression)
function getAllGames() {
  const allGames = [];

  // Add completed sessions (oldest first - sessions array is newest first, so reverse)
  [...data.sessions].reverse().forEach(session => {
    session.games.forEach(game => {
      allGames.push({ ...game });
    });
  });

  // Add active session games (most recent)
  if (data.activeSession) {
    data.activeSession.games.forEach(game => {
      allGames.push({ ...game });
    });
  }

  return allGames;
}

// Rendering
function renderSessions() {
  const container = document.getElementById('sessionsList');

  if (data.sessions.length === 0 && !data.activeSession) {
    container.innerHTML = '<p style="color: var(--text-secondary);">No sessions yet. Start a session to begin tracking.</p>';
    return;
  }

  let html = '';

  // Active session
  if (data.activeSession && data.activeSession.games.length > 0) {
    html += renderSessionCard(data.activeSession, false);
  }

  // Past sessions
  data.sessions.forEach(session => {
    html += renderSessionCard(session, false);
  });

  container.innerHTML = html;
}

function formatTime(date) {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getWinRate(games) {
  if (!games.length) return '0.0';
  const wins = games.filter(g => g.position == 1).length;
  return ((wins / games.length) * 100).toFixed(1);
}

function renderSessionCard(session, isActive) {
  const totalChange = session.games.reduce((sum, g) => sum + g.rsChange, 0);
  const avgPosition = (session.games.reduce((sum, g) => sum + parseInt(g.position), 0) / session.games.length).toFixed(2);
  const winRate = getWinRate(session.games);

  let gamesHtml = '';
  session.games.forEach((game, gameIndex) => {
    const posLabel = ['1st', '2nd', '3rd', '4th', '5-6th', '7-8th'][parseInt(game.position) - 1] || '';
    const changeColor = game.rsChange >= 0 ? 'var(--accent)' : '#ff6b6b';
    const escapedNote = (game.note || '').replace(/"/g, '""');
    const mapLabel = game.map || '—';
    gamesHtml += `
      <div class="game-item">
        <span>Seed ${game.seed}</span>
        <span style="color: ${changeColor};">${game.rsChange >= 0 ? '+' : ''}${game.rsChange} RS</span>
        <span>${posLabel}</span>
        <span>${mapLabel}</span>
        <span>${game.note || ''}</span>
        <button class="btn" style="padding: 0.3rem 0.6rem; font-size: 0.7rem; min-width: 60px;" onclick="editGame(${session.id}, ${gameIndex})">Edit</button>
      </div>
    `;
  });

  const isCurrentSession = data.activeSession && session.id === data.activeSession.id;

  return `
    <div class="session-card">
      <div class="session-header">
        <span class="session-date">${new Date(session.date).toLocaleDateString()} @ ${formatTime(session.date)}</span>
        <span style="color: var(--text-primary); margin: 0 1rem;">${isCurrentSession ? 'CURRENT SESSION' : ''}</span>
        <span style="color: var(--accent);">${session.games.length} Games</span>
      </div>
      <div class="session-stats">
        <div class="session-stat">
          <div class="stat-value" style="color: ${totalChange >= 0 ? 'var(--accent)' : '#ffffff'};">
            ${totalChange >= 0 ? '+' : ''}${totalChange}
          </div>
          <div class="stat-label">Total RS</div>
        </div>
        <div class="session-stat">
          <div class="stat-value">${avgPosition}</div>
          <div class="stat-label">Avg Pos</div>
        </div>
        <div class="session-stat">
          <div class="stat-value" style="color: var(--accent);">${winRate}%</div>
          <div class="stat-label">Win Rate</div>
        </div>
      </div>
      <div class="games-in-session">${gamesHtml}</div>
    </div>
  `;
}

// Chart rendering
function renderCharts() {
  const games = getAllGames();
  if (games.length === 0) return;

  Object.values(charts).forEach(c => c && c.destroy());

  const rsCtx = document.getElementById('rsProgressionChart').getContext('2d');
  // Calculate starting RS (current RS minus all game changes)
  const totalChange = games.reduce((sum, g) => sum + g.rsChange, 0);
  const startingRS = data.currentRS - totalChange;
  let cumulative = startingRS;
  const rsData = games.map((g) => {
    cumulative += g.rsChange;
    return cumulative;
  });
  charts.rsProgression = new Chart(rsCtx, {
    type: 'line',
    data: {
      labels: games.map((_, i) => `Game ${i + 1}`),
      datasets: [{
        label: 'RS',
        data: rsData,
        borderColor: data.accentColor,
        backgroundColor: hexToRgba(data.accentColor, 0.1),
        tension: 0.3,
        fill: true
      }]
    },
    options: chartOptions('RS Progress')
  });

  const sessionLengthCtx = document.getElementById('sessionLengthChart').getContext('2d');
  const lengthMap = {};
  data.sessions.forEach(s => {
    const len = s.games.length;
    const avg = s.games.reduce((sum, g) => sum + g.rsChange, 0) / s.games.length;
    if (!lengthMap[len]) lengthMap[len] = [];
    lengthMap[len].push(avg);
  });
  const lengthLabels = Object.keys(lengthMap).sort((a, b) => a - b);
  const lengthAvgs = lengthLabels.map(l => {
    const avgs = lengthMap[l];
    return avgs.reduce((sum, v) => sum + v, 0) / avgs.length;
  });
  charts.sessionLength = new Chart(sessionLengthCtx, {
    type: 'bar',
    data: {
      labels: lengthLabels.map(l => `${l} game${l > 1 ? 's' : ''}`),
      datasets: [{
        label: 'Avg RS',
        data: lengthAvgs,
        backgroundColor: lengthAvgs.map(v => v >= 0 ? hexToRgba(data.accentColor, 0.6) : hexToRgba(data.accentColor, 0.4)),
        borderColor: data.accentColor,
        borderWidth: 1
      }]
    },
    options: chartOptions('Avg RS by Session Length')
  });

  const seedRsCtx = document.getElementById('seedRsChart').getContext('2d');
  const seedRsMap = {};
  games.forEach(g => {
    const seed = String(g.seed);
    if (!seedRsMap[seed]) seedRsMap[seed] = [];
    seedRsMap[seed].push(g.rsChange);
  });
  const seedLabels = ['1','2','3','4','5','6','7','8'].map(s => `Seed ${s}`);
  const seedRsAvgs = ['1','2','3','4','5','6','7','8'].map(s => {
    const vals = seedRsMap[s] || [];
    return vals.length ? vals.reduce((sum, v) => sum + v, 0) / vals.length : 0;
  });
  charts.seedRs = new Chart(seedRsCtx, {
    type: 'bar',
    data: {
      labels: seedLabels,
      datasets: [{
        label: 'Avg RS',
        data: seedRsAvgs,
        backgroundColor: hexToRgba(data.accentColor, 0.5),
        borderColor: data.accentColor,
        borderWidth: 1
      }]
    },
    options: chartOptions('Avg RS by Seed', true)
  });

  const seedPosCtx = document.getElementById('seedPosChart').getContext('2d');
  const seedPosMap = {};
  games.forEach(g => {
    const seed = String(g.seed);
    if (!seedPosMap[seed]) seedPosMap[seed] = [];
    const pos = parseInt(g.position);
    // Map positions for averaging: 1,2,3,4 stay same, 5,6,7,8 -> 5.5, 7.5 respectively
    const mappedPos = pos <= 4 ? pos : (pos <= 6 ? 5.5 : 7.5);
    seedPosMap[seed].push(mappedPos);
  });
  const seedPosAvgs = ['1','2','3','4','5','6','7','8'].map(s => {
    const vals = seedPosMap[s] || [];
    return vals.length ? vals.reduce((sum, v) => sum + v, 0) / vals.length : 0;
  });
  charts.seedPos = new Chart(seedPosCtx, {
    type: 'bar',
    data: {
      labels: seedLabels,
      datasets: [{
        label: 'Avg Position',
        data: seedPosAvgs,
        backgroundColor: hexToRgba(data.accentColor, 0.5),
        borderColor: data.accentColor,
        borderWidth: 1
      }]
    },
    options: {
      ...chartOptions('Avg Position by Seed', true),
      scales: {
        y: { ticks: { color: '#ffffff', font: { family: 'Courier New' }, autoSkip: false }, grid: { color: 'rgba(255,255,255,0.1)' } },
        x: { min: 1, max: 8, ticks: { color: '#ffffff', font: { family: 'Courier New' } }, grid: { color: 'rgba(255,255,255,0.1)' } }
      }
    }
  });

  const posDistCtx = document.getElementById('positionDistChart').getContext('2d');
  const posCounts = [
    games.filter(g => g.position == 1).length,
    games.filter(g => g.position == 2).length,
    games.filter(g => g.position == 3).length,
    games.filter(g => g.position == 4).length,
    games.filter(g => g.position == 5).length,
    games.filter(g => g.position == 6).length
  ];
  const posPalette = [
    data.accentColor,
    hexToRgba(data.accentColor, 0.85),
    hexToRgba(data.accentColor, 0.7),
    hexToRgba(data.accentColor, 0.55),
    hexToRgba(data.accentColor, 0.4),
    hexToRgba(data.accentColor, 0.25)
  ];
  charts.positionDist = new Chart(posDistCtx, {
    type: 'pie',
    data: {
      labels: ['1st', '2nd', '3rd', '4th', '5-6th', '7-8th'],
      datasets: [{
        data: posCounts,
        backgroundColor: posPalette
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: '#ffffff', font: { family: 'Courier New' } } } }
    }
  });

  // Win Rate Over Time Chart
  const winRateCtx = document.getElementById('winRateChart').getContext('2d');
  const winRateData = [];
  let wins = 0;
  let total = 0;
  games.forEach((game, i) => {
    total++;
    if (game.position == 1) wins++;
    winRateData.push(((wins / total) * 100).toFixed(1));
  });
  charts.winRate = new Chart(winRateCtx, {
    type: 'line',
    data: {
      labels: games.map((_, i) => `Game ${i + 1}`),
      datasets: [{
        label: 'Win Rate %',
        data: winRateData,
        borderColor: data.accentColor,
        backgroundColor: hexToRgba(data.accentColor, 0.1),
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      ...chartOptions('Win Rate %'),
      scales: {
        y: { min: 0, max: 100, ticks: { color: '#ffffff', font: { family: 'Courier New' }, callback: v => v + '%' }, grid: { color: 'rgba(255,255,255,0.1)' } },
        x: { ticks: { color: '#ffffff', font: { family: 'Courier New' } }, grid: { color: 'rgba(255,255,255,0.1)' } }
      }
    }
  });

  // Map Stats Charts
  const mapStatsWrapper = document.getElementById('mapStatsWrapper');
  mapStatsWrapper.style.display = 'grid';

  // Avg RS by Map
    const mapStatsCtx = document.getElementById('mapStatsChart').getContext('2d');
    const mapMap = {};
    games.forEach(g => {
      if (!g.map) return;
      if (!mapMap[g.map]) mapMap[g.map] = { rs: [], pos: [] };
      mapMap[g.map].rs.push(g.rsChange);
      const pos = parseInt(g.position);
      const mappedPos = pos <= 4 ? pos : (pos <= 6 ? 5.5 : 7.5);
      mapMap[g.map].pos.push(mappedPos);
    });
    const mapLabels = Object.keys(mapMap).sort();
    const mapAvgs = mapLabels.map(m => {
      const vals = mapMap[m].rs;
      return vals.reduce((sum, v) => sum + v, 0) / vals.length;
    });
    charts.mapStats = new Chart(mapStatsCtx, {
      type: 'bar',
      data: {
        labels: mapLabels,
        datasets: [{
          label: 'Avg RS',
          data: mapAvgs,
          backgroundColor: mapAvgs.map(v => v >= 0 ? hexToRgba(data.accentColor, 0.6) : hexToRgba(data.accentColor, 0.4)),
          borderColor: data.accentColor,
          borderWidth: 1
        }]
      },
      options: chartOptions('Avg RS by Map', true)
    });

    // Avg Position by Map
    const mapPosCtx = document.getElementById('mapPosChart').getContext('2d');
    const mapPosAvgs = mapLabels.map(m => {
      const vals = mapMap[m].pos;
      return vals.reduce((sum, v) => sum + v, 0) / vals.length;
    });
    charts.mapPos = new Chart(mapPosCtx, {
      type: 'bar',
      data: {
        labels: mapLabels,
        datasets: [{
          label: 'Avg Position',
          data: mapPosAvgs,
          backgroundColor: hexToRgba(data.accentColor, 0.5),
          borderColor: data.accentColor,
          borderWidth: 1
        }]
      },
      options: {...chartOptions('Avg Position by Map', true), scales: {
        y: { min: 1, max: 8, ticks: { color: '#ffffff', font: { family: 'Courier New' } }, grid: { color: 'rgba(255,255,255,0.1)' } }
      }}
    });

  const rankGamesCtx = document.getElementById('rankTimeChart').getContext('2d');
  const rankOrder = ['Bronze 4', 'Bronze 3', 'Bronze 2', 'Bronze 1', 'Silver 4', 'Silver 3', 'Silver 2', 'Silver 1', 'Gold 4', 'Gold 3', 'Gold 2', 'Gold 1', 'Platinum 4', 'Platinum 3', 'Platinum 2', 'Platinum 1', 'Diamond 4', 'Diamond 3', 'Diamond 2', 'Diamond 1', 'Ruby'];
  const rankGamesMap = {};
  rankOrder.forEach(r => rankGamesMap[r] = 0);

  if (games.length > 0) {
    const totalChange = games.reduce((sum, g) => sum + g.rsChange, 0);
    let currentRS = data.currentRS - totalChange;
    games.forEach(game => {
      const rank = getRank(currentRS);
      rankGamesMap[rank.name] = (rankGamesMap[rank.name] || 0) + 1;
      currentRS += game.rsChange;
    });
  }

  charts.rankTime = new Chart(rankGamesCtx, {
    type: 'bar',
    data: {
      labels: rankOrder.map(r => r.replace('Platinum', 'Plat')),
      datasets: [{
        label: 'Games',
        data: rankOrder.map(r => rankGamesMap[r] || 0),
        backgroundColor: hexToRgba(data.accentColor, 0.5),
        borderColor: data.accentColor,
        borderWidth: 1
      }]
    },
    options: chartOptions('Games in Each Rank', true)
  });
}

function chartOptions(title, horizontal = false) {
  return {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: {
        ticks: {
          color: '#ffffff',
          font: { family: 'Courier New' },
          autoSkip: horizontal ? false : true
        },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      x: {
        ticks: {
          color: '#ffffff',
          font: { family: 'Courier New' },
          autoSkip: horizontal ? true : false
        },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    },
    indexAxis: horizontal ? 'y' : 'x'
  };
}

// Settings
function saveSettings(event) {
  event.preventDefault();
  data.playerName = document.getElementById('playerName').value;
  const newRS = parseInt(document.getElementById('manualRS').value);
  if (!isNaN(newRS)) {
    data.currentRS = newRS;
  }
  saveData();
  updateDisplay();
  showPage('tracker');
}

// Export/Import
function exportData() {
  let csv = 'Current RS\n';
  csv += `${data.currentRS}\n\n`;
  csv += 'Date,Session ID,Games,Total RS Change,Avg Position,Seed,RS Change,Position,Note\n';

  data.sessions.forEach(session => {
    const totalChange = session.games.reduce((sum, g) => sum + g.rsChange, 0);
    const avgPos = (session.games.reduce((sum, g) => sum + parseInt(g.position), 0) / session.games.length).toFixed(2);

    session.games.forEach((game, i) => {
      const note = (game.note || '').includes(',') ? `"${(game.note || '').replace(/"/g, '""')}"` : (game.note || '');
      if (i === 0) {
        csv += `${new Date(session.date).toISOString()},${session.id},${session.games.length},${totalChange},${avgPos},${game.seed},${game.rsChange},${game.position},${note}\n`;
      } else {
        csv += `,,,,,${game.seed},${game.rsChange},${game.position},${note}\n`;
      }
    });
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finals-tracker-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function parseCSVLine(line) {
  const result = [];
  let inQuotes = false;
  let current = '';
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.split('\n');
    let currentRS = parseInt(lines[1]?.trim()) || 0;
    data.currentRS = currentRS;

    const sessionMap = {};
    let currentSessionId = null;
    let inSessionSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('Date,Session ID')) {
        inSessionSection = true;
        continue;
      }

      if (!inSessionSection) continue;

      const parts = parseCSVLine(line);
      const sessionId = parts[1];
      const seed = parts[5];
      const rsChange = parseInt(parts[6]);
      const position = parseInt(parts[7]);
      const note = parts[8] || '';

      const sid = sessionId || currentSessionId;
      if (!sessionMap[sid]) {
        sessionMap[sid] = {
          id: parseInt(sid) || Date.now() + Math.random(),
          date: parts[0] || new Date().toISOString(),
          games: []
        };
      }
      currentSessionId = sid;

      if (seed !== '' && seed !== undefined) {
        sessionMap[sid].games.push({
          seed: seed,
          rsChange: rsChange || 0,
          position: (position || 1).toString(),
          note: note
        });
      }
    }

    data.sessions = [...Object.values(sessionMap), ...data.sessions];
    saveData();
    updateDisplay();
    renderSessions();
    event.target.value = '';
  };
  reader.readAsText(file);
}

// Init on load
init();