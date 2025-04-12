## Features

- Horizontal Time Axis: Displays date ticks (days and months) on the top
- Compact Lane Layout: Assigns events to lanes with the minimum number of lanes needed to avoid overlaps
- Event Details: Shows title, date range, and color-coding for each event
- Page Navigation: Navigate through time periods with previous/next buttons
- Interactive Events:

  - Click on an event to edit its title
  - Drag events to reposition them
  - Resize events by dragging their edges
  - Create new events by clicking on empty space

## What I Like About My Implementation

- Componentized Architecture: The timeline is divided into modular components (TimelineControls, TimelineHeader, TimelineItem) that have clear responsibilities, making the code more maintainable and easier to understand.
- Intuitive User Interactions: The component detects user intent intelligently, differentiating between clicks (for editing) and drags (for moving events) based on mouse movement patterns.
- Efficient Layout Algorithm: The lane assignment algorithm efficiently packs events into the minimum number of horizontal lanes needed, optimizing vertical space usage.
- Visual Clarity: The timeline provides clear visual cues with month/year headers, day markings, weekend highlighting, and color-coded events.
  Responsive Design: Using percentage-based layouts ensures the timeline adapts well to different container sizes and zoom levels.

## What I Would Change If I Were Going To Do It Again

- Date Library Integration: I would utilize a mature date library like date-fns or dayjs to handle date calculations more consistently and avoid potential browser compatibility issues.
- Accessibility Improvements: I would focus more on keyboard navigation, screen reader support, and ARIA attributes to make the timeline more accessible.
- Implement a mobile version due to time constraints, but responsive support would be a priority in future iterations.
- Implement a button to delete the event.
- Automatic Scrolling: Instead of relying on Next/Back buttons for navigation, I would implement smooth automatic scrolling triggered by user gestures, enhancing usability and making the experience feel more natural and fluid.
- Zoom Functionality: I implemented basic zoom support as a bonus feature, but it's still a bit rough and may contain minor bugs. Given the time constraints and since it was optional, I chose to prioritize core functionality and overall stability before polishing the zoom behavior.

## Design Decisions

The design was inspired by both Google Calendar and the example provided in the challenge email. Features like clicking to create events, as well as dragging to reposition and resize them, strongly influenced the interaction model I chose.

- Smart intent detection: Implementing logic to distinguish between clicks and drags creates a more natural user experience.
- Componentization pattern: Breaking the timeline into logical components improves code organization and potential for reuse.

## How I Would Test This With More Time

With more time, I would implement a comprehensive testing strategy:

- Add unit tests for date utilities, event layout logic, and state updates.
- Benchmark performance with large datasets to ensure smooth rendering.
- Test usability with real users to gather feedback and to identify pain points
