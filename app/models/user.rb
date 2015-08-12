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
  validates :password_digest, :session_token, :age, :weight, :height, :actx, :cals_in, presence: true
  validates :username, presence: true, length: { minimum: 3, maximum: 12, allow_nil: false }
  validates :sex, :inclusion => {:in => ['m', 'f', 'o']}
  validates :password, length: { minimum: 6, allow_nil: true }
  validates :username, :session_token, uniqueness: true
  after_initialize :ensure_session_token, :ensure_cals_in
  attr_reader :password

  has_many :sits

  def walk_stats
    pace = 3.1 * (self.height/70.0)
    stride = 0.414 * self.height

    return { pace: pace, stride: stride }
  end

  # TODO: delete rhr?
  def rhr
    return (45 + (10 * self.actx)) + (self.age / 11) if self.sex == 'm'
    return (50 + (10 * self.actx)) + (self.age / 11) if self.sex == 'f'
    return (47 + (10 * self.actx)) + (self.age / 11)
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
