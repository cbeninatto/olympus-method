// app.js v1 — Olympus Method

// ===============================
//   GLOBAL STATE & HELPERS
// ===============================
let currentUnit = "kg"; // "kg" or "lb"
const STORAGE_KEY = "olympus_method_logs_v1";

function $(id) {
    return document.getElementById(id);
}

function loadLogs() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveLogs(logs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

// Find last log for a specific day+exercise
function getLastExerciseLog(dayKey, exerciseName) {
    const logs = loadLogs();
    for (let i = logs.length - 1; i >= 0; i--) {
        const log = logs[i];
        if (log.day !== dayKey) continue;
        const ex = log.exercises.find(e => e.name === exerciseName);
        if (ex && ex.sets && ex.sets.length > 0) return ex;
    }
    return null;
}

// Find last date used for a specific day
function getLastDayDate(dayKey) {
    const logs = loadLogs();
    for (let i = logs.length - 1; i >= 0; i--) {
        if (logs[i].day === dayKey && logs[i].date) {
            return logs[i].date.slice(0, 10); // YYYY-MM-DD
        }
    }
    return null;
}

// Format helpers
function format1(x) {
    if (!isFinite(x)) return "-";
    return Number(x.toFixed(1)).toString();
}
function format2(x) {
    if (!isFinite(x)) return "-";
    return x.toFixed(2);
}

// ===============================
//   TABS
// ===============================
function initTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(target).classList.add("active");
        });
    });
}

// ===============================
//   UNIT SELECTOR
// ===============================
function initUnitSelector() {
    const unitSelector = $("unitSelector");
    const barWeightInput = $("barWeight");

    unitSelector.addEventListener("change", () => {
        currentUnit = unitSelector.value;
        if (currentUnit === "kg" && (!barWeightInput.value || barWeightInput.value === "45")) {
            barWeightInput.value = 20;
        } else if (currentUnit === "lb" && (!barWeightInput.value || barWeightInput.value === "20")) {
            barWeightInput.value = 45;
        }
    });

    currentUnit = unitSelector.value;
}

// ===============================
//   PHYSIQUE STANDARDS
// ===============================
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

function bandLabel(b) {
    switch (b) {
        case "good": return "Good";
        case "great": return "Great";
        case "godlike": return "Godlike";
        default: return "Below Good";
    }
}
function bandClass(b) {
    switch (b) {
        case "good": return "result-good";
        case "great": return "result-great";
        case "godlike": return "result-godlike";
        default: return "result-below";
    }
}

function initBodyCalculator() {
    const btn = $("calcBodyBtn");
    const out = $("bodyResults");

    btn.addEventListener("click", () => {
        const h = parseFloat($("heightInput").value);
        const w = parseFloat($("waistInput").value);
        const c = parseFloat($("chestInput").value);
        const a = parseFloat($("armsInput").value);

        if (!isFinite(h) || h <= 0 || !isFinite(w) || w <= 0) {
            out.innerHTML = `<p class="result-below">Enter at least Height and Waist.</p>`;
            return;
        }

        let html = "";

        // Waist / Height
        const waistRatio = w / h;
        const waistPerc = waistRatio * 100;
        const waistBand = classifyWaistRatio(waistRatio);
        html += `
            <p>
                Waist / Height: <strong>${waistPerc.toFixed(1)}%</strong>
                <span class="${bandClass(waistBand)}">(${bandLabel(waistBand)})</span>
            </p>
        `;

        // Chest / Waist
        if (isFinite(c) && c > 0) {
            const cw = c / w;
            const band = classifyChestWaist(cw);
            html += `
                <p>
                    Chest / Waist: <strong>${format2(cw)}×</strong>
                    <span class="${bandClass(band)}">(${bandLabel(band)})</span>
                </p>
            `;
        }

        // Arms / Waist
        if (isFinite(a) && a > 0) {
            const aw = a / w;
            const band = classifyArmsWaist(aw);
            html += `
                <p>
                    Arms / Waist: <strong>${(aw * 100).toFixed(1)}%</strong>
                    <span class="${bandClass(band)}">(${bandLabel(band)})</span>
                </p>
            `;
        }

        out.innerHTML = html;
    });
}

