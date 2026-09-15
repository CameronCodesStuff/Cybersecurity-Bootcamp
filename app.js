/* ============================================================
   CYBERSECURITY BOOTCAMP — app.js
   ============================================================ */

'use strict';

/* ── State ───────────────────────────────────────────────── */
const state = {
  xp: 0,
  completedLevels: new Set(),
  unlockedLevels: new Set([0])
};

/* ── Level data ──────────────────────────────────────────── */
const LEVELS = [
  {
    id: 0,
    title: 'What is Cybersecurity?',
    badge: 'BEGINNER',
    badgeClass: 'badge-beginner',
    desc: 'Start from zero. Learn what cybersecurity is, why it matters, and how the internet works.',
    topics: ['CIA Triad', 'Threats', 'Internet Basics'],
    xp: 100,
    tabs: ['Learn', 'Interactive', 'Quiz'],
    learn: `
      <h4>What is Cybersecurity?</h4>
      <p>Cybersecurity is the practice of protecting computers, servers, networks, and data from digital attacks, damage, or unauthorized access. Think of it as the immune system of the digital world.</p>
      <h4>The CIA Triad — The Foundation</h4>
      <p>Every security concept flows from three principles:</p>
      <p><strong style="color:var(--lavender)">Confidentiality</strong> — Only authorized people can see the data. Your bank balance is private.</p>
      <p><strong style="color:var(--lavender)">Integrity</strong> — Data can't be secretly altered. Your payment of $10 stays $10.</p>
      <p><strong style="color:var(--lavender)">Availability</strong> — Systems work when you need them. The bank website must stay online.</p>
      <h4>Why It Matters</h4>
      <p>Cybercrime costs the global economy over $8 trillion per year. Every connected device is a potential target — your phone, smart fridge, even your car.</p>
    `,
    interactive: 'cia-triad',
    quiz: [
      { q: 'What does the "C" in CIA Triad stand for?', a: ['Confidentiality', 'Cybersecurity', 'Control', 'Configuration'], correct: 0 },
      { q: 'A ransomware attack locks your files. Which CIA property is violated?', a: ['Confidentiality', 'Integrity', 'Availability', 'All three'], correct: 2 },
      { q: 'An attacker changes a $100 transaction to $10,000. Which property is violated?', a: ['Confidentiality', 'Integrity', 'Availability', 'Authentication'], correct: 1 }
    ]
  },
  {
    id: 1,
    title: 'Passwords & Authentication',
    badge: 'BEGINNER',
    badgeClass: 'badge-beginner',
    desc: 'Why "password123" is your worst enemy. Build unbreakable passwords and understand MFA.',
    topics: ['Password Strength', 'Hashing', '2FA', 'Credential Stuffing'],
    xp: 150,
    tabs: ['Learn', 'Interactive', 'Quiz'],
    learn: `
      <h4>Why Passwords Fail</h4>
      <p>Most people use weak, reused passwords. Attackers exploit this through <strong style="color:var(--lavender)">credential stuffing</strong> — taking passwords leaked from one breach and trying them everywhere else.</p>
      <h4>How Passwords Are Stored</h4>
      <p>Good systems never store your actual password. Instead, they run it through a <strong style="color:var(--lavender)">hash function</strong> — a one-way mathematical process. "password123" becomes something like <code style="color:var(--green);font-family:var(--font-mono)">ef92b778ba...</code>. Even if the database is stolen, attackers get gibberish.</p>
      <h4>Multi-Factor Authentication (MFA)</h4>
      <p>MFA requires something you <em>know</em> (password) plus something you <em>have</em> (your phone) or something you <em>are</em> (fingerprint). Even with your password, an attacker can't log in without your second factor.</p>
      <h4>The Rules</h4>
      <p>Use a passphrase (4+ random words), unique per site, stored in a password manager. Enable MFA everywhere that offers it.</p>
    `,
    interactive: 'password-strength',
    quiz: [
      { q: 'What is "credential stuffing"?', a: ['Filling in passwords randomly', 'Using leaked passwords from one breach on other sites', 'Creating very long passwords', 'Hashing passwords'], correct: 1 },
      { q: 'What does a hash function do?', a: ['Encrypts a password reversibly', 'Converts password to irreversible fixed-length output', 'Stores passwords in plain text', 'Generates random passwords'], correct: 1 },
      { q: 'Which is the strongest password?', a: ['P@ssw0rd!', 'correct-horse-battery-staple', 'abc123', '11111111'], correct: 1 }
    ]
  },
  {
    id: 2,
    title: 'Cryptography Fundamentals',
    badge: 'BASIC',
    badgeClass: 'badge-basic',
    desc: 'How secrets are kept. From ancient ciphers to modern encryption powering the web.',
    topics: ['Caesar Cipher', 'Symmetric', 'Asymmetric', 'TLS/SSL'],
    xp: 200,
    tabs: ['Learn', 'Interactive', 'Quiz'],
    learn: `
      <h4>The Ancient Art of Secret Messages</h4>
      <p>Cryptography — hiding information — dates back thousands of years. Julius Caesar shifted letters by 3 to communicate with generals. While trivially breakable today, it illustrates the core concept: a <strong style="color:var(--lavender)">cipher</strong> transforms readable text (plaintext) into gibberish (ciphertext).</p>
      <h4>Symmetric Encryption</h4>
      <p>Both parties share the same secret key. AES-256 — used to encrypt your hard drive — is symmetric. It's fast, but sharing the key safely is a challenge.</p>
      <h4>Asymmetric Encryption</h4>
      <p>Uses a <strong style="color:var(--lavender)">key pair</strong>: a public key (share freely) and a private key (never share). Data encrypted with your public key can only be decrypted with your private key. RSA and elliptic-curve cryptography work this way.</p>
      <h4>TLS — The Internet's Padlock</h4>
      <p>When you see HTTPS, TLS is running beneath it. Your browser and the server perform a <em>handshake</em> using asymmetric crypto to agree on a symmetric session key, then all traffic is encrypted. The padlock icon means nobody can read your data in transit.</p>
    `,
    interactive: 'caesar-cipher',
    quiz: [
      { q: 'In a Caesar cipher with shift 3, what does "A" become?', a: ['B', 'C', 'D', 'X'], correct: 2 },
      { q: 'Which encryption type uses a key pair (public + private)?', a: ['Symmetric', 'Asymmetric', 'Hashing', 'XOR'], correct: 1 },
      { q: 'What does HTTPS indicate?', a: ['The site is legitimate', 'Traffic is encrypted with TLS', 'The site is government-approved', 'The site is fast'], correct: 1 }
    ]
  },
  {
    id: 3,
    title: 'Networking & Protocols',
    badge: 'INTERMEDIATE',
    badgeClass: 'badge-inter',
    desc: 'How data travels across the internet. Packets, TCP/IP, DNS, and what attackers exploit.',
    topics: ['TCP/IP', 'DNS', 'Packets', 'OSI Model'],
    xp: 250,
    tabs: ['Learn', 'Interactive', 'Quiz'],
    learn: `
      <h4>Packets — The Internet's Postal System</h4>
      <p>Data isn't sent as one stream — it's broken into small <strong style="color:var(--lavender)">packets</strong>. Each packet has a header (routing info) and a payload (your actual data). Packets travel independently and are reassembled at the destination.</p>
      <h4>The TCP/IP Stack</h4>
      <p>Four layers work together: <strong style="color:var(--lavender)">Application</strong> (HTTP, DNS), <strong style="color:var(--lavender)">Transport</strong> (TCP/UDP), <strong style="color:var(--lavender)">Internet</strong> (IP routing), and <strong style="color:var(--lavender)">Network Access</strong> (physical transmission). Each layer wraps the layer above in its own header.</p>
      <h4>DNS — The Internet's Phone Book</h4>
      <p>You type "google.com" — your computer asks a DNS server to resolve it to an IP like 142.250.80.46. <strong style="color:var(--lavender)">DNS poisoning</strong> is an attack where a malicious IP is returned, redirecting you to a fake site.</p>
      <h4>Common Network Attacks</h4>
      <p>Man-in-the-Middle intercepts traffic. DDoS floods a server with junk requests until it collapses. Port scanning maps a target's open services before an attack.</p>
    `,
    interactive: 'packet-builder',
    quiz: [
      { q: 'What does DNS resolve?', a: ['Passwords to hashes', 'Domain names to IP addresses', 'Packets to streams', 'Ports to protocols'], correct: 1 },
      { q: 'Which OSI layer does TCP operate at?', a: ['Application', 'Network', 'Transport', 'Physical'], correct: 2 },
      { q: 'What is a DDoS attack?', a: ['Stealing encrypted data', 'Overwhelming a server with traffic', 'Guessing passwords', 'Injecting malware via email'], correct: 1 }
    ]
  },
  {
    id: 4,
    title: 'Ethical Hacking & Recon',
    badge: 'ADVANCED',
    badgeClass: 'badge-advanced',
    desc: 'Think like an attacker to defend like a pro. OSINT, port scanning, and vulnerability mapping.',
    topics: ['OSINT', 'Nmap', 'Footprinting', 'CVEs'],
    xp: 350,
    tabs: ['Learn', 'Interactive', 'Quiz'],
    learn: `
      <h4>Ethical Hacking (Penetration Testing)</h4>
      <p>Ethical hackers — <strong style="color:var(--lavender)">penetration testers</strong> — are hired to attack systems with permission, to find vulnerabilities before real attackers do. They follow the same methodology: Recon → Scanning → Exploitation → Reporting.</p>
      <h4>OSINT — Open Source Intelligence</h4>
      <p>Attackers gather publicly available info before touching a target: WHOIS records, LinkedIn employees, GitHub code, job postings (which reveal tech stacks), and DNS records. This is <em>passive recon</em> — no packets sent to the target.</p>
      <h4>Port Scanning with Nmap</h4>
      <p>Every service runs on a port. Port 80 = HTTP. Port 443 = HTTPS. Port 22 = SSH. Nmap sends probes to discover which ports are open, revealing what software is running — and therefore what vulnerabilities might exist.</p>
      <h4>CVEs — Common Vulnerabilities and Exposures</h4>
      <p>A CVE is a public record of a known vulnerability, e.g. CVE-2021-44228 (Log4Shell). Each gets a CVSS score (0–10). Attackers scan for systems running vulnerable versions.</p>
    `,
    interactive: 'network-scan',
    quiz: [
      { q: 'What is OSINT?', a: ['Hacking using open-source tools', 'Intelligence gathered from public sources', 'A type of malware', 'An encryption standard'], correct: 1 },
      { q: 'What port does SSH typically run on?', a: ['80', '443', '22', '3389'], correct: 2 },
      { q: 'What does a CVE score of 9.8 indicate?', a: ['Very low risk', 'Medium risk', 'High/critical risk', 'The vulnerability is patched'], correct: 2 }
    ]
  },
  {
    id: 5,
    title: 'Web Application Security',
    badge: 'ADVANCED',
    badgeClass: 'badge-advanced',
    desc: 'The OWASP Top 10. SQL injection, XSS, CSRF, and how to stop them cold.',
    topics: ['SQLi', 'XSS', 'CSRF', 'OWASP Top 10'],
    xp: 400,
    tabs: ['Learn', 'Interactive', 'Quiz'],
    learn: `
      <h4>OWASP Top 10</h4>
      <p>OWASP (Open Web Application Security Project) publishes the top 10 web vulnerabilities. Mastering these means understanding where the vast majority of real attacks occur.</p>
      <h4>SQL Injection</h4>
      <p>If user input is inserted directly into a SQL query, an attacker can break out of the query and run their own SQL. Input <code style="color:var(--green);font-family:var(--font-mono)">' OR 1=1--</code> can bypass a login entirely. Prevention: parameterized queries.</p>
      <h4>Cross-Site Scripting (XSS)</h4>
      <p>Injecting malicious JavaScript into a page viewed by other users. A stored XSS in a comment box could steal every visitor's session cookies, logging in as them.</p>
      <h4>Cross-Site Request Forgery (CSRF)</h4>
      <p>Tricks a logged-in user's browser into making a request to a site they're authenticated on — without their knowledge. A malicious link could transfer funds from your bank. Prevention: CSRF tokens and SameSite cookies.</p>
    `,
    interactive: 'sql-injection',
    quiz: [
      { q: "What does ' OR 1=1-- do in a SQL login query?", a: ['Causes an error', 'Bypasses authentication', 'Deletes the database', 'Encrypts the query'], correct: 1 },
      { q: 'Which attack injects JavaScript into pages seen by other users?', a: ['SQL Injection', 'CSRF', 'XSS', 'Buffer Overflow'], correct: 2 },
      { q: 'What prevents CSRF attacks?', a: ['Hashing passwords', 'CSRF tokens + SameSite cookies', 'TLS encryption', 'Firewalls'], correct: 1 }
    ]
  },
  {
    id: 6,
    title: 'Malware & Reverse Engineering',
    badge: 'EXPERT',
    badgeClass: 'badge-expert',
    desc: 'Dissect viruses, trojans, and ransomware. Understand how malware operates and how analysts hunt it.',
    topics: ['Malware Types', 'Indicators of Compromise', 'Static Analysis', 'Sandboxing'],
    xp: 500,
    tabs: ['Learn', 'Interactive', 'Quiz'],
    learn: `
      <h4>Malware Taxonomy</h4>
      <p><strong style="color:var(--lavender)">Virus</strong> — attaches to files and spreads. <strong style="color:var(--lavender)">Worm</strong> — self-replicates across networks. <strong style="color:var(--lavender)">Trojan</strong> — disguised as legitimate software. <strong style="color:var(--lavender)">Ransomware</strong> — encrypts files, demands payment. <strong style="color:var(--lavender)">Rootkit</strong> — hides itself deep in the OS.</p>
      <h4>Indicators of Compromise (IoCs)</h4>
      <p>Evidence that a system has been breached: unusual network connections, suspicious registry keys, new scheduled tasks, unexpected processes, file hashes matching known malware. Threat intelligence platforms share IoCs globally.</p>
      <h4>Static vs. Dynamic Analysis</h4>
      <p><strong style="color:var(--lavender)">Static</strong> — examine the binary without running it. Disassembly, strings extraction, entropy analysis. <strong style="color:var(--lavender)">Dynamic</strong> — run the sample in a controlled sandbox and observe behavior: file writes, network calls, registry changes.</p>
      <h4>Sandbox Evasion</h4>
      <p>Sophisticated malware detects sandbox environments (virtual machine artifacts, timing, user activity absence) and lies dormant until it believes it's on a real machine.</p>
    `,
    interactive: 'malware-analysis',
    quiz: [
      { q: 'Which malware type spreads across networks without user interaction?', a: ['Virus', 'Worm', 'Trojan', 'Spyware'], correct: 1 },
      { q: 'What are Indicators of Compromise (IoCs)?', a: ['Attack signatures in source code', 'Evidence of system compromise', 'Cryptographic keys', 'Network firewall rules'], correct: 1 },
      { q: 'Dynamic analysis involves...', a: ['Reading disassembled binary code', 'Running malware in a sandbox', 'Scanning with antivirus', 'Checking file hashes'], correct: 1 }
    ]
  }
];

