# grEAT Routes
## /api/

`PUT /api/address`
```javascript
/**
 * Change the address of the current user
 * @name PUT/api/address
 * @param streetAddr - the new street address
 * @param city - the new city
 * @param state - the new state
 * @return success message - if address set successfully
 * @throws {403} - if there is no current user (user is not logged in)
 */
```

`PUT /api/email`
```javascript
/**
 * Change the email address of the current user
 * @name PUT/api/email
 * @param email - the new email address
 * @return success message - if address set successfully
 * @throws {404} - if the user could not be found
 * @throws {403} - if there is no current user (user is not logged in) or if email is already associated with an account
 */
```

`PUT /api/name`
```javascript
/**
 * Change the name of the current user
 * @name PUT/api/name
 * @param firstName - the new first name (optional)
 * @param lastName - the new last name (optional)
 * @return success message - if first and / or last set successfully
 * @throws {400} - if the firstName and lastName are both undefined
 * @throws {403} - if there is no current user (user is not logged in)
 */
```

`PUT /api/password`
```javascript
/**
 * Change the password of the current user
 * @name PUT/api/password
 * @param passwordHash - the hash of the user's new password
 * @return success message - if password set successfully
 * @throws {404} - if the user could not be found
 * @throws {403} - if there is no current user (user is not logged in)
 */
```

`PUT /api/zip`
```javascript
/**
 * Change the zip code of the current user
 * @name PUT/api/zip
 * @param zipCode - the new zip code
 * @return success message - if password set successfully
 * @throws {400} - if zipCode is not a valid 5-digit zip code
 * @throws {403} - if there is no current user (user is not logged in)
 */
```

`DELETE /api/delete`
```javascript
/**
 * Delete the account of the current user
 * @name DELETE/api/delete
 * @return success message - if account deleted uccessfully
 * @throws {403} - if there is no current user (user is not logged in)
 */
```

`GET /api/me`
```javascript
/**
 * Delete the info of the current user
 * @name GET/api/me
 * @return {info} - an object with fields 
 *    email: the email address of the current user,
 *    firstName: the first name of the current user,
 *    lastName: the last name of the current user,
 *    zipCode: the zip code of the current user,
 *    address: the address of the current user
 * @throws {404} - if the user could not be found
 * @throws {403} - if there is no current user (user is not logged in)
 */
```

`DELETE /api/logout`
```javascript
/**
 * Log out the current user
 * @name DELETE/api/logout
 * @return success message - if user was logged out successfully
 * @throws {403} - if there is no current user (user is not logged in)
 */
```

## /api/greatings
`POST /api/greatings`
```javascript
/**
 * Create a greating and add it to the existing list
 * @name POST/api/greatings
 * @param title - the title of the new greating
 * @param email - the email of the user organizing the greating
 * @return the id of the newly created greating
 */
```

`GET /api/greatings/:grId/approval`
```javascript
/**
 * Get restaurant approval data
 * @name GET/api/greatings/grId/restaurantId/approval
 * :grId - id of grEATing
 * @return the approval data for the grEATing with id grId
 * @throws {404} if no greating with the specified id can be found
 */
```

`POST /api/greatings/:grId/restaurants/approve`
```javascript
/**
 * Approve a specified restaurant suggestion within a specified greating
 * @name POST/api/greatings/:grId/restaurants/approve
 * :grId - the id of the particular greating
 * @param userEmail - the email of the user approving
 * @param restaurantId - the id of the restaurant suggestion to be approved
 * @return the number of approvals the restaurant suggestion now has within the greating
 */
```

`POST /api/greatings/:grId/restaurants/finalize`
```javascript
/**
 * Finalize a restuarant choice within a specified greating
 * @name POST/api/greatings/:grId/restaurants/finalize
 * :grId - the id of the particular greating
 * @param restaurant - the id of the chosen restaurant
 * @return {time: the currently chosen time for the greating (may be undefined),
 *          restaurant: the id of the currently chosen restaurant for the greating,
 *          status: the current status of the greating (either 'In Progress' or 'Finalized')}
 }
 */
```

