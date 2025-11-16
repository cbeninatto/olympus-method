/* ================================
   THEME TOGGLE (Light / Dark / Auto)
================================ */
const themeSelect = document.getElementById("themeSelect");

function applyTheme(mode) {
    document.body.classList.remove("light", "dark", "auto");
    if (mode === "light") document.body.classList.add("light");
    else if (mode === "dark") document.body.classList.add("dark");
    else document.body.classList.add("auto");
    localStorage.setItem("om_theme", mode);
}

function loadTheme() {
    const saved = localStorage.getItem("om_theme") || "auto";
    themeSelect.value = saved;
    applyTheme(saved);
}
themeSelect.addEventListener("change", () => applyTheme(themeSelect.value));
loadTheme();

/* ================================
   UNIT TOGGLE
================================ */
let currentUnit = "kg";
const kgBtn = document.getElementById("kgBtn");
const lbBtn = document.getElementById("lbBtn");
const barWeightInput = document.getElementById("barWeight");

function setUnit(unit) {
    currentUnit = unit;
    if (unit === "kg") {
        kgBtn.classList.add("active");
        lbBtn.classList.remove("active");
        if (!barWeightInput.value) barWeightInput.value = 20;
    } else {
        lbBtn.classList.add("active");
        kgBtn.classList.remove("active");
        if (!barWeightInput.value) barWeightInput.value = 45;
    }
    localStorage.setItem("om_unit", unit);
}
kgBtn.addEventListener("click", () => setUnit("kg"));
lbBtn.addEventListener("click", () => setUnit("lb"));
(function initUnit() {
    const stored = localStorage.getItem("om_unit");
    if (stored === "lb") setUnit("lb");
    else setUnit("kg");
})();

/* ================================
   TABS
================================ */
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-target");
        tabButtons.forEach(b => b.classList.remove("active"));
        tabPanels.forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(target).classList.add("active");
    });
});

/* ================================
   STANDARDS HELPERS
================================ */
function bandLabel(band) {
    switch (band) {
        case "good": return "Good";
        case "great": return "Great";
        case "godlike": return "Godlike";
        default: return "Below";
    }
}
function bandClass(band) {
    switch (band) {
        case "good": return "score-good";
        case "great": return "score-great";
        case "godlike": return "score-godlike";
        default: return "score-below";
    }
}
function classifyWaistRatio(r) {
    if (r <= 0.45) return "godlike";
    if (r <= 0.46) return "great";
    if (r <= 0.47) return "good";
    return "below";
}
function classifyChestWaist(r) {
    if (r >= 1.40) return "godlike";
    if (r >= 1.35) return "great";
    if (r >= 1.30) return "good";
    return "below";
}
function classifyArmsWaist(r) {
    if (r >= 0.50) return "godlike";
    if (r >= 0.48) return "great";
    if (r >= 0.46) return "good";
    return "below";
}
function classifyIncline(r) {
    if (r >= 1.25) return "godlike";
    if (r >= 1.10) return "great";
    if (r >= 0.90) return "good";
    return "below";
}
function classifyChins(perc) {
    if (perc >= 0.60) return "godlike";
    if (perc >= 0.45) return "great";
    if (perc >= 0.30) return "good";
    return "below";
}
function classifyOHP(r) {
    if (r >= 0.90) return "godlike";
    if (r >= 0.80) return "great";
    if (r >= 0.65) return "good";
    return "below";
}
function classifyCurl(r) {
    if (r >= 0.65) return "godlike";
    if (r >= 0.55) return "great";
    if (r >= 0.45) return "good";
    return "below";
}

/* ================================
   PHYSIQUE STANDARDS
================================ */
const heightInput = document.getElementById("heightInput");
const waistInput = document.getElementById("waistInput");
const chestInput = document.getElementById("chestInput");
const armsInput = document.getElementById("armsInput");
const evaluateBodyBtn = document.getElementById("evaluateBodyBtn");
const bodyStandardsResult = document.getElementById("bodyStandardsResult");

