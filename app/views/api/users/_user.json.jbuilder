json.extract! user,
              :id,
              :username,
              :fname,
              :lname,
              :sex,
              :age,
              :weight,
              :height,
              :actx,
              :cals_in,
              :rmr,
              :daily_avg

if show_sits
  json.sits do
    json.array! user.sits.sort_by {|sit| sit.start_time}.reverse do |sit|
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
