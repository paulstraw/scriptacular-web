class Project < ActiveRecord::Base
  has_paper_trail

  attr_accessible :description, :markup, :script, :style, :title, :libraries

  belongs_to :user

  def to_param
    slug
  end

  def generate_slug
    Base64.encode64(UUIDTools::UUID.random_create)[0..5]
  end

  before_create do
    self.slug = generate_slug

    #ensure slug is unique
    while Project.find_by_slug(self.slug) != nil
      self.slug = generate_slug
    end
  end

  before_save do
    project_html = Nokogiri::HTML(self.markup)
    html_title = project_html.at_css('title')
    html_description = project_html.at_css('meta[name="description"]')

    self.title = (html_title.nil? || html_title.text == '') ? 'Untitled' : html_title.text
    self.description = (html_description.nil? || html_description.attr('content') == '') ? nil : html_description.attr('content')
  end
end