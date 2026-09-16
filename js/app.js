// ── Module data ────────────────────────────────────────────────────────────
const modules = {

  xss: {
    label: "Cross-Site Scripting",
    understand: {
      prose: [
        "A web app often takes text that a visitor typed — a name, a comment, a search term — and displays it back to other users. XSS (Cross-Site Scripting) happens when the app forgets to escape that text before inserting it into the HTML page.",
        "When raw input lands in the DOM without escaping, the browser has no idea it wasn't written by the developer. If the input contains a <code>&lt;script&gt;</code> tag, the browser will execute it — in the context of the site, with access to cookies, session tokens, and anything else the site can see.",
        "A real XSS payload might silently steal your session cookie and send it to an attacker's server, or rewrite the login form to capture credentials — all while you're looking at a page that appears completely normal."
      ],
      diagram: [
        { type: "good", text: "<strong>Normal:</strong> User types <code>Hello!</code> → server encodes to <code>Hello!</code> → browser shows text only." },
        { type: "bad",  text: "<strong>XSS:</strong> Attacker types <code>&lt;script&gt;stealCookies()&lt;/script&gt;</code> → unsafe app injects raw HTML → browser executes script." },
        { type: "warn", text: "<strong>Result:</strong> Script runs in the victim's session, with full access to the page's cookies and DOM." }
      ],
      keyIdea: "The browser can't tell the difference between developer code and attacker code — both arrive as HTML. Output encoding is what keeps user input from becoming a script."
    },
    try: {
      hint: { title: "What to try", body: "Type a normal message first. Then try typing an HTML tag like <b>hello</b> or even &lt;script&gt;alert('xss')&lt;/script&gt; and see what the safe renderer does differently from an unsafe one." },
      renderInput: () => `
        <div class="field"><label for="xss-msg">Your message</label><input id="xss-msg" placeholder="e.g. Hello, bootcamp!" autocomplete="off"></div>
        <button class="run-btn" id="xss-run">Render safely</button>
      `,
      renderOutput: () => `
        <div class="output-bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div><span class="output-bar-title">safe-renderer.js</span></div>
        <div class="output-body" id="xss-output-body"><span style="color:var(--dim)">// Waiting for input...</span></div>
      `,
      init: (setResult) => {
        document.getElementById("xss-run").onclick = () => {
          const val  = document.getElementById("xss-msg").value || "";
          const body = document.getElementById("xss-output-body");
          const safeDiv = document.createElement("div");
          safeDiv.textContent = val || "(empty)";
          const safeText = safeDiv.innerHTML;
          const escaped  = val.replace(/</g,"&lt;").replace(/>/g,"&gt;") || "(empty)";
          body.innerHTML = `
            <span class="out-key">// Input received</span><br>
            <span style="color:var(--muted)">raw_input =</span> <span class="out-warn">"${escaped}"</span><br><br>
            <span class="out-key">// textContent (safe)</span><br>
            <span class="out-ok">rendered = "${safeText}"</span><br>
            <span style="color:var(--dim)">// Tags treated as text, not markup</span><br><br>
            <span class="out-key">// innerHTML (unsafe)</span><br>
            <span class="out-bad">would parse tags as HTML</span><br>
            <span style="color:var(--dim)">// Scripts would execute</span>
          `;
          const hasTag = val.includes("<") || val.includes(">");
          setResult(hasTag ? "danger" : "safe",
            hasTag
              ? "<strong>Script or HTML tag detected.</strong> The safe renderer used textContent — your tags were shown as literal text, not parsed as markup. An unsafe innerHTML call would have executed them."
              : "<strong>Clean input rendered safely.</strong> The renderer used textContent, which always treats input as data. Even if a script tag were present, it would show as text rather than execute."
          );
        };
      }
    },
    reflect: {
      quiz: {
        q: "Which of these is the correct defense against XSS?",
        opts: [
          "Block all <code>&lt;script&gt;</code> tags in user input",
          "Escape user input before inserting it into HTML output",
          "Use HTTPS so input can't be intercepted",
          "Only accept input from logged-in users"
        ],
        answer: 1,
        feedback: {
          good: "Exactly right. Output encoding (escaping) at render time is the correct fix. Blocking script tags alone can be bypassed with other vectors like event handlers or SVG.",
          bad: "Not quite. Blocking script tags sounds logical but attackers have dozens of ways around it (event handlers like onerror=, SVG payloads, protocol handlers). The correct fix is output encoding — escaping every character that has meaning in HTML so user input always renders as text."
        }
      },
      defenses: [
        { icon: "🔤", title: "Output encoding", body: "Escape HTML entities (<, >, \", ') at render time. Most templating engines do this by default." },
        { icon: "🔒", title: "Content Security Policy", body: "Set a CSP header that tells the browser which scripts it's allowed to execute." },
        { icon: "🚫", title: "HttpOnly cookies", body: "Mark session cookies HttpOnly so JavaScript (attacker scripts included) can't read them." },
        { icon: "🔍", title: "Input validation", body: "Validate input format and length — a defense-in-depth layer, not a replacement for output encoding." }
      ]
    }
  },

  sql: {
    label: "SQL Injection",
    understand: {
      prose: [
        "Most web applications store data in a relational database and query it with SQL. A login might ask the database: <em>SELECT * FROM users WHERE username='admin' AND password='abc123'</em>.",
        "SQL injection happens when a developer builds that query by directly concatenating user input into the SQL string. A malicious value like <code>' OR '1'='1</code> closes the string early and appends new SQL — completely changing the meaning of the query.",
        "The result can be a login bypass (logging in without a valid password), data exfiltration (dumping the whole users table), or in severe cases, even database server commands being executed."
      ],
      diagram: [
        { type: "good", text: "<strong>Safe query:</strong> <code>SELECT * FROM users WHERE user=? AND pass=?</code> — the <code>?</code> is a placeholder. The database handles the value separately." },
        { type: "bad",  text: "<strong>Unsafe query:</strong> <code>'SELECT ... WHERE user=\"' + input + '\"'</code> — attacker input <code>x' OR '1'='1</code> turns the WHERE clause always-true." },
        { type: "warn", text: "<strong>Result:</strong> The query returns the first row in the table — effectively logging the attacker in as the first registered user." }
      ],
      keyIdea: "Parameterized queries (prepared statements) separate SQL structure from data, so user input can never be interpreted as SQL logic — no matter what characters it contains."
    },
    try: {
      hint: { title: "Classic training payload", body: "Enter <strong>admin</strong> as the username and <strong>' OR '1'='1</strong> as the password. This closes the SQL string early and appends a condition that is always true." },
      renderInput: () => `
        <div class="field"><label for="sql-user">Username</label><input id="sql-user" placeholder="admin" autocomplete="off"></div>
        <div class="field"><label for="sql-pass">Password</label><input id="sql-pass" placeholder="try the payload above" autocomplete="off" type="text"></div>
        <button class="run-btn" id="sql-run">Submit login</button>
      `,
      renderOutput: () => `
        <div class="output-bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div><span class="output-bar-title">query-log.sql</span></div>
        <div class="output-body" id="sql-output-body"><span style="color:var(--dim)">// Query log will appear here...</span></div>
      `,
      init: (setResult) => {
        document.getElementById("sql-run").onclick = () => {
          const user = document.getElementById("sql-user").value.trim();
          const pass = document.getElementById("sql-pass").value;
          const eu   = user.replace(/</g,"&lt;").replace(/>/g,"&gt;");
          const ep   = pass.replace(/</g,"&lt;").replace(/>/g,"&gt;");
          const isInject  = pass === "' OR '1'='1";
          const isCorrect = user.toLowerCase() === "admin" && pass === "correct-horse";
          document.getElementById("sql-output-body").innerHTML = `
            <span class="out-key">// Unsafe query (concatenation)</span><br>
            <span class="${isInject ? "out-bad" : "out-warn"}">SELECT * FROM users<br>  WHERE username='${eu}'<br>  AND password='${ep}'</span><br><br>
            ${isInject
              ? `<span class="out-bad">⚠ WHERE becomes always-true!</span><br><span style="color:var(--dim)">// Returns first row without valid credentials</span>`
              : `<span style="color:var(--dim)">// Query evaluates normally</span>`}
          `;
          if (isInject) {
            setResult("danger", "<strong>Injection bypass triggered.</strong> The payload closed the password string early with <code>'</code>, then appended <code>OR '1'='1</code> — a condition that's always true. The WHERE clause no longer checks credentials.");
          } else if (isCorrect) {
            setResult("safe", "<strong>Normal login accepted.</strong> You used the demo's real password <code>correct-horse</code>.");
          } else {
            setResult("info", "<strong>Login denied.</strong> Try the training payload in the hint — or use the real demo password <code>correct-horse</code>.");
          }
        };
      }
    },
    reflect: {
      quiz: {
        q: "Why can't you fix SQL injection by just filtering out single quotes from user input?",
        opts: [
          "You can — that's the recommended fix",
          "Attackers can encode quotes as %27 or use other injection vectors that don't need them",
          "Databases ignore quoted characters anyway",
          "Single quotes are only dangerous in usernames, not passwords"
        ],
        answer: 1,
        feedback: {
          good: "Correct. Blocklisting is fragile — attacks can use URL encoding, Unicode variants, second-order injection, or payloads that don't need quotes at all. Parameterized queries make the question moot.",
          bad: "Not quite. Filtering quotes is a blocklist approach — easily bypassed with encodings like %27, double-encoding, or payloads that don't use quotes. The correct fix is parameterized queries, which remove the structural confusion entirely."
        }
      },
      defenses: [
        { icon: "📋", title: "Parameterized queries", body: "Use prepared statements with placeholders (?). The database driver handles quoting — input can never change query structure." },
        { icon: "🗂️", title: "ORMs", body: "Object-relational mappers generate parameterized queries by default. Raw SQL in an ORM is still dangerous." },
        { icon: "🔐", title: "Least privilege", body: "The app's database user should only have the permissions it actually needs — no DROP TABLE, no xp_cmdshell." },
        { icon: "🕵️", title: "Web Application Firewall", body: "A WAF can detect common injection patterns, but is a defense-in-depth layer, not a substitute for parameterized queries." }
      ]
    }
  },

  bruteforce: {
    label: "Brute Force Attacks",
    understand: {
      prose: [
        "Brute force is the simplest attack: try credentials repeatedly until one works. If a service allows unlimited login attempts, an attacker needs only time and a word list. Short, common passwords fall in seconds.",
        "Modern attacks don't guess randomly — they use dictionaries of real passwords from past breaches. The <em>Have I Been Pwned</em> dataset contains over 800 million real passwords. If yours is in that list, it's the first thing an attacker tries.",
        "A strong password shifts the problem from seconds to centuries — but rate limiting, account lockout, and multi-factor authentication remove the window for guessing entirely, regardless of password strength."
      ],
      diagram: [
        { type: "bad",  text: "<strong>Attack:</strong> Attacker loops through a word list, submitting one credential pair per request. No rate limit means no cost per attempt." },
        { type: "warn", text: "<strong>Scale:</strong> A basic script can try thousands of passwords per second against an unprotected endpoint." },
        { type: "good", text: "<strong>Defense:</strong> Rate limiting + exponential backoff + account lockout + MFA reduces the attack space to effectively impossible." }
      ],
      keyIdea: "A strong password buys time. Rate limiting, lockout policies, and MFA remove the time budget entirely — making guessing infeasible regardless of password strength."
    },
    try: {
      hint: { title: "Watch the guesser", body: "Click Start to run the simulated guesser. It cycles through a tiny word list until it finds the demo password. Notice how quickly it finds a short, predictable word — even in a list of only 8 options." },
      renderInput: () => `<button class="run-btn" id="bf-run">Start guessing</button>`,
      renderOutput: () => `
        <div class="output-bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div><span class="output-bar-title">brute-sim.log</span></div>
        <div class="output-body" id="bf-output-body">
          <span style="color:var(--dim)">// Wordlist: [sun, cat, blue, rocket, coffee, winter, bootcamp, secure]</span><br>
          <span style="color:var(--dim)">// Target: 1 account · No rate limit · No lockout</span><br>
          <span style="color:var(--dim)">// Waiting...</span>
        </div>
        <div class="progress-row">
          <div class="progress-track"><div class="progress-fill" id="bf-fill"></div></div>
          <div class="progress-stat" id="bf-stat">0 / 8 tried</div>
        </div>
      `,
      init: (setResult) => {
        let running = false;
        const words  = ["sun","cat","blue","rocket","coffee","winter","bootcamp","secure"];
        const secret = "secure";
        const btn    = document.getElementById("bf-run");
        btn.onclick  = () => {
          if (running) return;
          running = true; btn.disabled = true;
          const body = document.getElementById("bf-output-body");
          body.innerHTML = `<span style="color:var(--dim)">// Starting brute force simulation...</span><br>`;
          let i = 0;
          const timer = setInterval(() => {
            const word  = words[i];
            const match = word === secret;
            body.innerHTML += `<span style="color:var(--dim)">attempt ${i+1}:</span> trying <span class="out-warn">"${word}"</span> … <span class="${match ? "out-ok" : "out-bad"}">${match ? "✓ MATCH" : "✗ wrong"}</span><br>`;
            body.scrollTop = body.scrollHeight;
            document.getElementById("bf-fill").style.width = `${((i+1)/words.length)*100}%`;
            document.getElementById("bf-stat").textContent  = `${i+1} / ${words.length} tried`;
            i++;
            if (match) {
              clearInterval(timer);
              running = false; btn.disabled = false; btn.textContent = "Run again";
              setResult("danger", `<strong>Password found in ${i} attempt${i===1?"":"s"}.</strong> "secure" is a word — found in every common wordlist. A 20-character random passphrase would push the same attack to millions of years, even without rate limiting.`);
            }
          }, 380);
        };
      }
    },
    reflect: {
      quiz: {
        q: "Which defense most effectively stops brute force even against a weak password?",
        opts: [
          "Requiring passwords to contain a number and symbol",
          "Rate limiting and account lockout after failed attempts",
          "Hashing passwords with SHA-256",
          "Showing a CAPTCHA on the login page"
        ],
        answer: 1,
        feedback: {
          good: "Correct. Rate limiting and lockout don't just slow guessing — they cap the number of attempts an attacker can realistically make, making even weak passwords temporarily safe.",
          bad: "Not quite. Password complexity rules and hashing defend the stored database, and CAPTCHAs help against simple bots. But rate limiting + lockout is the most direct defense: it caps attempts, so guessing becomes infeasible regardless of what the password is."
        }
      },
      defenses: [
        { icon: "⏱️", title: "Rate limiting", body: "Limit login attempts per IP or account. Exponential backoff increases the cost of each successive failure." },
        { icon: "🔒", title: "Account lockout", body: "After N failures, lock the account (or require email/SMS to unlock). Makes large-scale guessing impractical." },
        { icon: "📱", title: "Multi-factor authentication", body: "Even if a password is guessed, MFA requires a second factor the attacker doesn't have." },
        { icon: "🧂", title: "Bcrypt / Argon2", body: "Slow, salted hashing means a leaked database takes years to crack offline rather than hours." }
      ]
    }
  },

  ddos: {
    label: "DDoS Attacks",
    understand: {
      prose: [
        "A Distributed Denial of Service attack floods a service with more requests than it can handle. Every server has finite capacity — bandwidth, CPU, memory, connection slots. When that capacity is exhausted, legitimate requests are queued, delayed, or dropped.",
        "The 'distributed' part is what makes it hard to defend. Traffic comes from thousands of compromised machines (a botnet) all over the world, so blocking a single IP achieves nothing. Distinguishing attack traffic from a genuine surge of users is genuinely hard.",
        "Defenses shift the problem: scrubbing centres absorb volumetric traffic before it reaches the origin server; rate limiting drops obvious abusers; CDNs and load balancers distribute the load. Availability is always a cost equation."
      ],
      diagram: [
        { type: "good", text: "<strong>Normal:</strong> ~50 req/s arrive → server processes each → responses sent → users happy." },
        { type: "bad",  text: "<strong>DDoS:</strong> 50,000 req/s from a botnet → server queues fill → legitimate requests time out → site appears down." },
        { type: "warn", text: "<strong>Reality:</strong> Even partial overload degrades performance. A site that takes 10 seconds to load loses most of its users." }
      ],
      keyIdea: "Availability is a resource equation. An attacker wins by consuming more resources than you have. Defenses either add more resources (CDN, load balancers) or shed attack traffic before it reaches your capacity (scrubbing, rate limiting)."
    },
    try: {
      hint: { title: "No real traffic is sent", body: "This simulation only animates elements on this page. It models the capacity concept without connecting to any server or sending any network requests." },
      renderInput: () => `<button class="run-btn" id="ddos-run">Simulate traffic spike</button>`,
      renderOutput: () => `
        <div class="output-bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div><span class="output-bar-title">traffic-monitor</span></div>
        <div class="output-body" id="ddos-output-body">
          <span style="color:var(--dim)">// Traffic monitor ready. No real requests sent.</span><br>
          <span style="color:var(--dim)">// Capacity: 100 units · Current load: 18 units</span>
        </div>
        <div class="traffic-viz" id="traffic-viz" aria-label="Traffic visualisation"></div>
        <div class="progress-row">
          <div class="progress-track"><div class="progress-fill" id="ddos-fill"></div></div>
          <div class="progress-stat" id="ddos-stat">Idle</div>
        </div>
      `,
      init: (setResult) => {
        const viz = document.getElementById("traffic-viz");
        for (let i = 0; i < 48; i++) {
          const b = document.createElement("div");
          b.className = "traffic-bar";
          b.style.height = `${12 + Math.random() * 25}%`;
          viz.appendChild(b);
        }
        let running = false;
        const btn = document.getElementById("ddos-run");
        btn.onclick = () => {
          if (running) return;
          running = true; btn.disabled = true;
          const bars = [...viz.querySelectorAll(".traffic-bar")];
          const body = document.getElementById("ddos-output-body");
          let tick = 0;
          const phases = ["Normal","Elevated","Busy","Overloaded","Saturated","Unavailable"];
          const timer  = setInterval(() => {
            tick++;
            const load  = Math.min(100, 18 + tick * 9);
            const phase = phases[Math.min(Math.floor(load / 17), 5)];
            const fill  = document.getElementById("ddos-fill");
            fill.style.width = `${load}%`;
            if (load >= 65) fill.classList.add("danger"); else fill.classList.remove("danger");
            document.getElementById("ddos-stat").textContent = `${load}% capacity · ${phase}`;
            bars.forEach(b => {
              b.style.height     = `${Math.min(96, 12 + Math.random() * (18 + tick * 8))}%`;
              b.style.opacity    = load > 80 ? "0.9" : "0.6";
              b.style.background = load > 80 ? "var(--red)" : load > 60 ? "var(--amber)" : "var(--cyan)";
            });
            body.innerHTML += `<span style="color:var(--dim)">t+${tick}s:</span> load <span class="${load>80?"out-bad":load>50?"out-warn":"out-ok"}">${load}%</span> · status: ${phase}<br>`;
            body.scrollTop = body.scrollHeight;
            if (tick >= 9) {
              clearInterval(timer);
              running = false; btn.disabled = false; btn.textContent = "Simulate again";
              setResult("danger", "<strong>Server capacity exceeded.</strong> At 100% load, legitimate requests can't get through. In a real attack this would last hours, sourced from thousands of IPs — making simple IP blocking ineffective.");
            }
          }, 200);
        };
      }
    },
    reflect: {
      quiz: {
        q: "Why doesn't blocking the attacking IP address solve a DDoS attack?",
        opts: [
          "IP addresses can't be blocked at the firewall level",
          "The attack traffic comes from thousands of different IPs, so blocking one changes nothing",
          "DDoS attacks use encrypted traffic that firewalls can't inspect",
          "Attackers spoof the source IP so it matches the victim's own address"
        ],
        answer: 1,
        feedback: {
          good: "Correct. A botnet of 100,000 compromised machines means 100,000 source IPs. By the time you've blocked the first thousand, a hundred thousand more are still sending.",
          bad: "Not quite. The key is 'distributed' — traffic arrives from thousands of different IPs (a botnet of compromised machines). Blocking one IP is like bailing the ocean one cup at a time."
        }
      },
      defenses: [
        { icon: "🌐", title: "CDN / Anycast distribution", body: "Route traffic through a global network so the attack load is absorbed across hundreds of PoPs, not one origin." },
        { icon: "🧹", title: "Traffic scrubbing", body: "Specialist services identify and drop attack traffic before it reaches your network, passing only clean requests." },
        { icon: "⚡", title: "Rate limiting", body: "Drop requests from IPs that exceed a threshold, with increasingly aggressive limits during an attack." },
        { icon: "📦", title: "Over-provisioning + caching", body: "More capacity and cached responses mean the attack needs to be larger to overwhelm your service." }
      ]
    }
  }
};