// ===============================
//   STRENGTH STANDARDS
// ===============================
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

function initStrengthCalculator() {
    const btn = $("calcStrengthBtn");
    const out = $("strengthResults");

    btn.addEventListener("click", () => {
        const BW = parseFloat($("bwInput").value);
        if (!isFinite(BW) || BW <= 0) {
            out.innerHTML = `<p class="result-below">Enter your Bodyweight.</p>`;
            return;
        }

        let html = "";

        const inc = parseFloat($("inclineInput").value);
        if (isFinite(inc) && inc > 0) {
            const r = inc / BW;
            const band = classifyIncline(r);
            html += `
                <p>
                    Incline Bench (5 reps): <strong>${format2(r)}× BW</strong>
                    <span class="${bandClass(band)}">(${bandLabel(band)})</span>
                </p>
            `;
        }

        const ch = parseFloat($("chinsInput").value);
        if (isFinite(ch) && ch > 0) {
            const perc = ch / BW; // added weight / BW
            const band = classifyChins(perc);
            html += `
                <p>
                    Weighted Chins (added, 5 reps): <strong>${(perc * 100).toFixed(1)}% BW</strong>
                    <span class="${bandClass(band)}">(${bandLabel(band)})</span>
                </p>
            `;
        }

        const ohp = parseFloat($("ohpInput").value);
        if (isFinite(ohp) && ohp > 0) {
            const r = ohp / BW;
            const band = classifyOHP(r);
            html += `
                <p>
                    Overhead Press (5 reps): <strong>${format2(r)}× BW</strong>
                    <span class="${bandClass(band)}">(${bandLabel(band)})</span>
                </p>
            `;
        }

        const curl = parseFloat($("curlInput").value);
        if (isFinite(curl) && curl > 0) {
            const r = curl / BW;
            const band = classifyCurl(r);
            html += `
                <p>
                    Barbell Curl (5 reps): <strong>${format2(r)}× BW</strong>
                    <span class="${bandClass(band)}">(${bandLabel(band)})</span>
                </p>
            `;
        }

        if (!html) {
            html = `<p>Enter at least one lift to see your strength standards.</p>`;
        }

        out.innerHTML = html;
    });
}

// ===============================
//   WARM-UP CALCULATOR
// ===============================
const WARMUP_TEMPLATES = {
    soviet: {
        name: "Soviet Strength",
        sets: [
            { type: "Warm-up", percent: 0.40, reps: "5" },
            { type: "Warm-up", percent: 0.70, reps: "2–3" },
            { type: "Working", percent: 1.00, reps: "6–10 (top set)" }
        ]
    },
    mentzer: {
        name: "Mike Mentzer",
        sets: [
            { type: "Warm-up", percent: 0.50, reps: "6–8" },
            { type: "Warm-up", percent: 0.75, reps: "3–4" },
            { type: "Working", percent: 1.00, reps: "6–10 (to failure)" }
        ]
    },
    olympus: {
        name: "Olympus Method",
        sets: [
            { type: "Warm-up", percent: 0.30, reps: "5" },
            { type: "Warm-up", percent: 0.50, reps: "3–5" },
            { type: "Working", percent: 1.00, reps: "6–10 (to failure)" }
        ]
    }
};

const LIFTS = [
    "Incline Barbell Bench Press",
    "Flat Barbell Bench Press",
    "Bench Press",
    "Barbell Back Squat",
    "Deadlift",
    "Romanian Deadlift",
    "Weighted Dips (Chest-focused)",
    "Weighted Pull-Ups",
    "Bent-Over Barbell Row",
    "Overhead Press",
    "Barbell Biceps Curl",
    "Leg Press",
    "Hack Squat",
    "Calf Raises",
    "Hamstring Curl (Machine)",
    "Rear Delt Flys",
    "Barbell Shrugs"
];

const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const LB_PLATES = [45, 35, 25, 10, 5, 2.5];

function plateList() {
    return currentUnit === "kg" ? KG_PLATES : LB_PLATES;
}

