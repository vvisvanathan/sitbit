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
#

class Sit < ActiveRecord::Base
  validates :user, :start_time, :end_time, presence: true
  validate :ensure_valid_time_interval

  belongs_to :user

  def interval
    return self.end_time.to_f - self.start_time.to_f
  end

  def within_today
  end

  def within_week
  end


  private
  def ensure_valid_time_interval
    unless self.end_time > self.start_time
      errors.add(:end_time, "can't be before start time")
    end
  end
end
