class Api::SitsController < ApplicationController
  before_action :require_login

  def index
    @sits = current_user.sits.includes(:user)
    render :index
  end

  def show
    @user = Sit.includes(:user).find(params[:id])
    render :show
  end

  def create
    fixed_st = (sit_params[:start_time]).to_time
    fixed_et = (sit_params[:end_time]).to_time
    @sit = Sit.new(
      start_time: fixed_st,
      end_time: fixed_et,
      is_sleep: sit_params[:is_sleep]
    )
    @sit.user_id = current_user.id
    @sit.weight = current_user.weight
    @sit.actx = current_user.actx
    @sit.is_sleep ||= false

    if @sit.save
      render :show
    else
      render json: @sit.errors.full_messages, status: :unprocessable_entity
    end
  end

  def update
    @sit = Sit.find(params[:id])
    if @sit.update(sit_params)
      render :index
    else
      render json: @sit.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    @sit = Sit.find(params[:id])
    @sit.destroy
    index
  end

  private
  def sit_params
    params.require(:sit).permit(:start_time, :end_time, :is_sleep)
  end
end
