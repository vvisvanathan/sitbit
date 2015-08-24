# Sitbit
*Life is short- have a sit.*

Sitbit promotes healthy stress-relief and relaxation by tracking time spent
sitting. Users can track their time spent sitting comfortably, rescuing innocent
calories from being 'burned,' and maintaining a healthy level of inactivity.

[Heroku link][heroku]

[heroku]: http://sitbit.herokuapp.com

## Minimum Viable Product
Sitbit is a clone of the fitbit dashboard built on Rails and Backbone. Users can:

- [x] Create accounts
- [x] Create sessions (log in)
- [ ] Track and view their 'Sit Time'
- [x] Track and view their 'Calories Rescued'
- [x] Track and view their 'Steps Avoided'
- [x] View a dashboard that summarizes their statistics
- [x] Interact with dashboard to modify timelines or see details
- [x] View a leaderboard
- [x] Search for other users and view their profiles
- [x] Log in as guest user

## Design Docs
* [View Wireframes][views]
* [DB schema][schema]

[views]: ./docs/views.md
[schema]: ./docs/schema.md

## Implementation Timeline

### Phase 1: User Authentication, Sit Data and Seeding (~1 day)
I will implement user authentication in Rails based on the practices learned at
App Academy. By the end of this phase, users will be able to create an account
using a simple text form in a Rails view, and edit/update account details after
creation.

Users will also be able to see a log of all of their 'sits' (start time, end
time). The 'sit period' data will be used to calculate the user's stats in the
back-end to pass through the API.

[Details][phase-one]

### Phase 2: Viewing Basic User Stats (~1 day)
I will add backend processing to serve sit time, calories rescued, and
inactivity level data as JSON, then add Backbone models and collections that
fetch data from those routes. By the end of this phase, users will be able to
sign up for sitbit and view text-form data of their three (3) base-level
statistics, all inside a single-page Backbone app.


[Details][phase-two]

### Phase 3: Graphing Basic User Stastistics (~2 days)
I will use third-party libraries (d3.js, chartview.js, or other) to graph a
user's three (3) base-level statistics. These graphs will appear as tiles on the
user's dashboard.
- 'Sit Time' will appear as a circular progress bar (out of 24 hours)
- 'Calories Rescued' will appear as a bar graph (progressive over one week)
- 'Inactivity Level' will appear as a line graph (progressive over 24 hours)

[Details][phase-three]

### Phase 4: Interactive Dashboard (~1-2 days)
Add functionality that (1) lets users toggle between various timespans on their
graphed statistics (2) allows users to click on graph tiles to access a detail
page on the statistic. The detail pages should pop-out instead of redirecting
to a different page.

[Details][phase-four]

### Phase 5: User Search and Leaderboard(~2 days)
Add the ability for users to:
- Search for other users in a search bar on the dashboard
- view a leaderboard of their friends on their dashboards.

Add `search` routes to the users controller. On the Backbone side,
there will be a `SearchResults` composite view with 'UserIndex' composite views.
The dashboard will obtain a new view for a 'Leaderboard,' which ranks friends.

[Details][phase-five]

### Phase 6: Add guest log-in and begin bonus features (~2 days)
A final (yet important) step of this project is to allow a visitor to log in as
a guest and test all of the website's functionality. The guest account should
have seeded data and should reset every night. The user should be able to log-in
as a guest in a single click from the login page.

The remainder of the time should be spent implementing bonus features in the
order of priority specified below.

[Details][phase-six]

### Bonus Features (TBD)
- [x] Users can customize account settings
- [x] Users can track and view their 'Net Calories'
- [ ] Users can set and view a custom 'Target Weight'
- [ ] Users can track and view their 'Current Weight'
- [ ] Website tour (Shepherd)
- [ ] Multiple sessions/session management

[phase-one]: ./docs/phases/phase1.md
[phase-two]: ./docs/phases/phase2.md
[phase-three]: ./docs/phases/phase3.md
[phase-four]: ./docs/phases/phase4.md
[phase-five]: ./docs/phases/phase5.md
[phase-six]: ./docs/phases/phase6.md
