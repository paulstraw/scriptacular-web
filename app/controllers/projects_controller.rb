class ProjectsController < ApplicationController
	def show
		@the_version = (params[:revision] || 1).to_i
		@the_id = params[:id] || params[:project_id]
		@project = Project.find_by_slug(@the_id)

		#TODO right now, 404ing if project doesn't exist. should probably redirect to /new with a flash message instead
		if @project.nil?
			flash[:error] = "Looks like that project doesn't exist, but you can create a new one here."
			redirect_to '/new'
			return
		end


		@latest_version = @project
		@version_count = @project.versions.length
		@versions = @project.versions

		#since the latest version is stored as the current object in the database already, we only need to display a version if we're not showing latest
		if @the_version > @version_count || params[:revision] == 'latest'
			redirect_to "/#{@the_id}/#{@project.versions.length}"
			return
		elsif @the_version < 1
			redirect_to "/#{@the_id}"
			return
		elsif @the_version < @version_count
			@project = @project.versions[@the_version].reify
		end

		render 'projects/editor'
	end

	def new
		@project = Project.new(:markup =>
'<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width initial-scale=1">

		<title></title> <!-- give your project a name -->
		<meta name="description" content=""> <!-- give your project a description -->
	</head>
	<body>
		' + '
	</body>
</html>')

		render 'projects/editor'
	end

	def create
		@project = Project.new(params[:project])

		if current_user
			@project.user_id = current_user.id
		end

		@project.save
		redirect_to(@project)
	end

	def update
		@project = Project.find_by_slug(params[:id])

		if current_user
			@project.user_id = current_user.id
		else
			@project.user_id = nil
		end

		@project.update_attributes(params[:project])

		redirect_to "/#{@project.slug}/#{@project.versions.length}"
	end
end
