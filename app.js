/* ============================================================
   GLOBAL CONSTANTS
============================================================ */

const lifts = [
  "Incline Barbell Bench Press",
  "Flat Barbell Bench Press",
  "Weighted Dips",
  "Dumbbell Lateral Raises",
  "Rope Pushdown",
  "Skull Crushers",
  "Barbell Back Squat",
  "Romanian Deadlift",
  "Hamstring Curl",
  "Calf Raises",
  "Leg Press",
  "Hack Squat",
  "Weighted Pull-Ups",
  "Bent-Over Barbell Row",
  "Barbell Biceps Curl",
  "Rear Delt Flys",
  "Barbell Shrugs"
];

/* ============================================================
   THEME SYSTEM (Light / Dark / Auto)
============================================================ */

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

themeSelect.addEventListener("change", () => {
    applyTheme(themeSelect.value);
});

loadTheme();

/* ============================================================
   UNIT TOGGLE (KG / LB)
============================================================ */

const kgBtn = document.getElementById("kgBtn");
const lbBtn = document.getElementById("lbBtn");

let currentUnit = "kg";

kgBtn.classList.add("active-unit");

kgBtn.addEventListener("click", () => {
    currentUnit = "kg";
    kgBtn.classList.add("active-unit");
    lbBtn.classList.remove("active-unit");
    localStorage.setItem("om_unit", "kg");
});

lbBtn.addEventListener("click", () => {
    currentUnit = "lb";
    lbBtn.classList.add("active-unit");
    kgBtn.classList.remove("active-unit");
    localStorage.setItem("om_unit", "lb");
});

function loadUnit() {
    const saved = localStorage.getItem("om_unit") || "kg";
    currentUnit = saved;

    if (saved === "kg") {
        kgBtn.classList.add("active-unit");
        lbBtn.classList.remove("active-unit");
    } else {
        lbBtn.classList.add("active-unit");
        kgBtn.classList.remove("active-unit");
    }
}

loadUnit();

/* ============================================================
   TAB SYSTEM
============================================================ */

const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        const tab = button.dataset.tab;

        tabButtons.forEach(b => b.classList.remove("active"));
        tabPanels.forEach(p => p.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(tab).classList.add("active");
    });
});

/* ============================================================
   WARM-UP TEMPLATES
============================================================ */

const templateSelector = document.getElementById("templateSelector");
const warmupOutput = document.getElementById("warmupOutput");
const liftSelector = document.getElementById("liftSelector");

lifts.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l;
    liftSelector.appendChild(opt);
});

const warmupTemplates = {
    soviet: [
        { pct: 0.30, reps: 5 },
        { pct: 0.50, reps: 3 },
        { pct: 0.70, reps: 1 }
    ],
    mentzer: [
        { pct: 0.30, reps: 5 },
        { pct: 0.50, reps: 5 }
    ],
    olympus: [
        { pct: 0.30, reps: 5 },
        { pct: 0.50, reps: 5 }
    ]
};

/* ============================================================
   WARM-UP CALCULATOR
============================================================ */

document.getElementById("calcWarmupBtn").addEventListener("click", () => {
    const working = parseFloat(document.getElementById("workingWeight").value);
    const bar = parseFloat(document.getElementById("barWeight").value);
    const template = templateSelector.value;

    if (!working || !bar) {
        warmupOutput.innerHTML = "Enter working weight + bar weight.";
        return;
    }

    const sets = warmupTemplates[template];

    let html = `<strong>Warm-up sets:</strong><br><br>`;

    sets.forEach((s, i) => {
        const weight = Math.round((working * s.pct));
        const plates = (weight - bar) / 2;
        html += `Set ${i + 1}: ${Math.round(s.pct * 100)}% → ${weight}${currentUnit} × ${s.reps}<br>`;
    });

    warmupOutput.innerHTML = html;
});

/* ============================================================
   PHYSIQUE STANDARDS
============================================================ */

