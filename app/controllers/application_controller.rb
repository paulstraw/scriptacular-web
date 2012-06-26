class ApplicationController < ActionController::Base
  protect_from_forgery

  def index
    @recently_updated = Project.order('updated_at desc').limit(5)
    @newest = Project.order('created_at desc').limit(5)
  end

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

private

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  helper_method :current_user

  def authorize
    redirect_to login_url, alert: "You need to log in to do that." if current_user.nil?
  end
end
