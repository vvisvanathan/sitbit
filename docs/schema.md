# Schema Information

## sits
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
user_id     | integer   | not null, foreign key (references users)
start_time  | integer   | not null
end_time    | integer   | not null

## users
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
username        | string    | not null, unique
password_digest | string    | not null
session_token   | string    | not null, unique

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
body        | string    | not null
status      | string    | not null
url         | string    | not null