document.getElementById("calcBodyBtn").addEventListener("click", () => {
    const h = parseFloat(document.getElementById("heightInput").value);
    const w = parseFloat(document.getElementById("waistInput").value);
    const c = parseFloat(document.getElementById("chestInput").value);
    const a = parseFloat(document.getElementById("armsInput").value);

    const out = document.getElementById("bodyResults");

    if (!h || !w) {
        out.innerHTML = "Enter height and waist at minimum.";
        return;
    }

    const waistGood = h * 0.47;
    const waistGreat = h * 0.46;
    const waistGod = h * 0.45;

    let html = "<strong>Waist</strong><br>";
    html += `Good: ${waistGood.toFixed(1)}<br>`;
    html += `Great: ${waistGreat.toFixed(1)}<br>`;
    html += `Godlike: ${waistGod.toFixed(1)}<br><br>`;

    if (c) {
        html += "<strong>Chest</strong><br>";
        html += `Good: ${(w * 1.30).toFixed(1)}<br>`;
        html += `Great: ${(w * 1.35).toFixed(1)}<br>`;
        html += `Godlike: ${(w * 1.40).toFixed(1)}<br><br>`;
    }

    if (a) {
        html += "<strong>Arms</strong><br>";
        html += `Good: ${(w * 0.46).toFixed(1)}<br>`;
        html += `Great: ${(w * 0.48).toFixed(1)}<br>`;
        html += `Godlike: ${(w * 0.50).toFixed(1)}<br>`;
    }

    out.innerHTML = html;
});

/* ============================================================
   STRENGTH STANDARDS
============================================================ */

document.getElementById("calcStrengthBtn").addEventListener("click", () => {
    const bw = parseFloat(document.getElementById("bwInput").value);
    const inc = parseFloat(document.getElementById("inclineInput").value);
    const chin = parseFloat(document.getElementById("chinsInput").value);
    const ohp = parseFloat(document.getElementById("ohpInput").value);
    const curl = parseFloat(document.getElementById("curlInput").value);

    const out = document.getElementById("strengthResults");

    if (!bw) {
        out.innerHTML = "Enter bodyweight.";
        return;
    }

    function rating(ratio, good, great, god) {
        if (ratio < good) return "Below Standard";
        if (ratio < great) return "Good";
        if (ratio < god) return "Great";
        return "Godlike";
    }

    let html = "<strong>Results:</strong><br><br>";

    if (inc) {
        const ratio = inc / bw;
        html += `Incline Bench: ${rating(ratio, 0.9, 1.1, 1.25)}<br>`;
    }

    if (chin) {
        const ratio = chin / bw;
        html += `Weighted Chins: ${rating(ratio, 0.30, 0.45, 0.60)}<br>`;
    }

    if (ohp) {
        const ratio = ohp / bw;
        html += `Overhead Press: ${rating(ratio, 0.65, 0.8, 0.9)}<br>`;
    }

    if (curl) {
        const ratio = curl / bw;
        html += `Barbell Curl: ${rating(ratio, 0.45, 0.55, 0.65)}<br>`;
    }

    out.innerHTML = html;
});

/* ============================================================
   DAY LOG STRUCTURE (Push / Legs / Pull)
============================================================ */

