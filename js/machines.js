const machineGrid = document.getElementById("machineGrid");
const machineSearch = document.getElementById("machineSearch");
const machineDifficulty = document.getElementById("machineDifficulty");

const fallbackMachines = [
    machine("Leg Press Machine", ["Quadriceps"], ["Glutes", "Hamstrings"], "Beginner", ["Set feet shoulder-width", "Lower with control", "Do not lock knees hard"]),
    machine("Lat Pulldown Machine", ["Lats"], ["Biceps", "Upper Back"], "Beginner", ["Adjust thigh pad", "Pull bar toward upper chest", "Control the return"]),
    machine("Chest Press Machine", ["Chest"], ["Shoulders", "Triceps"], "Beginner", ["Set handles at chest height", "Keep back against pad", "Press without shrugging"]),
    machine("Seated Row Machine", ["Mid Back"], ["Biceps", "Rear Delts"], "Beginner", ["Sit tall", "Pull elbows back", "Squeeze shoulder blades"]),
    machine("Cable Machine", ["Full Body"], ["Core", "Stabilizers"], "Intermediate", ["Set pulley height", "Use smooth cable tension", "Keep posture steady"]),
    machine("Smith Machine", ["Legs", "Chest"], ["Core"], "Intermediate", ["Set safety stops", "Use a controlled path", "Practice unloaded first"])
];

let machines = fallbackMachines;

function machine(name, primaryMuscles, secondaryMuscles, difficulty, tips) {
    return { name, primaryMuscles, secondaryMuscles, difficulty, tips };
}

function renderMachines() {

    const searchText = machineSearch.value.toLowerCase();
    const difficulty = machineDifficulty.value;

    const filtered = machines.filter((item) => {

        const text = [
            item.name,
            ...(item.primaryMuscles || []),
            ...(item.secondaryMuscles || [])
        ].join(" ").toLowerCase();

        const matchesSearch = text.includes(searchText);
        const matchesDifficulty =
            difficulty === "all"
            ||
            item.difficulty === difficulty;

        return matchesSearch && matchesDifficulty;

    });

    machineGrid.innerHTML =
        filtered.length > 0
        ? filtered.map((item) => `
            <article class="machine-card">
                <div class="machine-visual">${item.name}</div>
                <div class="machine-content">
                    <span class="machine-badge">${item.difficulty}</span>
                    <h3>${item.name}</h3>
                    <p><strong>Primary:</strong> ${item.primaryMuscles.join(", ")}</p>
                    <p><strong>Secondary:</strong> ${(item.secondaryMuscles || ["Stabilizers"]).join(", ")}</p>
                    <ul>
                        ${(item.tips || ["Start light", "Adjust the seat", "Move with control"]).map((tip) => `<li>${tip}</li>`).join("")}
                    </ul>
                </div>
            </article>
        `).join("")
        : "<p>No machines match this filter.</p>";
}

function mergeMachines(data) {

    if (!data?.gymMachines?.length) {
        return fallbackMachines;
    }

    const names = new Set(data.gymMachines.map((item) => item.name));

    return [
        ...data.gymMachines.map((item) => ({
            ...item,
            tips: fallbackMachines.find((fallback) => fallback.name === item.name)?.tips
                || ["Adjust the machine to your body", "Use a controlled range", "Start with a manageable weight"]
        })),
        ...fallbackMachines.filter((item) => !names.has(item.name))
    ];
}

machineSearch.addEventListener("input", renderMachines);
machineDifficulty.addEventListener("change", renderMachines);

(async function initMachines() {

    const data =
        window.coreZenDataPromise
        ? await window.coreZenDataPromise
        : null;

    machines = mergeMachines(data);
    renderMachines();

})();
