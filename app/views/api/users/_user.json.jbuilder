json.extract! user,
              :id,
              :username,
              :sex,
              :age,
              :weight,
              :height,
              :actx,
              :cals_in,
              :rmr,
              :walk_stats


if show_following
  json.followings do
    json.array! user.following do |follow|
      json.extract! follow, :id,
                            :username
    end
  end
end

if show_sits
  json.sits do
    json.array! user.sits do |sit|
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
