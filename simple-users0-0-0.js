async function fetchAllUsersAndBuildBlocks() {
    while(usersContainer.firstChild) {
        usersContainer.removeChild(usersContainer.firstChild)
    }

    try {
        const usersSnapshot = await db.collection('users').get();
        let usersData = [];

        usersSnapshot.forEach((userDoc) => {
            const userData = userDoc.data();
            usersData.push({
                userID: userDoc.id,
                userName: userData.fullName || "Unknown Name",
                userProfilePhoto: userData.profilePhoto || defaultProfile,
                dateCreated: new Date(userData.dateCreated * 1000),
                countryCode: userData.countryCode,
                phoneNumber: userData.phoneNumber,
                birthday : userData.birthday
            });
        });

        // Sort users by date created
        usersData.sort((a, b) => a.userName.localeCompare(b.userName, undefined, { sensitivity: 'base' }));

        // Now build blocks for each user
        usersData.forEach((user) => {
            buildUserBlock(user.userID, user.userName, user.userProfilePhoto, user.dateCreated, user.countryCode, user.phoneNumber, user.birthday);
        });
    } catch (error) {
        console.error("Error fetching users: ", error);
    }
}

function buildUserBlock(userID, userName, userPhoto, dateCreated, countryCode, phoneNumber, birthday) {
    let userBlock = document.createElement('div');
    userBlock.className = 'user-block';
    userBlock.addEventListener('click', () => fetchUserDetails(userID, userBlock));

    //Photo and Name
    var userNameBlock = document.createElement('div');
    userNameBlock.className = 'user-name-block';
    createDOMElement('img', 'patient-photo', userPhoto, userNameBlock);
    createDOMElement('div', 'text-light', userName, userNameBlock);

    //Country Code 
    var userIDBlock = document.createElement('div');
    userIDBlock.className = 'user-id-div';
    createDOMElement('div', 'text-light', userID, userIDBlock);

        
    //Date Created
    var userDateBlock = document.createElement('div');
    userDateBlock.className = 'user-text-div';
    createDOMElement('div', 'text-light', formatDate(dateCreated), userDateBlock);

    //Phone Number
    var userPhoneBlock = document.createElement('div');
    userPhoneBlock.className = 'user-text-div';
    createDOMElement('div', 'text-light', `${countryCode} ${phoneNumber}`, userPhoneBlock);
       
    //Birthday
    var birthdayDiv = document.createElement('div');
    birthdayDiv.className = 'user-text-div';
    createDOMElement('div', 'text-light', birthday, birthdayDiv);

    //Actions
    var actionsBlock = document.createElement('div');
    actionsBlock.className = 'user-actions-block';
    let actionSelectButton = document.createElement('div')
    actionSelectButton.className = 'action-unselected'
    actionSelectButton.innerHTML = '' //Empty checkbox
    actionSelectButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent triggering click event on userBlock
    
        // Toggle between selected and unselected states
        if (actionSelectButton.className === 'action-unselected') {
            actionSelectButton.className = 'action-selected';
            actionSelectButton.innerHTML = ''; // Checkbox
        } else {
            actionSelectButton.className = 'action-unselected';
            actionSelectButton.innerHTML = ''; // Empty checkbox
        }
    });
    actionsBlock.appendChild(actionSelectButton)
       
    // Append child elements to the user block
    userBlock.appendChild(userNameBlock);
    userBlock.appendChild(userIDBlock);
    userBlock.appendChild(userDateBlock);
    userBlock.appendChild(userPhoneBlock);
    userBlock.appendChild(birthdayDiv);
    userBlock.appendChild(actionsBlock);

    // Append the user block to the container
    document.getElementById('users-container').appendChild(userBlock);
}





async function fetchUserDetails(userID, userBlock) {
    try {
        const userSnapshot = await db.collection('users').doc(userID).get();
        if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            buildPatientDetailsContainer(
                userID,
                userData.fullName || "Unknown Name",
                userData.profilePhoto,
                userData.countryCode,
                userData.phoneNumber,
                userData.username

            );
        }

        // Check if there is a block currently selected and remove the selected class
        if (currentlySelectedBlock && currentlySelectedBlock !== userBlock) {
            currentlySelectedBlock.classList.remove('user-block-selected');
        }
        
        // Add the selected class to the clicked block and update the currently selected block
        userBlock.classList.add('user-block-selected');
        currentlySelectedBlock = userBlock;


    } catch (error) {
        console.error("Error fetching user details: ", error);
    }
}

let userDetailsContainer = document.getElementById('user-details-container')
userDetailsContainer.style.display = "none"
let currentlySelectedBlock = null;

function buildPatientDetailsContainer(userID, userName, userPhoto, countryCode, phoneNumber, username) {

    while ( userDetailsContainer.firstChild ) {
        userDetailsContainer.removeChild(userDetailsContainer.firstChild)
    }
    userDetailsContainer.style.display = "flex"

    if (userPhoto == "") {
        createDOMElement('img', 'patient-details-photo', defaultProfile, userDetailsContainer)
    } else {
        createDOMElement('img', 'patient-details-photo', userPhoto, userDetailsContainer)
    }
    createDOMElement('div', 'patient-details-name', userName, userDetailsContainer)
    createDOMElement('div', 'user-details-id', userID, userDetailsContainer)

    createDOMElement('div', 'patient-details-text', `${countryCode} ${phoneNumber}`, userDetailsContainer)
    createDOMElement('div', 'patient-details-text', `@${username}`, userDetailsContainer)

}