function calcPlates(target, bar) {
    if (!isFinite(target) || !isFinite(bar)) {
        return "—";
    }
    if (target < bar + 0.01) {
        return "Bar only";
    }

    let remaining = target - bar;
    let perSide = remaining / 2;
    const sizes = plateList();
    const result = [];

    for (const p of sizes) {
        const count = Math.floor((perSide + 1e-6) / p);
        if (count > 0) {
            result.push(`${format1(p)} × ${count}`);
            perSide -= count * p;
        }
    }

    return result.length ? result.join(", ") + " / side" : "Bar only";
}

function initWarmupCalculator() {
    const liftSelector = $("liftSelector");
    const workingWeight = $("workingWeight");
    const barWeight = $("barWeight");
    const templateSelector = $("templateSelector");
    const btn = $("calcWarmupBtn");
    const out = $("warmupOutput");

    // Populate lift dropdown
    LIFTS.forEach(l => {
        const opt = document.createElement("option");
        opt.value = l;
        opt.textContent = l;
        liftSelector.appendChild(opt);
    });

    btn.addEventListener("click", () => {
        const work = parseFloat(workingWeight.value);
        const bar = parseFloat(barWeight.value);
        const templateKey = templateSelector.value;

        if (!isFinite(work) || work <= 0) {
            out.innerHTML = `<p class="result-below">Enter a valid Working Weight.</p>`;
            return;
        }
        if (!isFinite(bar) || bar <= 0) {
            out.innerHTML = `<p class="result-below">Enter a valid Bar Weight.</p>`;
            return;
        }

        const tpl = WARMUP_TEMPLATES[templateKey];
        if (!tpl) {
            out.innerHTML = `<p class="result-below">Invalid template.</p>`;
            return;
        }

        let html = `<p><strong>${tpl.name}</strong> — ${liftSelector.value} (${currentUnit})</p>`;
        html += `<table class="results-table"><thead><tr>
            <th>Set</th><th>Type</th><th>%</th><th>Reps</th><th>Target</th><th>Plates</th>
        </tr></thead><tbody>`;

        tpl.sets.forEach((s, idx) => {
            const tgt = work * s.percent;
            html += `<tr>
                <td>${idx + 1}</td>
                <td>${s.type}</td>
                <td>${Math.round(s.percent * 100)}%</td>
                <td>${s.reps}</td>
                <td>${format1(tgt)} ${currentUnit}</td>
                <td>${calcPlates(tgt, bar)}</td>
            </tr>`;
        });

        html += `</tbody></table>`;
        out.innerHTML = html;
    });
}

// ===============================
//   EXERCISE CARDS / DAY LOGS
// ===============================
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

function createSetRow(setData, onChange) {
    const row = document.createElement("div");
    row.className = "set-row";

    const idxSpan = document.createElement("div");
    idxSpan.textContent = setData.indexLabel || "1";

    const typeSel = document.createElement("select");
    ["", "Warm-up", "Working", "Top Set", "Backoff", "Failure", "Drop Set", "Optional Set"].forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        typeSel.appendChild(opt);
    });
    if (setData.type) typeSel.value = setData.type;

    const weightInput = document.createElement("input");
    weightInput.type = "number";
    weightInput.placeholder = "Weight";
    if (typeof setData.weight === "number") weightInput.value = setData.weight;

    const repsInput = document.createElement("input");
    repsInput.type = "number";
    repsInput.placeholder = "Reps";
    if (typeof setData.reps === "number") repsInput.value = setData.reps;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-set";
    removeBtn.textContent = "×";

    row.appendChild(idxSpan);
    row.appendChild(typeSel);
    row.appendChild(weightInput);
    row.appendChild(repsInput);
    row.appendChild(removeBtn);

    [typeSel, weightInput, repsInput].forEach(el => {
        el.addEventListener("input", () => onChange());
    });

    removeBtn.addEventListener("click", () => {
        row.remove();
        onChange();
    });

    row._indexSpan = idxSpan;
    row._typeInput = typeSel;
    row._weightInput = weightInput;
    row._repsInput = repsInput;

    return row;
}

function renumberSetRows(container) {
    const rows = container.querySelectorAll(".set-row");
    rows.forEach((row, i) => {
        if (row._indexSpan) row._indexSpan.textContent = (i + 1).toString();
    });
}

