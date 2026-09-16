/* ══════════════════════════════════════════════════
   Cybersecurity Bootcamp — main.js
   All demo logic lives here, no external deps.
══════════════════════════════════════════════════ */

/* ── Hero terminal typer ─────────────────────────── */
function initTyper() {
  const lines = [
    '$ welcome to cybersec-bootcamp',
    '$ loading modules... [xss, sqli, bruteforce, ddos]',
    '$ ready. select a module below ▼'
  ];
  const el = document.getElementById('typer');
  if (!el) return;
  let li = 0, ci = 0, typing = true;
  function tick() {
    if (li >= lines.length) { el.textContent = lines[lines.length-1]; return; }
    const line = lines[li];
    if (typing) {
      el.textContent = line.slice(0, ci + 1);
      ci++;
      if (ci >= line.length) {
        typing = false;
        setTimeout(tick, 900);
        return;
      }
      setTimeout(tick, 38);
    } else {
      li++;
      if (li >= lines.length) { return; }
      ci = 0;
      typing = true;
      el.textContent = '';
      setTimeout(tick, 300);
    }
  }
  tick();
}

/* ── Module tab switching ────────────────────────── */
function initTabs() {
  const tabs   = document.querySelectorAll('.module-tab');
  const panels = document.querySelectorAll('.module-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('visible'));
      tab.classList.add('active');
      const target = document.getElementById('panel-' + tab.dataset.module);
      if (target) {
        target.classList.add('visible');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Activate first tab by default
  if (tabs.length) tabs[0].click();
}

/* ══════════════════════════════════════════════════
   DEMO 1 — SQL INJECTION
══════════════════════════════════════════════════ */
function initSQLDemo() {
  const userEl = document.getElementById('sql-user');
  const passEl = document.getElementById('sql-pass');
  const btn    = document.getElementById('sql-btn');
  const out    = document.getElementById('sql-out');
  const reset  = document.getElementById('sql-reset');

  if (!btn) return;

  // Patterns that indicate SQLi
  const sqliPatterns = [
    /'\s*or\s*'?\s*1\s*=\s*1/i,
    /'\s*or\s*1\s*=\s*1/i,
    /'\s*--/,
    /#/,
    /\/\*/,
    /union\s+select/i,
    /drop\s+table/i,
    /'\s*;\s*/,
    /admin'\s*--/i
  ];

  function isSQLi(val) {
    return sqliPatterns.some(p => p.test(val));
  }

  btn.addEventListener('click', () => {
    const u = userEl.value.trim();
    const p = passEl.value.trim();

    if (!u && !p) {
      show('warn', '⚠️', 'Empty fields', 'Enter something in the username or password field.'); return;
    }

    if (isSQLi(u) || isSQLi(p)) {
      userEl.classList.add('injected');
      passEl.classList.add('injected');
      show('success',
        '💥 Injection Successful!',
        'You bypassed the login.',
        'The server ran: SELECT * FROM users WHERE username=\'' + u + '\' AND password=\'' + p + '\'  — the OR 1=1 made the WHERE clause always true, so every row matched and you got in as the first user (admin).'
      );
    } else {
      userEl.classList.remove('injected');
      passEl.classList.remove('injected');
      show('fail',
        '❌ Login Failed',
        'Wrong username or password.',
        'Hint: try typing   admin\'--   in the username box, or   \' OR 1=1--   and anything as the password.'
      );
    }
  });

  reset.addEventListener('click', () => {
    userEl.value = ''; passEl.value = '';
    userEl.classList.remove('injected','safe');
    passEl.classList.remove('injected','safe');
    out.className = 'demo-output'; out.innerHTML = '';
  });

  function show(type, title, msg, detail='') {
    out.className = 'demo-output show ' + type;
    out.innerHTML = `<div class="out-title">${title}</div><div>${msg}</div>${detail ? `<div class="out-detail">${detail}</div>` : ''}`;
  }
}

/* ══════════════════════════════════════════════════
   DEMO 2 — XSS
══════════════════════════════════════════════════ */
function initXSSDemo() {
  const input   = document.getElementById('xss-input');
  const postBtn = document.getElementById('xss-post');
  const preview = document.getElementById('xss-preview');
  const out     = document.getElementById('xss-out');
  const reset   = document.getElementById('xss-reset');

  if (!postBtn) return;

  const xssPatterns = [
    /<script[\s>]/i,
    /javascript\s*:/i,
    /on\w+\s*=/i,
    /<img[^>]+src/i,
    /<iframe/i,
    /alert\s*\(/i,
    /<svg[^>]*on/i
  ];

  function isXSS(val) {
    return xssPatterns.some(p => p.test(val));
  }

  postBtn.addEventListener('click', () => {
    const val = input.value;
    if (!val.trim()) return;

    if (isXSS(val)) {
      // Show the unsanitised version so learner sees it rendered
      preview.innerHTML = '<b>💬 A visitor said:</b> ' + val;
      out.className = 'demo-output show success';
      out.innerHTML = `<div class="out-title">💥 XSS Executed!</div><div>Your script was injected into the page. In a real site, this could steal cookies, redirect users, or silently log keystrokes.</div><div class="out-detail">The comment wasn't sanitised before being put into the HTML. Try: <span style="color:var(--cyan)">&lt;script&gt;alert('hacked')&lt;/script&gt;</span></div>`;
    } else {
      // Safe — escape and display
      const safe = val.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      preview.innerHTML = '<b>💬 A visitor said:</b> ' + safe;
      out.className = 'demo-output show fail';
      out.innerHTML = `<div class="out-title">✅ Safe Comment Posted</div><div>This looks like plain text — no XSS here.</div><div class="out-detail">Try: <span style="color:var(--cyan)">&lt;img src=x onerror=alert(1)&gt;</span></div>`;
    }
  });

  reset.addEventListener('click', () => {
    input.value = '';
    preview.innerHTML = '<span style="color:#aaa;font-size:0.85rem">Your comment will appear here...</span>';
    out.className = 'demo-output'; out.innerHTML = '';
  });
}

/* ══════════════════════════════════════════════════
   DEMO 3 — BRUTEFORCE
══════════════════════════════════════════════════ */
function initBruteDemo() {
  const startBtn  = document.getElementById('bf-start');
  const stopBtn   = document.getElementById('bf-stop');
  const log       = document.getElementById('bf-log');
  const bar       = document.getElementById('bf-bar');
  const out       = document.getElementById('bf-out');
  const targetIn  = document.getElementById('bf-target');

  if (!startBtn) return;

  // Hidden secret password chosen randomly each page load
  const wordlist = ['password','123456','admin','letmein','qwerty','dragon','monkey','shadow','master','sunshine','princess','welcome','login','abc123','trustno1','superman','batman','iloveyou','starwars','passw0rd'];
  const secret   = wordlist[Math.floor(Math.random() * wordlist.length)];
  let running    = false;
  let timer      = null;
  let idx        = 0;

  function reset() {
    clearInterval(timer);
    running = false;
    idx = 0;
    bar.style.width = '0%';
    bar.classList.remove('cracked');
    log.innerHTML = '';
    out.className = 'demo-output'; out.innerHTML = '';
    startBtn.disabled = false;
    stopBtn.disabled  = true;
  }

  startBtn.addEventListener('click', () => {
    if (running) return;
    reset();
    // Shuffle wordlist order, ensure secret is in there at a random position
    const list = [...wordlist].filter(w => w !== secret);
    const insertAt = Math.floor(Math.random() * (list.length - 3)) + 2;
    list.splice(insertAt, 0, secret);

    running = true;
    startBtn.disabled = true;
    stopBtn.disabled  = false;
    let i = 0;
    log.innerHTML = `<div class="log-try">[ bruteforce started ] target: <b>${targetIn.value || 'admin@site.com'}</b></div>`;

    timer = setInterval(() => {
      if (!running || i >= list.length) { clearInterval(timer); return; }
      const attempt = list[i];
      const pct = Math.round(((i+1)/list.length)*100);
      bar.style.width = pct + '%';

      if (attempt === secret) {
        log.innerHTML += `<div class="log-win">✓ MATCH FOUND → password: <b>${attempt}</b>  [${i+1}/${list.length} attempts]</div>`;
        log.scrollTop = log.scrollHeight;
        bar.classList.add('cracked');
        out.className = 'demo-output show success';
        out.innerHTML = `<div class="out-title">🔓 Password Cracked: "${secret}"</div><div>Found in ${i+1} attempt${i!==0?'s':''}. Weak passwords fall in seconds against a wordlist attack.</div><div class="out-detail">Real attackers use lists of billions of leaked passwords from data breaches.</div>`;
        clearInterval(timer);
        running = false;
        startBtn.disabled = false;
        stopBtn.disabled  = true;
      } else {
        log.innerHTML += `<div class="log-try">✗ ${attempt}</div>`;
        log.scrollTop = log.scrollHeight;
      }
      i++;
    }, 120);
  });

  stopBtn.addEventListener('click', () => {
    clearInterval(timer);
    running = false;
    startBtn.disabled = false;
    stopBtn.disabled  = true;
    log.innerHTML += `<div class="log-hit">[ attack stopped by user ]</div>`;
    log.scrollTop = log.scrollHeight;
  });

  document.getElementById('bf-reset')?.addEventListener('click', reset);
}

/* ══════════════════════════════════════════════════
   DEMO 4 — DDOS
══════════════════════════════════════════════════ */
function initDDoSDemo() {
  const startBtn  = document.getElementById('ddos-start');
  const stopBtn   = document.getElementById('ddos-stop');
  const resetBtn  = document.getElementById('ddos-reset');
  const meter     = document.getElementById('ddos-meter');
  const reqCount  = document.getElementById('ddos-count');
  const rpsEl     = document.getElementById('ddos-rps');
  const statusEl  = document.getElementById('ddos-status');
  const out       = document.getElementById('ddos-out');

  if (!startBtn) return;

  let running  = false;
  let timer    = null;
  let total    = 0;
  let load     = 0; // 0-100
  let crashed  = false;
  let rps      = 0;

  function setLoad(pct) {
    load = Math.min(100, pct);
    meter.style.width = load + '%';
    meter.className = 'meter ' + (load < 50 ? 'ok' : load < 80 ? 'warn' : 'danger');
  }

  function updateStatus() {
    if (crashed) {
      statusEl.textContent = 'OFFLINE'; statusEl.className = 'value danger';
    } else if (load >= 80) {
      statusEl.textContent = 'OVERLOADED'; statusEl.className = 'value danger';
    } else if (load >= 50) {
      statusEl.textContent = 'DEGRADED'; statusEl.className = 'value';
      statusEl.style.color = 'var(--yellow)';
    } else {
      statusEl.textContent = 'ONLINE'; statusEl.className = 'value';
      statusEl.style.color = 'var(--green)';
    }
  }

  function reset() {
    clearInterval(timer);
    running = false; crashed = false;
    total = 0; load = 0; rps = 0;
    setLoad(0);
    reqCount.textContent = '0';
    rpsEl.textContent = '0 req/s';
    out.className = 'demo-output'; out.innerHTML = '';
    updateStatus();
    startBtn.disabled = false;
    stopBtn.disabled  = true;
  }

  startBtn.addEventListener('click', () => {
    if (running || crashed) return;
    running = true;
    startBtn.disabled = true;
    stopBtn.disabled  = false;

    let tick = 0;
    timer = setInterval(() => {
      tick++;
      const burst = Math.floor(Math.random() * 15) + 10;
      total += burst;
      rps    = burst * 10; // simulated req/s (interval is 100ms)
      load  += (Math.random() * 4 + 2);
      reqCount.textContent = total.toLocaleString();
      rpsEl.textContent    = rps.toLocaleString() + ' req/s';
      setLoad(load);
      updateStatus();

      if (load >= 100 && !crashed) {
        crashed = true;
        clearInterval(timer);
        running = false;
        startBtn.disabled = false;
        stopBtn.disabled  = true;
        out.className = 'demo-output show fail';
        out.innerHTML = `<div class="out-title">💀 Server Crashed!</div><div>After ${total.toLocaleString()} requests the server stopped responding. All legitimate users are now locked out.</div><div class="out-detail">This is exactly what a DDoS achieves — not stealing data, but making a service completely unavailable.</div>`;
      }
    }, 100);
  });

  stopBtn.addEventListener('click', () => {
    clearInterval(timer);
    running = false;
    startBtn.disabled = false;
    stopBtn.disabled  = true;
    // Load slowly recovers
    let rec = setInterval(() => {
      load = Math.max(0, load - 8);
      setLoad(load);
      updateStatus();
      rpsEl.textContent = '0 req/s';
      if (load <= 0) clearInterval(rec);
    }, 200);
    out.className = 'demo-output show warn';
    out.innerHTML = `<div class="out-title">⏸ Attack Paused</div><div>Load is dropping. Server is recovering. A real DDoS involves thousands of machines — harder to stop.</div>`;
  });

  resetBtn?.addEventListener('click', reset);
}

/* ── Init everything on load ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTyper();
  initTabs();
  initSQLDemo();
  initXSSDemo();
  initBruteDemo();
  initDDoSDemo();
});
