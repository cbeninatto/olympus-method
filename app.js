// Tabs
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

// Unit toggle
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
}

kgBtn.addEventListener("click", () => setUnit("kg"));
lbBtn.addEventListener("click", () => setUnit("lb"));

// Scoring helpers
function bandLabel(band) {
    switch (band) {
        case "good": return "Good";
        case "great": return "Great";
        case "godlike": return "Godlike";
        default: return "Below Good";
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

// Physique band classifiers
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

// Strength band classifiers
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

// Physique Standards
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

    bodyStandardsResult.classList.remove("empty-note");
    bodyStandardsResult.innerHTML = html;
});

// Strength Standards
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
    if (isFinite(curl) && curl > 0) {
        const ratio = curl / BW;
        const band = classifyCurl(ratio);
        html += `
            <div class="standard-line">
                <span class="standard-label">Barbell Curl (5 reps):</span>
                <span class="standard-value">${ratio.toFixed(2)}× BW</span>
                <span class="standard-score ${bandClass(band)}">${bandLabel(band)}</span>
            </div>
        `;
    }

    if (!html) {
        html = "Add your main lifts to see the strength standards.";
    }

    strengthStandardsResult.classList.remove("empty-note");
    strengthStandardsResult.innerHTML = html;
});

// Warm-up logic
const TEMPLATES = {
    soviet: {
        name: "Soviet Strength",
        description: "40% x 5, 70% x 2–3, then 100% working set.",
        sets: [
            { type: "Warm-up", percent: 0.40, reps: "5" },
            { type: "Warm-up", percent: 0.70, reps: "2–3" },
            { type: "Working", percent: 1.00, reps: "6–10 (to failure)" }
        ]
    },
    mentzer: {
        name: "Mike Mentzer",
        description: "50% x 6–8, 75% x 3–4, 100% x 6–10 to failure.",
        sets: [
            { type: "Warm-up", percent: 0.50, reps: "6–8" },
            { type: "Warm-up", percent: 0.75, reps: "3–4" },
            { type: "Working", percent: 1.00, reps: "6–10 (to failure)" }
        ]
    },
    olympus: {
        name: "Olympus Method",
        description: "30% x 5, 50% x 3–5, then 100% x 6–10 to failure.",
        sets: [
            { type: "Warm-up", percent: 0.30, reps: "5" },
            { type: "Warm-up", percent: 0.50, reps: "3–5" },
            { type: "Working", percent: 1.00, reps: "6–10 (to failure)" }
        ]
    }
};

const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const LB_PLATES = [45, 35, 25, 10, 5, 2.5];

const workingWeightInput = document.getElementById("workingWeight");
const templateSelect = document.getElementById("templateSelect");
const templateHint = document.getElementById("templateHint");
const resultsTable = document.getElementById("resultsTable");
const resultsBody = document.getElementById("resultsBody");
const emptyNote = document.getElementById("emptyNote");
const calcBtn = document.getElementById("calcBtn");

function updateTemplateHint() {
    const tKey = templateSelect.value;
    const t = TEMPLATES[tKey];
    if (!t) {
        templateHint.textContent = "";
        return;
    }
    templateHint.innerHTML = `<span>${t.name}:</span> ${t.description}`;
}

templateSelect.addEventListener("change", updateTemplateHint);
updateTemplateHint();

function formatWeight(value) {
    if (!isFinite(value)) return "-";
    return value.toFixed(1).replace(/\.0$/, "");
}

function plateConfig() {
    return currentUnit === "kg" ? KG_PLATES : LB_PLATES;
}

function computePlates(targetWeight, barWeight) {
    const plateSizes = plateConfig();
    const epsilon = 1e-6;

    if (targetWeight < barWeight - epsilon) {
        return { text: "Bar only", raw: [] };
    }

    let remainingTotal = targetWeight - barWeight;
    if (remainingTotal < 0) remainingTotal = 0;

    let perSide = remainingTotal / 2;
    const platesPerSide = [];

    for (const p of plateSizes) {
        let count = Math.floor((perSide + epsilon) / p);
        if (count > 0) {
            platesPerSide.push({ size: p, count });
            perSide -= count * p;
        }
    }

    if (platesPerSide.length === 0) {
        return { text: "Bar only", raw: [] };
    }

    const text = platesPerSide
        .map(pl => `${formatWeight(pl.size)} × ${pl.count}`)
        .join(", ");

    return { text: text + " / side", raw: platesPerSide };
}

