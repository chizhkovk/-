// Simulated Console Messages
const logs = {
  local: [
    { text: "dev-pc:~/project$ git status", type: "cmd" },
    { text: "On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  modified:   index.html\n  modified:   style.css", type: "output" },
    { text: "dev-pc:~/project$ git add .", type: "cmd" },
    { text: "dev-pc:~/project$ git commit -m 'feat: improve pipeline visual dashboard and terminal logs'", type: "cmd" },
    { text: "[main e2b5e01] feat: improve pipeline visual dashboard and terminal logs\n 2 files changed, 45 insertions(+), 12 deletions(-)", type: "output" },
    { text: "# Локальные изменения зафиксированы в Git. Готово к отправке в облако.", type: "comment" }
  ],
  push: [
    { text: "dev-pc:~/project$ git push -u origin main", type: "cmd" },
    { text: "Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nDelta compression using up to 12 threads\nCompressing objects: 100% (3/3), done.\nWriting objects: 100% (3/3), 342 bytes | 342.00 KiB/s, done.\nTotal 3 (delta 2), reused 0 (delta 0)\nTo https://github.com/chizhkovk/-.git\n   6f39e01..e2b5e01  main -> main\nBranch 'main' set up to track remote branch 'main' from 'origin'.", type: "output" },
    { text: "# Код успешно отправлен в репозиторий GitHub!", type: "comment" }
  ],
  deploy: [
    { text: "ssh user@gcp-vm-server", type: "cmd" },
    { text: "Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-1008-gcp x86_64)\nLast login: Mon Jul 13 06:00:15 2026 from 35.240.12.34", type: "output" },
    { text: "gcp-server:~$ cd ~/app && git pull", type: "cmd" },
    { text: "Updating e2b5e01..6f39e01\nFast-forward\n index.html | 24 +++++++++++++++++++++++-\n style.css  | 18 ++++++++++++++++++\n 2 files changed, 40 insertions(+), 1 deletion(-)", type: "output" },
    { text: "gcp-server:~/app$ docker-compose down && docker-compose up -d --build", type: "cmd" },
    { text: "Stopping app-container ... done\nRemoving app-container ... done\nBuilding app-image\nStep 1/5 : FROM nginx:alpine ... done\nCreating app-container ... done", type: "output" },
    { text: "# Сервер успешно обновил файлы из GitHub и перезапустил Docker-контейнер!", type: "comment" },
    { text: "# Пайплайн полностью отработал! Проект запущен на GCP.", type: "comment" }
  ]
};

// State Variables
let currentStep = 'local';

// DOM Elements
const consoleOutput = document.getElementById('console-output');
const btnLocal = document.getElementById('btn-local');
const btnPush = document.getElementById('btn-push');
const btnDeploy = document.getElementById('btn-deploy');
const pulse1 = document.getElementById('pulse-1');
const pulse2 = document.getElementById('pulse-2');

// Disable standard pulse animations on load
pulse1.style.animation = 'none';
pulse2.style.animation = 'none';

async function runSimulation(step) {
  // Disable button while running
  disableAllButtons();
  
  const stepLogs = logs[step];
  
  // Clear console on first step
  if (step === 'local') {
    consoleOutput.innerHTML = '';
  }

  // Print logs sequentially with mock delay
  for (let i = 0; i < stepLogs.length; i++) {
    const log = stepLogs[i];
    const logDiv = document.createElement('div');
    
    if (log.type === 'cmd') {
      logDiv.className = 'term-cmd';
      logDiv.innerText = log.text;
    } else if (log.type === 'output') {
      logDiv.className = 'term-output';
      // Handle multiline output formatting
      logDiv.innerHTML = log.text.replace(/\n/g, '<br>');
    } else if (log.type === 'comment') {
      logDiv.className = 'term-comment';
      logDiv.innerText = log.text;
    }
    
    consoleOutput.appendChild(logDiv);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
    
    // Simulate delay between outputs
    await sleep(log.type === 'cmd' ? 800 : 1200);
  }

  // Handle post-step logic (animations & button unlocking)
  if (step === 'local') {
    btnLocal.classList.add('active');
    btnPush.disabled = false;
    // Animate connector 1
    pulse1.style.animation = 'run-light-x 2s infinite linear';
    printCursor('dev-pc:~/project$ ');
  } else if (step === 'push') {
    btnPush.classList.add('active');
    btnDeploy.disabled = false;
    // Animate connector 2
    pulse2.style.animation = 'run-light-x 2s infinite linear';
    printCursor('dev-pc:~/project$ ');
  } else if (step === 'deploy') {
    btnDeploy.classList.add('active');
    // Reset buttons so user can play again
    await sleep(2000);
    resetSimulation();
  }
}

function printCursor(promptText) {
  const cursorDiv = document.createElement('div');
  cursorDiv.className = 'cursor-line';
  cursorDiv.innerText = promptText;
  consoleOutput.appendChild(cursorDiv);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function disableAllButtons() {
  btnLocal.disabled = true;
  btnPush.disabled = true;
  btnDeploy.disabled = true;
}

function resetSimulation() {
  btnLocal.disabled = false;
  btnPush.disabled = true;
  btnDeploy.disabled = true;
  
  btnLocal.classList.remove('active');
  btnPush.classList.remove('active');
  btnDeploy.classList.remove('active');
  
  pulse1.style.animation = 'none';
  pulse2.style.animation = 'none';
  
  consoleOutput.innerHTML = `
    <div class="term-comment"># Симулятор пайплайна готов к работе.</div>
    <div class="term-comment"># Выберите действие 1 в панели слева для старта.</div>
    <div class="cursor-line">dev-pc:~/project$ </div>
  `;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
