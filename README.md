# Welcome to the Tether-API 🎮
*Have you ever had a problem connecting with others within a single interest of a
certain game but couldn't find a community that was on a single application? While
applications such as discord can provide the ability to create a group centered
around certain interests it's ability to reach out to others isn't as accessible as we
think creating an exclusivity feeling. Among thousands if not hundreds-of-thousands
of players within one community can make the feeling of connecting overwhelming,
Tether tries to take that feeling and combat it with a algorithmic search to pair
yourself up with others based of filters you have set or games you want a player 2
for.*

**This API is intended for the associated developers working under** 
[Tether](https://github.com/webcodejunkie/tether-app)

## Objective 
An application built to bring players together, either within a community or a 1 on 1
experience based off whatever game they interested in. Whether you want to make a
post within a community or find someone active who wants to play now. Tether will
get players connected.


## Getting Started
This project includes a jsdoc of all the API calls that provide documentation on what is passed in and expected through the requests, you can find them here where you can run them locally but opening the *global.html* in your browser. [jsDoc](https://github.com/webcodejunkie/tether-api/tree/main/out)

## Design Criteria
### Essential Features
* Integrate Socket.io for user to user chat system
* Allow new users to register
* Allow users to login
* Allow users to update their information (username, password, email, bio)
* Allow users to delete their profile
* Allow users to follow/unfollow other users
* Allow users to favorite/unfavorite games
* Allow users to create a community forum on a chosen game
* Allow the admin user of the create community forum to delete the forum
* Allow users to post messages on the community forum board
* Allow users to request to join a user created community forum
### Optional Features
* Let users upload a (single-file) profile picture
### User Stories

• As a consumer, I want to make a profile that will display a username, age, bio, and the type of player I am.

• As a user, I want to view different titles (games) that display information about 
them.

• As a user, I want to a collection of communities that are available to join 
dependent on what game I'm searching for.

• As a user, I want to add another user and have it reflect on my friends list.

• As a user of a community I want to create/delete/edit a posting of mine.

## Mongoose Schemas's
<details><summary> Mongoose Schemas's </summary>
  
**This API doesn't store game information, instead using a second API [RAWG](https://rawg.io/apidocs)**

## User

This API's user model is built around maintaining basic user information such as Username, Password, Email, Birthday, PlayerType, Bio, Country, and Region.

#### Username
Will be used to define user's across tether.
#### Password
Password's within tether are protected with a hashing system providing security amongost users
#### Email
Having a email tied to an account will bring future features such as verified users.
#### Birthday 
Having an age system to protect agaisnt users of the age of 18 not joining. 
#### PlayerType
PlayerType is a property to define the player's playstyle and seperate them to filters to add when looking for the right players.
#### Bio
User's will be able to define themselves.
#### Country
In order to allow users to be paired up within countries based off where they choose, we will ultilize a Country & Region property to stray away from geolocation adding an extra comfort that they aren't tracked based upon a pin-point location.
#### Region
Refers to Country.

## Community
**Comunity Model's to come soon.**


## Image
#### user
The uploaded image will have the userId tied to the posted image
#### name
Name of the image
#### desc
Description of the image
#### image
An onject that will store the contents of the image into
</details>
