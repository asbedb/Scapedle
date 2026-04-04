## How to Contribute

For further information or help getting started you can [join the discord](https://discord.gg/behPY8KUSM).

### Submitting an Issue

If you’ve found a bug or have a brilliant idea for a new feature, please open an issue! High-quality issues make it much easier for the community to contribute.

1. **Check for Duplicates:** Search the existing issues to see if someone else has already reported the same thing.
2. **Choose a Template:** Select whether you are submitting a Bug Report or a Feature Request.
3. **Provide Context:** For Bug Reports: Include your browser, device (mobile/desktop), and the specific steps to reproduce the error. If the daily word is broken, please include the Daily # and the date.
   - For Feature Requests: Clearly describe the "why" behind the suggestion and how it improves the player experience.
4. Use Labels: If you have the permissions, apply relevant labels like bug, enhancement, or documentation to help others find your issue.

### Issue Tracking

Before getting started and setup with contributing, you'll want to look at and choose an issue to work on. Here is a basic workflow you want to work from:

1. Search through [issues](https://github.com/asbedb/Scapedle/issues)
2. Find issue you want to work on
3. Check if the issue has been assigned to someone already
4. (Optional) Double check pull requests for someone who has worked on the pull request
5. Request to be assigned on the issue by commenting on the issue.

If you have gotten that far, then you can go ahead and work on the issue.

### Naming Conventions

The main naming conventions used in issues and pull requests follow the below conventions.

`<fix/feat/chore>: <Short description of change>` an example of this can be `feat: API Based Features` which suggests the pull request is a new feature that incorporates API based features into the game. Find below each category for more information

- **feat**: Feature
- **fix**: Bug fix
- **chore**: Updating dependencies, correction of spelling, adding comments etc.

### Forking and Local Setup

To start working on your assigned issue, you’ll need to create your own copy of the repository and set up the development environment.

1. **Fork the Repository**: Click the Fork button at the top-right of the Scapedle repository to create a copy under your GitHub account.
2. Clone Locally:

```Bash
git clone https://github.com/YOUR-USERNAME/Scapedle.git
cd Scapedle
```

3. Install Dependencies: Scapedle uses SvelteKit. Ensure you have Node.js installed, then run:

```Bash
npm install
```

4. Create a Branch: Always work on a new branch rather than main. Use a name that reflects the issue - (see naming conventions below)[#naming-conventions]:

```Bash
git checkout -b feat/your-feature-name
```

### Submitting a Pull Request (PR)

Once you have implemented your changes and verified they work locally (run npm run dev), follow these steps to submit your contribution:

1. Push Your Changes

```Bash
git push origin feat/your-feature-name
```

2. Open the PR
   - Navigate to the original Scapedle repository on GitHub. You should see a prompt to "Compare & pull request."

3. PR Requirements
   - When opening a PR, please ensure the following: - Title: Follow the Naming Conventions (e.g., fix: resolve mobile layout overlap). - Description: Reference the issue number you worked on (e.g., "Closes #12"). Provide a brief summary of what you changed. - Visuals: If your PR changes the UI, please include a screenshot or a screen recording of the change in action. - Clean Code: Ensure there are no unnecessary console.log statements or commented-out code blocks.

4. Review Process
   - Once submitted, the maintainers will review your code. - Feedback: You might be asked to make small adjustments. Simply commit the changes to the same branch and push them; the PR will update automatically. - Approval: Once approved, your code will be merged into the main project and included in the next daily build!
