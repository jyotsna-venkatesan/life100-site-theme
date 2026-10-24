# Gazet - Ghost theme


## Requirements

Ghost `6.0` or higher


## Config

The package.json file contains the basic configurations:
- `posts_per_page` - for setting the number of posts per page
- responsive image sizes
- custom theme settings

The custom settings are available in the Ghost Admin under **Settings > Design**


## Install

To install the theme do the following:
1. Upload the theme zip file in your Ghost Admin.
- check out the [official guide](https://ghost.org/help/installing-a-theme/) for more details.

2. Upload the `routes.yaml` file.
- Go to **Settings > Labs > Routes**

3. Adjust the Custom Settings
- Custom settings are split into 3 categories: Site-wide, Homepage and Post
- Go to **Setting > Design > Site-wide/Homepage/Post**

For more details check out the [official theme documentation](https://brightthemes.com/docs/gazet/).


## Development

The theme is built with [TailwindCSS](https://tailwindcss.com/) and [Alpine.js](https://alpinejs.dev/).
The development environment is based on [Vite](https://vitejs.dev/), the tasks can ran with npm scripts.

1. `npm run dev` (`vite build --watch & vite`)
The dev script will start the development process, watching for changes and building.
The `vite.config.js` file contains the main configuration for Vite.

2. `npm run build` (`vite build`)
The build script will start the build process.

3. `npm run test` (`gscan . --verbose`)
The test will test the theme using [gscan](https://gscan.ghost.org/) the official Ghost test tool.

4. `npm run zip`
The zip script will create a zip file in the `dist` directory.


## Demo

[https://gazet.brightthemes.com/](https://gazet.brightthemes.com/)


## Documentation

[https://brightthemes.com/docs/gazet](https://brightthemes.com/docs/gazet/)


## Help

[https://brightthemes.com/contact/](https://brightthemes.com/contact/)
