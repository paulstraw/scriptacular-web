class ApplicationController < ActionController::Base
  protect_from_forgery

  def index
    @newest_projects = Project.order('created_at desc').limit(5)
  end

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end
end
