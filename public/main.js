// Variables to store references to HTML elements
const maincontent = document.getElementById("main-content");
const workouts = document.getElementById("workouts");
const workoutPlanContainer = document.getElementById("workoutPlanContainer");
const addExerciseModal = document.getElementById("addExerciseModal");
const exerciseListContainer = document.getElementById("exerciseListContainer");
const back = document.getElementsByClassName('back')[0];

// Function to show the login popup
function showLoginPopup() {
    // Display the login popup and hide the register popup
    document.getElementById('popup').style.display = 'block';
    document.getElementById('registerPopup').style.display = 'none';
}

// Function to show the register popup
function showRegisterPopup() {
    // Display the register popup and hide the login popup
    document.getElementById('popup').style.display = 'none';
    document.getElementById('registerPopup').style.display = 'block';
}

// Function to handle the login process
async function login() {
    // Get username and password from input fields
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Make a POST request to the login API endpoint
        const response = await fetch('https://fittracker-lc3q.onrender.com/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        // Parse the response JSON
        const result = await response.json();

        // Log the result to the console
        console.log('Login Result:', result);

        // If login is successful, store the user ID in local storage and hide the overlay
        if (response.ok && result.success) {
            const userId = result.user.user_id;
            localStorage.setItem('loggedInUserId', userId);
            document.getElementById('overlay').style.display = 'none';
        }

        // Display an alert with the login result message
        alert(result.message);
    } catch (error) {
        // Handle and log any errors
        console.error(error);
        alert('An error occurred. Please check the console for details.');
    }
}

// Function to handle user registration
async function register() {
    // Get registration username and password from input fields
    const registerUsername = document.getElementById('registerUsername').value;
    const registerPassword = document.getElementById('registerPassword').value;

    // Check if username and password are provided
    if (!registerUsername || !registerPassword) {
        alert('Registration unsuccessful. Please Try Again.');
        return;
    }

    try {
        // Make a POST request to the registration API endpoint
        const response = await fetch('https://fittracker-lc3q.onrender.com/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: registerUsername, password: registerPassword })
        });

        // If registration is successful, display an alert and show the login popup
        if (response.ok) {
            const result = await response.json();
            alert('Registration successful. Please log in.');
            showLoginPopup();
        } else {
            // If registration fails, display an alert with the error message
            const result = await response.json();
            alert(result.message);
        }
    } catch (error) {
        // Handle and log any errors
        console.error(error);
        alert('An error occurred. Please try again.');
    }
}

// Function to create a workout plan
async function createWorkoutPlan(event) {
    // Prevent the default form submission
    event.preventDefault();
    
    // Get plan name and description from input fields
    const planName = document.getElementById('planName').value;
    const description = document.getElementById('description').value;

    try {
        // Get the logged-in user's ID from local storage
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        console.log(loggedInUserId);

        // Make a POST request to create a new workout plan
        const response = await fetch('https://fittracker-lc3q.onrender.com/api/workout-plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: loggedInUserId, plan_name: planName, description }),
        });

        // If the request is successful, log the result and fetch/display updated workout plans
        if (response.ok) {
            const result = await response.json();
            console.log('New Workout Plan:', result);
            fetchAndDisplayWorkoutPlans();
        } else {
            // If the request fails, log the error message
            const result = await response.json();
            console.error(result.message);
        }
    } catch (error) {
        // Handle and log any errors
        console.error(error);
    }
}

// Function to fetch and display workout plans
async function fetchAndDisplayWorkoutPlans() {
    try {
        // Get the logged-in user's ID from local storage
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        console.log(loggedInUserId);

        // Make a GET request to fetch workout plans for the logged-in user
        const response = await fetch(`https://fittracker-lc3q.onrender.com/api/workout-plans/${loggedInUserId}`);
        
        // If the request is successful, parse the response JSON and update the UI
        if (response.ok) {
            const workoutPlans = await response.json();
            console.log(workoutPlans);

            const workoutPlansContainer = document.getElementById('workoutPlanContainer');
            workoutPlansContainer.innerHTML = '';

            // Create HTML elements for each workout plan and append them to the container
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
            // If the request fails, log the error message
            const result = await response.json();
            console.error(result.message);
        }
    } catch (error) {
        // Handle and log any errors
        console.error(error);
    }
}

// Function to delete a workout plan
async function deleteWorkoutPlan(planId) {
    try {
        // Make a DELETE request to delete the specified workout plan
        const response = await fetch(`https://fittracker-lc3q.onrender.com/api/workout-plans/${planId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // If the request is successful, log a message and fetch/display updated workout plans
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

// Variable to store the current workout plan ID
let currentPlanID;

// Function to open the add exercise modal and store the current workout plan ID
function openAddExercise(planId) {
    currentPlanID = planId;
    const modal = document.getElementById('addExerciseModal');
    modal.style.display = 'block';
}

// Function to close the add exercise modal
function closeAddExerciseModal() {
    const modal = document.getElementById('addExerciseModal');
    modal.style.display = 'none';
}

// Function to add an exercise to a workout plan
async function addExerciseToPlan() {
    // Get input values and the current workout plan ID
    const planId = currentPlanID;
    const exerciseName = document.getElementById('exerciseName').value;
    const sets = document.getElementById('sets').value;
    const repetitions = document.getElementById('repetitions').value;
    const notes = document.getElementById('notes').value;

    try {
        // Make a POST request to add an exercise to a workout plan
        const response = await fetch(`https://fittracker-lc3q.onrender.com/api/exercises/${planId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exercise_name: exerciseName, sets, repetitions, notes }),
        });

        // If the request is successful, display an alert and fetch/display updated workout plans
        if (response.ok) {
            alert('Exercise added to workout plan');
            fetchAndDisplayWorkoutPlans();
        } else {
            // If the request fails, log the error message
            const result = await response.json();
            console.error(result.message);
        }
    } catch (error) {
        // Handle and log any errors
        console.error(error);
    }
}

// Function to view exercises for a specific workout plan
async function viewExercises(planId) {
    try {
        // Make a GET request to fetch exercises for a workout plan
        const response = await fetch(`https://fittracker-lc3q.onrender.com/api/exercises/${planId}`);
        
        // If the request is successful, parse the response JSON and display the exercises
        if (response.ok) {
            const exercises = await response.json();
            displayExercises(exercises);
        } else {
            // If the request fails, log the error message
            const result = await response.json();
            console.error(result.message);
        }
    } catch (error) {
        // Handle and log any errors
        console.error(error);
    }
}

// Function to display exercises
function displayExercises(exercises) {
    const exerciseListContainer = document.getElementById('exerciseListContainer');
    exerciseListContainer.innerHTML = '';
    exerciseListContainer.style.display = "flex";
    workoutPlanContainer.style.display = "none";
    workouts.style.display = "none";
    back.style.display = "inline-block";
    
    // Check if there are no exercises for the workout plan
    if (exercises.length === 0) {
        exerciseListContainer.innerHTML = '<p>No exercises available for this workout plan.</p>';
        return;
    }

    // Create HTML elements for each exercise and append them to the container
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

// Function to go back to the workout plans view
function goBack() {
    workoutPlanContainer.style.display = "flex";
    workouts.style.display = "flex";
    back.style.display = "none";
    exerciseListContainer.style.display = "none";
}

// Event listener for the "Get Started" button
const getStarted = document.getElementById("GetStarted")

// Function to hide the main content and display the workout plans
getStarted.addEventListener('click', function () {
    maincontent.style.display = "none";
    workouts.style.display = "flex"
    window.scrollTo(0, 0);
});
