# 6.170 Final Project: grEAT
grEAT is a platform that helps people organize meals with friends. More specifically, it reduces the difficulty of coordinating scheduling and choosing restaurants that satisfies everyone's needs and preferences. grEAT provides a central location for group members to indicate these criteria and suggests times and restaurants that work best for everyone, so the organizer can easily finalize an outing with friends.

**Deployment Link:** http://gr-eat-app.herokuapp.com/

## File Authorship
### April:
Responsible for handling restaurant logic, including routes in `routes/restaurants.js`, functions for retrieving restaurants from Google Places in `models/Restaurants.js`, loading and sorting restaurants in grEATings in `models/Greatings.js`, and loading restaurants in `components/RestaurantList.vue`. Also created landing page in `components/Home.vue`.

### Alicia:
Responsible for grEATing display in `components/Greating.vue`, tracking approvals, allowing users to add preferences in `components/Preferences.vue`, and organizer controls. Also created visuals for the carousel in the landing page (in the `media` folder).

### Jenna:
Responsible for allowing users to invite other users to a grEATing in `routes/invite.js`, user creation and account controls (setting address, password, username, dietary restrictions) in `routes/users.js`, `models/User.js`, and `MyAccount.vue`. Also responsible for the notification system (`components/Notifications.vue`) and creating a skeleton for the overall website (`components/MainPage.vue`, `components/GreatingSideNav.vue`, `components/TopNav.vue`).

### Tuyet:
Responsible for all availability functionality (settings for availability, displaying best available times, etc) in `routes/greating.js`with schedule in the API, `models/Availability.js`, `components/ChangeAvailabilityModal.vue`,  and `components/Availability.vue`. Also contributed to allowing users to browse restaurants by zip code and certain filters, and displaying additional restaurant info in `components/RestaurantListItem.vue`.

## Local Build Instructions
1. Download the repo, then expand the zip file.
2. In the `great-app` directory (or whatever you choose to name it), run `npm install`.
3. Next, run `npm run build` and `npm start`. The project should be started on port 3000.
4. grEAT should now be running on `localhost:3000`.
