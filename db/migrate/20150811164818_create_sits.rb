class CreateSits < ActiveRecord::Migration
  def change
    create_table :sits do |t|
      t.integer :user_id, null: false
      t.datetime :start_time, null: false
      t.datetime :end_time, null: false
      t.timestamps null: false
    end
  end
end