const dayData = {
    push: [
        "Incline Barbell Bench Press",
        "Flat Barbell Bench Press",
        "Weighted Dips",
        "Dumbbell Lateral Raises",
        "Rope Pushdown (Optional)",
        "Skull Crushers (Optional)"
    ],
    legs: [
        "Barbell Back Squat",
        "Romanian Deadlift",
        "Hamstring Curl",
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

function createExerciseCard(name, day, index) {
    const card = document.createElement("div");
    card.className = "exercise-card";

    const header = document.createElement("div");
    header.className = "exercise-header";
    header.textContent = name;

    const body = document.createElement("div");
    body.className = "exercise-body collapsed";

    const setsContainer = document.createElement("div");
    setsContainer.className = "sets-container";

    const addSetBtn = document.createElement("button");
    addSetBtn.className = "btn-ghost";
    addSetBtn.textContent = "+ Add Set";

    addSetBtn.addEventListener("click", () => {
        const row = document.createElement("div");
        row.className = "set-row";

        row.innerHTML = `
            <input type="number" class="set-number" placeholder="#" />
            <select class="set-type">
                <option value="warmup">Warm-up</option>
                <option value="working">Working</option>
            </select>
            <input type="number" class="set-weight" placeholder="Weight" />
            <input type="number" class="set-reps" placeholder="Reps" />
            <button class="remove-set-btn">×</button>
        `;

        row.querySelector(".remove-set-btn").addEventListener("click", () => {
            row.remove();
        });

        setsContainer.appendChild(row);
    });

    header.addEventListener("click", () => {
        body.classList.toggle("collapsed");
    });

    body.appendChild(setsContainer);
    body.appendChild(addSetBtn);

    card.appendChild(header);
    card.appendChild(body);

    return card;
}

/* ============================================================
   RENDER DAY LISTS
============================================================ */

function initDay(day) {
    const container = document.getElementById(day + "Exercises");
    dayData[day].forEach((ex, i) => {
        const card = createExerciseCard(ex, day, i);
        container.appendChild(card);
    });

    // Custom exercise
    document.getElementById(day + "AddBtn").addEventListener("click", () => {
        const input = document.getElementById(day + "AddInput");
        if (!input.value.trim()) return;

        const card = createExerciseCard(input.value.trim(), day, Date.now());
        container.appendChild(card);

        input.value = "";
    });
}

["push", "legs", "pull"].forEach(initDay);

/* ============================================================
   LOCAL STORAGE SAVE / LOAD
============================================================ */

document.querySelectorAll(".save-day-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const day = btn.dataset.day;

        const dateInput = document.querySelector(`input[data-day="${day}"]`);
        const date = dateInput.value;

        const container = document.getElementById(day + "Exercises");
        const cards = [...container.querySelectorAll(".exercise-card")];

        let save = {
            date,
            exercises: []
        };

        cards.forEach(c => {
            const name = c.querySelector(".exercise-header").textContent;
            const sets = [...c.querySelectorAll(".set-row")].map(row => ({
                number: row.querySelector(".set-number").value,
                type: row.querySelector(".set-type").value,
                weight: row.querySelector(".set-weight").value,
                reps: row.querySelector(".set-reps").value
            }));

            save.exercises.push({ name, sets });
        });

        localStorage.setItem("om_" + day, JSON.stringify(save));
    });
});

/* ============================================================
   TIMERS (Workout + Rest)
============================================================ */

let workoutSec = 0;
let workoutTimer = null;

document.getElementById("workoutStartPause").addEventListener("click", () => {
    if (workoutTimer) {
        clearInterval(workoutTimer);
        workoutTimer = null;
        return;
    }
    workoutTimer = setInterval(() => {
        workoutSec++;
        document.getElementById("workoutDisplay").textContent =
            Math.floor(workoutSec / 60).toString().padStart(2, "0") +
            ":" +
            (workoutSec % 60).toString().padStart(2, "0");
    }, 1000);
});

document.getElementById("workoutReset").addEventListener("click", () => {
    clearInterval(workoutTimer);
    workoutTimer = null;
    workoutSec = 0;
    document.getElementById("workoutDisplay").textContent = "00:00";
});

/* Rest Timer */

let restSec = 0;
let restTimer = null;

document.getElementById("restStartPause").addEventListener("click", () => {
    if (restTimer) {
        clearInterval(restTimer);
        restTimer = null;
        return;
    }
    restTimer = setInterval(() => {
        restSec++;
        document.getElementById("restDisplay").textContent =
            restSec + "s";
    }, 1000);
});

document.getElementById("restReset").addEventListener("click", () => {
    clearInterval(restTimer);
    restTimer = null;
    restSec = 0;
    document.getElementById("restDisplay").textContent = "00s";
});

document.querySelectorAll(".rest-preset").forEach(btn => {
    btn.addEventListener("click", () => {
        restSec = parseInt(btn.dataset.sec);
        document.getElementById("restDisplay").textContent =
            restSec + "s";
    });
});

document.getElementById("restPlus30").addEventListener("click", () => {
    restSec += 30;
    document.getElementById("restDisplay").textContent =
        restSec + "s";
});

/* Expand / Collapse footer */
document.getElementById("timerToggleBtn").addEventListener("click", () => {
    document.getElementById("timerDetails").classList.toggle("active");
});