evaluateBodyBtn.addEventListener("click", () => {
    const h = parseFloat(heightInput.value);
    const w = parseFloat(waistInput.value);
    const c = parseFloat(chestInput.value);
    const a = parseFloat(armsInput.value);

    if (!isFinite(h) || h <= 0 || !isFinite(w) || w <= 0) {
        alert("Enter at least height and waist.");
        return;
    }

    let html = "";
    const waistRatio = w / h;
    const waistPerc = waistRatio * 100;
    const waistBand = classifyWaistRatio(waistRatio);
    html += `
        <div class="standard-line">
            <span class="standard-label">Waist / Height:</span>
            <span class="standard-value">${waistPerc.toFixed(1)}%</span>
            <span class="standard-score ${bandClass(waistBand)}">${bandLabel(waistBand)}</span>
        </div>
    `;

    if (isFinite(c) && c > 0) {
        const cw = c / w;
        const chestBand = classifyChestWaist(cw);
        html += `
            <div class="standard-line">
                <span class="standard-label">Chest / Waist:</span>
                <span class="standard-value">${cw.toFixed(2)}×</span>
                <span class="standard-score ${bandClass(chestBand)}">${bandLabel(chestBand)}</span>
            </div>
        `;
    }
    if (isFinite(a) && a > 0) {
        const aw = a / w;
        const armsBand = classifyArmsWaist(aw);
        html += `
            <div class="standard-line">
                <span class="standard-label">Arms / Waist:</span>
                <span class="standard-value">${(aw * 100).toFixed(1)}%</span>
                <span class="standard-score ${bandClass(armsBand)}">${bandLabel(armsBand)}</span>
            </div>
        `;
    }
    if (!html) {
        html = "Add chest and arms to see more detailed standards.";
    }
    bodyStandardsResult.innerHTML = html;
});

/* ================================
   STRENGTH STANDARDS
================================ */
const stdBW = document.getElementById("stdBW");
const stdIncline = document.getElementById("stdIncline");
const stdChins = document.getElementById("stdChins");
const stdOHP = document.getElementById("stdOHP");
const stdCurl = document.getElementById("stdCurl");
const evaluateStrengthBtn = document.getElementById("evaluateStrengthBtn");
const strengthStandardsResult = document.getElementById("strengthStandardsResult");

evaluateStrengthBtn.addEventListener("click", () => {
    const BW = parseFloat(stdBW.value);
    if (!isFinite(BW) || BW <= 0) {
        alert("Enter your bodyweight.");
        return;
    }
    let html = "";

    const inc = parseFloat(stdIncline.value);
    if (isFinite(inc) && inc > 0) {
        const ratio = inc / BW;
        const band = classifyIncline(ratio);
        html += `
            <div class="standard-line">
                <span class="standard-label">Incline Bench (5 reps):</span>
                <span class="standard-value">${ratio.toFixed(2)}× BW</span>
                <span class="standard-score ${bandClass(band)}">${bandLabel(band)}</span>
            </div>
        `;
    }

    const chin = parseFloat(stdChins.value);
    if (isFinite(chin) && chin > 0) {
        const perc = chin / BW;
        const band = classifyChins(perc);
        html += `
            <div class="standard-line">
                <span class="standard-label">Weighted Chins (5 reps):</span>
                <span class="standard-value">${(perc * 100).toFixed(1)}% BW</span>
                <span class="standard-score ${bandClass(band)}">${bandLabel(band)}</span>
            </div>
        `;
    }

    const ohp = parseFloat(stdOHP.value);
    if (isFinite(ohp) && ohp > 0) {
        const ratio = ohp / BW;
        const band = classifyOHP(ratio);
        html += `
            <div class="standard-line">
                <span class="standard-label">Overhead Press (5 reps):</span>
                <span class="standard-value">${ratio.toFixed(2)}× BW</span>
                <span class="standard-score ${bandClass(band)}">${bandLabel(band)}</span>
            </div>
        `;
    }

    const curl = parseFloat(stdCurl.value);
    if (isFinite(curl) && c