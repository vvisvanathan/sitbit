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
#

class Sit < ActiveRecord::Base
  validates :user, :start_time, :end_time, :weight, :actx, presence: true
  validates :is_sleep, :inclusion => {:in => [true, false]}
  validate :start_before_end, :does_not_overlap
  after_initialize :ensure_attrs

  belongs_to :user

  def interval
    interval = interval_in_seconds

    return {
      in_seconds: interval,
      in_minutes: (interval / 60),
      in_hours: (interval / 3600 ),
      in_days: (interval / (3600 * 24))
    }
  end

  def interval_in_seconds
    return self.end_time.to_f - self.start_time.to_f
  end

  def sit_cals_rate
    return (self.sit_cals / self.interval[:in_hours] ) * 24
  end

  def sit_cals
    # Male (imperial): RMR = [(6.25 x WP) + (12.7 x HI) - (6.76 x age) + 66] x 1.1
    # Female (imperial): RMR = [(4.35 x WP) + (4.7 x HI) - 4.68 x age) + 655] x 1.1

    user_attrs = user.attributes
    sex = user_attrs['sex']
    age = user_attrs['age']
    weight = self.weight
    height = user_attrs['height']
    is_sleep ? sleepx = 0.75 : sleepx = 1

    if sex == 'm'
      wX, hX, aX, oX = 6.25, 12.7, 6.76, 66
    elsif sex == 'f'
      wX, hX, aX, oX = 4.35, 4.7, 4.68, 655
    else
      wX, hX, aX, oX = (6.25 + 4.35)/2, (12.7 + 4.7)/2, (6.76 + 4.68)/2, (66 + 655)/2
    end

    hc = ((weight * wX) + (height * hX) - (age * aX) + oX) * self.interval[:in_days] * sleepx

    return hc
  end

  def hyp_cals
    return (self.sit_cals / 0.85) if self.is_sleep

    return self.sit_cals * (1.0 + ( (self.actx ** 2.25) / 10 ))
  end

  def hyp_cals_rate
    return (self.hyp_cals / self.interval[:in_hours] ) * 24
  end

  def cal_stats
    sitc = sit_cals
    scr = (sitc / self.interval[:in_hours])
    hypc = hyp_cals
    hcr = (hypc / self.interval[:in_hours] )
    net = hypc - sitc
    netr = hcr - scr

    return {
      sit_cals: sitc,
      sit_rate: scr,
      hyp_cals: hypc,
      hyp_rate: hcr,
      net: net,
      net_rate: netr
    }
  end


  def steps_avoided
    return 0 if self.is_sleep
    uws = user.walk_stats
    dist_avoided = (uws[:pace] * self.interval[:in_hours])
    steps_avoided = (dist_avoided * 63360.0) / uws[:stride]
    return steps_avoided * (1 + 0.4*(self.actx - 3))
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
