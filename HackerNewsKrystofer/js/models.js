"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

class Story {
    // Takes an object with properties like storyId, title, etc, and assigns them to the instance
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  getHostName() {
    return new URL(this.url).host;
  }
}

class StoryList {
    // Initializes the class with an array of stories
  constructor(stories) {
    this.stories = stories;
  }

    // Fetches stories from the server using axios and maps the response to Story objects
  static async getStories() {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    const stories = response.data.stories.map(story => new Story(story));

    return new StoryList(stories);
  }

  // Adds a new story to the user's stories and sends a POST request to the server
  async addStory(user, { title, author, url }) {
    const token = user.loginToken;
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/stories`,
      data: { token, story: { title, author, url } },
    });

    const story = new Story(response.data.story);
    this.stories.unshift(story);
    user.ownStories.unshift(story);

    return story;
  }

  // Removes a story from the user's stories and sends a DELETE request to the server
  async removeStory(user, storyId) {
    const token = user.loginToken;
    await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "DELETE",
      data: { token: user.loginToken }
    });

    this.stories = this.stories.filter(story => story.storyId!== storyId);

    user.ownStories = user.ownStories.filter(s => s.storyId!== storyId);
    user.favorites = user.favorites.filter(s => s.storyId!== storyId);
  }
}

class User {
    // Initializes the user with their details and maps their favorites and owned stories to Story objects
  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    this.loginToken = token;
  }

  // Sends a signup request to the server and returns a new User object
  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }
  // Sends a login request to the server and returns a new User object
  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  // Adds a story to the favorites and sends a POST request to the server
  async addFavorite(story) {
    this.favorites.push(story);
    await this._addOrRemoveFavorite("add", story)
  }

  // Removes a story from the favorites and sends a delete request to the server
  async removeFavorite(story) {
    this.favorites = this.favorites.filter(s => s.storyId!== story.storyId);
    await this._addOrRemoveFavorite("remove", story);
  }

  // Handles adding or removing a story from the favorites
  async _addOrRemoveFavorite(newState, story) {
    const method = newState === "add"? "POST" : "DELETE";
    const token = this.loginToken;
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
      method: method,
      data: { token },
    });
  }

  // Checks if a story is in the user's favorites
  isFavorite(story) {
    return this.favorites.some(s => (s.storyId === story.storyId));
  }
}