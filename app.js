// =========================
// THEME & UNIT TOGGLES
// =========================

const THEME_KEY = "olympus_themeMode";
const UNIT_KEY = "olympus_unit";
const DAY_LOG_KEY = "olympusDayLogs_v1";

let currentUnit = "kg";

// Apply theme class to body (light / dark / auto)
function applyTheme(mode) {
    const body = document.body;
    body.classList.remove("light", "dark", "auto");
    if (!["light", "dark", "auto"].includes(mode)) mode = "auto";
    body.classList.add(mode);
    localStorage.setItem(THEME_KEY, mode);
}

// Init theme
function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || "auto";
    const themeSelect = document.getElementById("themeMode");
    themeSelect.value = saved;
    applyTheme(saved);

    themeSelect.addEventListener("change", () => {
        applyTheme(themeSelect.value);
    });
}

// Apply unit (kg/lb)
function setUnit(unit) {
    currentUnit = unit === "lb" ? "lb" : "kg";
    localStorage.setItem(UNIT_KEY, currentUnit);

    const unitSelector = document.getElementById("unitSelector");
    if (unitSelector) unitSelector.value = currentUnit;

    const barWeightInput = document.getElementById("barWeight");
    if (barWeightInput && !barWeightInput.value) {
        barWeightInput.value = currentUnit === "kg" ? 20 : 45;
    }
}

// Init unit toggle
function initUnit() {
    const saved = localStorage.getItem(UNIT_KEY) || "kg";
    setUnit(saved);

    const unitSelector = document.getElementById("unitSelector");
    unitSelector.addEventListener("change", () => {
        setUnit(unitSelector.value);
    });
}

// =========================
// TABS
// =========================

function initTabs() {
    const tabButtons = document.querySelectorAll(".tab-button");
    const panels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.tab;
            tabButtons.forEach(b => b.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add("active");
        });
    });
}

// =========================
// PHYSIQUE STANDARDS
// =========================

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

// Waist / height ratio
function classifyWaistRatio(r) {
    if (r <= 0.45) return "godlike";
    if (r <= 0.46) return "great";
    if (r <= 0.47) return "good";
    return "below";
}

// Chest / waist
function classifyChestWaist(r) {
    if (r >= 1.40) return "godlike";
    if (r >= 1.35) return "great";
    if (r >= 1.30) return "good";
    return "below";
}

// Arms / waist
function classifyArmsWaist(r) {
    if (r >= 0.50) return "godlike";
    if (r >= 0.48) return "great";
    if (r >= 0.46) return "good";
    return "below";
}

