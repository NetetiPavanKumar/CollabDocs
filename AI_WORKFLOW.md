# AI Workflow Note

## AI Tool Used

ChatGPT was used as a development assistant during the assessment.

## How AI Was Used

AI was mainly used for:

- Discussing the application architecture and implementation approach
- Clarifying technical concepts and implementation options
- Troubleshooting issues encountered during development
- Reviewing code and suggesting improvements
- Helping with deployment configuration
- Preparing project documentation

## Development Approach

The application was implemented and tested incrementally.

AI suggestions were used as references and starting points where useful, but the final implementation was adapted to the project's requirements and existing code.

Some suggestions were intentionally not used when they would have added unnecessary complexity for the assessment timebox.

For example:

- Full authentication was not added; seeded users were used to demonstrate sharing and authorization.
- Real-time collaboration was not implemented because it was an optional stretch feature.
- File import was limited to `.txt` and `.md`.
- Tiptap JSON was selected for document persistence and formatting preservation.

## Debugging and Verification

AI assistance was useful when troubleshooting issues during development, particularly around:

- API integration
- Rich-text editor configuration
- Authorization
- Automated testing with Jest and Supertest
- Production deployment
- React Router direct navigation

Suggestions were verified by running the application and testing the relevant functionality.

The final application was manually tested in production for:

- Document creation
- Editing and formatting
- Saving and reopening
- Refresh persistence
- File import
- Document sharing
- Shared-user access
- Unauthorized access
- Direct document URLs

An automated Jest/Supertest test was also used to verify unauthorized document access.

## What Was Changed or Rejected

AI suggestions were reviewed against the assessment requirements rather than being accepted automatically.

The final implementation prioritizes the required functionality within the 4–6 hour assessment timebox and avoids unnecessary features that could reduce reliability or development time.

## Summary

AI was used primarily as a development and problem-solving assistant. The resulting implementation was reviewed, adapted, tested, and deployed based on the actual assessment requirements.