// ── State ──────────────────────────────────────────────────────────────────
let currentModule = null;
let currentStep   = "understand";
let stepsDone     = { understand: false, try: false, reflect: false };
let quizAnswered  = false;

// ── DOM refs ───────────────────────────────────────────────────────────────
const lessonPanel = document.getElementById("lesson");
const panes = {
  understand: document.getElementById("pane-understand"),
  try:        document.getElementById("pane-try"),
  reflect:    document.getElementById("pane-reflect")
};
const tabs = {
  understand: document.getElementById("tab-understand"),
  try:        document.getElementById("tab-try"),
  reflect:    document.getElementById("tab-reflect")
};

// ── Rendering helpers ──────────────────────────────────────────────────────
function renderProse(paragraphs) {
  return paragraphs.map(p => `<p>${p}</p>`).join("");
}

function renderDiagram(steps) {
  return steps.map(s => `
    <div class="diag-step">
      <div class="diag-num ${s.type}">${s.type==="good"?"✓":s.type==="bad"?"✗":"!"}</div>
      <div class="diag-text">${s.text}</div>
    </div>
  `).join("");
}

function renderDefenses(list) {
  return list.map(d => `
    <div class="defense-item">
      <div class="defense-icon">${d.icon}</div>
      <div class="defense-text"><strong>${d.title}</strong><span>${d.body}</span></div>
    </div>
  `).join("");
}

