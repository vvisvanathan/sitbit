# Schema Information

## sits
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
user_id     | integer   | not null, foreign key (references users)
start_time  | datetime  | not null
end_time    | datetime  | not null
is_sleep    | boolean   | default: false
weight      | integer   | not null
activ_lvl   | integer   | not null


## users
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
username        | string    | not null, unique
password_digest | string    | not null
session_token   | string    | not null, unique
sex             | string    | not null
age             | integer   | not null
weight          | integer   | not null
height          | integer   | not null
activ_lvl       | integer   | not null, default: 2
cals_in         | integer   | default: 2000

## followings
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
followee_id | integer   | not null, foreign key (references users)
follower_id | integer   | not null, foreign key (references users)

## notifications
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
user_id     | integer   | not null, foreign key (references users)
body        | text      | not null
status      | string    | not null
url         | string    | not null
