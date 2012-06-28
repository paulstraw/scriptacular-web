class User < ActiveRecord::Base
  has_secure_password

  attr_accessible :email, :password, :password_confirmation, :username

  validates_uniqueness_of :email
  validates_presence_of :email
  validates_uniqueness_of :username
  validates_presence_of :username

  has_many :projects

  validates :password, presence: {on: :create}, length: {minimum: 8}, :if => :password_digest_changed?

  def to_param
    username
  end

  def get_projects
    # TODO this is hacky
    current = Project.where(user_id: id)
    previous = Version.where(whodunnit: id).group('item_id').order('created_at desc').map do |version|
      version.next ? version.next.reify : version.reify
    end
    all = current + previous

    all.uniq { |project| project.id }
  end
end
