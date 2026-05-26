/* =========================
   COREZEN EXERCISES
========================= */

const muscleCards =
    document.querySelectorAll(".muscle-card");

const exerciseGrid =
    document.getElementById("exerciseGrid");

const selectedMuscleTitle =
    document.getElementById(
        "selectedMuscleTitle"
    );

const selectedMuscleDescription =
    document.getElementById(
        "selectedMuscleDescription"
    );

const searchInput =
    document.getElementById(
        "exerciseSearch"
    );

const difficultyFilter =
    document.getElementById(
        "difficultyFilter"
    );

const modal =
    document.getElementById(
        "exerciseModal"
    );

const modalBody =
    document.getElementById(
        "modalBody"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

/* =========================
   GLOBAL VARIABLES
========================= */

let coreZenData = {};

let currentExercises = [];

/* =========================
   LOAD JSON DATA
========================= */

async function loadExerciseData() {

    try {

        const response =
            await fetch("../data.json");

        if (!response.ok) {

            throw new Error(
                "Failed to load data.json"
            );
        }

        coreZenData =
            await response.json();

        console.log(
            "Exercise Data Loaded",
            coreZenData
        );

    }

    catch (error) {

        console.error(
            "Error loading JSON:",
            error
        );

        exerciseGrid.innerHTML = `
            <p>
                Failed to load exercise data.
            </p>
        `;
    }
}

loadExerciseData();

/* =========================
   MUSCLE CARD CLICK
========================= */

/* =========================
   MUSCLE CARD CLICK
========================= */

muscleCards.forEach((card) => {

    card.addEventListener("click", async () => {

        /* Wait until JSON loads */

        if (
            !coreZenData.exerciseCategories
        ) {

            await loadExerciseData();
        }

        const selectedMuscle =
            card.dataset.muscle;

        loadMuscleExercises(
            selectedMuscle
        );

    });

});

/* =========================
   LOAD EXERCISES
========================= */

function loadMuscleExercises(
    muscleName
) {

    const muscleData =
        coreZenData.exerciseCategories
        ?.find(category =>

            category.name.toLowerCase()
            ===
            muscleName.toLowerCase()

        );

    if (!muscleData) {

        exerciseGrid.innerHTML = `
            <p>
                No exercises found.
            </p>
        `;

        return;
    }

    currentExercises =
    muscleData.exercises;

selectedMuscleTitle.textContent =
    muscleData.name;

selectedMuscleDescription.textContent =
    `Explore ${muscleData.name}
    exercises and training techniques.`;

/* KEEP CURRENT FILTERS */

filterExercises();

    /* Scroll to section */

    document.querySelector(
        ".exercise-display"
    ).scrollIntoView({
        behavior: "smooth"
    });

}

/* =========================
   RENDER EXERCISES
========================= */

function renderExercises(
    exercises
) {

    exerciseGrid.innerHTML = "";

    if (exercises.length === 0) {

        exerciseGrid.innerHTML = `
            <p>
                No exercises available yet.
            </p>
        `;

        return;
    }

    exercises.forEach(
        (exercise) => {

        const difficultyClass =
            exercise.difficulty
            .toLowerCase();

        const card =
            document.createElement("div");

        card.classList.add(
            "exercise-card"
        );

        card.innerHTML = `

            <video
                class="exercise-video"
                autoplay
                muted
                loop
                playsinline
                preload="metadata"
            >

                <source
                    src="../images/exercises/${selectedMuscleTitle.textContent.toLowerCase()}/${exercise.video}"
                    type="video/mp4"
                >

            </video>

            <div class="exercise-card-content">

                <span class="exercise-badge ${difficultyClass}">
                    ${exercise.difficulty}
                </span>

                <h3>
                    ${exercise.name}
                </h3>

                <div class="exercise-stats">

                    <div class="exercise-stat">
                        💪 Primary:
                        ${exercise.primaryMuscles.join(", ")}
                    </div>

                    <div class="exercise-stat">
                        ⚙️ Equipment:
                        ${exercise.equipment}
                    </div>

                </div>

                <button
                    class="view-details-btn"
                    data-name="${exercise.name}"
                >
                    View Details
                </button>

            </div>
        `;

        exerciseGrid.appendChild(
            card
        );

        card
        .querySelector(
            ".view-details-btn"
        )
        .addEventListener(
            "click",
            function () {

                openExerciseModal(
                    this.dataset.name
                );

            }
        );

    });

}

/* =========================
   SEARCH FUNCTIONALITY
========================= */

searchInput.addEventListener(
    "input",
    filterExercises
);

difficultyFilter.addEventListener(
    "change",
    filterExercises
);

function filterExercises() {

    const searchText =
        searchInput.value
        .toLowerCase();

    const difficulty =
        difficultyFilter.value;

    const filtered =
        currentExercises.filter(
            (exercise) => {

            const matchesSearch =

                exercise.name
                .toLowerCase()
                .includes(searchText);

            const matchesDifficulty =

                difficulty === "all"
                ||

                exercise.difficulty
                === difficulty;

            return (
                matchesSearch
                &&
                matchesDifficulty
            );

        });

    renderExercises(filtered);

}

/* =========================
   OPEN MODAL
========================= */

function openExerciseModal(
    exerciseName
) {

    const exercise =
        currentExercises.find(

            item =>
            item.name === exerciseName

        );

    if (!exercise) return;

    modal.style.display =
        "flex";

    modalBody.innerHTML = `

        <video
    class="modal-video"
    autoplay
    muted
    loop
    controls
    playsinline
>

    <source
        src="../images/exercises/${selectedMuscleTitle.textContent.toLowerCase()}/${exercise.video}"
        type="video/mp4"
    >

</video>

        <h2 class="modal-title">
            ${exercise.name}
        </h2>

        <div class="modal-section">

            <h3>
                Overview
            </h3>

            <p>
                <strong>
                    Difficulty:
                </strong>

                ${exercise.difficulty}
            </p>

            <p>
                <strong>
                    Equipment:
                </strong>

                ${exercise.equipment}
            </p>

        </div>

        <div class="modal-section">

            <h3>
                Muscles Worked
            </h3>

            <p>
                <strong>
                    Primary:
                </strong>

                ${exercise.primaryMuscles.join(", ")}
            </p>

            <p>
                <strong>
                    Secondary:
                </strong>

                ${exercise.secondaryMuscles.join(", ")}
            </p>

        </div>

        <div class="modal-section">

            

    <h3>
        How To Do It
    </h3>

    <ol>

        ${
            exercise.steps
            ? exercise.steps
                .map(
                    step =>
                    `<li>${step}</li>`
                )
                .join("")
            : `
                <li>
                    Steps coming soon
                </li>
            `
        }

    </ol>

    </div>

    <div class="modal-section">

    <h3>

                Benefits
            </h3>

            



            <ul>

                ${
    exercise.benefits
    ? exercise.benefits
        .map(
            benefit =>
            `<li>${benefit}</li>`
        )
        .join("")
    : `
        <li>
            Benefits coming soon
        </li>
    `
}

            </ul>

        </div>

        <div class="modal-section">

            <h3>
                Common Mistakes
            </h3>

            <ul>

                ${
    exercise.mistakes
    ? exercise.mistakes
        .map(
            mistake =>
            `<li>${mistake}</li>`
        )
        .join("")
    : `
        <li>
            Mistakes coming soon
        </li>
    `
}

            </ul>

            </div>

            <div class="modal-section">

    <h3>
        Tips
    </h3>

    <ul>

        ${
            exercise.tips
            ? exercise.tips
                .map(
                    tip =>
                    `<li>${tip}</li>`
                )
                .join("")
            : `
                <li>
                    Tips coming soon
                </li>
            `
        }

    </ul>

</div>

        

    `;

    document.body.style
        .overflow = "hidden";

}

/* =========================
   CLOSE MODAL
========================= */

closeModal.addEventListener(
    "click",
    closeExerciseModal
);

function closeExerciseModal() {

    modal.style.display =
        "none";

    document.body.style
        .overflow = "auto";

}

/* Close when clicking outside */

window.addEventListener(
    "click",
    (event) => {

    if (
        event.target === modal
    ) {

        closeExerciseModal();

    }

});

/* =========================
   ESC KEY CLOSE
========================= */

document.addEventListener(
    "keydown",
    (event) => {

    if (
        event.key === "Escape"
        &&
        modal.style.display
        === "flex"
    ) {

        closeExerciseModal();

    }

});