class UsersController < ApplicationController
  def new
    @user = User.new
    render layout: 'projects'
  end

  def create
    @user = User.new(params[:user])

    if @user.save
      redirect_to root_url, notice: "You're all set. Time to make stuff."
    else
      render "new", layout: 'projects'
    end
  end

  def index
    @users = User.all
  end

  def show
    @user = User.find_by_username(params[:id])
    not_found unless @user
  end
end