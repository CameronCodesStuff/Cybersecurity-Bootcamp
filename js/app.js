const modules = {
  xss: {
    label: "MODULE 01 · WEB SECURITY",
    title: "Cross-Site Scripting (XSS)",
    explanation: "A website often displays text that a visitor typed. XSS happens when a site accidentally treats that text as browser code instead of ordinary text. A malicious script can then run in another visitor's browser under the site's context.",
    takeaway: "Treat user input as data, not executable code. Output encoding and other browser-side protections help keep the two separate.",
    demoTitle: "What does the browser see?",
    hint: "Type a harmless message. The demo shows the difference between treating input as text and treating it as HTML.",
    render: () => `
      <div class="demo-form">
        <div class="field"><label for="xss-input">Your message</label><input id="xss-input" placeholder="e.g. Hello, bootcamp!" autocomplete="off"></div>
        <button class="demo-btn" id="xss-run">Render safely</button>
      </div>
      <div class="result" style="margin-top:14px"><strong>Safe output</strong><div id="xss-output">Nothing rendered yet.</div></div>
    `,
    init: () => {
      const input = document.querySelector("#xss-input");
      document.querySelector("#xss-run").onclick = () => {
        // textContent deliberately prevents the input from becoming executable HTML.
        const output = document.querySelector("#xss-output");
        output.textContent = input.value || "Nothing rendered yet.";
        setResult(`<strong>Safe rendering.</strong> Your input stayed data rather than becoming browser code.`);
      };
    }
  },

  sql: {
    label: "MODULE 02 · DATABASE SECURITY",
    title: "SQL Injection",
    explanation: "A login normally asks a database a question such as “does this username have this password?” SQL injection can happen when a developer builds that database question by directly joining untrusted input into the SQL statement. Special characters can change the meaning of the query.",
    takeaway: "Use parameterized queries (prepared statements) so user input stays a value instead of changing the structure of a database query.",
    demoTitle: "Fake login · local sandbox",
    hint: "This is a toy database with no network connection. Try the classic training input shown below to see how an unsafe query can be tricked.",
    render: () => `
      <div class="demo-form">
        <div class="field"><label for="sql-user">Username</label><input id="sql-user" placeholder="admin" autocomplete="off"></div>
        <div class="field"><label for="sql-pass">Password</label><input id="sql-pass" placeholder="Try the training input below" autocomplete="off"></div>
        <button class="demo-btn" id="sql-run">Log in</button>
      </div>
      <div class="takeaway" style="margin-top:14px">
        <span>Training input</span>
        <p>Username: <code>admin</code> · Password: <code>' OR '1'='1</code></p>
      </div>
    `,
    init: () => {
      document.querySelector("#sql-run").onclick = () => {
        const user = document.querySelector("#sql-user").value.trim();
        const pass = document.querySelector("#sql-pass").value;
        if (user.toLowerCase() === "admin" && pass === "' OR '1'='1") {
          setResult(`<strong>Demo bypass triggered.</strong> In this toy scenario, the unsafe query's logic has been altered. A real application should use parameterized queries.`);
        } else if (user.toLowerCase() === "admin" && pass === "correct-horse") {
          setResult(`<strong>Normal login.</strong> You supplied the demo's real password.`);
        } else {
          setResult(`<strong>Login denied.</strong> Try the training input above, or use the demo password <code>correct-horse</code>.`);
        }
      };
    }
  },

  bruteforce: {
    label: "MODULE 03 · AUTHENTICATION",
    title: "Brute Force",
    explanation: "A brute-force attack is repeated guessing. If a password is short and a service allows unlimited attempts, an attacker can keep trying until one works. Real passwords are much larger search spaces, but the principle is the same.",
    takeaway: "Long, unique passwords plus rate limits, MFA, lockouts, and monitoring make repeated guessing much harder.",
    demoTitle: "Guess the tiny demo password",
    hint: "The sandbox cycles through a small list of pretend passwords. Watch the attempts climb until it finds the demo password.",
    render: () => `
      <div class="sim-row"><div class="progress"><span id="bf-progress"></span></div><div class="stat" id="bf-stat">0 attempts</div></div>
      <button class="demo-btn" id="bf-run">Start guessing</button>
    `,
    init: () => {
      let running = false;
      document.querySelector("#bf-run").onclick = () => {
        if (running) return;
        running = true;
        const words = ["sun", "cat", "blue", "rocket", "coffee", "winter", "bootcamp", "secure"];
        const secret = "secure";
        let i = 0;
        const btn = document.querySelector("#bf-run");
        btn.disabled = true;
        const timer = setInterval(() => {
          i++;
          document.querySelector("#bf-progress").style.width = `${(i / words.length) * 100}%`;
          document.querySelector("#bf-stat").textContent = `${i} attempt${i === 1 ? "" : "s"}`;
          if (words[i - 1] === secret) {
            clearInterval(timer);
            running = false;
            btn.disabled = false;
            btn.textContent = "Run again";
            setResult(`<strong>Match found after ${i} attempts.</strong> The list was tiny on purpose. Real defenses increase the cost of guessing.`);
          }
        }, 300);
      };
    }
  },

  ddos: {
    label: "MODULE 04 · AVAILABILITY",
    title: "Distributed Denial of Service (DDoS)",
    explanation: "A DDoS attack overwhelms a service with more traffic or requests than it can comfortably handle. “Distributed” means the traffic can come from many sources at once. The result can be slow responses or an unavailable service.",
    takeaway: "Defenses can include rate limiting, traffic filtering, caching, load balancing, and specialised DDoS protection.",
    demoTitle: "Traffic vs. capacity",
    hint: "Start the safe visual simulation. It only animates bars on this page — it does not send network traffic anywhere.",
    render: () => `
      <div class="traffic" id="traffic" aria-label="Traffic visualisation"></div>
      <div class="sim-row"><div class="progress"><span id="ddos-progress"></span></div><div class="stat" id="ddos-stat">Normal</div></div>
      <button class="demo-btn" id="ddos-run">Simulate traffic spike</button>
    `,
    init: () => {
      const traffic = document.querySelector("#traffic");
      for (let i = 0; i < 42; i++) {
        const bar = document.createElement("span");
        bar.className = "bar";
        bar.style.height = `${15 + Math.random() * 35}%`;
        traffic.appendChild(bar);
      }
      let running = false;
      document.querySelector("#ddos-run").onclick = () => {
        if (running) return;
        running = true;
        const bars = [...document.querySelectorAll(".bar")];
        let tick = 0;
        const timer = setInterval(() => {
          tick++;
          const load = Math.min(100, 18 + tick * 9);
          document.querySelector("#ddos-progress").style.width = `${load}%`;
          document.querySelector("#ddos-stat").textContent = load < 65 ? "Busy" : load < 90 ? "Overloaded" : "Unavailable";
          bars.forEach(bar => bar.style.height = `${Math.min(96, 18 + Math.random() * (20 + tick * 7))}%`);
          if (tick >= 10) {
            clearInterval(timer);
            running = false;
            document.querySelector("#ddos-run").textContent = "Simulate again";
            setResult(`<strong>Capacity exceeded in the visual model.</strong> No requests were sent to a real server. The lesson is simply that capacity is finite.`);
          }
        }, 180);
      };
    }
  }
};

const lesson = document.querySelector("#lesson");
const demoArea = document.querySelector("#demo-area");
const result = document.querySelector("#demo-result");

function setResult(html) {
  result.innerHTML = `<div class="result">${html}</div>`;
}

function openModule(key) {
  const item = modules[key];
  document.querySelector("#lesson-label").textContent = item.label;
  document.querySelector("#lesson-title").textContent = item.title;
  document.querySelector("#lesson-explanation").textContent = item.explanation;
  document.querySelector("#lesson-takeaway").textContent = item.takeaway;
  document.querySelector("#demo-title").textContent = item.demoTitle;
  document.querySelector("#demo-hint").textContent = item.hint;
  demoArea.innerHTML = item.render();
  result.innerHTML = "";
  lesson.hidden = false;
  item.init();
  lesson.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll(".module-card").forEach(card => {
  card.addEventListener("click", () => openModule(card.dataset.module));
});

document.querySelector("#closeLesson").addEventListener("click", () => {
  lesson.hidden = true;
  document.querySelector("#modules").scrollIntoView({ behavior: "smooth" });
});
