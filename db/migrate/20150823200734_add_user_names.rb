class AddUserNames < ActiveRecord::Migration
  def change
    add_column :users, :fname, :string
    add_column :users, :lname, :string
    add_column :users, :total_sit_time, :float
  end
end
