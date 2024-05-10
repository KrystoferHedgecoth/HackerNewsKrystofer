"use strict";

let currentUser;

async function loginUser(evt) {
  evt.preventDefault();

  // Get username and password from form
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // Log in user and set currentUser
  currentUser = await User.login(username, password);

  // Resets form
  $loginForm.trigger("reset");

  // Save user information in local storage
  storeUserInLocalStorage();
  updateUIAfterUserLogin();
}

// Attach loginUser to form submission
$loginForm.on("submit", loginUser);

// Handles signUp for when there isn't an account.
async function signUpUser(evt) {
  evt.preventDefault();

  // Get signUp details from form
  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // Sign up user and set currentUser
  currentUser = await User.signup(username, password, name);

  // Save user credentials and update UI
  storeUserInLocalStorage();
  updateUIAfterUserLogin();

  // Reset signUp form
  $signupForm.trigger("reset");
}

// Attach signUpUser function
$signupForm.on("submit", signUpUser);

function logOutUser(evt) {
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logOutUser);

// Function to check for remembered user on page load
async function checkForRememberedUser() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // Try to log in with stored credentials
  currentUser = await User.loginViaStoredCredentials(token, username);
}

// Function to save user credentials in localStorage
function storeUserInLocalStorage() {
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

// Function to update UI after user login
async function updateUIAfterUserLogin() {
  // Hide page components and update UI
  hidePageComponents();
  putStoriesOnPage();
  $allStoriesList.show();
  updateNavOnLogin();
  generateUserProfile();
  $storiesContainer.show();
}

// Function to generate user profile
function generateUserProfile() {

  // Update user profile with currentUser details
  $("#profile-name").text(currentUser.name);
  $("#profile-username").text(currentUser.username);
  $("#profile-account-date").text(currentUser.createdAt.slice(0, 10));
}