# == Schema Information
#
# Table name: follows
#
#  id          :integer          not null, primary key
#  follower_id :integer          not null
#  followed_id :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Follow < ActiveRecord::Base
  validates :follower, :followed, presence: true
  validates :followed_id, uniqueness: { scope: :follower_id }
  belongs_to :follower, class_name: 'User'
  belongs_to :followed, class_name: 'User'
end
