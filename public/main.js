const maincontent = document.getElementById("main-content");
const workouts = document.getElementById("workouts");

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

        if (response.ok && result.success) {
            // Save user_id to localStorage
            const userId = result.user.user_id;
            localStorage.setItem('loggedInUserId', userId);

            console.log(result);
            document.getElementById('overlay').style.display = 'none';
        }

        alert(result.message);
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please check the console for details.');
    }
}

// Function to create a workout plan
async function createWorkoutPlan() {
    const planName = document.getElementById('planName').value;
    const description = document.getElementById('description').value;

    try {
        // Retrieve user_id from localStorage
        const loggedInUserId = localStorage.getItem('loggedInUserId');

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
            // Handle success (e.g., update UI, show a success message)
        } else {
            const result = await response.json();
            console.error(result.message);
            // Handle error (e.g., show an error message)
        }
    } catch (error) {
        console.error(error);
        // Handle network or unexpected errors
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



const getStarted = document.getElementById("GetStarted")

getStarted.addEventListener('click', function () {
    maincontent.style.display = "none";
    workouts.style.display = "flex"
});



