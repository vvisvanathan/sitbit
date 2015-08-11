class SessionsController < ApplicationController
  def new
  end

  def create
    u = User.find_by_credentials(
      params[:user][:username],
      params[:user][:password]
    )

    if u
      login!(u)
      redirect_to ''
    else
      flash.now[:errors] = ["Invalid username or password"]
      render :new
    end
  end

  def destroy
    logout!
    redirect_to new_session_url
  end
end