`GET /api/greatings/:grId`
```javascript
/**
 * Get information about a specified greating
 * @name GET/api/greatings/:grId
 * :grId - the id of the particular greating
 * @return the full object representation of the greating (including members, organizer, restaurants, status, etc.)
 */
```

`DELETE /api/greatings/:grId`
```javascript
/**
 * Delete a grEATing
 * @name DELETE/api/greatings/:grId
 * :grId - id of the grEATing
 * @throws {404} if no greating with the specified id can be found
 */
```

`GET /api/greatings/:grId/organizer`
```javascript
/**
 * Get the email address of the organizer of a particular greating
 * @name GET/api/greatings/:grId/organizer
 * :grId - the id of the particular greating
 * @return the string email address of the greating organizer
 */
```

`GET /api/greatings/:grId/invitedInfo`
```javascript
 /**
  * GET information about invited users
  * @name GET/api/greatings/:grId/invitedInfo
  * @return an object formatted like {invited: [member1, member2]}
  */
 ```

`GET /api/greatings/:grId/members`
```javascript
/**
 * Get the names of each member in the greating
 * @name GET/api/greatings/:grId/members
 * :grId - the id of the particular greating
 * @return a list of string member names
 }
 */
```

`DELETE /api/greatings/:grId/members/:email`
```javascript
/**
 * DELETE a member
 * @name DELETE/api/greatings/:grId/members/:email
 * @param email - the email address of the user to be deleted
 * @return
 */
```

`GET /api/greatings/:grId/memberInfo`
```javascript
/**
 * Get the info (first, last, and email) of the members of the grEATing with ID grId
 * @name GET/api/greatings/:grId/memberInfo
 * :grId - the id of the particular greating
 * @return a list of information objects for each member, formatted like {firstName: string, 
 *                                                                        lastName: string, 
 *                                                                        email: string};
 }
 */
```

`POST /api/greatings/:grId/usersearch`
```javascript
/**
 * Search for users with some query and categorize results into current greating members, invitable users, and invited users
 * @name POST /api/greatings/:grId/usersearch
 * :grId - the id of the particular greating
 * @param query - some query string with which to search for users
 * @return an object containing categorized user lists formatted like {members: array, 
 *                                                                     invited: array, 
 *                                                                     invitable: array};
 }
 */
```

`GET /api/greatings/:grId/restaurants/:sortby`
```javascript
/**
 * Get restaurants for greating with grID, sorted by a certain criteria (best fit or most popular)
 * @name GET/api/greatings/:grID/restaurants/:sortby
 * :grID - id of grEATing to get restaurants for
 * :sortby - criteria to sort by
 * @return {Restaurants} - list of restaurants for the grEATing, sorted by the given criteria
 * @throws {404} - if grEATing with id grID doesn't exist
 */
```

`POST /api/greatings/:grId/restaurants/criteria`
```javascript
/**
 * Add criteria (restriction or preference) to the grEATing
 * @name POST/api/greatings/:grID/restaurants/criteria
 * :grID - id of grEATing to add criteria to
 * @param criteria - a list or set of restrictions or preferences to add to the grEATing
 * @return {Restaurants} - updated list of grEATing restaurants after applying the criteria
 * @throws {404} - if grEATing with id grID doesn't exist
 */
```

`PUT /api/greatings/:grId/restaurants`
```javascript
/**
 * Add a restaurant suggestion to a greating restaurant list
 * @name PUT/api/greatings/:grId/restaurants
 * :grId - the id of the particular greating
 * @param restaurant - the id of the restaurant to be suggested
 }
 */
```

`GET /api/greatings/:grId/schedule/availability`
```javascript
/**
 * Get some representation of who's free at what time for a particular greating
 * @name GET/api/greatings/:grId/schedule/availability
 * :grId - the id of the particular greating
 * @return A mapping of start times to the users available at that time for all time blocks in a greating
 * @throws {401} if the user is not signed in
 }
 */
```

