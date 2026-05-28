const dietTabs = document.getElementById("dietTabs");
const dietPanel = document.getElementById("dietPanel");

const fallbackDiet = [
    {
        type: "Vegetarian Protein Sources",
        description: "Plant-forward and dairy-based foods that help you reach daily protein targets.",
        foods: ["Paneer", "Tofu", "Soy Chunks", "Lentils", "Chickpeas", "Greek Yogurt", "Peanuts", "Milk"],
        meals: [
            ["Paneer bowl", "Paneer", "Rice or roti", "Vegetables"],
            ["Lentil plate", "Dal", "Curd", "Salad"],
            ["Tofu stir fry", "Tofu", "Mixed vegetables", "Rice"]
        ]
    },
    {
        type: "Muscle Gain",
        description: "Prioritize protein, enough calories, and consistent meals around training.",
        foods: ["Rice", "Potatoes", "Paneer", "Milk", "Soy Chunks", "Banana", "Nuts"],
        meals: [
            ["Pre-workout", "Banana", "Curd", "Water"],
            ["Post-workout", "Milk", "Paneer sandwich", "Fruit"],
            ["Dinner", "Rice", "Dal", "Vegetables", "Tofu"]
        ]
    },
    {
        type: "Weight Loss",
        description: "Build filling meals with lean protein, vegetables, fiber, and steady hydration.",
        foods: ["Dal", "Sprouts", "Vegetables", "Curd", "Tofu", "Fruit", "Chickpeas"],
        meals: [
            ["Breakfast", "Curd", "Fruit", "Nuts"],
            ["Lunch", "Dal", "Vegetables", "Roti"],
            ["Snack", "Sprouts", "Lemon", "Spices"]
        ]
    }
];

let dietCategories = fallbackDiet;

function mergeDietData(data) {

    if (!data?.dietGuide?.categories) {
        return fallbackDiet;
    }

    return fallbackDiet.map((fallbackCategory) => {

        const jsonCategory =
            data.dietGuide.categories.find((category) =>
                category.type === fallbackCategory.type
            );

        if (!jsonCategory) {
            return fallbackCategory;
        }

        return {
            ...fallbackCategory,
            foods:
                jsonCategory.foods && jsonCategory.foods.length > 0
                ? [...new Set([...jsonCategory.foods, ...fallbackCategory.foods])]
                : fallbackCategory.foods
        };

    });
}

function renderTabs() {

    dietTabs.innerHTML = dietCategories.map((category, index) => `
        <button class="diet-tab ${index === 0 ? "active" : ""}" type="button" data-type="${category.type}">
            ${category.type}
        </button>
    `).join("");

    document.querySelectorAll(".diet-tab").forEach((button) => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".diet-tab").forEach((tab) => tab.classList.remove("active"));
            button.classList.add("active");
            renderPanel(button.dataset.type);

        });

    });
}

function renderPanel(type) {

    const category = dietCategories.find((item) => item.type === type) || dietCategories[0];

    dietPanel.innerHTML = `
        <h2>${category.type}</h2>
        <p>${category.description}</p>

        <div class="food-grid">
            ${category.foods.map((food) => `
                <article class="food-card">
                    <strong>${food}</strong>
                    <p>Useful option for balanced meals and weekly planning.</p>
                </article>
            `).join("")}
        </div>

        <div class="meal-grid">
            ${category.meals.map((meal) => `
                <article class="meal-card">
                    <h3>${meal[0]}</h3>
                    <ul>
                        ${meal.slice(1).map((item) => `<li>${item}</li>`).join("")}
                    </ul>
                </article>
            `).join("")}
        </div>
    `;
}

(async function initDiet() {

    const data =
        window.coreZenDataPromise
        ? await window.coreZenDataPromise
        : null;

    dietCategories = mergeDietData(data);
    renderTabs();
    renderPanel(dietCategories[0].type);

})();
