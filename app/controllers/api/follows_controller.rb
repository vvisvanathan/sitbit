class Api::FollowsController < ApplicationController
  before_action :require_login

  def index
    @follows = current_user.follows.includes(:follower).includes(:followed)
    render :index
  end

  def show
    @follow = Follow.includes(:follower).includes(:followed).find(params[:id])
    render :show
  end

  def create
    @follow = Follow.new(follow_params)

    if @follow.save
      render :show
    else
      render json: @follow.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    @follow = Follow.find(params[:id])
    @follow.destroy
    index
  end

  private
  def follow_params
    params.require(:follow).permit(:follower_id, :followed_id)
  end
end
