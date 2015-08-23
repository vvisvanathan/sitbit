# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  username        :string           not null
#  password_digest :string           not null
#  session_token   :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  sex             :string
#  weight          :integer          not null
#  height          :integer          not null
#  age             :integer          not null
#  actx            :integer          default(2), not null
#  cals_in         :integer          default(2000)
#  fname           :string
#  lname           :string
#  total_sit_time  :float
#

require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
