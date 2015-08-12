json.extract! @user,
              :id,
              :username,
              :sex,
              :age,
              :weight,
              :height,
              :actx,
              :cals_in,
              :created_at

if show_sits
  json.sits do
    json.array! user.sits do |sit|
      # TODO: add sit_time_today, calories_burned, etc.
      json.extract! sit, :id, :user_id, :start_time, :end_time, :interval, :is_sleep
    end
  end
end
