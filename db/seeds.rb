# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

DATA_CUTOFF = 1.month.ago
TIME_NOW = Time.now.localtime

User.create(username: 'bob', fname: "Bob", lname: "Bobson", password: 123123, sex: 'm', age: 35, weight: 160, height: 71, actx: 2, cals_in: 2000)
User.create(username: 'Guest', fname: "Guest", password: 123123, sex: 'm', age: 35, weight: 160, height: 71, actx: 2, cals_in: 2000)
User.create(username: 'RondaRousey', fname: "Ronda", lname: "Rousey", password: 123123, sex: 'f', age: 28, weight: 135, height: 67, actx: 3, cals_in: 3000)
User.create(username: 'KanyeWest', fname: "Kanye", lname: "West", password: 123123, sex: 'm', age: 38, weight: 168, height: 68, actx: 2, cals_in: 2300)
User.create(username: 'Rihanna', fname: "Robyn", lname: "Rihanna", password: 123123, sex: 'f', age: 27, weight: 124, height: 68, actx: 2, cals_in: 1700)
User.create(username: 'KingJames', fname: "LeBron", lname: "James", password: 123123, sex: 'm', age: 28, weight: 250, height: 80, actx: 3, cals_in: 5000)
User.create(username: 'JonnyIve', fname: "Jonny", lname: "Ive", password: 123123, sex: 'm', age: 48, weight: 180, height: 65, actx: 1, cals_in: 3000)
User.create(username: 'Kobe8', fname: "Kobe", lname: "Bryant", password: 123123, sex: 'm', age: 36, weight: 205, height: 78, actx: 3, cals_in: 3800)
User.create(username: 'RubyRon', fname: "Ron", lname: "Ruby", password: 123123, sex: 'm', age: 28, weight: 150, height: 67, actx: 1, cals_in: 1500)
User.create(username: 'JavaJohn', fname: "John", lname: "Java", password: 123123, sex: 'm', age: 35, weight: 200, height: 68, actx: 1, cals_in: 2500)
User.create(username: 'PeterD', fname: "Peter", lname: "Dinklage", password: 123123, sex: 'm', age: 46, weight: 250, height: 53, actx: 1, cals_in: 1700)
User.create(username: 'HisAirness', fname: "Michael", lname: "Jordan", password: 123123, sex: 'm', age: 56, weight: 198, height: 78, actx: 2, cals_in: 2500)
User.create(username: 'TSwift', fname: "Taylor", lname: "Swift", password: 123123, sex: 'f', age: 28, weight: 150, height: 69, actx: 2, cals_in: 2000)
User.create(username: 'FatAl', fname: "Albert", lname: "Jackson", password: 123123, sex: 'm', age: 28, weight: 280, height: 68, actx: 1, cals_in: 6000)


def seed_sits
  add_daytime_sits
  add_sleep
end

def add_daytime_sits
  User.pluck(:id, :weight, :actx).each do |user_id, user_weight, user_actx|
    d_day = DATA_CUTOFF.to_date

    until d_day >= TIME_NOW.to_date
      fill_days_with_sits(user_id, user_weight, user_actx, d_day)
      d_day += 1
    end

    add_sits_for_today(user_id, user_weight, user_actx)
  end
end

def fill_days_with_sits(user_id, user_weight, user_actx, date)
  s_floor = date.to_time + secondize(9)
  s_cap = date.to_time + secondize(20)
  sit_start, sit_end = s_floor, s_floor

  while sit_end <= s_cap
    sit_start = sit_end + rand(secondize(0.5)..secondize(1.5))
    sit_end = sit_start + rand(secondize(0.5)..secondize(3.0))

    if sit_start < s_cap && sit_end < s_cap
      sit = Sit.new(user_id: user_id,
                    start_time: sit_start,
                    end_time: sit_end,
                    is_sleep: false,
                    weight: user_weight,
                    actx: user_actx
                    )
      if sit.save
        user = sit.user
        new_total_st = user.total_sit_time + sit.interval
        user.update({ total_sit_time: new_total_st })
      end
    end
  end
end

def add_sits_for_today(user_id, user_weight, user_actx)
  s_floor = TIME_NOW.to_date.to_time + secondize(9)
  s_cap = TIME_NOW
  sit_start, sit_end = s_floor, s_floor

  while sit_end <= s_cap
    sit_start = sit_end + rand(secondize(0.5)..secondize(1.5))
    sit_end = sit_start + rand(secondize(0.5)..secondize(3.0))

    if sit_start < s_cap && sit_end < s_cap
      sit = Sit.new(user_id: user_id,
                    start_time: sit_start,
                    end_time: sit_end,
                    is_sleep: false,
                    weight: user_weight,
                    actx: user_actx
                    )
      if sit.save
        user = sit.user
        new_total_st = user.total_sit_time + sit.interval
        user.update({ total_sit_time: new_total_st })
      end
    end
  end
end

def add_sleep
  User.pluck(:id, :weight, :actx).each do |user_id, user_weight, user_actx|
    d_day = DATA_CUTOFF.to_date

    until d_day >= TIME_NOW.to_date
      sleep_start, sleep_end = random_sleep_interval(d_day)
      d_day += 1

      sit = Sit.new(user_id: user_id,
                    start_time: sleep_start,
                    end_time: sleep_end,
                    is_sleep: true,
                    weight: user_weight,
                    actx: user_actx
                    )
      if sit.save
        user = sit.user
        new_total_st = user.total_sit_time + sit.interval
        user.update({ total_sit_time: new_total_st })
      end
    end
  end
end

def random_sleep_interval(date)
  t_sleep_start = date.to_time + rand(secondize(21)..secondize(23.5))
  t_sleep_end = t_sleep_start + rand(secondize(6)..secondize(9))

  t_sleep_end = TIME_NOW if t_sleep_end > TIME_NOW

  return [t_sleep_start.to_datetime, t_sleep_end.to_datetime]
end

def secondize(hours)
  return hours * 3600
end

seed_sits
