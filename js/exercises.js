/* =========================
   COREZEN EXERCISES
========================= */

const muscleCards = document.querySelectorAll(".muscle-card");
const exerciseGrid = document.getElementById("exerciseGrid");
const selectedMuscleTitle = document.getElementById("selectedMuscleTitle");
const selectedMuscleDescription = document.getElementById("selectedMuscleDescription");
const searchInput = document.getElementById("exerciseSearch");
const difficultyFilter = document.getElementById("difficultyFilter");
const modal = document.getElementById("exerciseModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

let coreZenData = {};
let currentExercises = [];
let currentMuscle = "";

const fallbackExerciseCategories = [
    {
        name: "Shoulders",
        exercises: [
            createExercise("Shoulder Press", "Beginner", "Dumbbells", ["Shoulders"], ["Triceps"], "Press weights overhead with control while keeping the ribs down."),
            createExercise("Lateral Raise", "Beginner", "Dumbbells", ["Side Delts"], ["Traps"], "Raise arms to shoulder height with soft elbows and steady posture."),
            createExercise("Face Pull", "Intermediate", "Cable or Band", ["Rear Delts"], ["Upper Back"], "Pull toward the face while squeezing the shoulder blades together.")
        ]
    },
    {
        name: "Biceps",
        exercises: [
            createExercise("Dumbbell Curl", "Beginner", "Dumbbells", ["Biceps"], ["Forearms"], "Curl without swinging and lower slowly."),
            createExercise("Hammer Curl", "Beginner", "Dumbbells", ["Biceps"], ["Brachialis", "Forearms"], "Use a neutral grip to train the upper arm and forearm together."),
            createExercise("Concentration Curl", "Intermediate", "Dumbbell", ["Biceps"], ["Forearms"], "Brace the arm against the thigh and curl through a full range.")
        ]
    },
    {
        name: "Triceps",
        exercises: [
            createExercise("Triceps Pushdown", "Beginner", "Cable Machine", ["Triceps"], ["Shoulders"], "Keep elbows pinned and extend the arms fully."),
            createExercise("Overhead Triceps Extension", "Beginner", "Dumbbell", ["Triceps"], ["Core"], "Lower the weight behind the head and extend without flaring elbows."),
            createExercise("Bench Dip", "Intermediate", "Bench", ["Triceps"], ["Chest", "Shoulders"], "Keep shoulders down and move through a comfortable range.")
        ]
    },
    {
        name: "Legs",
        exercises: [
            createExercise("Bodyweight Squat", "Beginner", "None", ["Quadriceps", "Glutes"], ["Hamstrings", "Core"], "Sit hips back, keep chest tall, and drive through the feet."),
            createExercise("Reverse Lunge", "Beginner", "None", ["Quadriceps", "Glutes"], ["Hamstrings", "Core"], "Step back under control and keep the front knee stable."),
            createExercise("Romanian Deadlift", "Intermediate", "Dumbbells", ["Hamstrings", "Glutes"], ["Lower Back"], "Hinge at the hips with a neutral spine and soft knees.")
        ]
    },
    {
        name: "Core",
        exercises: [
            createExercise("Plank", "Beginner", "None", ["Core"], ["Shoulders", "Glutes"], "Hold a straight line from head to heels while breathing steadily."),
            createExercise("Dead Bug", "Beginner", "None", ["Core"], ["Hip Flexors"], "Move opposite arm and leg while keeping the lower back controlled."),
            createExercise("Mountain Climber", "Intermediate", "None", ["Core"], ["Shoulders", "Hip Flexors"], "Drive knees forward from a strong plank position.")
        ]
    },
    {
        name: "Full Body",
        exercises: [
            createExercise("Burpee", "Intermediate", "None", ["Full Body"], ["Core", "Shoulders"], "Move from squat to plank and back with controlled rhythm."),
            createExercise("Kettlebell Swing", "Intermediate", "Kettlebell", ["Glutes", "Hamstrings"], ["Core", "Back"], "Use a hip snap, not an arm raise, to move the weight."),
            createExercise("Thruster", "Advanced", "Dumbbells", ["Legs", "Shoulders"], ["Core", "Triceps"], "Combine a front squat with an overhead press in one smooth movement.")
        ]
    }
];

function createExercise(name, difficulty, equipment, primaryMuscles, secondaryMuscles, overview) {

    return {
        name,
        difficulty,
        equipment,
        primaryMuscles,
        secondaryMuscles,
        overview,
        steps: [
            "Set your starting position and brace your core.",
            overview,
            "Return to the starting position with control.",
            "Repeat with steady breathing and clean form."
        ],
        benefits: [
            "Builds practical strength",
            "Improves movement control",
            "Supports balanced training"
        ],
        mistakes: [
            "Using momentum instead of control",
            "Rushing through the range of motion",
            "Ignoring posture and breathing"
        ],
        tips: [
            "Start light and prioritize technique",
            "Stop if a movement causes sharp pain",
            "Increase difficulty gradually"
        ]
    };
}

async function loadExerciseData() {

    try {

        coreZenData =
            window.coreZenDataPromise
            ? await window.coreZenDataPromise
            : null;

        if (!coreZenData) {
            const response = await fetch("../data.json");

            if (!response.ok) {
                throw new Error("Failed to load data.json");
            }

            coreZenData = await response.json();
        }

    }

    catch (error) {

        coreZenData = {
            exerciseCategories: fallbackExerciseCategories
        };

    }
}

function getMuscleData(muscleName) {

    const dataCategory =
        coreZenData.exerciseCategories
        ?.find((category) =>
            category.name.toLowerCase() === muscleName.toLowerCase()
        );

    const fallbackCategory =
        fallbackExerciseCategories.find((category) =>
            category.name.toLowerCase() === muscleName.toLowerCase()
        );

    if (!dataCategory) {
        return fallbackCategory;
    }

    if (!dataCategory.exercises || dataCategory.exercises.length === 0) {
        return {
            ...dataCategory,
            exercises: fallbackCategory?.exercises || []
        };
    }

    return dataCategory;
}

async function loadMuscleExercises(muscleName) {

    if (!coreZenData.exerciseCategories) {
        await loadExerciseData();
    }

    const muscleData = getMuscleData(muscleName);

    if (!muscleData) {
        exerciseGrid.innerHTML = "<p>No exercises found.</p>";
        return;
    }

    currentMuscle = muscleData.name;
    currentExercises = muscleData.exercises || [];

    selectedMuscleTitle.textContent = muscleData.name;
    selectedMuscleDescription.textContent =
        `Explore ${muscleData.name} exercises and training techniques.`;

    filterExercises();

    document.querySelector(".exercise-display").scrollIntoView({
        behavior: "smooth"
    });
}

function renderExerciseMedia(exercise) {

    const folderName = currentMuscle.toLowerCase().replace(/\s+/g, "");

    if (exercise.video) {
        return `
            <video class="exercise-video" autoplay muted loop playsinline preload="metadata">
                <source src="../images/exercises/${folderName}/${exercise.video}" type="video/mp4">
            </video>
        `;
    }

    if (exercise.image) {
        return `
            <img src="../images/exercises/${folderName}/${exercise.image}" alt="${exercise.name}">
        `;
    }

    return `
        <div class="exercise-media-fallback">
            <span>${exercise.name}</span>
        </div>
    `;
}

function renderExercises(exercises) {

    exerciseGrid.innerHTML = "";

    if (exercises.length === 0) {
        exerciseGrid.innerHTML = "<p>No exercises available for this filter.</p>";
        return;
    }

    exercises.forEach((exercise) => {

        const difficultyClass = exercise.difficulty.toLowerCase();
        const card = document.createElement("div");

        card.classList.add("exercise-card");

        card.innerHTML = `
            ${renderExerciseMedia(exercise)}

            <div class="exercise-card-content">
                <span class="exercise-badge ${difficultyClass}">
                    ${exercise.difficulty}
                </span>

                <h3>${exercise.name}</h3>

                <div class="exercise-stats">
                    <div class="exercise-stat">
                        <strong>Primary:</strong> ${exercise.primaryMuscles.join(", ")}
                    </div>

                    <div class="exercise-stat">
                        <strong>Equipment:</strong> ${exercise.equipment}
                    </div>
                </div>

                <button class="view-details-btn" data-name="${exercise.name}">
                    View Details
                </button>
            </div>
        `;

        exerciseGrid.appendChild(card);

        card.querySelector(".view-details-btn").addEventListener("click", function () {
            openExerciseModal(this.dataset.name);
        });

    });
}

function filterExercises() {

    const searchText = searchInput.value.toLowerCase();
    const difficulty = difficultyFilter.value;

    const filtered = currentExercises.filter((exercise) => {

        const searchableText = [
            exercise.name,
            exercise.equipment,
            ...(exercise.primaryMuscles || []),
            ...(exercise.secondaryMuscles || [])
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchText);
        const matchesDifficulty =
            difficulty === "all"
            ||
            exercise.difficulty === difficulty;

        return matchesSearch && matchesDifficulty;

    });

    renderExercises(filtered);
}

function renderList(items, fallback) {

    const listItems =
        items && items.length > 0
        ? items
        : fallback;

    return listItems.map((item) => `<li>${item}</li>`).join("");
}

function openExerciseModal(exerciseName) {

    const exercise = currentExercises.find((item) => item.name === exerciseName);

    if (!exercise) return;

    modal.style.display = "flex";

    modalBody.innerHTML = `
        ${renderExerciseMedia(exercise).replace("exercise-video", "modal-video")}

        <h2 class="modal-title">${exercise.name}</h2>

        <div class="modal-section">
            <h3>Overview</h3>
            <p><strong>Difficulty:</strong> ${exercise.difficulty}</p>
            <p><strong>Equipment:</strong> ${exercise.equipment}</p>
            ${exercise.overview ? `<p>${exercise.overview}</p>` : ""}
        </div>

        <div class="modal-section">
            <h3>Muscles Worked</h3>
            <p><strong>Primary:</strong> ${exercise.primaryMuscles.join(", ")}</p>
            <p><strong>Secondary:</strong> ${(exercise.secondaryMuscles || ["Stabilizers"]).join(", ")}</p>
        </div>

        <div class="modal-section">
            <h3>How To Do It</h3>
            <ol>${renderList(exercise.steps, ["Move slowly with proper posture.", "Keep tension on the target muscles.", "Return with control."])}</ol>
        </div>

        <div class="modal-section">
            <h3>Benefits</h3>
            <ul>${renderList(exercise.benefits, ["Builds strength", "Improves control", "Supports long-term fitness"])}</ul>
        </div>

        <div class="modal-section">
            <h3>Common Mistakes</h3>
            <ul>${renderList(exercise.mistakes, ["Using too much momentum", "Rushing repetitions", "Losing posture"])}</ul>
        </div>

        <div class="modal-section">
            <h3>Tips</h3>
            <ul>${renderList(exercise.tips, ["Control every repetition", "Use a comfortable range", "Progress gradually"])}</ul>
        </div>
    `;

    document.body.style.overflow = "hidden";
}

function closeExerciseModal() {

    modal.style.display = "none";
    document.body.style.overflow = "auto";

}

muscleCards.forEach((card) => {

    card.addEventListener("click", () => {
        loadMuscleExercises(card.dataset.muscle);
    });

});

searchInput.addEventListener("input", filterExercises);
difficultyFilter.addEventListener("change", filterExercises);
closeModal.addEventListener("click", closeExerciseModal);

window.addEventListener("click", (event) => {

    if (event.target === modal) {
        closeExerciseModal();
    }

});

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && modal.style.display === "flex") {
        closeExerciseModal();
    }

});

loadExerciseData();
