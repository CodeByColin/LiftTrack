
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

        console.log('Response:', response);
        console.log('Result:', result);

        if (response.ok && result.success) {
            // If login is successful, hide the overlay
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

    // Check if username and password are not empty
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