function buildExerciseCard(dayKey, container, name) {
    const card = document.createElement("div");
    card.className = "exercise-card";

    const header = document.createElement("div");
    header.className = "exercise-header";

    const title = document.createElement("div");
    title.className = "exercise-name";
    title.textContent = name;

    const lastPerf = document.createElement("div");
    lastPerf.className = "last-performance";

    header.appendChild(title);
    header.appendChild(lastPerf);

    const setsBox = document.createElement("div");

    const addSetBtn = document.createElement("button");
    addSetBtn.className = "add-set-btn";
    addSetBtn.textContent = "+ Add Set";

    const notes = document.createElement("textarea");
    notes.className = "notes-box";
    notes.placeholder = "Notes, RPE, tempo, etc.";

    card.appendChild(header);
    card.appendChild(setsBox);
    card.appendChild(addSetBtn);
    card.appendChild(notes);

    container.appendChild(card);

    const lastLog = getLastExerciseLog(dayKey, name);
    let baseWeight = null;
    let baseReps = null;

    if (lastLog && lastLog.sets && lastLog.sets.length > 0) {
        lastPerf.textContent = (() => {
            const top = lastLog.sets[lastLog.sets.length - 1];
            baseWeight = top.weight;
            baseReps = top.reps;
            return `Last: ${format1(top.weight)} x ${top.reps}`;
        })();

        lastLog.sets.forEach((s, idx) => {
            const isOptional = name.toLowerCase().includes("(optional");
            const row = createSetRow({
                indexLabel: (idx + 1).toString(),
                type: s.type || "",
                weight: s.weight,
                reps: isOptional ? null : s.reps
            }, () => scheduleAutoSave(dayKey));
            setsBox.appendChild(row);
        });

        notes.value = lastLog.notes || "";
    } else {
        // Default 2 empty sets
        for (let i = 0; i < 2; i++) {
            const row = createSetRow({
                indexLabel: (i + 1).toString()
            }, () => scheduleAutoSave(dayKey));
            setsBox.appendChild(row);
        }
    }

    addSetBtn.addEventListener("click", () => {
        const isOptional = name.toLowerCase().includes("(optional");
        const row = createSetRow({
            indexLabel: (setsBox.children.length + 1).toString(),
            weight: baseWeight,
            reps: isOptional ? null : baseReps
        }, () => scheduleAutoSave(dayKey));
        setsBox.appendChild(row);
        renumberSetRows(setsBox);
        scheduleAutoSave(dayKey);
    });

    notes.addEventListener("input", () => scheduleAutoSave(dayKey));

    card._getData = () => {
        const sets = [];
        const rows = setsBox.querySelectorAll(".set-row");
        rows.forEach((row, i) => {
            const t = row._typeInput.value || "";
            const w = parseFloat(row._weightInput.value);
            const r = parseInt(row._repsInput.value, 10);
            if (isFinite(w) && w > 0 && Number.isFinite(r) && r > 0) {
                sets.push({
                    setNumber: i + 1,
                    type: t,
                    weight: w,
                    reps: r
                });
            }
        });
        return {
            name,
            notes: notes.value.trim(),
            sets
        };
    };

    card._updateLastPerf = () => {
        const data = card._getData();
        if (data.sets.length > 0) {
            const top = data.sets[data.sets.length - 1];
            lastPerf.textContent = `Last: ${format1(top.weight)} x ${top.reps}`;
        }
    };

    return card;
}

const dayContainers = {
    push: "pushContainer",
    legs: "legsContainer",
    pull: "pullContainer"
};

const autoSaveTimers = {};

function scheduleAutoSave(dayKey) {
    if (autoSaveTimers[dayKey]) {
        clearTimeout(autoSaveTimers[dayKey]);
    }
    autoSaveTimers[dayKey] = setTimeout(() => {
        saveDay(dayKey, true);
    }, 800);
}

