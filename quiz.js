// Quiz state management
let currentQuestionIndex = 0;
let userAnswers = {};
let quizStarted = false;

// Initialize quiz
function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = {};
    quizStarted = true;

    showScreen('quiz-screen');
    displayQuestion();
    updateProgress();
}

// Screen management
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Display current question
function displayQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const totalQuestions = quizQuestions.length;

    // Update question counter
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = totalQuestions;

    // Update question text
    document.getElementById('question-text').textContent = question.question;

    // Build answers
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.dataset.value = answer.value;
        answerDiv.dataset.questionId = question.id;
        answerDiv.dataset.type = question.type;

        answerDiv.innerHTML = `
            <span class="icon">${answer.icon}</span>
            <span class="label">${answer.label}</span>
            <span class="description">${answer.description}</span>
        `;

        // Check if this answer was previously selected
        const savedAnswer = userAnswers[question.id];
        if (savedAnswer) {
            if (question.type === 'multiple' && Array.isArray(savedAnswer) && savedAnswer.includes(answer.value)) {
                answerDiv.classList.add('selected');
            } else if (question.type === 'single' && savedAnswer === answer.value) {
                answerDiv.classList.add('selected');
            }
        }

        answerDiv.addEventListener('click', () => selectAnswer(answerDiv, question));
        answersContainer.appendChild(answerDiv);
    });

    // Update navigation buttons
    updateNavigationButtons();
}

// Handle answer selection
function selectAnswer(answerElement, question) {
    const answerValue = answerElement.dataset.value;
    const questionId = question.id;

    if (question.type === 'single') {
        // Single choice: deselect others
        const allAnswers = document.querySelectorAll(`[data-question-id="${questionId}"]`);
        allAnswers.forEach(el => el.classList.remove('selected'));
        answerElement.classList.add('selected');
        userAnswers[questionId] = answerValue;
    } else if (question.type === 'multiple') {
        // Multiple choice: toggle selection
        answerElement.classList.toggle('selected');

        if (!userAnswers[questionId]) {
            userAnswers[questionId] = [];
        }

        if (answerElement.classList.contains('selected')) {
            if (!userAnswers[questionId].includes(answerValue)) {
                userAnswers[questionId].push(answerValue);
            }
        } else {
            userAnswers[questionId] = userAnswers[questionId].filter(v => v !== answerValue);
        }
    }

    updateNavigationButtons();
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const question = quizQuestions[currentQuestionIndex];

    // Enable/disable previous button
    prevBtn.disabled = currentQuestionIndex === 0;

    // Check if current question is answered
    const isAnswered = userAnswers[question.id] &&
        (question.type === 'single' ? userAnswers[question.id] : userAnswers[question.id].length > 0);

    // Enable/disable next button
    nextBtn.disabled = !isAnswered;

    // Change next button text on last question
    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextBtn.textContent = 'See Results';
    } else {
        nextBtn.textContent = 'Next';
    }
}

// Navigate to next question
function nextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        updateProgress();
    } else {
        // Quiz completed - show results
        calculateAndShowResults();
    }
}

// Navigate to previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        updateProgress();
    }
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

// Calculate coffee recommendations
function calculateAndShowResults() {
    const scores = coffeeProducts.map(coffee => {
        let score = 0;

        // Question 1: Primary flavor preference
        const flavorPref = userAnswers[1];
        if (coffee.flavors.includes(flavorPref)) {
            score += 30; // High weight for primary flavor match
        }

        // Question 2: Brewing method
        const brewMethod = userAnswers[2];
        if (coffee.brewMethods.includes(brewMethod)) {
            score += 20; // Brewing method compatibility
        }

        // Question 3: Roast level
        const roastPref = userAnswers[3];
        if (coffee.roast.includes(roastPref)) {
            score += 25; // Roast level preference
        }

        // Question 4: Intensity preference
        const intensityPref = userAnswers[4];
        if (coffee.intensity === intensityPref ||
            (intensityPref === 'bold' && coffee.intensity === 'intense') ||
            (intensityPref === 'delicate' && coffee.intensity === 'bright')) {
            score += 15; // Intensity match
        }

        // Question 5: Secondary flavors (multiple choice)
        const secondaryFlavors = userAnswers[5] || [];
        secondaryFlavors.forEach(flavor => {
            if (coffee.flavors.includes(flavor) ||
                (flavor === 'caramel' && coffee.flavors.includes('nutty')) ||
                (flavor === 'citrus' && coffee.flavors.includes('fruity'))) {
                score += 5; // Bonus for each secondary flavor match
            }
        });

        return {
            coffee,
            score,
            matchPercentage: Math.min(Math.round((score / 100) * 100), 100)
        };
    });

    // Sort by score (highest first) and get top 5 recommendations
    const recommendations = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    displayResults(recommendations);
}

// Display results
function displayResults(recommendations) {
    showScreen('results-screen');

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    recommendations.forEach((recommendation, index) => {
        const coffee = recommendation.coffee;
        const isBestMatch = index === 0;

        const coffeeCard = document.createElement('div');
        coffeeCard.className = 'coffee-recommendation' + (isBestMatch ? ' best-match' : '');

        coffeeCard.innerHTML = `
            ${isBestMatch ? '<span class="match-badge">🏆 Best Match</span>' : ''}
            <h3>${coffee.name}</h3>
            <div class="roast-level">${formatRoastLevel(coffee.roast)} Roast</div>
            <p class="description">${coffee.description}</p>
            <div class="flavor-tags">
                ${coffee.flavors.map(flavor => `<span class="flavor-tag">${formatFlavorTag(flavor)}</span>`).join('')}
            </div>
            <div class="brewing-methods">
                <strong>Best brewed with:</strong>
                <span>${coffee.brewMethods.map(method => formatBrewMethod(method)).join(', ')}</span>
            </div>
            <div class="match-score">Match Score: ${recommendation.matchPercentage}%</div>
        `;

        resultsContainer.appendChild(coffeeCard);
    });
}

// Restart quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    userAnswers = {};
    showScreen('welcome-screen');
}

// Formatting helpers
function formatRoastLevel(roast) {
    return roast.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatFlavorTag(flavor) {
    const flavorMap = {
        'fruity': '🍓 Fruity',
        'chocolatey': '🍫 Chocolatey',
        'nutty': '🥜 Nutty',
        'earthy': '🌿 Earthy',
        'floral': '🌺 Floral',
        'citrus': '🍊 Citrus',
        'caramel': '🍮 Caramel',
        'spicy': '🌶️ Spicy',
        'roasted': '🔥 Roasted',
        'honey': '🍯 Honey',
        'subtle-fruit': '🍑 Subtle Fruit'
    };
    return flavorMap[flavor] || flavor.charAt(0).toUpperCase() + flavor.slice(1);
}

function formatBrewMethod(method) {
    const methodMap = {
        'espresso': 'Espresso',
        'drip': 'Drip Coffee',
        'pour-over': 'Pour Over',
        'french-press': 'French Press',
        'cold-brew': 'Cold Brew',
        'aeropress': 'AeroPress',
        'moka-pot': 'Moka Pot',
        'vietnamese-phin': 'Vietnamese Phin'
    };
    return methodMap[method] || method;
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    // Show welcome screen by default
    showScreen('welcome-screen');
});
