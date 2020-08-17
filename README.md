# ConnellyPartners.com 3

Wordpress (Pantheon) + [Gatsby](https://gatsbyjs.org) powered statically generated site.

## Local Setup

1. Check out the cp-com-3 project from Gitlab (`git clone git@git.connellydigital.com:cp/cp-com-3.git`)
2. Open Terminal and navigate to the repository
3. Create and switch to your own branch (based on the `dev` branch): `git checkout -b [your branch name] dev`
4. `cd gatsby`
5. Install (globally) the Gatsby CLI: `npm install -g gatsby-cli`
6. Install npm dependencies: `npm install`
7. add `./gatsby/.env` and update it with:

    PANTHEON_ENV=dev

Replace `dev` with whatever environment on pantheon you want to read from

8. run `gatsby develop`
9. After the site builds, `http://localhost:8000` should be available to view the site.
  - `https://localhost:8000/__graphql` will have a GraphiQL application to test queries
10. Make changes, and push to GitLab
11. Netlify will build changes to a Branch Deploy
12. Make a pull request to merge branches, Netlify will also build a preview branch for that pull request.

Note that you can include `[skip ci]` in the commit message to `git push` without triggering an update. [More info here](https://www.netlify.com/docs/continuous-deployment/#skipping-a-deploy)

## Folder Setup (Recommended)

This repo includes a `gatsby/` folder with the front-end source files.

If the backend code needs to be updated. Clone it from pantheon into this folder (just to keep both parts of the site together). The folders `cms/` and `wordpress/` are gitignored if you want to use those. You can still use `lando` in the subfolder as well to use a local copy of Wordpress as the source during dev (clone Wordpress into this folder directly from Pantheon: `cp-com-3`).

Additionally `frontend-templates` is gitignored for pulling down front end code created by Webbymonks.

## Wordpress

All of the custom site functions for Wordpress (custom post types, etc.) is handled by plugins. There is no custom theme code. (TODO: replace default theme with a custom "theme" that is simply a redirect to cp.com/Netlify). Most custom stuff is handled in `cp-plugin`. ACF and Yoast API output is handled by those plugins (except for the `cp_meta` field for getting open graph info).

## Gatsby Config

No custom config for Gatsby other than setting `.env`, see "Reading data" below

## Branch Config

Three branches, `dev`, `test`, `master`, track to `dev`, `test`, and `live` on pantheon, and `dev--`, `test--` and production branches on Netlify (cp-com-3.netlify.com)

Additionally, other branches will be built into their own Branch Deploys on Netlify. ~~Currently these branches must be explicitly stated in Netlify site settings. Current branches are `swashington`, `mlee`, and `ewebster`~~ All branches will be deployed as branch deploys as of 7-9-2019.

## Reading data

The site reads from a Pantheon Wordpress install matching the `BRANCH` environment variable, defaulting to `dev` if none is found. To set the Pantheon environment you are reading from, create `.env` in `/gastby` and set `PANTHEON_ENV=[your env name here]` (see `.env.example`)

NB: This value will be replaced with the name of your branch when you deploy to netlify. If you deploy on a branch that isn't dev,test, or master (live), be sure to create a Pantheon multidev environment that matches your branch name.

You can also use Lando instance running locally to read your data from. In this case you can run `npm run build:lando` which will create a `public` folder with the static site based on data on Lando running locally. Then you can run `npx serve public` to serve that folder and browse it locally. You can also add `USE_LANDO=true` to your `.env` file to have this running in `gatsby develop`-mode. Note that the lando build depends on your lando site being hosted at `cpcom3.lndo.site`. If your lando address changes, this needs to be updated in the final export in `/gatsby/pantheon-branchname.js`.

## Deployment

This application is deployed and hosted on [Netlify](https://netlify.com). The site is a part of the "Connelly Partners" organization. Add new team members using the Netlify web dashboard.

Webhooks are set up in Gitlab that trigger builds when pushing to any branch. Pushing to a branch will create a branch deploy at `[branch-name]--cp-com-3.netlify.com`. As such, there are 3 key branches in the repo: `dev`, `test`, and `master` (which pushes to Netlify's production environment using Pantheon's live environment)

By default, the build will reach for the Dev environment in Pantheon (https://dev-cp-com-3.pantheonsite.io/wp-admin) for data to populate templates if it hasn't been specified otherwise.

If you wish to change this, edit `/netlify.toml` at the root of this repo (no need to edit `gatsby/netlify.toml`, this simply handles building lambda functions). Add a new `context` section named for your branch, and set the `PANTHEON_ENV` environment variable to the Pantheon environment you want (multidev, or dev/test/live).

```
[context."branch-name"]
  environment = { PANTHEON_ENV = "branch-name" }
```

Note that you can include the branch name in quotes if it include invalid characters for the config file (like dashes).

All builds (success or fail) are reported to the `#cpr_deployments` Slack channel for monitoring.

Netlify keeps track of every single build ever made for the site, and rolling back is as simple as accessing a build and clicking "Publish deploy". "Publishing" on Netlify means to promote that build to production. You can also publish deploys from other branches without merging into master. Note that deploys published this way will be overwritten with the next push to master. There is also a button on the Deploys screen that will lock publishing to the currently published build, meaning that neither updates to `master` nor content updates will update the site. Use this to lock down the site for a period of time.

## Triggering Builds

In addition to triggering builds based on code pushes, builds can also be triggered via content updates. Currently, Wordpress/Pantheon is configured to trigger a build when:

- Any content is saved (except for ACF fields). (see `/wp-content/plugins/cp-plugin/cp-init.php` -> `rebuild_on_save()` function in the Pantheon repo).
- Any content is migrated between environment (i.e. Clone database and files within Pantheon) (see `/.pantheon.yml` in the Pantheon repo)
- The caches for an environment are cleared. (via the "Clear Caches" button in the Pantheon Dashboard or via terminus).

The webhooks that trigger these are in the Netlify dashboard (under "Build & deploy") and you can use whatever tools you like to ping these URLs (Postman, IFTTT, etc.)

### Skipping Builds

You can have Netlify skip the build by including `[skip ci]` in your latest commit message.

You can also do `git commit --allow-empty -m "[skip ci]"` to make an empty commit if you have already committed all your changes.

## Build Errors

Common sources for build errors:

1. The Pantheon server isn't awake. Because the site isn't actively visited, Pantheon will spin down the container hosting Wordpress after 12 hours (at most) of inactivity (dev and test sleep sooner). There is currently an IFTTT script running* that constantly pings the servers to keep them awake, so this shouldn't happen unless that Applet stops running. You'll see this because a number of warning of "Remote content could not be found" will pop up in the logs following a failed build. This is usually fixed by accessing `/wp-admin` for that environment and re-running the build (Netlify has a button to "Retry deploy"...usually _not_ clearing cache helps). This may require clearing caches on Pantheon as well.

* There is also a version of this script running via cron on the Jenkins server that uses Terminus directly, as a backup/proof-of-concept in `/home/swash/bin/wake-cp.sh`. See appendix below.

2. Altered schema. This is common during maintenance or adding features. Sometimes the GraphQL schema will change if you are manipulating ACF Fields, and some fragments (and the types they refer to) will have to be updated. If you need to update types, refer to GraphiQL (http://localhost:8000/___graphql) when running in `gatsby develop` to update those fragments. The GraphiQL explorer still runs in `gatsby develop` even if the build fails (unless bootstrapping gatsby fails entirely, which should be rare).

3. Incorrect/Incomplete data. Not all portions of the site can handle missing data (i.e. images, text, etc.). The fix for this is to either add a null check or make the content required within Wordpress.

## Appendix: wake-cp.sh

```bash
#!/bin/bash

echo "waking cp-com-3 dev/test/live"
/home/swash/terminus/vendor/bin/terminus env:wake cp-com-3.dev
/home/swash/terminus/vendor/bin/terminus env:wake cp-com-3.test
/home/swash/terminus/vendor/bin/terminus env:wake cp-com-3.live
```
