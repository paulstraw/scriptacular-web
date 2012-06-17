class RemoveRevisionFromProject < ActiveRecord::Migration
  def up
    remove_column :projects, :revision
  end

  def down
    add_column :projects, :revision
  end
end