// ── Open module ────────────────────────────────────────────────────────────
function openModule(key) {
  currentModule = key;
  stepsDone     = { understand: false, try: false, reflect: false };
  quizAnswered  = false;
  const m       = modules[key];

  document.getElementById("lesson-breadcrumb-title").textContent = m.label;

  // Understand pane
  panes.understand.innerHTML = `
    <div class="understand-layout">
      <div>
        <div class="explain-prose">${renderProse(m.understand.prose)}</div>
        <div class="key-box">
          <div class="key-box-label">KEY IDEA</div>
          <p>${m.understand.keyIdea}</p>
        </div>
        <button class="next-btn primary" id="u-next" style="margin-top:24px">Try the demo →</button>
      </div>
      <div>
        <div class="attack-diagram">
          <div class="diag-title">HOW THE ATTACK WORKS</div>
          ${renderDiagram(m.understand.diagram)}
        </div>
      </div>
    </div>
  `;

  // Try pane
  panes.try.innerHTML = `
    <div class="try-layout">
      <div>
        <div class="try-pane-label">INPUT</div>
        <div class="hint-box"><strong>${m.try.hint.title}</strong>${m.try.hint.body}</div>
        ${m.try.renderInput()}
        <div class="result-banner" id="try-result"></div>
      </div>
      <div>
        <div class="try-pane-label">OUTPUT</div>
        <div class="output-pane">${m.try.renderOutput()}</div>
        <button class="next-btn" id="try-next" style="margin-top:18px;display:none">Continue to reflect →</button>
      </div>
    </div>
  `;

  // Reflect pane
  const quiz = m.reflect.quiz;
  panes.reflect.innerHTML = `
    <div class="reflect-layout">
      <div class="quiz-area">
        <h3>Test your understanding</h3>
        <div class="quiz-q">${quiz.q}</div>
        <div class="quiz-opts">
          ${quiz.opts.map((o,i) => `<button class="quiz-opt" data-idx="${i}">${o}</button>`).join("")}
        </div>
        <div class="quiz-feedback" id="quiz-feedback"></div>
        <button class="next-btn" id="reflect-done" style="display:none;margin-top:16px">← Back to modules</button>
      </div>
      <div class="defense-list">
        <h3>How to defend against this</h3>
        ${renderDefenses(m.reflect.defenses)}
      </div>
    </div>
  `;

  // Wire understand → try
  document.getElementById("u-next").onclick = () => {
    stepsDone.understand = true;
    goStep("try");
  };

  // Wire try demo
  m.try.init((type, msg) => {
    const banner = document.getElementById("try-result");
    banner.className = `result-banner show ${type}`;
    banner.innerHTML = msg;
    const nxt = document.getElementById("try-next");
    nxt.style.display = "inline-block";
    nxt.onclick = () => { stepsDone.try = true; goStep("reflect"); };
    updateTabs();
  });

  // Wire quiz
  document.querySelectorAll(".quiz-opt").forEach(btn => {
    btn.onclick = () => {
      if (quizAnswered) return;
      quizAnswered = true;
      const idx     = parseInt(btn.dataset.idx);
      const correct = idx === quiz.answer;
      btn.classList.add(correct ? "correct" : "wrong");
      if (!correct) document.querySelectorAll(".quiz-opt")[quiz.answer].classList.add("correct");
      const fb = document.getElementById("quiz-feedback");
      fb.className   = `quiz-feedback show ${correct ? "good" : "bad"}`;
      fb.textContent = correct ? quiz.feedback.good : quiz.feedback.bad;
      stepsDone.reflect = true;
      updateTabs();
      const done = document.getElementById("reflect-done");
      done.style.display = "inline-block";
      done.onclick = () => {
        lessonPanel.hidden = true;
        document.getElementById("modules").scrollIntoView({ behavior: "smooth" });
      };
    };
  });

  lessonPanel.hidden = false;
  goStep("understand");
  lessonPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function goStep(step) {
  currentStep = step;
  Object.keys(panes).forEach(k => {
    panes[k].classList.toggle("active", k === step);
  });
  updateTabs();
}

function updateTabs() {
  Object.keys(tabs).forEach(k => {
    tabs[k].classList.remove("active", "done");
    if (k === currentStep) {
      tabs[k].classList.add("active");
    } else if (stepsDone[k]) {
      tabs[k].classList.add("done");
    }
  });
}

// Tab clicks
Object.keys(tabs).forEach(k => {
  tabs[k].onclick = () => {
    if (tabs[k].classList.contains("done") || tabs[k].classList.contains("active")) {
      goStep(k);
    }
  };
});

// Module cards
document.querySelectorAll(".module-card").forEach(card => {
  card.addEventListener("click", () => openModule(card.dataset.module));
});

// Close button
document.getElementById("closeLesson").addEventListener("click", () => {
  lessonPanel.hidden = true;
  document.getElementById("modules").scrollIntoView({ behavior: "smooth" });
});
