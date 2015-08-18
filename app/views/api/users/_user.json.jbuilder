json.extract! user,
              :id,
              :username,
              :sex,
              :age,
              :weight,
              :height,
              :actx,
              :cals_in,
              :rmr

if show_sits
  json.sits do
    # TODO: fix this
    json.array! user.sits do |sit|
      # TODO: add sit_time_today, calories_burned, etc.
      json.extract! sit, :id,
                         :start_time,
                         :end_time,
                         :is_sleep,
                         :interval,
                         :cal_stats,
                         :steps_avoided,
                         :hourly_split
    end
  end
end
