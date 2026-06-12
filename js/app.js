// Data handling
let data = {
  playerName: '',
  currentRS: 0,
  sessions: [],
  activeSession: null
};

let charts = {};

// Init
function init() {
  loadData();
  // Restore active session if exists
  if (data.activeSession) {
    document.getElementById('startSessionBtn').style.display = 'none';
    document.getElementById('endSessionBtn').style.display = 'block';
    document.getElementById('gameInputSection').style.display = 'block';
  }
  updateDisplay();
  renderSessions();
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
function addGame(event) {
  event.preventDefault();
  const seed = document.getElementById('seed').value;
  const rsChange = parseInt(document.getElementById('rsChange').value);
  const position = document.getElementById('position').value;

  if (!data.activeSession) return;

  const game = { seed, rsChange, position };
  data.activeSession.games.push(game);
  data.currentRS += rsChange;
  saveData();
  updateDisplay();
  renderSessions();
  document.getElementById('gameForm').reset();
}

// Get all games from all sessions
function getAllGames() {
  const activeGames = data.activeSession ? data.activeSession.games : [];
  return [...data.sessions.flatMap(s => s.games), ...activeGames];
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

function renderSessionCard(session, isActive) {
  const totalChange = session.games.reduce((sum, g) => sum + g.rsChange, 0);
  const avgPosition = (session.games.reduce((sum, g) => sum + parseInt(g.position), 0) / session.games.length).toFixed(2);

  let gamesHtml = '';
  session.games.forEach(game => {
    const posLabel = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'][parseInt(game.position) - 1];
    const changeColor = game.rsChange >= 0 ? 'var(--accent)' : 'var(--accent)';
    gamesHtml += `
      <div class="game-item">
        <span>Seed ${game.seed}</span>
        <span style="color: ${changeColor};">${game.rsChange >= 0 ? '+' : ''}${game.rsChange} RS</span>
        <span>${posLabel}</span>
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
  let cumulative = 0;
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
        borderColor: '#d21f3c',
        backgroundColor: 'rgba(210, 31, 60, 0.1)',
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
        backgroundColor: lengthAvgs.map(v => v >= 0 ? 'rgba(210, 31, 60, 0.6)' : 'rgba(210, 31, 60, 0.4)'),
        borderColor: '#d21f3c',
        borderWidth: 1
      }]
    },
    options: chartOptions('Avg RS by Session Length')
  });

  const seedRsCtx = document.getElementById('seedRsChart').getContext('2d');
  const seedRsMap = {};
  games.forEach(g => {
    if (!seedRsMap[g.seed]) seedRsMap[g.seed] = [];
    seedRsMap[g.seed].push(g.rsChange);
  });
  const seedLabels = [1,2,3,4,5,6,7,8].map(s => `Seed ${s}`);
  const seedRsAvgs = [1,2,3,4,5,6,7,8].map(s => {
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
        backgroundColor: 'rgba(210, 31, 60, 0.5)',
        borderColor: '#d21f3c',
        borderWidth: 1
      }]
    },
    options: chartOptions('Avg RS by Seed', true)
  });

  const seedPosCtx = document.getElementById('seedPosChart').getContext('2d');
  const seedPosMap = {};
  games.forEach(g => {
    if (!seedPosMap[g.seed]) seedPosMap[g.seed] = [];
    seedPosMap[g.seed].push(parseInt(g.position));
  });
  const seedPosAvgs = [1,2,3,4,5,6,7,8].map(s => {
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
        backgroundColor: 'rgba(210, 31, 60, 0.5)',
        borderColor: '#d21f3c',
        borderWidth: 1
      }]
    },
    options: {...chartOptions('Avg Position by Seed', true), scales: {
      y: { min: 1, max: 8, ticks: { color: '#ffffff', font: { family: 'Courier New' } }, grid: { color: 'rgba(255,255,255,0.1)' } }
    }}
  });

  const posDistCtx = document.getElementById('positionDistChart').getContext('2d');
  const posCounts = [1,2,3,4,5,6,7,8].map(p =>
    games.filter(g => g.position == p).length
  );
  const posPalette = ['#d21f3c', '#e03a55', '#ee5573', '#fc7091', '#ff8caf', '#ffa8c9', '#ffc1e3', '#ffdaf2'];
  charts.positionDist = new Chart(posDistCtx, {
    type: 'pie',
    data: {
      labels: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'],
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

  const rankTimeCtx = document.getElementById('rankTimeChart').getContext('2d');
  const rankOrder = ['Bronze 4', 'Bronze 3', 'Bronze 2', 'Bronze 1', 'Silver 4', 'Silver 3', 'Silver 2', 'Silver 1', 'Gold 4', 'Gold 3', 'Gold 2', 'Gold 1', 'Platinum 4', 'Platinum 3', 'Platinum 2', 'Platinum 1', 'Diamond 4', 'Diamond 3', 'Diamond 2', 'Diamond 1', 'Ruby'];
  const rankTimeMap = {};
  rankOrder.forEach(r => rankTimeMap[r] = 0);

  if (data.sessions.length > 0) {
    let prevRS = 0;
    let prevDate = null;

    [...data.sessions].sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(session => {
      const sessionRS = session.games.reduce((sum, g) => sum + g.rsChange, 0);
      const sessionStartRS = prevRS;

      if (prevDate) {
        const hours = (new Date(session.date) - new Date(prevDate)) / (1000 * 60 * 60);
        if (hours > 0) {
          for (let i = 0; i < rankOrder.length; i++) {
            const rankName = rankOrder[i];
            const { min, max } = getRankBounds(rankName);
            if (sessionStartRS >= min && sessionStartRS < max) {
              rankTimeMap[rankName] += hours;
              break;
            }
          }
        }
      } else if (sessionStartRS < 2500) {
        // First session starts in Bronze 4
        rankTimeMap['Bronze 4'] += 0;
      }
      prevRS += sessionRS;
      prevDate = session.date;
    });
  }

  charts.rankTime = new Chart(rankTimeCtx, {
    type: 'bar',
    data: {
      labels: rankOrder.map(r => r.replace('Platinum', 'Plat')),
      datasets: [{
        label: 'Hours',
        data: rankOrder.map(r => rankTimeMap[r] || 0),
        backgroundColor: 'rgba(210, 31, 60, 0.5)',
        borderColor: '#d21f3c',
        borderWidth: 1
      }]
    },
    options: chartOptions('Time in Each Rank', true)
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
      y: { ticks: { color: '#ffffff', font: { family: 'Courier New' } }, grid: { color: 'rgba(255,255,255,0.1)' } },
      x: { ticks: { color: '#ffffff', font: { family: 'Courier New' } }, grid: { color: 'rgba(255,255,255,0.1)' } }
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
  let csv = 'Date,Session ID,Games,Total RS Change,Avg Position,Seed,RS Change,Position\n';

  data.sessions.forEach(session => {
    const totalChange = session.games.reduce((sum, g) => sum + g.rsChange, 0);
    const avgPos = (session.games.reduce((sum, g) => sum + parseInt(g.position), 0) / session.games.length).toFixed(2);

    session.games.forEach((game, i) => {
      if (i === 0) {
        csv += `${new Date(session.date).toISOString()},${session.id},${session.games.length},${totalChange},${avgPos},${game.seed},${game.rsChange},${game.position}\n`;
      } else {
        csv += `,,,,,${game.seed},${game.rsChange},${game.position}\n`;
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

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.split('\n');
    const sessionMap = {};
    let currentSessionId = null;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',');
      const sessionId = parts[1];
      const seed = parts[5];
      const rsChange = parseInt(parts[6]);
      const position = parseInt(parts[7]);

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
          position: (position || 1).toString()
        });
      }
    }

    data.sessions = [...Object.values(sessionMap), ...data.sessions];
    saveData();
    renderSessions();
    event.target.value = '';
  };
  reader.readAsText(file);
}

// Init on load
init();