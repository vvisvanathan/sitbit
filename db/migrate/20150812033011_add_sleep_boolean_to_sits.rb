class AddSleepBooleanToSits < ActiveRecord::Migration
  def change
    add_column :sits, :is_sleep, :boolean, default: false
  end
end
