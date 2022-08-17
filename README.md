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

## Mongoose Schemas's 
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
## Image