/* ── DOM refs ─────────────────────────────────────────────── */
const modalOverlay  = document.getElementById('modal-overlay');
const modalTitle    = document.getElementById('modal-title');
const modalBody     = document.getElementById('modal-body');
const modalClose    = document.getElementById('modal-close');
const xpOverlay     = document.getElementById('xp-overlay');
const xpNum         = document.getElementById('xp-num');
const xpFill        = document.getElementById('xp-fill');
const navXp         = document.getElementById('nav-xp');
const toast         = document.getElementById('toast');
const levelPath     = document.getElementById('level-path');

/* ── Boot terminal ───────────────────────────────────────── */
function runBootTerminal() {
  const lines = [
    { type: 'prompt', text: '~/ ' },
    { type: 'cmd',    text: 'init cybersec-bootcamp --mode=interactive', delay: 0 },
    { type: 'out',    text: '> Loading curriculum modules...', delay: 700 },
    { type: 'out',    text: '> 7 levels detected  [■■■■■■■□□□]', delay: 1300, cls: 'hi' },
    { type: 'out',    text: '> Environment ready. Welcome, recruit.', delay: 1900, cls: 'hi' },
    { type: 'prompt2',text: '~/ ', delay: 2400 }
  ];

  const body = document.getElementById('term-body');
  body.innerHTML = '';

  let i = 0;
  function next() {
    if (i >= lines.length) return;
    const l = lines[i++];
    setTimeout(() => {
      const span = document.createElement('span');
      span.className = 'term-line';
      if (l.type === 'prompt' || l.type === 'prompt2') {
        span.innerHTML = `<span class="term-prompt">❯</span> <span class="term-cmd"></span>`;
        body.appendChild(span);
        if (l.type === 'prompt') typeText(span.querySelector('.term-cmd'), l.text.trim() === '~/ ' ? '' : l.text, next);
        else {
          const cur = document.createElement('span');
          cur.className = 'term-cursor';
          span.appendChild(cur);
        }
      } else {
        span.innerHTML = `<span class="term-out ${l.cls || ''}">${l.text}</span>`;
        body.appendChild(span);
        next();
      }
    }, l.delay || 0);
  }

  // Prompt+cmd type-out
  function typeText(el, text, cb) {
    const full = 'init cybersec-bootcamp --mode=interactive';
    let idx = 0;
    const cursor = document.createElement('span');
    cursor.className = 'term-cursor';
    el.appendChild(cursor);

    const iv = setInterval(() => {
      el.insertBefore(document.createTextNode(full[idx++]), cursor);
      if (idx >= full.length) {
        clearInterval(iv);
        setTimeout(cb, 400);
      }
    }, 38);
  }

  // kick off after prompt line
  const promptLine = document.createElement('span');
  promptLine.className = 'term-line';
  promptLine.innerHTML = `<span class="term-prompt">❯</span> <span class="term-cmd" id="tcmd"></span>`;
  body.appendChild(promptLine);

  const tcmd = document.getElementById('tcmd');
  const cursor = document.createElement('span');
  cursor.className = 'term-cursor';
  tcmd.appendChild(cursor);

  const full = 'init cybersec-bootcamp --mode=interactive';
  let idx = 0;
  const iv = setInterval(() => {
    tcmd.insertBefore(document.createTextNode(full[idx++]), cursor);
    if (idx >= full.length) {
      clearInterval(iv);
      cursor.remove();

      const rest = [
        { text: '> Loading curriculum modules...', delay: 400 },
        { text: '> 7 levels detected  [■■■■■■■□□□]', delay: 1000, cls: 'hi' },
        { text: '> Environment ready. Welcome, recruit.', delay: 1600, cls: 'hi' }
      ];

      rest.forEach(r => {
        setTimeout(() => {
          const s = document.createElement('span');
          s.className = 'term-line';
          s.innerHTML = `<span class="term-out ${r.cls||''}">${r.text}</span>`;
          body.appendChild(s);
        }, r.delay);
      });

      setTimeout(() => {
        const s = document.createElement('span');
        s.className = 'term-line';
        s.innerHTML = `<span class="term-prompt">❯</span> <span class="term-cursor"></span>`;
        body.appendChild(s);
      }, 2200);
    }
  }, 38);
}

