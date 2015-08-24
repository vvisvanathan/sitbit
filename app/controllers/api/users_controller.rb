class Api::UsersController < ApplicationController
  def index
    if params[:query].present?
      query = params[:query].downcase
      @users = User
        .where("lower(username) ~ ? OR lower(lname) ~ ? OR lower(fname) ~ ?", query, query, query)
    else
      @users = (User.all.sort_by { |user| user.total_sit_time}).reverse
    end
    render :index
  end

  def show
    # TODO: params: {
    #   start_date:
    #   end_date:
    # }
    # where("sits.start_time < ?").
    # @sits = (eventually when doing d/w/m/y)

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
