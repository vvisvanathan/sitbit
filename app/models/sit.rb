# == Schema Information
#
# Table name: sits
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  start_time :datetime         not null
#  end_time   :datetime         not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  is_sleep   :boolean          default(FALSE)
#  weight     :integer          not null
#  actx       :integer          not null


class Sit < ActiveRecord::Base
  validates :user, :start_time, :end_time, :weight, :actx, presence: true
  validates :is_sleep, :inclusion => {:in => [true, false]}
  validate :start_before_end, :does_not_overlap
  after_initialize :ensure_attrs

  belongs_to :user

  def interval
    return (self.end_time.to_f - self.start_time.to_f) /3600
  end

  def sit_cals
    # Male (imperial): RMR = [(6.25 x WP) + (12.7 x HI) - (6.76 x age) + 66] x 1.1
    # Female (imperial): RMR = [(4.35 x WP) + (4.7 x HI) - 4.68 x age) + 655] x 1.1

    user_attrs = user.attributes
    sex = user_attrs['sex']
    age = user_attrs['age']
    height = user_attrs['height']
    weight = self.weight
    is_sleep ? sleepx = 0.85 : sleepx = 1

    if sex == 'm'
      wX, hX, aX, oX = 6.25, 12.7, 6.76, 66
    elsif sex == 'f'
      wX, hX, aX, oX = 4.35, 4.7, 4.68, 655
    else
      wX, hX, aX, oX = 5.3, 8.7, 5.72, 360.5
    end

    burn_rate = (weight * wX) + (height * hX) - (age * aX) + oX
    return burn_rate * self.interval * (sleepx/24.0)
  end

  def cal_stats
    sitc = sit_cals
    scr = (sitc / self.interval)

    return { sit_cals: sitc, sit_rate: scr }
  end

  def steps_avoided
    return 0 if self.is_sleep
    uws = user.walk_stats
    normalizer = 0.15 * (1 + 0.45*(self.actx - 3))
    dist_avoided = (uws[:pace] * self.interval) * normalizer
    steps_avoided = (dist_avoided * 63360.0) / uws[:stride]
    return steps_avoided
  end

  def hourly_split
    s_local = self.start_time.localtime
    e_local = self.end_time.localtime
    t_start = s_local.hour + (s_local.min/60.0)
    t_end = e_local.hour + (e_local.min/60.0)
    output = []

    day_incr = 0
    sincr = t_start.to_i
    eincr = t_end.to_i + 1
    until sincr == eincr
      if sincr > 23
        sincr = 0
        day_incr = 1
      end
      t_start.between?(sincr, sincr + 1) ? startmark = t_start : startmark = sincr
      t_end.between?(sincr, sincr + 1) ? endmark = t_end : endmark = (sincr + 1)

      output.push({
        date: {
          day: s_local.day + day_incr,
          month: s_local.month,
          year: s_local.year
        },
        h_start: startmark,
        h_end: endmark,
        is_sleep: self.is_sleep,
        scr: self.sit_cals / self.interval,
        step_rate: self.steps_avoided / self.interval
      })

      sincr += 1
    end

    # date used to parse day/week/month/year in JS
    # h_start/h_end are in decimal time i.e. 1:15pm -> 13.25
    return output
  end

  private

  def overlapping_sits
    Sit.where('(:id IS NULL) OR (id != :id)', id: self.id)
       .where(user_id: self.user_id)
       .where(<<-SQL, start_time: start_time, end_time: end_time)
              NOT( (start_time > :end_time) OR (end_time < :start_time) )
        SQL
  end

  def does_not_overlap
    unless overlapping_sits.empty?
      errors[:base] << "Sit interval conflicts with existing sit interval"
    end
  end

  def start_before_end
    unless self.end_time > self.start_time
      errors.add(:end_time, "can't be before start time")
    end
  end

  def ensure_attrs
    return unless self.user
    self.weight ||= self.user.weight
    self.actx ||= self.user.actx
    self.is_sleep ||= false
  end
end
