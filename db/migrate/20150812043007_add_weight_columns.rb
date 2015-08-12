class AddWeightColumns < ActiveRecord::Migration
  def change
    add_column :users, :sex, :string, default: nil
    add_column :users, :weight, :integer, null: false
    add_column :users, :height, :integer, null: false
    add_column :users, :age, :integer, null: false
    add_column :users, :actx, :integer, null: false, default: 2
    add_column :users, :cals_in, :integer, default: 2000
    
    add_column :sits, :weight, :integer, null: false
    add_column :sits, :actx, :integer, null: false
  end
end
