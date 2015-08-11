class Api::SitsController < ApplicationController
  before_action :require_login

  def index
    @sits = current_user.sits
    render :index
  end

  def create
    @sit = Sit.new(sit_params)
    @sit.user_id = current_user.id
    if @sit.save
      render :index
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
    params.require(:sit).permit(:start_time, :end_time)
  end
end
