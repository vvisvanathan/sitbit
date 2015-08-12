json.extract! user,
              :id,
              :username,
              :sex,
              :age,
              :weight,
              :height,
              :actx,
              :cals_in,
              :walk_stats,
              :created_at

if show_sits
  json.sits do
    json.array! user.sits do |sit|
      # TODO: add sit_time_today, calories_burned, etc.
      json.extract! sit, :id,
                         :start_time,
                         :end_time,
                         :is_sleep,
                         :interval_in_hours,
                         :cal_stats,
                         :steps_avoided
    end
  end
end
