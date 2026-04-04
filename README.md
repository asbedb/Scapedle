[![scapedle socialbanner](./docs/img/social-banner.png)](https://scapedle.com/)

## Scapedle

[Play it here!](https://www.scapedle.com)

[Join the discord](https://discord.gg/behPY8KUSM)

Scapedle is the combination of wordle with Old School RuneScape (OSRS).

It started as a weekend minimum viable product and quickly evolved into an application with a growing player base.

## Architecture and Technology

Scapedle is built with [SvelteKit](https://svelte.dev/) and runs on the [Node.js](https://nodejs.org/en) runtime environment.

### Data and Dictionary Management

The game's core logic revolves around a curated wordlist.

- **Seeding:** The initial vocabulary was generated using Claude, and is currently being refined to ensure lore accuracy.
- **Validation:** This wordlist is transformed into a HashMap, providing O(1) lookup times for validating user inputs against the dictionary

### Automated Daily Builds

Rather than relying on a complex backend database to serve a new word, Scapedle utilizes a static-first deployment strategy:

- **Scheduled CI/CD:** The project is rebuilt daily.
- **Deterministic Seeding:** A custom algorithm uses the current date as a seed to select the "Daily Scape." This ensures a canonical order of game numbers and maintains synchronized play across the global community without needing a real-time server.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en)
- [git](https://www.atlassian.com/git/tutorials/install-git)

To install and run Scapedle locally ensure to first complete the prerequisites followed by the below.

### 1. (Optional) Fork the repository

[Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) the repository as your own repo if you wish to build a project on top of siteQL.

### 2. Clone the repository to your local machine

First, navigate to the folder where you want to store the project on your local machine using the terminal. Then run this command to clone your fork:

```sh
git clone https://github.com/<YOUR_GITHUB_ACCOUNT_NAME>/Scapedle.git
```

Ensure to Replace <YOUR_GITHUB_ACCOUNT_NAME> with your actual GitHub username. This command creates a copy of the repository on your computer where you can make changes.

### 3. Navigate to the project directory

After cloning is complete, change your current directory to the newly created project folder:

```sh
cd Scapedle
```

This command opens the project folder where you'll find all the source code and project files. Note that the directory name is case-sensitive, so make sure to use the exact same capitalization as shown in the previous step.

### 5. Install the required dependencies

Run the following command in your terminal to install all the necessary packages defined in the project's package.json file:

```sh
npm i
```

This command (shorthand for npm install) will automatically download and set up all required Node.js packages, including the NextJS framework and other dependencies needed for the front-end. The installation process may take several minutes depending on your internet connection speed.

### 7. Start the developer server

```sh
npm run dev
```

Open your browser and visit this displayed link in your console to see the application running.

## Contributing

To contribute to Scapedles development including raising issues, please follow the [Contributing Guidelines](CONTRIBUTING.md) - We try to follow some order in naming pull requests and issues to keep track of changes!

## License

Scapedle is licensed under the GPL 2.0 license.
