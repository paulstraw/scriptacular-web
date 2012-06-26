class User < ActiveRecord::Base
  has_secure_password

  attr_accessible :email, :password, :password_confirmation, :username

  validates_uniqueness_of :email
  validates_presence_of :email
  validates_uniqueness_of :username
  validates_presence_of :username
  validates :password, presence: {on: :create}, length: {minimum: 8}, :if => :password_digest_changed?
end
