const plannerForm = document.getElementById("plannerForm");
const goalSelect = document.getElementById("goalSelect");
const levelSelect = document.getElementById("levelSelect");
const daysInput = document.getElementById("daysInput");
const planOutput = document.getElementById("planOutput");

const planLibrary = {
    strength: ["Squat pattern", "Bench or push-up", "Row or pull-up", "Hip hinge", "Core brace"],
    muscle: ["Chest and triceps", "Back and biceps", "Legs", "Shoulders", "Core finisher"],
    fatloss: ["Full-body circuit", "Incline walk", "Bodyweight intervals", "Mobility reset", "Core circuit"],
    mobility: ["Yoga flow", "Hip mobility", "Thoracic rotation", "Hamstring mobility", "Breathing reset"]
};

const levelNotes = {
    beginner: "Use controlled sets, leave two reps in reserve, and learn the movement first.",
    intermediate: "Add progressive overload and track performance week to week.",
    advanced: "Rotate intensity and recovery so hard sessions stay productive."
};

function buildPlan(goal, level, days) {

    const exercises = planLibrary[goal];
    const planDays = [];

    for (let index = 0; index < days; index += 1) {

        const focus = exercises[index % exercises.length];
        const secondary = exercises[(index + 2) % exercises.length];

        planDays.push({
            title: `Day ${index + 1}`,
            focus,
            items: [
                `${focus}: 3-4 controlled sets`,
                `${secondary}: 2-3 support sets`,
                "Warm up for 8-10 minutes",
                "Cool down with stretching or breathing"
            ]
        });

    }

    return planDays;
}

function renderPlan() {

    const goal = goalSelect.value;
    const level = levelSelect.value;
    const days = Math.min(6, Math.max(2, Number(daysInput.value) || 4));

    daysInput.value = days;

    const planDays = buildPlan(goal, level, days);
    const goalLabel = goalSelect.options[goalSelect.selectedIndex].textContent;
    const levelLabel = levelSelect.options[levelSelect.selectedIndex].textContent;

    planOutput.innerHTML = `
        <h2>${goalLabel} Plan</h2>
        <p>${levelLabel} routine for ${days} days per week. ${levelNotes[level]}</p>

        <div class="plan-days">
            ${planDays.map((day) => `
                <article class="plan-day">
                    <h3>${day.title}: ${day.focus}</h3>
                    <ul>
                        ${day.items.map((item) => `<li>${item}</li>`).join("")}
                    </ul>
                </article>
            `).join("")}
        </div>
    `;
}

plannerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderPlan();
});

renderPlan();
