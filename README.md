# Smart Notes

Smart Notes is a note-taking application that allows users to create, edit, delete, and categorize their notes. It includes features like real-time search, AI-powered content categorization, and a user-friendly interface.

## Features

- Create, edit, and delete notes.
- Categorize notes into predefined categories (Work, Personal, Ideas).
- AI-powered content analysis to suggest categories based on note content.
- Real-time search functionality with debouncing.
- Responsive and intuitive UI.

## Technologies and AI Tools Used

- **Technologies**:

  - [Next.js](https://nextjs.org) for the frontend and backend.
  - MongoDB for database storage.
  - Tailwind CSS for styling.
  - Jest and React Testing Library for testing.
 
## Live Demo

Access the live application here: [Smart Notes Organizer](https://smart-notes-organizer-lss7tcblh-snthshs-projects.vercel.app)

- **AI Tools**:
  - Hugging Face's `facebook/bart-large-mnli` model for content categorization.

## Getting Started

### Prerequisites

- Node.js (v16 or higher) installed on your system.
- MongoDB instance running locally or in the cloud.
- Hugging Face API key for AI-powered categorization.

### Running the App Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/smart-notes.git
   cd smart-notes
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:

   ```env
   MONGODB_URI=<your-mongodb-uri>
   HF_API_KEY=<your-hugging-face-api-key>
   MAX_RETRIES=3
   NEXT_PUBLIC_MINIMUM_KEYWORD_LENGTH=3
   ```

4. Start the development server:

   ```bash
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to access the app.

## Testing Approach

The application uses Jest and React Testing Library for unit and integration testing. The tests cover:

- Form behavior in the `NoteEditor` component.
- API interactions for content analysis.
- Edge cases like API errors and short content.

### Running Tests

To execute the test cases, run the following command:

```bash
yarn test
```

This will run all test files and display the results in the terminal.

## Learn More

To learn more about the tools and frameworks used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Hugging Face API Documentation](https://huggingface.co/docs/api-inference)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com). Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