function initBodyStandards() {
    const heightInput = document.getElementById("heightInput");
    const waistInput = document.getElementById("waistInput");
    const chestInput = document.getElementById("chestInput");
    const armsInput = document.getElementById("armsInput");
    const btn = document.getElementById("calcBodyBtn");
    const output = document.getElementById("bodyResults");

    btn.addEventListener("click", () => {
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
            <div>
                <strong>Waist / Height:</strong>
                ${waistPerc.toFixed(1)}%
                — <span>${bandLabel(waistBand)}</span>
            </div>
        `;

        if (isFinite(c) && c > 0) {
            const cw = c / w;
            const chestBand = classifyChestWaist(cw);
            html += `
                <div style="margin-top:4px;">
                    <strong>Chest / Waist:</strong>
                    ${cw.toFixed(2)}×
                    — <span>${bandLabel(chestBand)}</span>
                </div>
            `;
        }

        if (isFinite(a) && a > 0) {
            const aw = a / w;
            const armsBand = classifyArmsWaist(aw);
            html += `
                <div style="margin-top:4px;">
                    <strong>Arms / Waist:</strong>
                    ${(aw * 100).toFixed(1)}%
                    — <span>${bandLabel(armsBand)}</span>
                </div>
            `;
        }

        output.classList.remove("muted");
        output.innerHTML = html || "Add chest and arms to see more detailed standards.";
    });
}

// =========================
// STRENGTH STANDARDS
// =========================

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

function initStrengthStandards() {
    const bwInput = document.getElementById("bwInput");
    const inclineInput = document.getElementById("inclineInput");
    const chinsInput = document.getElementById("chinsInput");
    const ohpInput = document.getElementById("ohpInput");
    const curlInput = document.getElementById("curlInput");
    const btn = document.getElementById("calcStrengthBtn");
    const output = document.getElementById("strengthResults");

    btn.addEventListener("click", () => {
        const BW = parseFloat(bwInput.value);
        if (!isFinite(BW) || BW <= 0) {
            alert("Enter your bodyweight.");
            return;
        }

        let html = "";

        // Incline bench
        const inc = parseFloat(inclineInput.value);
        if (isFinite(inc) && inc > 0) {
            const r = inc / BW;
            const b = classifyIncline(r);
            html += `
                <div>
                    <strong>Incline Bench (5 reps):</strong>
                    ${r.toFixed(2)}× BW — ${bandLabel(b)}
                </div>
            `;
        }

        // Weighted chins (added weight only)
        const chin = parseFloat(chinsInput.value);
        if (isFinite(chin) && chin > 0) {
            const perc = chin / BW;
            const b = classifyChins(perc);
            html += `
                <div style="margin-top:4px;">
                    <strong>Weighted Chins (5 reps):</strong>
                    ${(perc * 100).toFixed(1)}% BW — ${bandLabel(b)}
                </div>
            `;
        }

        // OHP
        const ohp = parseFloat(ohpInput.value);
        if (isFinite(ohp) && ohp > 0) {
            const r = ohp / BW;
            const b = classifyOHP(r);
            html += `
                <div style="margin-top:4px;">
                    <strong>Overhead Press (5 reps):</strong>
                    ${r.toFixed(2)}× BW — ${bandLabel(b)}
                </div>
            `;
        }

        // Curl
        const curl = parseFloat(curlInput.value);
        if (isFinite(curl) && curl > 0) {
            const r = curl / BW;
            const b = classifyCurl(r);
            html += `
                <div style="margin-top:4px;">
                    <strong>Barbell Curl (5 reps):</strong>
                    ${r.toFixed(2)}× BW — ${bandLabel(b)}
                </div>
            `;
        }

        output.classList.remove("muted");
        output.innerHTML = html || "Add your main lifts to see how they rank.";
    });
}

// =========================
// WARM-UP CALCULATOR
// =========================

const TEMPLATES = {
    soviet: {
        name: "Soviet Strength",
        description: "40% × 5, 70% × 2–3, then 100% working set.",
        sets: [
            { type: "Warm-up", percent: 0.40, reps: "5" },
            { type: "Warm-up", percent: 0.70, reps: "2–3" },
            { type: "Working", percent: 1.00, reps: "6–10 (to failure)" }
        ]
    },
    mentzer: {
        name: "Mike Mentzer",
        description: "50% × 6–8, 75% × 3–4, then 100% × 6–10 to failure.",
        sets: [
            { type: "Warm-up", percent: 0.50, reps: "6–8" },
            { type: "Warm-up", percent: 0.75, reps: "3–4" },
            { type: "Working", percent: 1.00, reps: "6–10 (to failure)" }
        ]
    },
    olympus: {
        name: "Olympus Method",
        description: "30% × 5, 50% × 3–5, then 100% × 6–10 to failure.",
        sets: [
            { type: "Warm-up", percent: 0.30, reps: "5" },
            { type: "Warm-up", percent: 0.50, reps: "3–5" },
            { type: "Working", percent: 1.00, reps: "6–10 (to failure)" }
        ]
    }
};

const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const LB_PLATES = [45, 35, 25, 10, 5, 2.5];

function plateConfig() {
    return currentUnit === "kg" ? KG_PLATES : LB_PLATES;
}

function formatWeight(val) {
    if (!isFinite(val)) return "-";
    const s = val.toFixed(1);
    return s.endsWith(".0") ? s.slice(0, -2) : s;
}

function computePlates(targetWeight, barWeight) {
    const plateSizes = plateConfig();
    const epsilon = 1e-6;

    if (targetWeight < barWeight - epsilon) {
        return "Bar only";
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

    if (platesPerSide.length === 0) return "Bar only";

    return platesPerSide
        .map(pl => `${formatWeight(pl.size)} × ${pl.count}`)
        .join(", ") + " / side";
}

function initWarmupCalculator() {
    const liftSelector = document.getElementById("liftSelector");
    const workingWeightInput = document.getElementById("workingWeight");
    const barWeightInput = document.getElementById("barWeight");
    const templateSelector = document.getElementById("templateSelector");
    const templateHint = document.getElementById("templateHint");
    const calcBtn = document.getElementById("calcWarmupBtn");
    const warmupOutput = document.getElementById("warmupOutput");

    // Populate lifts
    const lifts = [
        "Bench Press",
        "Incline Barbell Bench Press",
        "Flat Barbell Bench Press",
        "Barbell Back Squat",
        "Deadlift",
        "Romanian Deadlift",
        "Overhead Press",
        "Bent-Over Barbell Row",
        "Weighted Pull-Ups",
        "Weighted Dips (Chest-focused)",
        "Dumbbell Lateral Raises",
        "Rope Triceps Pushdown",
        "Skull Crushers",
        "Hamstring Curl (Machine)",
        "Calf Raises",
        "Leg Press (Optional)",
        "Hack Squat (Optional)",
        "Barbell Biceps Curl",
        "Rear Delt Flys",
        "Barbell Shrugs (Optional)",
        "Custom / Other"
    ];
    lifts.forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        liftSelector.appendChild(opt);
    });

    function updateTemplateHint() {
        const key = templateSelector.value;
        const tpl = TEMPLATES[key];
        if (!tpl) {
            templateHint.textContent = "";
            return;
        }
        templateHint.textContent = `${tpl.name}: ${tpl.description}`;
    }
    templateSelector.addEventListener("change", updateTemplateHint);
    updateTemplateHint();

    calcBtn.addEventListener("click", () => {
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

        const tplKey = templateSelector.value;
        const tpl = TEMPLATES[tplKey];
        if (!tpl) return;

        let html = `<table style="width:100%; border-collapse:collapse; font-size:0.9rem;">`;
        html += `
            <thead>
                <tr>
                    <th align="left">Set</th>
                    <th align="left">Type</th>
                    <th align="left">%</th>
                    <th align="left">Reps</th>
                    <th align="left">Target</th>
                    <th align="left">Plates / side</th>
                </tr>
            </thead>
            <tbody>
        `;

        tpl.sets.forEach((set, idx) => {
            const target = work * set.percent;
            const plates = computePlates(target, bar);
            html += `
                <tr>
                    <td>${idx + 1}</td>
                    <td>${set.type}</td>
                    <td>${Math.round(set.percent * 100)}%</td>
                    <td>${set.reps}</td>
                    <td>${formatWeight(target)} ${currentUnit}</td>
                    <td>${plates}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;

        warmupOutput.classList.remove("muted");
        warmupOutput.innerHTML = html;
    });
}

