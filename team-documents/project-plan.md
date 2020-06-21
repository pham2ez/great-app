# Project Plan #

# Proof of Concept

## Functionality to be done:
* Signing in (user accounts will pre-populated)
* Auto-generate restaurants based on users’ dietary restrictions + availability (which are pre-populated)
* Add preferences to an existing grEATing (grEATing will be pre-populated with users)
* Add suggestions to an existing grEATing
* Show availability (pre-populated, can’t be changed for now) in the grEATing
* Be able to approve displayed restaurants
* Organizer can finalize time and place

## Implementation tasks:
1. Users - Jenna
    1. Implement sign in for existing users
    2. Display user account settings
        1. Particularly dietary restrictions and addresses
        2. Change username/password if there’s time
2. Availability - Tuyet
    1. Generate a chart of availabilities based on a given list of availabilities for each user
    2. Compute and display all times when everyone is available
3. Suggestions - April
    1. Divise a tagging system for restaurants (which preferences a restaurant meets)
    2. Generate a way to “score” restaurants (with info pulled from an existing API)
4. grEATing - Alicia
    1. Display members, suggestions, and availabilities
    2. Track approval
    3. Allow users to add preferences (and display a user’s preferences to him/her)
    4. Implement organizer controls (choosing a time, choosing a place)

# Minimum Viable Product

## Functionality to be done:
* Complete landing page (with the “how this works” + “browse restaurants” button)
* Browse restaurants page
    * Can browse by zip code
    * Implement how to suggest a restaurant to a grEATing from here
* Creating an account/setting up profile
    * User can set their dietary restrictions
    * Users can update address/name/password/remove account
* Creating a grEATing
* When organizer creates a grEATing, they can invite existing users as well as invite with a link
* Add availability to a grEATing
* Notification system
    * alerts users when they are invited to a grEATing, or when new members or preferences are added

## Implementation tasks:
1. Landing page - April
    1. Create a nice carousel of graphics explaining how to use the application
    2. Include sign in/create account buttons and browse restaurants button
    3. grEAT restaurants sorted by best fit (most restrictions/preferences satisfied)
2. Restaurant Browsing - Tuyet
    1. Create display page of all stored restaurants (should be able to suggest a restaurant for a specific grEATing if logged in)
3. Account Creation - Jenna
    1. Set & modify username, password, zip code/address, dietary restrictions
    2. Allow users to delete their account
    3. Generate a user’s home page (listing all grEATings they are involved with)
    4. Create grEATing invites and notifications
4. grEATing Creation - Alicia
    1. Organizer controls
        1. Allow organizer to create grEATing
        2. Organizer can invite other users

# Finished Product

## Functionality to be done:

* Work on CSS for the website
* Categorize browse filters (by preference, by location, by price)
* Filter grEATing restaurants by best fit and most approvals
* Notification system (daily/weekly emails as well as in-browser)
* Ability for organizer to delete grEATing and for members to leave a grEATing
* Ability to decline a grEATing invite
* More complex approval system (3 options: love, like, dislike)

## Implementation tasks:
1. Refining restaurant display - April
    1. Adding tags satisfied to each restaurant
    2. Add filters for best fit and most approvals
2. grEATing Filtering & unifying CSS - Tuyet
    1. Categorizing browse filters
    2. Unify CSS
3. Notifications & Testing - Jenna
    1. Implement in-browser notifications and email notifications (this includes adding a notification controls option to the user’s profile settings)
    2. Record manual test cases and record any unexpected behavior (Run user tests, enumerate all edge cases and check them, etc)
4. grEATing management - Alicia
    1. Revise approvals to allow 3 options
    2. Declining grEAT invite, delete grEATing, leave grEATing


# If Stuff Goes Wrong

If things don’t go according to plan, we will prioritize all core functionalities in the Minimum Viable Product. This means that we would omit grEAT filtering, and only have one way to invite members and accept invitations (through the platform while the user is signed in, rather than using a link externally). Certain displays could be simplified as well; for example, browsing menu information may be simplified to just listing dietary criteria, such as vegetarian-friendly or kosher. We may also cut out scheduled email notifications and instead just display in-browser notifications in a separate tab.