/* ── Render level path ───────────────────────────────────── */
function renderLevels() {
  levelPath.innerHTML = '';
  LEVELS.forEach((lv, i) => {
    const unlocked = state.unlockedLevels.has(i);
    const completed = state.completedLevels.has(i);
    const isLeft = i % 2 === 0;

    const row = document.createElement('div');
    row.className = `level-row ${isLeft ? 'left' : 'right'}`;

    const card = document.createElement('div');
    card.className = `level-card ${unlocked ? '' : 'locked'}`;
    card.innerHTML = `
      <div class="level-badge ${lv.badgeClass}">${completed ? '✓ ' : ''}${lv.badge}</div>
      <h3>${lv.title}</h3>
      <p>${lv.desc}</p>
      <div class="level-topics">${lv.topics.map(t => `<span class="topic-chip">${t}</span>`).join('')}</div>
      <div class="card-action">
        <span>${completed ? 'Review' : unlocked ? 'Start lesson' : 'Locked — complete previous level'}</span>
        ${unlocked ? '<span class="arrow">→</span>' : '🔒'}
      </div>
    `;

    if (unlocked) {
      card.addEventListener('click', () => openLesson(i));
    }

    const spacer = document.createElement('div');
    spacer.className = 'level-spacer';
    const nodeState = completed ? 'unlocked' : (unlocked ? 'active' : '');
    spacer.innerHTML = `
      <div class="level-node ${nodeState}" title="Level ${i + 1}">
        ${completed ? '✓' : `L${i + 1}`}
      </div>
    `;

    const empty = document.createElement('div');
    empty.className = 'level-empty';

    if (isLeft) {
      row.appendChild(card);
      row.appendChild(spacer);
      row.appendChild(empty);
    } else {
      row.appendChild(empty);
      row.appendChild(spacer);
      row.appendChild(card);
    }

    levelPath.appendChild(row);
  });
}