`POST /api/greatings/:grId/schedule/availability`
```javascript
/**
 * Update the user's availability for this grEATing
 * @name POST/api/greatings/:grId/schedule/availability
 * :grId - the id of the particular greating
 * @param email - the email address of the active user
 * @param updated - a dictionary mapping timeblock objects to booleans indicating whether the user is free during that block
 * @throws {401} if the user is not signed in
 }
 */
```

`GET /api/greatings/:grId/schedule/info`
```javascript
/**
 * Gets the current availability settings for this greating
 * @name GET/api/greatings/:grId/schedule/info
 * :grId - the id of the particular greating
 * @return info of the form {length: int (duration of greating), 
 *                           availDays: list of days, 
 *                           timeRange: [start, end]}
 * @throws {401} if the user is not signed in
 }
 */
```

`PUT /api/greatings/:grId/schedule/info`
```javascript
/**
 * Updates the current availability settings for this greating
 * @name PUT/api/greatings/:grId/schedule/info
 * :grId - the id of the particular greating
 * @param info Object of the form {length: int (duration of greating), 
 *                           availDays: list of days, 
 *                           timeRange: [start, end]}
 * @throws {401} if the user is not signed in
 }
 */
```

`GET /api/greatings/:grId/schedule/timeblocks/:email`
```javascript
/**
 * Gets the user's availability for all timeblocks in a greating
 * @name GET/api/greatings/:grId/schedule/timeblocks
 * :grId - the id of the particular greating
 * :email - the email address of the active user
 * @return a mapping of greating timeblocks to boolean values indicating whether the active user is available
 * @throws {401} if the user is not signed in
 }
 */
```

`GET /api/greatings/:grId/schedule/optimal`
```javascript
/**
 * Gets a list of optimal starting timeblocks for this greating, based on current user availability
 * @name GET/api/greatings/:grId/schedule/optimal
 * :grId - the id of the particular greating
 * @return a list of the best starting timeblocks for the greating
 * @throws {401} if the user is not signed in
 }
 */
```

`GET /api/greatings/:grId/schedule/timeblocks/:email`
```javascript
/**
 * Gets the available timeblocks that exist for this grEATing
 * as well as the user's current availability.
 * :grId - the id of the grEATing
 * :email - the user's email
 * @name GET/api/greatings/:grId/schedule/timeblocks/:email
 * @return user's current availability
 */
```

`POST /api/greatings/:grId/schedule/finalize`
```javascript
/**
 * Choose a time for this greating
 * @name POST/api/greatings/:grId/schedule/finalize
 * :grId - the id of the particular greating
 * @param time - the selected time
 * @return {time: the currently chosen time for the greating (may be undefined),
 *          restaurant: the id of the currently chosen restaurant for the greating,
 *          status: the current status of the greating (either 'In Progress' or 'Finalized')}
 }
 */
```

## /invite
`POST /api/invite/:grIdHash/accept`
```javascript
/**
 * Accept the invitation for the grEATing whose ID hash is grIdHash
 * @name POST/api/invite/:grIdHash/accept
 * :grIdHash - ID hash of the grEATing
 * @return {string} - success message
 * @throws {403} - if user is not logged in
 * @throws {404} - if user or grEATing doesn't exist
 */
```

`POST /api/invite/:grIdHash/decline`
```javascript
/**
 * Decline the invitation for the grEATing whose ID hash is grIdHash
 * @name POST/api/invite/:grIdHash/decline
 * :grIdHash - ID hash of the grEATing
 * @return {string} - success message
 * @throws {403} - if user is not logged in
 * @throws {404} - if user or grEATing doesn't exist
 */
```

`POST /api/invite/:grId/send`
```javascript
/**
 * Send an invitation to the grEATing whose ID is grId
 * @name POST/api/invite/:grId/send
 * :grId - id of the grEATing
 * @param email - email of the invited member
 * @return {string} - success message
 * @throws {403} - if user is not logged in, or if user is not part of the grEATing
 * @throws {404} - if user doesn't exist
 */
```

