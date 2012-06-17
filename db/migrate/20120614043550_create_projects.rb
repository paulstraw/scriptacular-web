class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :title
      t.text :description
      t.text :markup
      t.text :style
      t.text :script
      t.string :slug
      t.integer :revision

      t.timestamps
    end
  end
end
