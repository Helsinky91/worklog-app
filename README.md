# Worklog-App


## Access to our app
##### https://worklog.cyclic.app/

## About the web app
Worklog app is a website created to log all the working times of a worker inside a company, in this case an Hotel, and the Teamlead can check on those worklog times and validate them.
It also alows the Teamlead to create some events, and the worker to add some of those events to favourites and to be display on their profile.

---
## MVP (EXPRESS - MONGOOSE)
There is a Home view where you can either sign up or log in, and depending on your role status you can access two different views and funcionalities.

If you're a **worker** your role is *"user"*. Once you log in, you will be redirected to your profile, where you can edit your information, log the time you start working or you finish your workday, and you can leave a comment on each log. 
Also you can see a list of events and add some of those as favourite, and the'll be shown on your profile page.

If you're a **teamlead** your role is *"admin"*. Once you log in, you will be redirected to a dashboard where you can see some information of yourself, be redirected to the event page o a list of all workers and it will be already display the information of the workers that are active on that moment.
From the active workers list, you'll be able to edit some of their information and also validate the worklogs.

---
# Functionalities
- More functionalities on the same view depeding on the worker's role.
- Possibility to add Favourite some events.
- Possibility to create a worklog flow and change button depending if the user is Active or Inactive.

---
# Project Structure

## Routes
There are 5 routes that feed into each other. 
-**index.routes.js** => to configure the path of the following routes.
-**auth.routes.js** => to create the login & logout configuration.
-**profile.routes.js** => to configure the CRUD of a User.
-**admin.routes.js** => to configure admin role and it's aditional features.
-**events.routes.js** => to configure the CRUD of an Event.


## Models
There are 3 models: Event, Log and User, and their are connected between them.
**User.model.js** is connected with Event.Model, so a User can have many events on it's ID:

```
const userSchema = new Schema({
    events: [{
        type: Schema.Types.ObjectId, 
        ref: "Event"
    }],  
    }) 
```

**Log.model.js** is connected with User.model, so one Log will have only one User, but one User might have plenty Logs.
```
const logSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,  
        ref: "User"
    },
})
```
---
*The background image belongs to Vecteezy.com*

## Links
### Git
https://github.com/Helsinky91/worklog-app

### Slides
https://docs.google.com/presentation/d/1TACqs-7ggxfYX6yrsueunnyFZuw4TXNcUZvJo8ff9NQ/edit?usp=sharing