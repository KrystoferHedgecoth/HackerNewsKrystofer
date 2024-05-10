"use strict";

// Shows all stories when clicked
function navAllStories(evt) {
  hidePageComponents();
  putStoriesOnPage();
}

// Listens for click on #nav-all
$body.on("click", "#nav-all", navAllStories);

// Shows submit story form and lists all stories when clicked
function navSubmitStoryClick(evt) {
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

// Listens for click on #nav-submit-story
$navSubmitStory.on("click", navSubmitStoryClick);

// Shows favorites list when clicked
function navFavoritesClick(evt) {
  hidePageComponents();
  putFavoritesListOnPage();
}

// Listens for click on #nav-favorites
$body.on("click", "#nav-favorites", navFavoritesClick);

// Shows submitted stories section when clicked
function navMyStories(evt) {
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

// Listens for click on #nav-my-stories
$body.on("click", "#nav-my-stories", navMyStories);

// Show logins and signup forms and hide stories container when clicked
function navLoginClick(evt) {
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $storiesContainer.hide()
}

// Listens for click on #nav-login
$navLogin.on("click", navLoginClick);

// Shows user profile when clicked
function navProfileClick(evt) {
  hidePageComponents();
  $userProfile.show();
}

// Listens for click on #nav-user-profile
$navUserProfile.on("click", navProfileClick);

// Updates navigation on login
function updateNavOnLogin() {
  // Shows main navigation links
  $(".main-nav-links").css('display', 'flex');
  // Hides login button and  shows logout button
  $navLogin.hide();
  $navLogOut.show();
  // Sets user profile text to current username and shows it
  $navUserProfile.text(`${currentUser.username}`).show();
}
