class Api::UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    render :show
  end

  private
  def user_params
    params.require(:user).permit(:username, :password, :session_token)
  end
end