function gatherDayData(dayKey) {
    const containerId = dayContainers[dayKey];
    if (!containerId) return null;
    const container = $(containerId);
    if (!container) return null;

    const dateInput = document.querySelector(`.workout-date[data-day="${dayKey}"]`);
    let dateIso = new Date().toISOString();
    if (dateInput && dateInput.value) {
        dateIso = new Date(dateInput.value + "T00:00:00").toISOString();
    }

    const cards = container.querySelectorAll(".exercise-card");
    const exercises = [];
    cards.forEach(card => {
        if (typeof card._getData === "function") {
            const ex = card._getData();
            if (ex.name || ex.sets.length || ex.notes) {
                exercises.push(ex);
            }
        }
    });

    return {
        day: dayKey,
        date: dateIso,
        unit: currentUnit,
        exercises
    };
}

// global for HTML inline onclick
function saveDay(dayKey, silent) {
    const data = gatherDayData(dayKey);
    if (!data) return;

    const logs = loadLogs();
    logs.push(data);
    saveLogs(logs);

    // update last performance labels
    const containerId = dayContainers[dayKey];
    const container = $(containerId);
    if (container) {
        container.querySelectorAll(".exercise-card").forEach(card => {
            if (typeof card._updateLastPerf === "function") {
                card._updateLastPerf();
            }
        });
    }

    if (!silent) {
        alert(`Saved ${dayKey.toUpperCase()} workout.`);
    }
}
window.saveDay = saveDay;

// Initialize default exercises and dates
function initDayLogs() {
    ["push", "legs", "pull"].forEach(dayKey => {
        const containerId = dayContainers[dayKey];
        const container = $(containerId);
        if (!container) return;

        DEFAULT_SPLIT[dayKey].forEach(name => {
            buildExerciseCard(dayKey, container, name);
        });

        const dateInput = document.querySelector(`.workout-date[data-day="${dayKey}"]`);
        if (dateInput) {
            const last = getLastDayDate(dayKey);
            if (last) dateInput.value = last;
            else dateInput.value = new Date().toISOString().slice(0, 10);

            dateInput.addEventListener("change", () => scheduleAutoSave(dayKey));
        }
    });
}

// ===============================
//   TIMERS
// ===============================
let workoutTimer = null;
let workoutSeconds = 0;

function updateWorkoutDisplay() {
    const el = $("workoutTime");
    const h = Math.floor(workoutSeconds / 3600);
    const m = Math.floor((workoutSeconds % 3600) / 60);
    const s = workoutSeconds % 60;
    el.textContent = [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
}

function startWorkoutTimer() {
    if (workoutTimer) return;
    workoutTimer = setInterval(() => {
        workoutSeconds++;
        updateWorkoutDisplay();
    }, 1000);
}
function pauseWorkoutTimer() {
    clearInterval(workoutTimer);
    workoutTimer = null;
}
function resetWorkoutTimer() {
    pauseWorkoutTimer();
    workoutSeconds = 0;
    updateWorkoutDisplay();
}

let restTimer = null;
let restRemaining = 0;

function updateRestDisplay() {
    const el = $("restTime");
    const m = Math.floor(restRemaining / 60);
    const s = restRemaining % 60;
    el.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function startRest(seconds) {
    if (typeof seconds === "number") {
        restRemaining = seconds;
    }
    updateRestDisplay();
    if (restTimer) clearInterval(restTimer);
    restTimer = setInterval(() => {
        restRemaining--;
        if (restRemaining <= 0) {
            restRemaining = 0;
            updateRestDisplay();
            clearInterval(restTimer);
            restTimer = null;
            alert("Rest over — time to lift.");
        } else {
            updateRestDisplay();
        }
    }, 1000);
}

function addRest(extra) {
    restRemaining += extra;
    if (restRemaining < 0) restRemaining = 0;
    updateRestDisplay();
}

// Expose for HTML inline handlers
window.startRest = startRest;
window.addRest = addRest;

function initTimers() {
    $("startWorkout").addEventListener("click", startWorkoutTimer);
    $("pauseWorkout").addEventListener("click", pauseWorkoutTimer);
    $("resetWorkout").addEventListener("click", resetWorkoutTimer);
    updateWorkoutDisplay();
    updateRestDisplay();
}

// ===============================
//   INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initUnitSelector();
    initBodyCalculator();
    initStrengthCalculator();
    initWarmupCalculator();
    initDayLogs();
    initTimers();
});
