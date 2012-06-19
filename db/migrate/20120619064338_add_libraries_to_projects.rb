class AddLibrariesToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :libraries, :text
  end
end
