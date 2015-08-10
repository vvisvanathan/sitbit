# Phase 5: Searching for Blogs and Posts

## Rails
### Models
* follow
* notification

### Controllers
* Api::UsersController (index, show)
* Api::FollowsController (create, destroy)
* Api::NotificationsController (index, show, create, update, destroy)

### Views
* users/index.json.jbuilder
* users/show.json.jbuilder

## Backbone
### Models
User
Notifications

### Collections
Users
Notification

### Views
* UserSearchItem
* UsersSearch (composite view, subviews: UsersSearchItem)
* UsersIndexItem
* UsersIndex (composite view, subviews: UsersIndexItem)
* NotificationsIndexItem
* NotificationsIndex (composite view, subviews: NotificationsIndexItem)

## Gems/Libraries
