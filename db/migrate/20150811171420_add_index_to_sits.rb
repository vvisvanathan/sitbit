class AddIndexToSits < ActiveRecord::Migration
  def change
    add_index :sits, :user_id
  end
end
