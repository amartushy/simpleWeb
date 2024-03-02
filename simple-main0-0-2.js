const db = firebase.firestore();
let defaultProfile = "https://firebasestorage.googleapis.com/v0/b/simple-1ccfd.appspot.com/o/Image%20copy.png?alt=media&token=bcd392b5-27c8-4e7e-9143-d384e9099a99"



firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is signed in, now check if they have isAdmin permission
        db.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists && doc.data().isAdmin) {
                // User is an admin, allow them to stay on the page
                console.log("User is admin.");

                // Call the function to fetch users and build the UI
                fetchAllUsersAndBuildBlocks();

                let adminData = doc.data()
                let adminProfileDiv = document.getElementById('admin-profile-div')
                while (adminProfileDiv.firstChild) {
                    adminProfileDiv.removeChild(adminProfileDiv.firstChild)
                }
                createDOMElement('img', 'patient-photo', adminData.profilePhoto, adminProfileDiv);
                createDOMElement('div', 'text-light', adminData.fullName, adminProfileDiv);

            } else {
                // User is not an admin, redirect them to the login page
                window.location.href = "https://simple-admin-ios.webflow.io/login";
            }
        }).catch(error => {
            console.error("Error checking admin status: ", error);
            window.location.href = "https://simple-admin-ios.webflow.io/login";
        });
    } else {
        // No user is signed in, redirect them to the login page
        window.location.href = "https://simple-admin-ios.webflow.io/login";
    }
});

let logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', function() {
    firebase.auth().signOut().then(() => {
        console.log('User logged out successfully');
        // Redirect to login page or show a message
        window.location.href = "https://simple-admin-ios.webflow.io/login";
    }).catch((error) => {
        // Handle errors here
        console.error('Error logging out:', error);
        alert('Failed to log out');
    });
});



let usersTab = document.getElementById("users-tab");
let reportsTab = document.getElementById("reports-tab");
let postsTab = document.getElementById("posts-tab");

let usersParentContainer = document.getElementById("users-parent-container");
let reportsParentContainer = document.getElementById("reports-parent-container");
let postsParentContainer = document.getElementById("posts-parent-container")

let usersContainer = document.getElementById("users-container");
let reportsContainer = document.getElementById("reports-container");
let postsContainer = document.getElementById("posts-container");

// Initially hide the other containers
usersParentContainer.style.display = "flex";
reportsParentContainer.style.display = "none";
postsParentContainer.style.display = "none";

usersTab.addEventListener('click', function() {
    // Show exams container and hide users container
    usersParentContainer.style.display = "flex";
    reportsParentContainer.style.display = "none";
    postsParentContainer.style.display = "none";

    // Optionally, update the tabs' appearance to indicate which tab is active
    usersTab.className = "tab-selected"
    reportsTab.className = "tab-unselected"
    postsTab.className = "tab-unselected"
});

reportsTab.addEventListener('click', function() {
    // Show exams container and hide users container
    usersParentContainer.style.display = "none";
    reportsParentContainer.style.display = "flex";
    postsParentContainer.style.display = "none";

    // Optionally, update the tabs' appearance to indicate which tab is active
    usersTab.className = "tab-unselected"
    reportsTab.className = "tab-selected"
    postsTab.className = "tab-unselected"
});

postsTab.addEventListener('click', function() {
    // Show exams container and hide users container
    usersParentContainer.style.display = "none";
    reportsParentContainer.style.display = "none";
    postsParentContainer.style.display = "flex";

    // Optionally, update the tabs' appearance to indicate which tab is active
    usersTab.className = "tab-unselected"
    reportsTab.className = "tab-unselected"
    postsTab.className = "tab-selected"
});




function createDOMElement(type, className, value, parent) {
    let DOMElement = document.createElement(type)
    DOMElement.setAttribute('class', className)
    if ( type == 'img' ) {
        DOMElement.src = value
    } else {
        DOMElement.innerHTML = value
    }
    parent.appendChild(DOMElement)
}




// Helper function to format dates
function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}
