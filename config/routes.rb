Rails.application.routes.draw do
  root to: 'static_pages#index'

  resource :users, only: [:new, :create]
  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do

    resources :users, only: [:index, :show, :update] do
      resources :sits, only: [:index, :create, :update, :destroy]
    end
  end
end
