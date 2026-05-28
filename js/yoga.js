const yogaGrid = document.getElementById("yogaGrid");
const yogaFilters = document.querySelectorAll(".yoga-filter");

const fallbackYoga = [
    {
        category: "Beginner",
        poses: [
            pose("Tadasana", "Mountain Pose", "Beginner", ["Improves posture", "Builds balance"]),
            pose("Balasana", "Child's Pose", "Beginner", ["Relaxes the back", "Calms breathing"])
        ]
    },
    {
        category: "Flexibility",
        poses: [
            pose("Paschimottanasana", "Seated Forward Bend", "Beginner", ["Stretches hamstrings", "Releases lower back"]),
            pose("Anjaneyasana", "Low Lunge", "Intermediate", ["Opens hip flexors", "Improves mobility"])
        ]
    },
    {
        category: "Strength",
        poses: [
            pose("Phalakasana", "Plank Pose", "Beginner", ["Strengthens core", "Builds shoulder endurance"]),
            pose("Utkatasana", "Chair Pose", "Intermediate", ["Strengthens legs", "Improves control"])
        ]
    },
    {
        category: "Balance",
        poses: [
            pose("Vrksasana", "Tree Pose", "Beginner", ["Improves balance", "Strengthens ankles"]),
            pose("Virabhadrasana III", "Warrior III", "Advanced", ["Builds stability", "Strengthens posterior chain"])
        ]
    },
    {
        category: "Breathing",
        poses: [
            pose("Nadi Shodhana", "Alternate Nostril Breathing", "Beginner", ["Supports focus", "Slows breathing"]),
            pose("Box Breathing", "Four Count Breath", "Beginner", ["Calms the nervous system", "Improves breath control"])
        ]
    }
];

let yogaItems = [];

function pose(name, englishName, difficulty, benefits) {
    return { name, englishName, difficulty, benefits };
}

function flattenYoga(categories) {

    return categories.flatMap((category) =>
        (category.poses || []).map((item) => ({
            ...item,
            category: category.category
        }))
    );
}

function renderYoga(category = "all") {

    const filtered =
        category === "all"
        ? yogaItems
        : yogaItems.filter((item) => item.category === category);

    yogaGrid.innerHTML =
        filtered.map((item) => `
            <article class="yoga-card">
                <div class="yoga-card-visual">${item.englishName}</div>
                <div class="yoga-card-content">
                    <span>${item.category} • ${item.difficulty}</span>
                    <h3>${item.name}</h3>
                    <p>${item.englishName}</p>
                    <ul>
                        ${(item.benefits || []).map((benefit) => `<li>${benefit}</li>`).join("")}
                    </ul>
                </div>
            </article>
        `).join("");
}

yogaFilters.forEach((button) => {

    button.addEventListener("click", () => {

        yogaFilters.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        renderYoga(button.dataset.category);

    });

});

(async function initYoga() {

    const data =
        window.coreZenDataPromise
        ? await window.coreZenDataPromise
        : null;

    const mergedCategories = fallbackYoga.map((fallbackCategory) => {

        const jsonCategory =
            data?.yogaCategories?.find((category) =>
                category.category === fallbackCategory.category
            );

        if (jsonCategory?.poses?.length) {
            const names = new Set(jsonCategory.poses.map((item) => item.name));

            return {
                category: fallbackCategory.category,
                poses: [
                    ...jsonCategory.poses,
                    ...fallbackCategory.poses.filter((item) => !names.has(item.name))
                ]
            };
        }

        return fallbackCategory;

    });

    yogaItems = flattenYoga(mergedCategories);
    renderYoga();

})();
