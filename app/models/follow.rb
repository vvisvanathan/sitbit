# == Schema Information
#
# Table name: follows
#
#  id         :integer          not null, primary key
#  follow_id  :integer          not null
#  user_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Follow < ActiveRecord::Base
end
