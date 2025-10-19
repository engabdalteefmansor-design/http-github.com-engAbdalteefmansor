const terminal = document.getElementById('terminal');
const lines = [
  "Initializing secure profile...",
  "Loading modules: [auth, audit, kali_tools, netsec]",
  "Scanning environment...",
  "Found: 5 open ports, 2 critical vulnerabilities (reported)",
  "Preparing secure channels...",
  "Encryption: AES-256 / RSA-4096 - OK",
  "Profile loaded. Welcome, Abdalteef Mansor.",
  ""
];

let idx = 0;
function typeLines() {
  if(idx >= lines.length) return;
  let i = 0;
  const line = lines[idx++] + "\n";
  const speed = 18 + Math.random()*20;
  function typeChar() {
    if(i < line.length) {
      terminal.textContent += line.charAt(i++);
      terminal.scrollTop = terminal.scrollHeight;
      setTimeout(typeChar, speed);
    } else {
      setTimeout(typeLines, 400);
    }
  }
  typeChar();
}

document.addEventListener('DOMContentLoaded', ()=>{
  terminal.textContent = "";
  typeLines();
});

// Fake scanner functionality
(function(){
  const scanBtn = document.getElementById('scan-btn');
  const abortBtn = document.getElementById('abort-btn');
  const scanInput = document.getElementById('scan-input');
  const scanOutput = document.getElementById('scan-output');
  let scanning = false;

  function appendLine(text='', delay=0){
    if(delay === 0){
      scanOutput.textContent += text + "\n";
      scanOutput.scrollTop = scanOutput.scrollHeight;
      return Promise.resolve();
    }
    return new Promise(res => {
      setTimeout(()=>{
        scanOutput.textContent += text + "\n";
        scanOutput.scrollTop = scanOutput.scrollHeight;
        res();
      }, delay);
    });
  }

  function generateFakeFindings(id){
    const seed = id.split('').reduce((s,c)=>s + c.charCodeAt(0), 0);
    const n = Math.max(3, (seed % 6) + 3);
    const types = ['OPEN_PORT','WEAK_SSL','EXPOSED_CRED','UNPATCHED_SERVICE','MISCONFIG','BACKDOOR_HINT'];
    const findings = [];
    for(let i=0;i<n;i++){
      const t = types[(seed + i) % types.length];
      const severity = ['LOW','MEDIUM','HIGH','CRITICAL'][(seed + i) % 4];
      const detail = `${t} on port ${1000 + ((seed + i)*7)%60000}`;
      findings.push({type:t,severity,detail});
    }
    return findings;
  }

  async function runScan(id){
    scanning = true;
    scanBtn.style.display = 'none';
    abortBtn.style.display = 'inline-block';
    scanOutput.textContent = '';
    await appendLine(`> Starting simulated scan for target: ${id}`, 200);
    await appendLine('> Initializing modules: auth, net, http, ssl', 300);
    await appendLine('> Establishing secure session...', 400);
    await appendLine('> Enumerating services...', 350);

    const findings = generateFakeFindings(id);

    for(let i=0;i<findings.length;i++){
      if(!scanning) { await appendLine('> Scan aborted by user.',0); break; }
      await appendLine(`> Scanning ${findings[i].detail} ...`, 200 + Math.random()*300);
      await appendLine(`  -> SEVERITY: ${findings[i].severity}`, 120);
      await appendLine(`  -> NOTE: Simulated evidence logged.`, 90);
    }

    if(scanning){
      await appendLine('> Finalizing report...', 300);
      await appendLine(`> Scan complete. ${findings.length} findings.`, 250);
      await appendLine('> Report: /reports/' + id + '.json (simulated)', 150);
    }

    scanning = false;
    scanBtn.style.display = 'inline-block';
    abortBtn.style.display = 'none';
  }

  scanBtn.addEventListener('click', ()=>{
    const id = (scanInput.value || '').trim();
    if(!id){ scanOutput.textContent = '> Please enter a valid target ID (any number or text)\n'; return; }
    runScan(id);
  });
  abortBtn.addEventListener('click', ()=>{
    scanning = false;
    scanOutput.textContent += '\n> Aborting...\n';
  });
})();