## /api/notifications
`GET /api/notifications/:email`
```javascript
/**
 * Get notifications for the user with email address email.
 * @name GET/api/notifications/:email
 * :email - user's email
 * @return {string} - notifications
 */
```

`GET /api/notifications/:email/preferences`
```javascript
/**
 * Get notification preferences for the user with email address email.
 * :email - user's email
 * @return {Object} with fields:
 *    preferences: a list of the user's notification preferences
 */
```

`PUT /api/notifications/:email/preferences`
```javascript
/**
 * Modify notification preferences for the user with email address email.
 * :email - user's email
 * @param preferences - a list of new preferences for this user
 * @return success message - if successful
 */
```

`POST /api/notifications/:nid`
```javascript
/**
 * Mark a notification as viewed.
 * @name PUT/api/notifications/:nid
 * @param nid - notification id
 */
```

## /api/restaurants:
`GET /api/restaurants/location/:zip/criteria/:criteria`
```javascript
/**
 * Search nearby restaurants by criteria, which can be any text query.
 * @name GET/api/restaurants/location/:zip/criteria/:criteria
 * :zip is the zip code to search near
 * :criteria is the criteria to add
 * @return {Restaurants} - the list of Restaurants that satisfy the criteria near the zip code
 * @throws {400} - if zip code is invalid
 */
```

`GET /api/restaurants/location/:zip/price/:price`
```javascript
/**
 * Search nearby restaurants with max price range being price
 * @name GET/api/restaurants/location/:zip/price/:price
 * :zip is the zip code to search near
 * :price is the max price range
 * @return {Restaurants} - the list of Restaurants that satisfy the max price range
 * @throws {400} - if zip code is invalid
 */
```

`GET /api/restaurants/location/:zip`
```javascript
/**
 * Search for restaurants in a certain zip code area
 * @name GET/api/restaurants/location/:zip
 * :zip is the zip code we are looking for restaurants in
 * @return {Restaurants} - the list of Restaurants from that zip code
 * @throws {400} - if zip code is invalid
 */
```

## /api/users

`POST /api/users/:email`
```javascript
/**
 * Make a new user
 * @name POST/api/users/:email
 * :email - the email address for the new user
 * @param firstName - the first name for the new user
 * @param lastName - the last name for the new user
 * @param passwordHash - the password hash for the new user
 * @param zipCode - the zip code for the new user
 * @return success message - if user was created successfully
 * @throws {400} - if email is not a valid email address or is already associated with an account, or if zipCode is not a valid 5-digit zip code
 */
```

`POST /api/users/:email/login`
```javascript
/**
 * Log in an existing user
 * @name POST/api/users/:email/login
 * :email - the email address of the user
 * @param passwordHash - the password hash of the user
 * @return success message - if user was logged in successfully
 * @throws {400} - if email address is nonexistent or password is wrong
 */
```

`GET /api/users/:email/greatings`
```javascript
/**
 * Get the grEATings for a user
 * @name GET/api/users/:email/greatings
 * :email - the email address of the user
 * @return {info} - object with fields:
 *    accepted: a list of Greatings that this user is a member of 
 *    invited: a list of Greatings that this user has been invited to
 * @throws {404} - if the user could not be found
 */
```

`GET /api/users/:email/restrictions`
```javascript
/**
 * Get the dietary restrictions for a user
 * @name GET/api/users/:email/restrictions
 * :email - the email address of the user
 * @return {info} - object with fields:
 *    restrictions: a list of dietary restrictions that this user has specified
 * @throws {404} - if the user could not be found
 */
```

`PUT /api/users/:email/restrictions`
```javascript
/**
 * Update the dietary restrictions for a user
 * @name PUT /api/users/:email/restrictions
 * :email - the email address of the user
 * @param restrictions -  a new list of dietary restrictions for this user
 * @return success message - if the user's dietary restrictions were successfully updated
 * @throws {404} - if the user could not be found
 */
```
