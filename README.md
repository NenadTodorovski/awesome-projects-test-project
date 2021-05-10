# Run 'npm install' in both root directory and in client-app

# Run 'npm start' from the root folder to run the project with the server and mock in-memory mock database
    -The npm package 'concurrently' takes care of running the server and the client app at the same time;
    -Used 'nodemon' for development purposes and also to autoamtically restart the development server anytime a change has been made to the code while the code is still running (e.g. experimenting with the views, components...);

# Used the npm package 'mongodb-memory-server' to create an in-memory mock database

# It works as a persistance layer and the data will not be lost even when the browser is refreshed/reloaded
    -It keeps the data while the dev server is running and resets only when it is restarted;
    -There are two initially seeded projects with a few tasks to start things up;
    -Used npm package 'uuid' to create unique IDs for the models, both projects and tasks;

# Used react-bootstrap and bootstrap for the styling to focus more on the functional part of the app
