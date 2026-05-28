const bodyImage = document.getElementById("bodyImage");
const bodyTabs = document.querySelectorAll(".body-tab");
const muscleList = document.getElementById("muscleList");
const muscleDetail = document.getElementById("muscleDetail");

const muscleDescriptions = {
    Chest: "The chest helps with pushing, pressing, and bringing the arms across the body.",
    Biceps: "The biceps bend the elbow and support pulling movements.",
    Quadriceps: "The quadriceps extend the knee and power squats, lunges, and leg presses.",
    Back: "The back supports posture, pulling strength, and shoulder stability.",
    Shoulders: "The shoulders move the arms overhead, outward, and across multiple planes.",
    Core: "The core stabilizes the spine and transfers force between upper and lower body."
};

const fallbackMuscles = [
    { name: "Chest", bodyPart: "Upper Body", relatedExercises: ["Push-Up", "Bench Press"] },
    { name: "Back", bodyPart: "Upper Body", relatedExercises: ["Pull-Up", "Lat Pulldown"] },
    { name: "Shoulders", bodyPart: "Upper Body", relatedExercises: ["Shoulder Press", "Lateral Raise"] },
    { name: "Biceps", bodyPart: "Arms", relatedExercises: ["Dumbbell Curl", "Hammer Curl"] },
    { name: "Quadriceps", bodyPart: "Legs", relatedExercises: ["Squat", "Leg Press"] },
    { name: "Core", bodyPart: "Midsection", relatedExercises: ["Plank", "Dead Bug"] }
];

let muscles = fallbackMuscles;

function showMuscle(muscle) {

    document.querySelectorAll(".muscle-button").forEach((button) => {
        button.classList.toggle("active", button.dataset.muscle === muscle.name);
    });

    const related =
        muscle.relatedExercises && muscle.relatedExercises.length > 0
        ? muscle.relatedExercises.join(", ")
        : "Use controlled strength movements for this area";

    muscleDetail.innerHTML = `
        <span class="detail-label">${muscle.bodyPart}</span>
        <h3>${muscle.name}</h3>
        <p>${muscleDescriptions[muscle.name] || "This muscle supports strength, posture, and controlled movement."}</p>
        <div class="related-list">
            <strong>Related exercises:</strong>
            <span>${related}</span>
        </div>
    `;
}

function renderMuscles() {

    muscleList.innerHTML = "";

    muscles.forEach((muscle, index) => {

        const button = document.createElement("button");
        button.className = "muscle-button";
        button.type = "button";
        button.dataset.muscle = muscle.name;
        button.textContent = muscle.name;
        button.addEventListener("click", () => showMuscle(muscle));

        muscleList.appendChild(button);

        if (index === 0) {
            showMuscle(muscle);
        }

    });
}

bodyTabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        bodyTabs.forEach((item) => item.classList.remove("active"));
        tab.classList.add("active");

        const view = tab.dataset.view;

        bodyImage.src =
            view === "front"
            ? "../images/anatomy/front-body.png"
            : "../images/anatomy/back-body.png";

        bodyImage.alt =
            view === "front"
            ? "Front body anatomy view"
            : "Back body anatomy view";

    });

});

(async function initAnatomy() {

    const data =
        window.coreZenDataPromise
        ? await window.coreZenDataPromise
        : null;

    if (data?.anatomy?.muscles?.length) {
        const names = new Set(data.anatomy.muscles.map((muscle) => muscle.name));
        muscles = [
            ...data.anatomy.muscles,
            ...fallbackMuscles.filter((muscle) => !names.has(muscle.name))
        ];
    }

    renderMuscles();

})();