function calculateWarmups() {
    const work = parseFloat(workingWeightInput.value);
    const bar = parseFloat(barWeightInput.value);

    if (!isFinite(work) || work <= 0) {
        alert("Enter a valid working set weight.");
        return;
    }
    if (!isFinite(bar) || bar <= 0) {
        alert("Enter a valid bar weight.");
        return;
    }

    const tpl = TEMPLATES[templateSelect.value];
    resultsBody.innerHTML = "";

    tpl.sets.forEach((set, idx) => {
        const target = work * set.percent;
        const plates = computePlates(target, bar);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td><span class="pill ${set.type === "Working" ? "work" : "warm"}">${set.type}</span></td>
            <td>${Math.round(set.percent * 100)}%</td>
            <td>${set.reps}</td>
            <td>${formatWeight(target)} ${currentUnit}</td>
            <td>${plates.text}</td>
        `;
        resultsBody.appendChild(tr);
    });

    resultsTable.style.display = "table";
    emptyNote.style.display = "none";
}

calcBtn.addEventListener("click", calculateWarmups);

// Day logs
const DAY_LOG_KEY = "olympusDayLogs_v1";

function loadDayLogs() {
    try {
        const raw = localStorage.getItem(DAY_LOG_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveDayLogs(logs) {
    localStorage.setItem(DAY_LOG_KEY, JSON.stringify(logs));
}

function getLastDayDate(dayKey) {
    const logs = loadDayLogs();
    for (let i = logs.length - 1; i >= 0; i--) {
        if (logs[i].day === dayKey && logs[i].date) {
            return logs[i].date;
        }
    }
    return null;
}

function getLastExerciseLog(dayKey, exName) {
    const logs = loadDayLogs();
    for (let i = logs.length - 1; i >= 0; i--) {
        const log = logs[i];
        if (log.day !== dayKey || !Array.isArray(log.exercises)) continue;
        const ex = log.exercises.find(e => e.name === exName);
        if (ex && ex.sets && ex.sets.length > 0) {
            return ex;
        }
    }
    return null;
}

const DAY_CONTAINERS = {
    push: document.getElementById("pushExercises"),
    legs: document.getElementById("legsExercises"),
    pull: document.getElementById("pullExercises")
};

const DEFAULT_SPLIT = {
    push: [
        "Incline Barbell Bench Press",
        "Flat Barbell Bench Press",
        "Weighted Dips (Chest-focused)",
        "Dumbbell Lateral Raises",
        "Rope Pushdown (Optional)",
        "Skull Crushers (Optional)"
    ],
    legs: [
        "Barbell Back Squat",
        "Romanian Deadlift",
        "Hamstring Curl (Machine)",
        "Calf Raises",
        "Leg Press (Optional)",
        "Hack Squat (Optional)"
    ],
    pull: [
        "Weighted Pull-Ups",
        "Bent-Over Barbell Row",
        "Barbell Biceps Curl",
        "Rear Delt Flys",
        "Barbell Shrugs (Optional)"
    ]
};

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
        return ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[c];
    });
}

// Add set row
function addSetRow(card, autoFocusWeight = true, autofill = null) {
    const container = card.querySelector(".sets-container");
    const index = container.children.length + 1;
    const row = document.createElement("div");
    row.className = "set-row";

    row.innerHTML = `
        <span class="set-label">Set ${index}</span>
        <select class="set-type">
            <option value=""></option>
            <option value="Warm-up">Warm-up</option>
            <option value="Working">Working</option>
            <option value="Top Set">Top Set</option>
            <option value="Backoff">Backoff</option>
            <option value="Failure">Failure</option>
            <option value="Drop Set">Drop Set</option>
            <option value="Optional Set">Optional Set</option>
        </select>
        <input type="number" class="set-weight" placeholder="Weight" step="0.5" inputmode="decimal" />
        <input type="number" class="set-reps" placeholder="Reps" step="1" inputmode="numeric" />
        <button type="button" class="remove-set-btn">×</button>
    `;

    container.appendChild(row);

    const typeSelect = row.querySelector(".set-type");
    const weightInput = row.querySelector(".set-weight");
    const repsInput = row.querySelector(".set-reps");
    const removeBtn = row.querySelector(".remove-set-btn");
    const dayKey = card.dataset.dayKey;

    if (autofill) {
        if (typeof autofill.weight === "number") {
            weightInput.value = autofill.weight;
        }
        if (typeof autofill.reps === "number") {
            repsInput.value = autofill.reps;
        }
        if (autofill.type) {
            typeSelect.value = autofill.type;
        }
    }

    if (autoFocusWeight) {
        weightInput.focus();
    }

    weightInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            repsInput.focus();
        }
    });

    removeBtn.addEventListener("click", () => {
        row.remove();
        Array.from(container.children).forEach((r, i) => {
            const label = r.querySelector(".set-label");
            if (label) label.textContent = `Set ${i + 1}`;
        });
        autoSaveDayLog(dayKey);
    });

    typeSelect.addEventListener("change", () => autoSaveDayLog(dayKey));
    weightInput.addEventListener("input", () => autoSaveDayLog(dayKey));
    repsInput.addEventListener("input", () => autoSaveDayLog(dayKey));

    return row;
}

function createExerciseCard(dayKey, name) {
    const container = DAY_CONTAINERS[dayKey];
    if (!container) return;

    const card = document.createElement("div");
    card.className = "exercise-card";
    card.setAttribute("draggable", "true");
    card.dataset.dayKey = dayKey;

    const lastLog = getLastExerciseLog(dayKey, name);
    const isOptional = name.toLowerCase().includes("(optional");

    let lastSummary = "";
    if (lastLog && lastLog.sets && lastLog.sets.length > 0) {
        const s = lastLog.sets[lastLog.sets.length - 1];
        lastSummary = `Last: ${formatWeight(s.weight)} × ${s.reps}`;
    }

    card.innerHTML = `
        <div class="exercise-header">
            <div class="exercise-header-left">
                <button type="button" class="exercise-toggle">▼</button>
                <div class="exercise-name-block">
                    <span class="exercise-name">${escapeHtml(name)}</span>
                    <span class="exercise-last">${lastSummary}</span>
                </div>
            </div>
        </div>
        <div class="exercise-body">
            <div class="sets-container"></div>
            <button type="button" class="btn-ghost add-set-btn">+ Add Set</button>
            <label class="notes-label">Notes</label>
            <textarea class="exercise-notes" rows="2" placeholder="Notes, RPE, technique..."></textarea>
        </div>
    `;

    const body = card.querySelector(".exercise-body");
    const toggleBtn = card.querySelector(".exercise-toggle");

    body.classList.remove("collapsed");
    toggleBtn.textContent = "▼";

    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const collapsed = body.classList.toggle("collapsed");
        toggleBtn.textContent = collapsed ? "▶" : "▼";
    });

    const header = card.querySelector(".exercise-header");
    header.addEventListener("click", (e) => {
        if (e.target === toggleBtn) return;
        const collapsed = body.classList.toggle("collapsed");
        toggleBtn.textContent = collapsed ? "▶" : "▼";
    });

    const setsContainer = card.querySelector(".sets-container");
    if (lastLog && lastLog.sets && lastLog.sets.length > 0) {
        lastLog.sets.forEach(set => {
            const autofill = {
                weight: set.weight,
                reps: isOptional ? null : set.reps,
                type: null
            };
            addSetRow(card, false, autofill);
        });
    } else {
        addSetRow(card, false);
        addSetRow(card, false);
    }

    const notes = card.querySelector(".exercise-notes");
    notes.addEventListener("input", () => autoSaveDayLog(dayKey));

    const addSetBtn = card.querySelector(".add-set-btn");
    addSetBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addSetRow(card, true);
        autoSaveDayLog(dayKey);
    });

    card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
    });
    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
        autoSaveDayLog(dayKey);
    });

    container.appendChild(card);
}

function initDefaultExercises() {
    ["push", "legs", "pull"].forEach(dayKey => {
        DEFAULT_SPLIT[dayKey].forEach(name => createExerciseCard(dayKey, name));
    });
}

initDefaultExercises();

function getDragAfterElement(container, y) {
    const cards = [...container.querySelectorAll(".exercise-card:not(.dragging)")];
    let closest = null;
    let closestOffset = Number.NEGATIVE_INFINITY;
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const offset = y - rect.top - rect.height / 2;
        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closest = card;
        }
    });
    return closest;
}

Object.keys(DAY_CONTAINERS).forEach(dayKey => {
    const list = DAY_CONTAINERS[dayKey];
    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = list.querySelector(".exercise-card.dragging");
        const after = getDragAfterElement(list, e.clientY);
        if (!dragging) return;
        if (after == null) {
            list.appendChild(dragging);
        } else {
            list.insertBefore(dragging, after);
        }
    });
});

// Add exercise inline
function setupAddExercise(dayKey, inputId, btnId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);

    function add() {
        const name = input.value.trim();
        if (!name) return;
        createExerciseCard(dayKey, name);
        input.value = "";
        autoSaveDayLog(dayKey);
    }

    btn.addEventListener("click", add);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            add();
        }
    });
}

setupAddExercise("push", "pushAddInput", "pushAddBtn");
setupAddExercise("legs", "legsAddInput", "legsAddBtn");
setupAddExercise("pull", "pullAddInput", "pullAddBtn");

// Dates
document.querySelectorAll(".workout-date").forEach(input => {
    const day = input.dataset.day;
    const last = getLastDayDate(day);
    if (last) {
        input.value = last.slice(0, 10);
    } else {
        input.value = new Date().toISOString().slice(0, 10);
    }
    input.addEventListener("change", () => {
        autoSaveDayLog(day);
    });
});

// Save day
document.querySelectorAll(".save-day-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const day = btn.getAttribute("data-day");
        saveDayLog(day, false);
    });
});

function gatherDayLog(dayKey) {
    const container = DAY_CONTAINERS[dayKey];
    if (!container) return null;

    const dateInput = document.querySelector(`.workout-date[data-day="${dayKey}"]`);
    let dateIso;
    if (dateInput && dateInput.value) {
        dateIso = new Date(dateInput.value + "T00:00:00").toISOString();
    } else {
        dateIso = new Date().toISOString();
    }

    const cards = container.querySelectorAll(".exercise-card");
    const log = {
        day: dayKey,
        date: dateIso,
        unit: currentUnit,
        exercises: []
    };

    cards.forEach(card => {
        const name = card.querySelector(".exercise-name").textContent.trim();
        const notes = card.querySelector(".exercise-notes").value.trim();
        const sets = [];

        card.querySelectorAll(".set-row").forEach((row, index) => {
            const type = row.querySelector(".set-type").value;
            const w = parseFloat(row.querySelector(".set-weight").value);
            const r = parseInt(row.querySelector(".set-reps").value, 10);
            if (isFinite(w) && w > 0 && Number.isFinite(r) && r > 0) {
                sets.push({ setNumber: index + 1, type, weight: w, reps: r });
            }
        });

        if (name || sets.length || notes) {
            log.exercises.push({ name, notes, sets });
        }
    });

    return log;
}

function saveDayLog(dayKey, silent = true) {
    const log = gatherDayLog(dayKey);
    if (!log) return;

    const logs = loadDayLogs();
    logs.push(log);
    saveDayLogs(logs);

    if (!silent) {
        const label = dayKey === "push" ? "Day 1" : dayKey === "legs" ? "Day 2" : "Day 3";
        alert(label + " log saved!");
    }
}

const autoSaveTimers = {};
function autoSaveDayLog(dayKey) {
    if (autoSaveTimers[dayKey]) clearTimeout(autoSaveTimers[dayKey]);
    autoSaveTimers[dayKey] = setTimeout(() => {
        saveDayLog(dayKey, true);
    }, 800);
}

// Timers
const workoutDisplay = document.getElementById("workoutDisplay");
const workoutSummary = document.getElementById("workoutSummary");
const restDisplay = document.getElementById("restDisplay");
const restSummary = document.getElementById("restSummary");
const workoutStartPauseBtn = document.getElementById("workoutStartPause");
const workoutResetBtn = document.getElementById("workoutReset");
const restStartPauseBtn = document.getElementById("restStartPause");
const restResetBtn = document.getElementById("restReset");
const restPresetBtns = document.querySelectorAll(".rest-preset");
const restPlus30Btn = document.getElementById("restPlus30");
const timerFooter = document.getElementById("timerFooter");
const timerChevron = document.getElementById("timerChevron");

let workoutSeconds = 0;
let workoutInterval = null;
let workoutRunning = false;

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function updateWorkoutDisplay() {
    const text = formatTime(workoutSeconds);
    workoutDisplay.textContent = text;
    workoutSummary.textContent = text;
}

workoutStartPauseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!workoutRunning) {
        workoutRunning = true;
        workoutStartPauseBtn.textContent = "Pause";
        workoutInterval = setInterval(() => {
            workoutSeconds += 1;
            updateWorkoutDisplay();
        }, 1000);
    } else {
        workoutRunning = false;
        workoutStartPauseBtn.textContent = "Start";
        clearInterval(workoutInterval);
    }
});

workoutResetBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    workoutRunning = false;
    clearInterval(workoutInterval);
    workoutSeconds = 0;
    updateWorkoutDisplay();
    workoutStartPauseBtn.textContent = "Start";
});

updateWorkoutDisplay();

let restDuration = 60;
let restRemaining = 60;
let restInterval = null;
let restRunning = false;

function updateRestDisplay() {
    restDisplay.textContent = String(restRemaining) + "s";
    restSummary.textContent = String(restRemaining) + "s";
}

restPresetBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const sec = parseInt(btn.getAttribute("data-sec"), 10);
        if (!Number.isFinite(sec)) return;
        restDuration = sec;
        restRemaining = sec;
        updateRestDisplay();
    });
});

restPlus30Btn.addEventListener("click", (e) => {
    e.stopPropagation();
    restRemaining += 30;
    restDuration = restRemaining;
    updateRestDisplay();
});

function playBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 880;
        o.connect(g);
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.2, ctx.currentTime);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        o.stop(ctx.currentTime + 0.3);
    } catch {}
}

function vibratePattern() {
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
    }
}

function flashEffect() {
    timerFooter.classList.add("flash-effect");
    setTimeout(() => timerFooter.classList.remove("flash-effect"), 500);
}

restStartPauseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!restRunning) {
        if (restRemaining <= 0) restRemaining = restDuration;
        restRunning = true;
        restStartPauseBtn.textContent = "Pause";
        restInterval = setInterval(() => {
            restRemaining -= 1;
            if (restRemaining <= 0) {
                restRemaining = 0;
                clearInterval(restInterval);
                restRunning = false;
                restStartPauseBtn.textContent = "Start";
                updateRestDisplay();
                playBeep();
                vibratePattern();
                flashEffect();
                alert("Rest over — time to hit the next set.");
                return;
            }
            updateRestDisplay();
        }, 1000);
    } else {
        restRunning = false;
        restStartPauseBtn.textContent = "Start";
        clearInterval(restInterval);
    }
});

restResetBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    restRunning = false;
    clearInterval(restInterval);
    restRemaining = restDuration;
    updateRestDisplay();
    restStartPauseBtn.textContent = "Start";
});

updateRestDisplay();

timerFooter.addEventListener("click", () => {
    const collapsed = timerFooter.classList.toggle("collapsed");
    timerChevron.textContent = collapsed ? "▲" : "▼";
});

document.querySelectorAll(".timer-footer .timer-btn").forEach(btn => {
    btn.addEventListener("click", (e) => e.stopPropagation());
});

// Initial defaults
setUnit("kg");
barWeightInput.value = 20;