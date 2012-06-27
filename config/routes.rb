ScriptacularWeb::Application.routes.draw do
  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  delete 'logout', to: 'sessions#destroy', as: 'logout'

  resources :users
  resources :sessions

  resources :projects, :path => '' do
    member do
      get ':revision', :action => 'show'
    end
  end

  root :to => 'application#index'
end