// =========================
// DAY LOGS & EXERCISES
// =========================

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

function getLastDayLog(dayKey) {
    const logs = loadDayLogs();
    for (let i = logs.length - 1; i >= 0; i--) {
        if (logs[i].day === dayKey) return logs[i];
    }
    return null;
}

function gatherDayLog(dayKey) {
    const containerId = dayKey + "Exercises";
    const container = document.getElementById(containerId);
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
        const nameEl = card.querySelector(".exercise-header");
        const name = nameEl ? nameEl.textContent.trim() : "Exercise";
        const notesEl = card.querySelector("textarea");
        const notes = notesEl ? notesEl.value.trim() : "";
        const sets = [];

        const rows = card.querySelectorAll(".set-row");
        rows.forEach((row, idx) => {
            const type = row.querySelector(".set-type")?.value || "";
            const w = parseFloat(row.querySelector(".set-weight")?.value || "");
            const r = parseInt(row.querySelector(".set-reps")?.value || "", 10);
            if (isFinite(w) && w > 0 && Number.isFinite(r) && r > 0) {
                sets.push({
                    setNumber: idx + 1,
                    type,
                    weight: w,
                    reps: r
                });
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
        alert(label + " log saved.");
    }
}

// Debounced autosave per day
const autoSaveTimers = {};
function autoSaveDayLog(dayKey) {
    if (autoSaveTimers[dayKey]) {
        clearTimeout(autoSaveTimers[dayKey]);
    }
    autoSaveTimers[dayKey] = setTimeout(() => {
        saveDayLog(dayKey, true);
    }, 800);
}

// Exercise cards
function addSetRow(card, dayKey, autofill) {
    const container = card.querySelector(".set-container");
    const index = container.children.length + 1;

    const row = document.createElement("div");
    row.className = "set-row";
    row.innerHTML = `
        <div>Set ${index}</div>
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
        <input type="number" class="set-weight" placeholder="Weight" step="0.5" />
        <input type="number" class="set-reps" placeholder="Reps" step="1" />
        <button type="button" class="remove-set">×</button>
    `;

    const typeEl = row.querySelector(".set-type");
    const wEl = row.querySelector(".set-weight");
    const rEl = row.querySelector(".set-reps");
    const removeBtn = row.querySelector(".remove-set");

    if (autofill) {
        if (typeof autofill.weight === "number") wEl.value = autofill.weight;
        if (typeof autofill.reps === "number") rEl.value = autofill.reps;
    }

    typeEl.addEventListener("change", () => autoSaveDayLog(dayKey));
    wEl.addEventListener("input", () => autoSaveDayLog(dayKey));
    rEl.addEventListener("input", () => autoSaveDayLog(dayKey));

    removeBtn.addEventListener("click", () => {
        row.remove();
        const rows = container.querySelectorAll(".set-row");
        rows.forEach((r, i) => {
            const label = r.querySelector("div");
            if (label) label.textContent = `Set ${i + 1}`;
        });
        autoSaveDayLog(dayKey);
    });

    container.appendChild(row);
}

function createExerciseCard(dayKey, name, previousData) {
    const container = document.getElementById(dayKey + "Exercises");
    const card = document.createElement("div");
    card.className = "exercise-card";

    card.innerHTML = `
        <div class="exercise-header">${name}</div>
        <div class="set-container"></div>
        <button type="button" class="btn-ghost add-set-btn">+ Add Set</button>
        <div style="margin-top:8px;">
            <label style="font-size:0.8rem; color:var(--text-muted);">Notes</label>
            <textarea rows="2" style="width:100%; margin-top:4px; padding:6px 8px; border-radius:6px; border:1px solid var(--card-border); background:var(--bg-input); color:var(--text);"></textarea>
        </div>
    `;

    const setContainer = card.querySelector(".set-container");
    const notesArea = card.querySelector("textarea");
    const addSetBtn = card.querySelector(".add-set-btn");

    if (previousData && previousData.notes) {
        notesArea.value = previousData.notes;
    }

    if (previousData && previousData.sets && previousData.sets.length > 0) {
        previousData.sets.forEach(s => {
            addSetRow(card, dayKey, { weight: s.weight, reps: s.reps });
        });
    } else {
        addSetRow(card, dayKey);
        addSetRow(card, dayKey);
    }

    notesArea.addEventListener("input", () => autoSaveDayLog(dayKey));

    addSetBtn.addEventListener("click", () => {
        addSetRow(card, dayKey);
        autoSaveDayLog(dayKey);
    });

    container.appendChild(card);
}

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

function initDay(dayKey) {
    const lastLog = getLastDayLog(dayKey);
    const containerId = dayKey + "Exercises";
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    let exercisesToCreate = [];

    if (lastLog && Array.isArray(lastLog.exercises) && lastLog.exercises.length > 0) {
        exercisesToCreate = lastLog.exercises.map(e => e.name);
        lastLog.exercises.forEach(ex => {
            createExerciseCard(dayKey, ex.name, ex);
        });
    } else {
        DEFAULT_SPLIT[dayKey].forEach(name => {
            createExerciseCard(dayKey, name, null);
        });
    }

    // Date
    const dateInput = document.querySelector(`.workout-date[data-day="${dayKey}"]`);
    if (dateInput) {
        if (lastLog && lastLog.date) {
            dateInput.value = lastLog.date.slice(0, 10);
        } else {
            dateInput.value = new Date().toISOString().slice(0, 10);
        }
        dateInput.addEventListener("change", () => autoSaveDayLog(dayKey));
    }

    // Add exercise
    const addInput = document.getElementById(dayKey + "AddInput");
    const addBtn = document.getElementById(dayKey + "AddBtn");
    function addExercise() {
        const val = addInput.value.trim();
        if (!val) return;
        createExerciseCard(dayKey, val, null);
        addInput.value = "";
        autoSaveDayLog(dayKey);
    }
    addBtn.addEventListener("click", addExercise);
    addInput.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            addExercise();
        }
    });

    // Save button
    const saveBtn = document.querySelector(`.save-day-btn[data-day="${dayKey}"]`);
    if (saveBtn) {
        saveBtn.addEventListener("click", () => saveDayLog(dayKey, false));
    }
}

