# **App Name**: AI Duel

## Core Features:

- Reverse Prompt Engineering: Accept user-provided AI output, use Gemini to reverse engineer the prompt, provide a template prompt, and suggest a better prompt. Gemini will act as a tool to generate the most likely prompt, a template version, and a suggested improvement.
- AI Arena: Send the same user-provided prompt to two randomly selected AI models (OpenAI, Cohere, Gemini) and display their responses side-by-side. Use the provided API keys for OpenAI and Cohere.
- Model Comparison Voting: Allow users to vote on which model provided the better response (A, B, or Tie) in the AI Arena.
- Model Reveal: Display the names of the models used in each AI Arena comparison after the user submits their vote.
- Leaderboard: Display a leaderboard showing which model has the most votes.
- Navigation Bar: Implement a navigation bar to allow users to easily navigate to each page.

## Style Guidelines:

- Dark background to provide contrast.
- Golden highlights for key elements and accents.
- Minimalist design with clear sections for each feature.
- Simple, clear icons for navigation and actions.
- Accent color: Teal (#008080) for interactive elements.

## Original User Request:
an website named "AI Showdown" this will have three pages
1. the home page is a page about reverse prompt engineerng, here the user will give us the output they got from a ai model and we will give the most likely prompt that could have produced it , and a template version of the prompt in which the user can change variables to generat e simmilar out put for diffrent varables and we will also suggest a better prompt for that task, use gemini api for this send the request in a draft that asks these question form the ai
3. leaderboard this will show which model is winning the most use a free  databse to store this data

keep the design minimilist and simple and keep a dark theme with golden highlights
  