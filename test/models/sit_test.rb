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

require 'test_helper'

class SitTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