function initDays() {
    ["push", "legs", "pull"].forEach(initDay);
}

// =========================
// TIMERS
// =========================

function initTimers() {
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

    const timerToggleBtn = document.getElementById("timerToggleBtn");
    const timerDetails = document.getElementById("timerDetails");

    let workoutSeconds = 0;
    let workoutInterval = null;
    let workoutRunning = false;

    function formatWorkout(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    function updateWorkoutDisplay() {
        const text = formatWorkout(workoutSeconds);
        workoutDisplay.textContent = text;
        workoutSummary.textContent = text;
    }

    workoutStartPauseBtn.addEventListener("click", () => {
        if (!workoutRunning) {
            workoutRunning = true;
            workoutStartPauseBtn.textContent = "Pause";
            workoutInterval = setInterval(() => {
                workoutSeconds++;
                updateWorkoutDisplay();
            }, 1000);
        } else {
            workoutRunning = false;
            workoutStartPauseBtn.textContent = "Start";
            clearInterval(workoutInterval);
        }
    });

    workoutResetBtn.addEventListener("click", () => {
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
        restDisplay.textContent = `${restRemaining}s`;
        restSummary.textContent = `${restRemaining}s`;
    }

    restPresetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const sec = parseInt(btn.dataset.sec, 10);
            if (!Number.isFinite(sec)) return;
            restDuration = sec;
            restRemaining = sec;
            updateRestDisplay();
        });
    });

    restPlus30Btn.addEventListener("click", () => {
        restRemaining += 30;
        restDuration = restRemaining;
        updateRestDisplay();
    });

    function beep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = 880;
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
            osc.stop(ctx.currentTime + 0.3);
        } catch {}
    }

    function vibrate() {
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
    }

    restStartPauseBtn.addEventListener("click", () => {
        if (!restRunning) {
            if (restRemaining <= 0) restRemaining = restDuration;
            restRunning = true;
            restStartPauseBtn.textContent = "Pause";
            restInterval = setInterval(() => {
                restRemaining--;
                if (restRemaining <= 0) {
                    restRemaining = 0;
                    clearInterval(restInterval);
                    restRunning = false;
                    restStartPauseBtn.textContent = "Start";
                    updateRestDisplay();
                    beep();
                    vibrate();
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

    restResetBtn.addEventListener("click", () => {
        restRunning = false;
        clearInterval(restInterval);
        restRemaining = restDuration;
        updateRestDisplay();
        restStartPauseBtn.textContent = "Start";
    });

    updateRestDisplay();

    // Toggle details
    let detailsVisible = false;
    timerToggleBtn.addEventListener("click", () => {
        detailsVisible = !detailsVisible;
        if (detailsVisible) {
            timerDetails.classList.add("active");
            timerToggleBtn.textContent = "▼";
        } else {
            timerDetails.classList.remove("active");
            timerToggleBtn.textContent = "▲";
        }
    });
}

// =========================
// INIT EVERYTHING
// =========================

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initUnit();
    initTabs();
    initBodyStandards();
    initStrengthStandards();
    initWarmupCalculator();
    initDays();
    initTimers();
});