/* ── Open lesson modal ───────────────────────────────────── */
function openLesson(idx) {
  const lv = LEVELS[idx];
  modalTitle.textContent = `Level ${idx + 1}: ${lv.title}`;

  modalBody.innerHTML = `
    <div class="lesson-tabs" id="lesson-tabs">
      ${lv.tabs.map((t, i) => `<button class="lesson-tab ${i===0?'active':''}" data-tab="${i}">${t}</button>`).join('')}
    </div>

    <!-- Learn tab -->
    <div class="lesson-panel ${lv.tabs[0]==='Learn'?'active':''}" data-panel="0">
      <div class="lesson-prose">${lv.learn}</div>
    </div>

    <!-- Interactive tab -->
    <div class="lesson-panel" data-panel="1">
      <div id="interactive-mount"></div>
    </div>

    <!-- Quiz tab -->
    <div class="lesson-panel" data-panel="2">
      <div id="quiz-mount"></div>
    </div>
  `;

  // Tab switching
  document.getElementById('lesson-tabs').addEventListener('click', e => {
    if (!e.target.matches('.lesson-tab')) return;
    const ti = +e.target.dataset.tab;
    document.querySelectorAll('.lesson-tab').forEach((t,i) => t.classList.toggle('active', i===ti));
    document.querySelectorAll('.lesson-panel').forEach((p,i) => p.classList.toggle('active', i===ti));
    if (ti === 1) mountInteractive(lv);
    if (ti === 2) mountQuiz(lv, idx);
  });

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

/* ── Interactive demos ───────────────────────────────────── */
function mountInteractive(lv) {
  const mount = document.getElementById('interactive-mount');
  if (!mount) return;

  switch (lv.interactive) {
    case 'cia-triad':      mount.innerHTML = ciaTria(); break;
    case 'password-strength': mount.innerHTML = passwordDemo(); bindPasswordDemo(); break;
    case 'caesar-cipher': mount.innerHTML = caesarDemo(); bindCaesarDemo(); break;
    case 'packet-builder': mount.innerHTML = packetDemo(); bindPacketDemo(); break;
    case 'network-scan':   mount.innerHTML = scanDemo(); bindScanDemo(); break;
    case 'sql-injection':  mount.innerHTML = sqlDemo(); bindSqlDemo(); break;
    case 'malware-analysis': mount.innerHTML = malwareDemo(); break;
  }
}

/* CIA Triad visual */
function ciaTria() {
  return `
    <div style="padding:1.5rem">
      <p class="muted" style="margin-bottom:1.5rem">Click each pillar to understand it. All three must hold for a system to be secure.</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem">
        ${[
          { label:'Confidentiality', icon:'🔐', color:'#7c3aed', ex:'Encryption, access control, VPNs ensure only authorised eyes read data.' },
          { label:'Integrity', icon:'🛡️', color:'#a855f7', ex:'Checksums, digital signatures, and audit logs prevent unauthorised modification.' },
          { label:'Availability', icon:'⚡', color:'#00ff88', ex:'Redundancy, DDoS protection, and backups keep systems accessible.' }
        ].map(p => `
          <div class="cia-pillar" onclick="this.classList.toggle('expanded')" style="
            background:var(--panel);border:1px solid ${p.color}44;border-radius:var(--radius);
            padding:1.25rem;cursor:pointer;transition:all .25s;text-align:center
          ">
            <div style="font-size:2rem;margin-bottom:.5rem">${p.icon}</div>
            <div style="font-weight:700;font-size:.9rem;color:${p.color};margin-bottom:.75rem">${p.label}</div>
            <div style="font-size:.8rem;color:var(--muted);line-height:1.5">${p.ex}</div>
          </div>
        `).join('')}
      </div>
      <div class="lab-box">
        <div class="lab-toolbar"><span>🎯 Scenario Analyzer</span></div>
        <div style="padding:1rem">
          <select id="cia-scenario" style="width:100%;background:var(--void);border:1px solid var(--border);
            color:var(--ghost);border-radius:var(--radius-sm);padding:.5rem;font-family:var(--font-mono);font-size:.8rem;margin-bottom:.75rem">
            <option value="">Select an attack scenario...</option>
            <option value="c">Attacker reads encrypted emails without decryption</option>
            <option value="i">Attacker changes a medical record silently</option>
            <option value="a">DDoS attack takes down a hospital website</option>
            <option value="all">Ransomware encrypts and exfiltrates all data</option>
          </select>
          <div id="cia-result" style="font-family:var(--font-mono);font-size:.8rem;color:var(--green);min-height:40px"></div>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('change', e => {
  if (!e.target.matches('#cia-scenario')) return;
  const map = {
    c: '❌ Confidentiality violated — attacker can read private data. Integrity ✓  Availability ✓',
    i: '❌ Integrity violated — data silently altered, trust is gone. Confidentiality ✓  Availability ✓',
    a: '❌ Availability violated — legitimate users can\'t access the system. Confidentiality ✓  Integrity ✓',
    all: '❌ ALL THREE violated — this is the worst-case scenario. Ransomware is a complete CIA failure.'
  };
  const r = document.getElementById('cia-result');
  if (r) r.textContent = map[e.target.value] || '';
});

/* Password strength */
function passwordDemo() {
  return `
    <div class="pw-demo">
      <p class="muted" style="margin-bottom:1rem">Type a password to analyse its strength in real-time.</p>
      <input class="pw-field" id="pw-input" type="text" placeholder="Type a password..." autocomplete="off"/>
      <div class="pw-bar-wrap"><div class="pw-bar" id="pw-bar"></div></div>
      <div id="pw-label" style="font-family:var(--font-mono);font-size:.75rem;color:var(--muted);margin-bottom:.75rem">No password</div>
      <div class="pw-hints">
        ${[
          ['pw-len','12+ characters'],
          ['pw-upper','Uppercase letter'],
          ['pw-lower','Lowercase letter'],
          ['pw-num','Number'],
          ['pw-sym','Special character (!@#...)'],
          ['pw-dict','Not a common word']
        ].map(([id,label]) => `<span class="pw-hint" id="${id}">${label}</span>`).join('')}
      </div>
      <div style="margin-top:1.5rem;padding:1rem;background:rgba(0,0,0,.3);border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:.75rem">
        <div style="color:var(--amethyst);margin-bottom:.4rem">💡 Time to crack (estimated)</div>
        <div id="crack-time" style="color:var(--ghost)">—</div>
      </div>
    </div>
  `;
}

function bindPasswordDemo() {
  const el = document.getElementById('pw-input');
  if (!el) return;
  el.addEventListener('input', () => analyzePassword(el.value));
}

function analyzePassword(pw) {
  const checks = {
    len:   pw.length >= 12,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    num:   /[0-9]/.test(pw),
    sym:   /[^A-Za-z0-9]/.test(pw),
    dict:  !['password','123456','qwerty','letmein','welcome','iloveyou'].includes(pw.toLowerCase())
  };

  const score = Object.values(checks).filter(Boolean).length;
  const bar = document.getElementById('pw-bar');
  const label = document.getElementById('pw-label');
  const crack = document.getElementById('crack-time');

  const colors = ['#ff4466','#ff7043','#fbbf24','#22c55e','#00ff88','#00ff88'];
  const labels = ['Very weak','Weak','Fair','Strong','Very strong','Excellent!'];
  const cracks = ['Instantly','< 1 second','Minutes','Weeks','Centuries','Heat death of universe'];

  if (bar)   { bar.style.width = `${(score/6)*100}%`; bar.style.background = colors[score] || '#888'; }
  if (label) label.textContent = pw ? labels[score] || 'Excellent!' : 'No password';
  if (crack) crack.textContent = pw ? cracks[Math.min(score, cracks.length-1)] : '—';

  Object.entries(checks).forEach(([k,v]) => {
    const el = document.getElementById(`pw-${k}`);
    if (el) el.classList.toggle('pass', v);
  });
}

/* Caesar cipher */
function caesarDemo() {
  return `
    <div style="padding:1.5rem">
      <p class="muted" style="margin-bottom:1rem">Type plaintext and drag the shift slider — watch it encrypt in real time.</p>
      <div style="margin-bottom:1rem">
        <label style="font-family:var(--font-mono);font-size:.75rem;color:var(--muted);display:block;margin-bottom:.4rem">SHIFT: <span id="shift-val">3</span></label>
        <input type="range" id="shift-range" min="1" max="25" value="3"/>
      </div>
      <div class="cipher-wrap">
        <div>
          <div style="font-family:var(--font-mono);font-size:.7rem;color:var(--muted);margin-bottom:.4rem">PLAINTEXT</div>
          <input class="cipher-input" id="cipher-plain" placeholder="Type message here..." value="Hello World"/>
        </div>
        <div class="cipher-arrow">
          <div>⟶</div>
          <div class="shift-label">shift <span id="cipher-shift-label">3</span></div>
        </div>
        <div>
          <div style="font-family:var(--font-mono);font-size:.7rem;color:var(--green);margin-bottom:.4rem">CIPHERTEXT</div>
          <div class="cipher-output" id="cipher-out">Khoor Zruog</div>
        </div>
      </div>
      <div style="margin-top:1.5rem" class="lab-box">
        <div class="lab-toolbar"><span>🔓 Brute-force all 25 shifts</span><button class="lab-run" id="brute-btn">Run</button></div>
        <div class="lab-output" id="brute-out" style="max-height:140px;overflow-y:auto">Click "Run" to see all possible decryptions...</div>
      </div>
    </div>
  `;
}

function bindCaesarDemo() {
  const plain = document.getElementById('cipher-plain');
  const out   = document.getElementById('cipher-out');
  const range = document.getElementById('shift-range');
  const sv    = document.getElementById('shift-val');
  const sl    = document.getElementById('cipher-shift-label');
  const bb    = document.getElementById('brute-btn');
  const bo    = document.getElementById('brute-out');

  function caesar(text, shift) {
    return text.replace(/[a-zA-Z]/g, c => {
      const base = c >= 'a' ? 97 : 65;
      return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
    });
  }

  function update() {
    const shift = +range.value;
    if (sv)  sv.textContent  = shift;
    if (sl)  sl.textContent  = shift;
    if (out) out.textContent = caesar(plain?.value || '', shift);
  }

  plain?.addEventListener('input', update);
  range?.addEventListener('input', update);
  update();

  bb?.addEventListener('click', () => {
    if (!bo || !plain) return;
    let html = '';
    for (let s = 1; s <= 25; s++) {
      html += `Shift ${String(s).padStart(2,' ')}: ${caesar(plain.value, s)}\n`;
    }
    bo.textContent = html;
  });
}

/* Packet builder */
function packetDemo() {
  return `
    <div style="padding:1.5rem">
      <p class="muted" style="margin-bottom:1.5rem">Visualise how data is encapsulated through the TCP/IP stack. Click a field to learn about it.</p>
      ${[
        { name:'APPLICATION LAYER (HTTP)', fields: ['GET /index.html','HTTP/1.1','Host: example.com','User-Agent: Mozilla'] },
        { name:'TRANSPORT LAYER (TCP)', fields: ['Src Port: 52341','Dst Port: 443','Seq: 1000','Checksum: 0xF4A2'] },
        { name:'INTERNET LAYER (IP)', fields: ['Version: 4','TTL: 64','Src IP: 192.168.1.5','Dst IP: 93.184.216.34'] },
        { name:'NETWORK ACCESS (Ethernet)', fields: ['Dst MAC: AA:BB:CC','Src MAC: 11:22:33','EtherType: 0x0800','FCS: 0xDEAD'] }
      ].map((layer, li) => `
        <div class="net-layer" style="margin-bottom:1rem">
          <div class="layer-label">${layer.name}</div>
          <div class="packet-row">
            ${layer.fields.map((f,fi) => `
              <div class="packet-field" onclick="highlightField(this,'${f}')" title="${f}">${f.split(':')[0]}</div>
            `).join('')}
          </div>
        </div>
      `).join('')}
      <div id="field-info" style="margin-top:1rem;padding:.75rem 1rem;background:var(--panel);border:1px solid var(--border);
        border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:.8rem;color:var(--amethyst);min-height:40px">
        Click any field above to learn what it does.
      </div>
    </div>
  `;
}

const fieldInfo = {
  'GET /index.html': 'The HTTP method + path — tells the server which resource you want.',
  'HTTP/1.1': 'The protocol version. HTTP/2 and HTTP/3 are faster successors.',
  'Host: example.com': 'The domain name. Servers use this to route to the right virtual host.',
  'User-Agent: Mozilla': 'Identifies your browser/client. Can be spoofed trivially.',
  'Src Port: 52341': 'Ephemeral (temporary) port chosen by your OS for this connection.',
  'Dst Port: 443': 'Port 443 = HTTPS. The server listens here for encrypted web traffic.',
  'Seq: 1000': 'TCP sequence number — tracks which bytes have been sent and received.',
  'Checksum: 0xF4A2': 'Error detection: if data is corrupted in transit, this won\'t match.',
  'Version: 4': 'IPv4. IPv6 is the newer version with vastly more address space.',
  'TTL: 64': 'Time To Live — decremented at each router hop. Prevents infinite loops.',
  'Src IP: 192.168.1.5': 'Your private IP. Gets NAT\'d to a public IP at your router.',
  'Dst IP: 93.184.216.34': 'The destination server\'s public IP address.',
  'Dst MAC: AA:BB:CC': 'Physical (layer 2) destination — usually your router\'s MAC.',
  'Src MAC: 11:22:33': 'Your network card\'s physical hardware address.',
  'EtherType: 0x0800': 'Tells the receiving hardware this is an IPv4 packet.',
  'FCS: 0xDEAD': 'Frame Check Sequence — detects bit errors in the physical transmission.'
};

window.highlightField = function(el, full) {
  document.querySelectorAll('.packet-field').forEach(f => f.classList.remove('hl','hh'));
  el.classList.add('hh');
  const info = document.getElementById('field-info');
  const key = Object.keys(fieldInfo).find(k => full.startsWith(k.split(':')[0])) || full;
  if (info) info.textContent = fieldInfo[full] || fieldInfo[key] || 'Field in the packet header.';
};

function bindPacketDemo() {} // uses global

/* Network scan */
function scanDemo() {
  return `
    <div style="padding:1.5rem">
      <p class="muted" style="margin-bottom:1rem">Simulate a port scan across a subnet. Watch hosts respond (or not) as the scanner probes them.</p>
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;flex-wrap:wrap">
        <code style="font-family:var(--font-mono);font-size:.8rem;color:var(--green)">nmap -sV 192.168.1.0/24</code>
        <button class="lab-run" id="scan-btn">▶ Run Scan</button>
        <span id="scan-status" style="font-family:var(--font-mono);font-size:.75rem;color:var(--muted)">Ready</span>
      </div>
      <div class="scan-grid" id="scan-grid"></div>
      <div id="scan-detail" style="margin-top:1rem;padding:.75rem 1rem;background:var(--panel);border:1px solid var(--border);
        border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:.75rem;color:var(--ghost);min-height:50px;white-space:pre-wrap"></div>
    </div>
  `;
}

function bindScanDemo() {
  const grid   = document.getElementById('scan-grid');
  const btn    = document.getElementById('scan-btn');
  const status = document.getElementById('scan-status');
  const detail = document.getElementById('scan-detail');

  const hosts = Array.from({length: 30}, (_,i) => ({
    ip: `192.168.1.${i+1}`,
    open: Math.random() > .65,
    ports: ['22/ssh','80/http','443/https','3306/mysql','8080/http-alt'].filter(() => Math.random() > .6)
  }));

  if (!grid) return;
  grid.innerHTML = hosts.map((h,i) => `
    <div class="scan-host" data-i="${i}" title="${h.ip}">
      <div>.${i+1}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.scan-host').forEach((el, i) => {
    if (hosts[i].open) {
      el.addEventListener('click', () => {
        const h = hosts[i];
        if (detail) detail.textContent =
          `Host: ${h.ip}\nStatus: UP\nOpen ports:\n${h.ports.length ? h.ports.map(p=>`  ${p}`).join('\n') : '  (none found)'}\n`;
      });
    }
  });

  btn?.addEventListener('click', () => {
    btn.disabled = true;
    const els = grid.querySelectorAll('.scan-host');
    els.forEach(e => { e.className = 'scan-host'; });
    if (status) status.textContent = 'Scanning...';

    let i = 0;
    const iv = setInterval(() => {
      if (i >= els.length) {
        clearInterval(iv);
        if (status) status.textContent = `Done — ${hosts.filter(h=>h.open).length} hosts up`;
        btn.disabled = false;
        return;
      }
      els[i].classList.add('scanning');
      const prev = i - 1;
      if (prev >= 0) els[prev].classList.remove('scanning');
      setTimeout(() => {
        els[i].classList.remove('scanning');
        els[i].classList.add(hosts[i].open ? 'open' : 'closed');
        els[i].innerHTML = `<div>${hosts[i].open ? '●' : '○'}</div><div style="font-size:.55rem">.${i+1}</div>`;
      }, 120);
      i++;
    }, 130);
  });
}

