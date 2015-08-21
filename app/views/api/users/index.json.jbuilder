json.array! @users do |user|
  json.partial!('user', user: user, show_sits: false, show_following: false)
end
