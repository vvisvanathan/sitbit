json.extract! @user,
              :id,
              :username,
              :created_at

if show_sits
  json.sits do
    json.array! user.sits do |sit|
      json.extract! sit, :id, :user_id, :start_time, :end_time, :interval
    end
  end
end
