---
title: Introduction - Get started
---

## [Full Video tutorial](https://www.youtube.com/watch?v=2V3A_LTFu4E)

1. Install Squeezer's command line tool globally on your machine using npm:
`npm install squeezer-cli -g`
2. Create a new project using the squeezer-2way-payment template: 
`sqz create --project my-first-project --template https://github.com/SqueezerIO/squeezer-2way-payment`
3. Switch to the project's directory:
    `cd my-first-project`
4. Initialize the local directory as a Git repository:
    `git init`
5. Add the files in your new local repository. This stages them for the first commit:
    `git add .`
6. Open up GitHub in a browser, navigate to the repositories page, and click on the `New` button, and enter the name of your project that you've created locally, in our case it will be my-first-project, then create the new repository.
7. In Terminal, add the URL for the remote repository where your local repository will be pushed:
    git remote add origin remote repository URL
8. Commit the files that you've staged in your local repository:
    `git commit -m "First commit"`
9. Push the master branch to GitHub:
    `git push -u origin master`
10. Open up a new browser window and navigate to https://platform.squeezer.io, then login to the platform.
11. Click on the import project button and import the project you've created from GitHub.
12. In the first step of the import process, you have to select the repository from your list.
13. In the second step of the import, you have to choose the provider and the stage name, dev or prod.
14. After importing the project, the deployment will start automatically.
15. When the deploy will be finished, we can check the logs by clicking on it.
16. Scroll all the way down in the log window and copy the Swagger URL, then paste in a browser window.


<br/><br/>

## ChainKit - Agnostic blockchain integration

The main usage of the ChainKit is to unify top blockchains interfaces into a single normalized API interface , therefore you can build blockchain apps easily without digging into all blockchain infrastructures.


### [Learn how to use ChainKit](https://github.com/SqueezerIO/squeezer-chainkit)