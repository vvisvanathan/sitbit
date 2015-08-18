class Api::UsersController < ApplicationController
  def index
    # TODO: Includes? no
    @users = User.all
    render :index
  end

  def show
    # TODO: params: {
    #   start_date:
    #   end_date:
    # }
    # where("sits.start_time < ?"). 
    @user = User.includes(:sits).find(params[:id])
    render :show
  end

  def update
    @user = current_user
    if @user.update(user_params)
      render :show
    else
      render json: @user.errors.full_messages, status: :unprocessable_entity
    end
  end

  private
  def user_params
    params.require(:user).permit(:username, :password, :session_token, :sex, :weight, :height, :age, :actx, :cals_in)
  end
end
