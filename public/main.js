const maincontent = document.getElementById("main-content");
const workouts = document.getElementById("workouts");
const workoutPlanContainer = document.getElementById("workoutPlanContainer");
const addExerciseModal = document.getElementById("addExerciseModal");
const exerciseListContainer = document.getElementById("exerciseListContainer");

function showLoginPopup() {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('registerPopup').style.display = 'none';
};

function showRegisterPopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('registerPopup').style.display = 'block';
};

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://fittracker-lc3q.onrender.com/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        console.log('Login Result:', result);

        if (response.ok && result.success) {
            const userId = result.user.user_id;
            localStorage.setItem('loggedInUserId', userId);

            document.getElementById('overlay').style.display = 'none';
        }

        alert(result.message);
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please check the console for details.');
    }
}

async function register() {
    const registerUsername = document.getElementById('registerUsername').value;
    const registerPassword = document.getElementById('registerPassword').value;

    if (!registerUsername || !registerPassword) {
        alert('Registration unsuccessful. Please Try Again.');
        return;
    }

    try {
        const response = await fetch('https://fittracker-lc3q.onrender.com/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: registerUsername, password: registerPassword })
        });

        if (response.ok) {
            const result = await response.json();
            alert('Registration successful. Please log in.');
            showLoginPopup();
        } else {
            const result = await response.json();
            alert(result.message);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again.');
    }
}

// Function to create a workout plan
async function createWorkoutPlan(event) {
    event.preventDefault();
    const planName = document.getElementById('planName').value;
    const description = document.getElementById('description').value;

    try {
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        console.log(loggedInUserId);

        const response = await fetch('https://fittracker-lc3q.onrender.com/api/workout-plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: loggedInUserId, plan_name: planName, description }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('New Workout Plan:', result);
            fetchAndDisplayWorkoutPlans();
        } else {
            const result = await response.json();
            console.error(result.message);
        }
    } catch (error) {
        console.error(error);
    }
}

async function fetchAndDisplayWorkoutPlans() {
    try {
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        console.log(loggedInUserId);

        const response = await fetch(`https://fittracker-lc3q.onrender.com/api/workout-plans/${loggedInUserId}`);
        
        if (response.ok) {
            const workoutPlans = await response.json();
            console.log(workoutPlans);

            const workoutPlansContainer = document.getElementById('workoutPlanContainer');
            workoutPlansContainer.innerHTML = '';

            workoutPlans.forEach(plan => {
                const planElement = document.createElement('div');
                planElement.classList.add('workout-box');
                planElement.innerHTML = `
                    <p><strong>Plan Name:</strong> ${plan.plan_name}</p>
                    <p><strong>Description:</strong> ${plan.description}</p>
                    <button class="delete-button" onclick="deleteWorkoutPlan(${plan.plan_id})">X</button>
                    <button class="add-exercise-button" onclick="openAddExercise(${plan.plan_id})">+</button>
                    <button class="view" onclick="viewExercises(${plan.plan_id})">View</button>
                `;
                workoutPlansContainer.appendChild(planElement);
            });
        } else {
            const result = await response.json();
            console.error(result.message);
        }
    } catch (error) {
        console.error(error);
    }
}

async function deleteWorkoutPlan(planId) {
    try {
        const response = await fetch(`https://fittracker-lc3q.onrender.com/api/workout-plans/${planId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log(`Workout plan with ID ${planId} deleted successfully.`);
            fetchAndDisplayWorkoutPlans();
        } else {
            const result = await response.json();
            fetchAndDisplayWorkoutPlans();
            console.error(result.message);
        }
    } catch (error) {
        console.error(error);
    }
}

let currentPlanID;

function openAddExercise(planId) {
    currentPlanID = planId
    const modal = document.getElementById('addExerciseModal');
    modal.style.display = 'block';
}

function closeAddExerciseModal() {
    const modal = document.getElementById('addExerciseModal');
    modal.style.display = 'none';
}

async function addExerciseToPlan() {
    const planId = currentPlanID;
    const exerciseName = document.getElementById('exerciseName').value;
    const sets = document.getElementById('sets').value;
    const repetitions = document.getElementById('repetitions').value;
    const notes = document.getElementById('notes').value;

    try {
        const response = await fetch(`https://fittracker-lc3q.onrender.com/api/exercises/${planId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exercise_name: exerciseName, sets, repetitions, notes }),
        });

        if (response.ok) {
            alert('Exercise added to workout plan');
            fetchAndDisplayWorkoutPlans();
        } else {
            const result = await response.json();
            console.error(result.message);
        }
    } catch (error) {
        console.error(error);
    }
}

async function viewExercises(planId) {
    try {
        const response = await fetch(`https://fittracker-lc3q.onrender.com/api/exercises/${planId}`);
        
        if (response.ok) {
            const exercises = await response.json();
            displayExercises(exercises);
        } else {
            const result = await response.json();
            console.error(result.message);
        }
    } catch (error) {
        console.error(error);
    }
}

function displayExercises(exercises) {
    const exerciseListContainer = document.getElementById('exerciseListContainer');
    exerciseListContainer.innerHTML = '';
    workoutPlanContainer.style.display = "none";
    workouts.style.display = "none";

    if (exercises.length === 0) {
        exerciseListContainer.innerHTML = '<p>No exercises available for this workout plan.</p>';
        return;
    }
    exercises.forEach(exercise => {
        const exerciseElement = document.createElement('div');
        exerciseElement.classList.add('workout-box');
        exerciseElement.innerHTML = `
            <p><strong>Exercise Name:</strong> ${exercise.exercise_name}</p>
            <p><strong>Sets:</strong> ${exercise.sets}</p>
            <p><strong>Repetitions:</strong> ${exercise.repetitions}</p>
            <p><strong>Notes:</strong> ${exercise.notes}</p>
        `;
        exerciseListContainer.appendChild(exerciseElement);
    });
}

function mainpage() {
    workoutPlanContainer.style.display = "none";
    workouts.style.display = "none";
    maincontent.style.display = "block";
}

const back = document.getElementsByClassName('back');
function goBack(){
    if (maincontent.style.display = "block") {
        back.style.display="none";
    } else if (workoutPlanContainer.style.display === "flex" || workouts.style.display === "flex" || addExerciseModal.style.display === "flex" || exerciseListContainer.style.display === "flex") {
        workoutPlanContainer.style.display === "none";
        workouts.style.display === "none";
        addExerciseModal.style.display === "none";
        exerciseListContainer.style.display === "none";
        maincontent.style.display === "block";
    }
}


const getStarted = document.getElementById("GetStarted")

getStarted.addEventListener('click', function () {
    maincontent.style.display = "none";
    workouts.style.display = "flex"
});



