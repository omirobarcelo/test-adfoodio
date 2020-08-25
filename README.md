# The Adludio Restaurant Concept!

Greetings! As a potential new-hire we want to put you in charge of your very own restaurant.
What will you be serving? We don't know, as long as it's tasty (and completely digital).

## The Challenge
Your challenge is to build a Full Stack Web app that lets the user order food and drinks from a menu (of your choice), and notifies them when it's 'ready' for pickup.

### How it behaves:

- The menu must have two sections, foods and drinks. At least three items in each.

- When the user selects at least one from each section a 10% discount will be applied as a “meal deal”

- The app must store the menu, order and any stateful information in a database (MySQL)

- The app must notify the user when the food is ready for pickup (My recommendation is that you set a wait/timeout to simulate  the "chef").

- The app must use styling (even if it's not pretty). We recommend [Material UI](https://material-ui.com).

- The app must 'remember' the user and their order on window refresh.

- The app must have _some_ tests (only enough so we understand how you approach testing)

- The app must be properly typed

### The technology

We have already set up the repo to use these technologies:

- Docker + Docker-compose
- Node + Express + Typescript
- React (using [Create React App](https://create-react-app.dev/docs/getting-started/), you may switch it out if you wish) + Typescript
- MySQL

### Questions

When you give us your task back, we expect you to answer these questions:

- What would you improve with your code?
- How would you scale your code for more users?
- What general patterns did you use to structure your code?
- Is there anything you think we should change about this test?

We will use them when we read your code, to try and understand your thought process, so that even if it's not perfect (or even done), we are able to give you a fair chance! :)

## How to get started

1. Clone this repository
2. Make sure you have docker and node installed
3. Add `api.adfoodio.site` to your hosts. If you are on linux you can use the following command:

```bash
sudo sh -c 'echo "\n127.0.0.1 api.adfoodio.site\n::1 api.adfoodio.site\n" >> /etc/hosts'
```

4. Run docker-compose up
5. asdasda