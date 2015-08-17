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
#

class User < ActiveRecord::Base
  validates :username, presence: true, length: { minimum: 3, maximum: 12, allow_nil: false }
  validates :username, :session_token, uniqueness: true
  validates :password, length: { minimum: 6, allow_nil: true }
  validates :password_digest, :session_token, :age, :weight, :height, :cals_in, presence: true
  validates :sex, presence: true, inclusion: {:in => ['m', 'f', 'o']}
  validates :actx, presence: true, inclusion: {:in => [1, 2, 3, 4]}
  after_initialize :ensure_session_token, :ensure_cals_in
  attr_reader :password

  has_many :sits

  def walk_stats
    pace = 3.1 * (self.height/70.0)
    stride = 0.414 * self.height

    return { pace: pace, stride: stride }
  end

  def rmr
    if self.sex == 'm'
      wX, hX, aX, oX = 6.25, 12.7, 6.76, 66
    elsif self.sex == 'f'
      wX, hX, aX, oX = 4.35, 4.7, 4.68, 655
    else
      wX, hX, aX, oX = (6.25 + 4.35)/2, (12.7 + 4.7)/2, (6.76 + 4.68)/2, (66 + 655)/2
    end

    return (((self.weight * wX) + (self.height * hX) - (self.age * aX) + oX) * (1.0 + ( (self.actx ** 2.25) / 10 ))) / 24
  end

  # authentication:

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)
    return nil unless user && user.valid_password?(password)
    user
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def valid_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def reset_token!
    self.session_token = SecureRandom.urlsafe_base64(16)
    self.save!
    self.session_token
  end

  private
  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64(16)
  end

  def ensure_cals_in
    self.cals_in ||= 1200 + (self.actx * 400)
  end
end
