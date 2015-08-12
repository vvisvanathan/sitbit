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

  def self.sits_today
  end

  def sit_time_today
  end

  def calories_saved_today
    # TODO: calculated calories saved based on calories burned versus hypothetical cals burned (based on actx)
    calories_burned
  end

  def interval
    return self.end_time.to_f - self.start_time.to_f
  end

# private

  def intervals_today
  end

  def calories_burned_sitting
    # MEN: Cals Burned = [(Age x 0.2017) — (Weight x 0.09036) + (Heart Rate x 0.6309) — 55.0969] x Time / 4.184.
    # WOMEN: Cals Burned = [(Age x 0.074) — (Weight x 0.05741) + (Heart Rate x 0.4472) — 20.4022] x Time / 4.184.

    time = (self.interval)
    a, w, hr = user.age, user.weight, user.rhr

    if user.sex == 'm'
      aX, wX, hrX, oX = 0.2017, 0.09036, 0.6309, 55
    elsif user.sex == 'f'
      aX, wX, hrX, oX = 0.074, 0.05741, 0.4472, 20
    else
      aX, wX, hrX, oX = (0.2017 + 0.074)/2, (0.09036 + 0.05741)/2, (0.6309 + 0.4472)/2, (55+20)/2
    end

    return ((aX * a) - (wX * w) + (hrX * hr) - oX) * time / 4.184
  end

  def hypothetical_calories_burned
  end

# validation:

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
