# STSaver Server

[Live Page](https://stsaver-app.now.sh/)

[Front End Repo](https://github.com/patrickgus/stsaver-app)

## Summary

STSaver is a screen-time tracker app where users can log their time looking at a screen whether it be a computer screen, phone screen, tablet screen, or a television screen. Users will be able to see their activity in the past 7 days in an activity bar-chart. There is also a timer where the user will be able to set a time for a work session and a break session and will be alerted by an alarm.

## Built with:

  - React.js
  - Node.js
  - Express.js
  - PostgreSQL
  - REST API
  - CSS
  - HTML
  - jQuery
  - Mocha
  - Chai

## Screenshots of the user's journey

To demo the app you can click on the 'demo' button at the bottom of the login form.

Or you could make your own user profile if you like. You would just need to supply your first name, last name, a username, and a protected password.
_We do not share any personal information with anyone else._

### Landing Page:
![STSaver-LandingPage](https://user-images.githubusercontent.com/53308172/76572448-59e09e00-6477-11ea-8f3e-ddd21d258942.png)
If you click on the 'Register' link in the top, right-hand corner of the page, you will be brought to the Registration Page.
### Registration Page:
![STSaver-RegistrationPage](https://user-images.githubusercontent.com/53308172/76572479-6ebd3180-6477-11ea-9472-16f3d4966fae.png)
If you successfully log in with a correct username and password, you will be brought to the Activity page.
### Activity Page:
![STSaver-ActivityPage](https://user-images.githubusercontent.com/53308172/76572521-8694b580-6477-11ea-8191-8da4fda8cc4d.png)
Clicking on 'Add Log' in the top navigation menu will let you add a new log to your Activity page.
### Add Log Page:
![STSaver-AddLogPage](https://user-images.githubusercontent.com/53308172/76572591-b5ab2700-6477-11ea-9035-b24f854e5653.png)
Clicking on 'Timer' in the top navigation menu will bring you to the Timer page.
### Timer Page:
![STSaver-TimerPage](https://user-images.githubusercontent.com/53308172/76572644-e1c6a800-6477-11ea-8c5e-788a6b1ef45a.png)
Here you can set a timer for your work session and break session.
## API Docs

GET, POST, DELETE, and PATCH fetch requests are made via RESTful API.

Base API URL is 'https://obscure-oasis-82471.herokuapp.com/api'

### Endpoints:

  - '/logs'
  - '/users'
  - '/auth'
