# Final Design

## Heuristics

###  Visibility of system status
When the website is waiting to receive the restaurants from Google, the user can see that it is doing so by the spinner and text that reads “Loading Restaurants…”.

###  Match between system and the real world
We used language that is typically used on commonly used websites and common language as well as understandable phrases such as “Showing Restaurants nearest to your Group”.

The ordering of the grEATing tabs also make sense because chronologically the user would want to invite other users to a grEAT, input their availability, add their preferences, then decide on which restaurants they want to approve based off of their availability and preferences.

Also the ordering for invited, accepted, and past makes sense as well.

###  User control and freedom
Users can approve and disapprove as they want, can reselect preferences, and chosen times and restaurants can be rechosen by the organizer.

###  Consistency and standards
There is consistency between the filters used and the preferences and dietary restrictions available.

###  Error prevention
Settings that are meant for only organizers are hidden from the other members of a grEAT so that they will not get the 403 error from the API.

###  Recognition rather than recall
The user sees restrictions and preferences that restaurants satisfy in the restaurant list, and can easily see preferences that they've input into the grEATing.

###  Flexibility and efficiency of use
If there are no new invites for a grEATing, the tab will automatically be on “accepted”, if there are new invites, then it will start off on “invited”.

It will also be helpful to put the user on a tab that they have not yet filled out, such as “availability” if they have not input anything or “restaurants” if they had not approved any restaurants yet.

###  Aesthetic and minimalist design
Does not fill up the screen with unnecessary information, only information that is currently needed is shown. For example, when the user is on the availability tab for a grEATing, viewing other member’s availability and inputting one’s own availability is split up instead of crowding up the screen with both views at once. Plus, viewing other member’s availability is mostly necessary for the organizer to choose the time as well so it keeps it minimalistic.

###  Help users recognize, diagnose, and recover from errors
Users will be told if authentication fails or if they have invalid inputs when creating an account.

###  Help and documentation
The first thing a new user will see is the carousel that gives them an overview of what grEAT does.
Information about the different colors used for availability is also provided to the user.

## Design Decisions
Below is an outline of major design choices during implementation.

### Less Restrictive Criteria for Displaying Restaurants
Originally, we wanted to only display restaurants that satisfied everyone's dietary restrictions; however, during implementation we realized this would greatly limit the restaurants displayed, due to our use of Google Place's Text Search API (searching for 'vegan' restaurants vs. 'halal' will return results with little to no intersections). Instead, we decided to rank restaurants that satisfy more restrictions higher, and show the tags that each restaurant satisfies in each restaurant item card.

### Restaurant Sorting
Restaurants in a grEATing may be sorted by best fit (satisfies the most restrictions and preferences), as well as by most popular (based on approvals). We thought these would be the most relevant filters, since users would want to eat at restaurants that fit their dietary needs, but might also want to know which restaurants are most favorable among the group. 

### Multi-Option Approval
We originally only had one level of approval, which indicated whether a user was willing to eat at a restaurant (not approving a restaurant meant they would not be willing to eat there). After getting feedback from the class, we realized that this didn't accurately capture a member's opinion of a restaurant, so we introduced 3 options instead: "love", "like", and "dislike". This allows for more robust sorting and also gives the organizer/members more information on how favorable a restaurant is.

## Social/Ethical Reflection

### Stakeholders
Besides impacting its direct users, grEATing’s stakeholders also include restaurants, users’ friends who don’t use the app, and other scheduling and messaging platforms. 

### Local Restaurant Discovery
Part of grEAT’s functionality is restaurant search, similar to Yelp; one of the main social/ethical issues that can arise from this is the impact on the local restaurant business. Especially since we are using an external API to pull restaurant data, smaller, lesser-known restaurants might be at a disadvantage, since they are less likely to be recommended or discovered on grEAT. This could drive business toward restaurants that already have a reputation, and force newer restaurants to either be active on social media or develop some kind of online presence in order to stay in business. Because of this, we will try as much as possible to maximize our range of restaurants. If we were to continue developing grEAT, another functionality we would look into to alleviate this issue is a “restaurant management” interface that allows restaurants to claim a business and potentially add themselves to our platform.

### Being Sensitive to Dietary Needs and Preferences
A major premise of grEAT is to prioritize users’ individual dietary needs and preferences, since most restaurant search apps don’t include this functionality. We know that when friends plan outings, there is often one person who may have a dietary restriction that becomes forgotten, or acknowledged at the last minute; as a result, the restaurant they go to often has few or no options that cater to their needs. To make sure that restaurant choices are fair and inclusive to everyone in the group, we decided to allow users to specify dietary restrictions in their profile, and any grEAT that they are a part of will prioritize restaurants that satisfy their needs.

### User Privacy
In our design of grEAT, we have tried to allow users to maintain as much privacy as possible. Users are only required to input a zip code (rather than an address or precise location) when using grEAT. Additionally, as discussed in the design decisions section, we decided that users should not be able to learn about grEATings which they were not a part of. This means that each user is free to meet up with others as they please and be certain that no one else will know whom they have met up with. Furthermore, this prevents users from learning about the past or future whereabouts of others.

### Avoiding Jealousy & Social Pressure
By preventing users from learning about grEATings that they were not a part of, we decrease the likelihood that someone feels unwelcome, jealous, or left out. We also aim to reduce social pressure in the restaurant approval process by only showing how many users have approved a certain restaurant—we believe the names of the users who have approved thus far to be irrelevant to the maximization of group happiness, and we also believe that users are more likely to express their true opinions when they have some degree of anonymity. 