/* SQL injection demo */
function sqlDemo() {
  return `
    <div style="padding:1.5rem">
      <p class="muted" style="margin-bottom:1rem">This simulates a vulnerable login form. Try normal credentials, then try an injection payload.</p>
      <div class="lab-box">
        <div class="lab-toolbar"><span>🗄️ Vulnerable Login Form</span></div>
        <div style="padding:1.25rem;display:flex;flex-direction:column;gap:.75rem">
          <div>
            <label style="font-family:var(--font-mono);font-size:.7rem;color:var(--muted);display:block;margin-bottom:.3rem">USERNAME</label>
            <input id="sql-user" style="width:100%;background:rgba(0,0,0,.3);border:1px solid var(--border);border-radius:var(--radius-sm);
              padding:.6rem .9rem;color:var(--ghost);font-family:var(--font-mono);font-size:.85rem;outline:none" value="admin"/>
          </div>
          <div>
            <label style="font-family:var(--font-mono);font-size:.7rem;color:var(--muted);display:block;margin-bottom:.3rem">PASSWORD</label>
            <input id="sql-pass" style="width:100%;background:rgba(0,0,0,.3);border:1px solid var(--border);border-radius:var(--radius-sm);
              padding:.6rem .9rem;color:var(--ghost);font-family:var(--font-mono);font-size:.85rem;outline:none" value="wrongpassword"/>
          </div>
          <button class="lab-run" id="sql-btn" style="align-self:flex-start;padding:.5rem 1.25rem">Login</button>
        </div>
        <div class="lab-output" id="sql-output">Query result will appear here...</div>
      </div>
      <div style="margin-top:1rem;padding:1rem;background:var(--panel);border:1px solid var(--border);border-radius:var(--radius-sm)">
        <div style="font-family:var(--font-mono);font-size:.7rem;color:var(--amethyst);margin-bottom:.5rem">💡 Try these payloads in the PASSWORD field:</div>
        ${["' OR '1'='1","' OR 1=1--","admin'--","' UNION SELECT * FROM users--"].map(p =>
          `<div onclick="document.getElementById('sql-pass').value='${p}'"
            style="font-family:var(--font-mono);font-size:.75rem;color:var(--green);cursor:pointer;padding:.2rem 0;
            hover:color:var(--lavender)">> ${p}</div>`
        ).join('')}
      </div>
    </div>
  `;
}

function bindSqlDemo() {
  const btn = document.getElementById('sql-btn');
  const out = document.getElementById('sql-output');
  if (!btn || !out) return;

  btn.addEventListener('click', () => {
    const user = document.getElementById('sql-user')?.value || '';
    const pass = document.getElementById('sql-pass')?.value || '';

    const query = `SELECT * FROM users WHERE username='${user}' AND password='${pass}'`;
    const injection = /('\s*OR\s*'?1'?='?1|'?\s*(OR|--)\s*[\w\s='"]*$)/i.test(pass) || pass.includes("'--") || pass.includes('UNION');

    if (injection) {
      out.textContent = `⚠ INJECTION DETECTED!\n\nQuery sent:\n  ${query}\n\nResult: Login BYPASSED — returned all rows from users table!\n\nThe injected SQL broke out of the password check.\nFix: Use parameterised queries / prepared statements.`;
      out.style.color = 'var(--red)';
    } else if (user === 'admin' && pass === 'c0rr3ct!') {
      out.textContent = `✓ Login successful.\n\nQuery:\n  ${query}\n\nWelcome, admin!`;
      out.style.color = 'var(--green)';
    } else {
      out.textContent = `✗ Invalid credentials.\n\nQuery:\n  ${query}\n\nTip: Try a SQL injection payload from below.`;
      out.style.color = 'var(--muted)';
    }
  });
}

/* Malware analysis */
function malwareDemo() {
  const strings = [
    { s: 'cmd.exe /c whoami', risk: 'high', note: 'Runs a shell command to identify current user' },
    { s: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', risk: 'high', note: 'Persistence: adds itself to startup registry key' },
    { s: 'CreateRemoteThread', risk: 'high', note: 'Code injection: injects code into another process' },
    { s: 'VirtualAllocEx', risk: 'medium', note: 'Allocates memory in another process — injection setup' },
    { s: 'GetProcAddress', risk: 'medium', note: 'Resolves API calls dynamically — evasion technique' },
    { s: 'InternetOpenUrl', risk: 'medium', note: 'Makes HTTP requests — possible C2 communication' },
    { s: 'SOFTWARE\\Microsoft\\Windows NT', risk: 'low', note: 'Reads Windows version info' },
    { s: 'kernel32.dll', risk: 'low', note: 'Standard Windows library import' },
  ];

  return `
    <div style="padding:1.5rem">
      <p class="muted" style="margin-bottom:1rem">Static analysis: extracted strings from a suspicious binary. Assess each for malicious intent.</p>
      <div style="display:flex;flex-direction:column;gap:.5rem" id="strings-list">
        ${strings.map((s,i) => `
          <div class="string-row" data-i="${i}" onclick="toggleStringInfo(${i})" style="
            background:var(--panel);border:1px solid var(--border);border-radius:var(--radius-sm);
            padding:.6rem 1rem;cursor:pointer;font-family:var(--font-mono);font-size:.78rem;
            display:flex;align-items:center;gap:.75rem;transition:border-color .2s
          ">
            <span style="color:${s.risk==='high'?'var(--red)':s.risk==='medium'?'var(--gold)':'var(--muted)'}">
              ${s.risk==='high'?'🔴':s.risk==='medium'?'🟡':'🟢'}
            </span>
            <span style="flex:1;color:var(--ghost)">${s.s}</span>
            <span style="color:var(--muted);font-size:.65rem">${s.risk.toUpperCase()}</span>
          </div>
          <div id="sinfo-${i}" style="display:none;padding:.5rem 1rem .5rem 2.5rem;font-size:.8rem;color:var(--amethyst)">${s.note}</div>
        `).join('')}
      </div>
      <div style="margin-top:1.25rem;padding:.75rem 1rem;background:rgba(255,68,102,.08);border:1px solid rgba(255,68,102,.3);
        border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:.78rem;color:var(--red)">
        ⚠ Verdict: HIGH RISK — shell execution, persistence, and injection APIs detected. Submit to sandbox.
      </div>
    </div>
  `;
}

window.toggleStringInfo = function(i) {
  const el = document.getElementById(`sinfo-${i}`);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

/* ── Quiz ─────────────────────────────────────────────────── */
function mountQuiz(lv, levelIdx) {
  const mount = document.getElementById('quiz-mount');
  if (!mount) return;

  let current = 0, score = 0, answered = false;

  function render() {
    const q = lv.quiz[current];
    mount.innerHTML = `
      <div style="margin-bottom:1rem">
        <div style="font-family:var(--font-mono);font-size:.75rem;color:var(--muted);margin-bottom:.75rem">
          Question ${current+1} of ${lv.quiz.length}
        </div>
        <div style="font-weight:600;font-size:1rem;margin-bottom:1.25rem;line-height:1.4">${q.q}</div>
        <div style="display:flex;flex-direction:column;gap:.5rem" id="options">
          ${q.a.map((opt,i) => `
            <button onclick="answerQ(${i})" data-opt="${i}" style="
              width:100%;text-align:left;padding:.75rem 1rem;
              background:var(--panel);border:1px solid var(--border);border-radius:var(--radius-sm);
              color:var(--ghost);font-family:var(--font-head);font-size:.9rem;cursor:pointer;
              transition:border-color .2s,background .2s
            ">${opt}</button>
          `).join('')}
        </div>
        <div id="q-feedback" style="margin-top:1rem;font-size:.85rem;min-height:24px"></div>
      </div>
    `;
    answered = false;
  }

  window.answerQ = function(chosen) {
    if (answered) return;
    answered = true;
    const q = lv.quiz[current];
    const btns = document.querySelectorAll('#options button');
    btns.forEach((b,i) => {
      b.style.cursor = 'default';
      if (i === q.correct) { b.style.borderColor = 'var(--green)'; b.style.background = 'rgba(0,255,136,.1)'; }
      if (i === chosen && i !== q.correct) { b.style.borderColor = 'var(--red)'; b.style.background = 'rgba(255,68,102,.1)'; }
    });

    const fb = document.getElementById('q-feedback');
    if (chosen === q.correct) {
      score++;
      if (fb) fb.innerHTML = `<span style="color:var(--green)">✓ Correct!</span>`;
    } else {
      if (fb) fb.innerHTML = `<span style="color:var(--red)">✗ Incorrect.</span> <span style="color:var(--muted)">The answer was: ${q.a[q.correct]}</span>`;
    }

    setTimeout(() => {
      current++;
      if (current < lv.quiz.length) {
        render();
      } else {
        showResult();
      }
    }, 1400);
  };

  function showResult() {
    const pct = Math.round((score / lv.quiz.length) * 100);
    const pass = pct >= 66;
    mount.innerHTML = `
      <div style="text-align:center;padding:2rem 1rem">
        <div style="font-size:3rem;margin-bottom:1rem">${pass ? '🏆' : '📚'}</div>
        <div style="font-size:1.5rem;font-weight:700;margin-bottom:.5rem;color:${pass?'var(--green)':'var(--gold)'}">${pct}%</div>
        <div style="color:var(--muted);margin-bottom:1.5rem">${score}/${lv.quiz.length} correct</div>
        ${pass
          ? `<p style="color:var(--ghost);margin-bottom:1.5rem">Level complete! You've earned <strong style="color:var(--amethyst)">${lv.xp} XP</strong>.</p>`
          : `<p style="color:var(--muted);margin-bottom:1.5rem">Review the Learn tab and try again.</p>`
        }
        <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-ghost" onclick="mountQuiz(window._curLevel, window._curLevelIdx)">Retry Quiz</button>
          ${pass ? `<button class="btn btn-primary" onclick="completeLevel(${levelIdx})">Complete Level ✓</button>` : ''}
        </div>
      </div>
    `;
    window._curLevel = lv;
    window._curLevelIdx = levelIdx;
  }

  render();
}

window.completeLevel = function(idx) {
  const lv = LEVELS[idx];
  if (!state.completedLevels.has(idx)) {
    state.completedLevels.add(idx);
    state.xp += lv.xp;
    if (idx + 1 < LEVELS.length) state.unlockedLevels.add(idx + 1);
    updateXP();
    renderLevels();
    showToast(`+${lv.xp} XP — Level ${idx+1} complete! 🎉`);
  }
  closeModal();
};

/* ── XP system ───────────────────────────────────────────── */
function updateXP() {
  const max = LEVELS.reduce((a,l) => a+l.xp, 0);
  const pct = (state.xp / max) * 100;
  if (xpNum)  xpNum.textContent  = `${state.xp} XP`;
  if (xpFill) xpFill.style.width = `${pct}%`;
  if (navXp)  navXp.textContent  = `${state.xp} XP`;
  if (xpOverlay) xpOverlay.classList.add('show');
}

/* ── Toast ───────────────────────────────────────────────── */
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ── Smooth scroll nav ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── Intersection observer for nav highlight ──────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active-link', a.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { threshold: .4 });

sections.forEach(s => obs.observe(s));

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  runBootTerminal();
  renderLevels();

  // Animated stat counters
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    let current = 0;
    const step = target / 60;
    const iv = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = (el.dataset.suffix || '') + Math.floor(current).toLocaleString() + (el.dataset.after || '');
      if (current >= target) clearInterval(iv);
    }, 16);
  });
});
