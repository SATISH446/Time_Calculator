function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const icon = document.getElementById("toggleIcon");
    icon.textContent = document.body.classList.contains("dark-mode") ? "light_mode" : "dark_mode";
  }
  
  function populateTime(id) {
    for (let i = 1; i <= 12; i++) {
      document.getElementById(`h${id}`).innerHTML += `<option>${String(i).padStart(2, '0')}</option>`;
    }
    for (let i = 0; i < 60; i++) {
      document.getElementById(`m${id}`).innerHTML += `<option>${String(i).padStart(2, '0')}</option>`;
      document.getElementById(`s${id}`).innerHTML += `<option>${String(i).padStart(2, '0')}</option>`;
    }
  }
  populateTime(1);
  populateTime(2);
  
  function to24Hour(h, ampm) {
    h = parseInt(h);
    if (ampm === "PM" && h !== 12) return h + 12;
    if (ampm === "AM" && h === 12) return 0;
    return h;
  }
  
  function fillTimeBox(id) {
    const h = document.getElementById(`h${id}`).value;
    const m = document.getElementById(`m${id}`).value;
    const s = document.getElementById(`s${id}`).value;
    const ampm = document.getElementById(`ampm${id}`).value;
    const h24 = String(to24Hour(h, ampm)).padStart(2, '0');
    document.getElementById(`time${id}`).value = `${h24}:${m}:${s}`;
  }
  
  ['h1','m1','s1','ampm1'].forEach(id => document.getElementById(id).onchange = () => fillTimeBox(1));
  ['h2','m2','s2','ampm2'].forEach(id => document.getElementById(id).onchange = () => fillTimeBox(2));
  
  function parseTime(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return { hours, minutes, seconds };
  }
  
  function findDifference() {
    const t1 = parseTime(document.getElementById('time1').value);
    const t2 = parseTime(document.getElementById('time2').value);
  
    const totalSec1 = t1.hours * 3600 + t1.minutes * 60 + t1.seconds;
    const totalSec2 = t2.hours * 3600 + t2.minutes * 60 + t2.seconds;
  
    let diff = Math.abs(totalSec1 - totalSec2);
    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
  
    const resultText = `⏱️ Difference: ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    document.getElementById('result').innerText = resultText;
  
    const percent = Math.floor(((Math.abs(totalSec1 - totalSec2)) / 86400) * 100);
    document.getElementById('progressBar').style.width = `${percent}%`;
  
    saveHistory(resultText);
  }
  
  function saveHistory(result) {
    let logs = JSON.parse(localStorage.getItem('timeHistory')) || [];
    logs.unshift(result);
    if (logs.length > 5) logs.pop();
    localStorage.setItem('timeHistory', JSON.stringify(logs));
    renderHistory();
  }
  
  function renderHistory() {
    const logs = JSON.parse(localStorage.getItem('timeHistory')) || [];
    document.getElementById('history').innerHTML = '<h3>Recent History</h3>' + logs.map(r => `<div>${r}</div>`).join('');
  }
  
  function clearHistory() {
    localStorage.removeItem('timeHistory');
    renderHistory();
  }
  
  function exportHistory() {
    const logs = JSON.parse(localStorage.getItem('timeHistory')) || [];
    const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'time_history.txt';
    link.click();
  }
  
  function notifyIfSameTime() {
    const t1 = document.getElementById('time1').value;
    const t2 = document.getElementById('time2').value;
    if (t1 && t1 === t2) {
      alert('🔔 Alert: Both times are exactly the same!');
    }
  }
  
  renderHistory();
  