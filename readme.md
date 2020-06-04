# atom-feed-cms
zero dependency nodejs cms for creating, managing and hosting multiple atom feeds

## Installation

fork or clone the repo

```bash
git clone https://github.com/angeal185/atom-feed-cms.git
```
no dependencies to install.

## Git repo hosting setup (optional)

fork [atom-feed-cms](https://github.com/angeal185/atom-feed-cms) or create a new github/gitlab/... repo  and push or upload a copy of [atom-feed-cms](https://github.com/angeal185/atom-feed-cms)

Enable github pages or equivalent  for the repo in order to live host your feed/s via your repo.

on github, this can be done by navigating to the repo's settings and under the github pages settings, select master-branch.

you can now navigate your browser to the example atom feed.xml at:
[https://{{your-username}}.github.io/{{your-repo-name}}/atom/example_feed.xml](https://angeal185.github.io/atom-feed-cms/atom/example_feed.xml)

for example: [https://angeal185.github.io/atom-feed-cms/atom/example_feed.xml](https://angeal185.github.io/atom-feed-cms/atom/example_feed.xml)

for each new feed you add, your url need only replace `example_feed` with the new feed filename

should you wish, you could also serve your feed/s via cdn. be mindful though, that none of these will provide live updates all of the time.

example:
[https://cdn.jsdelivr.net/gh/{{your-username}}/{{your-repo-name}}/atom/{{your-feed-name}}.xml](https://cdn.jsdelivr.net/gh/{{your-username}}/{{your-repo-name}}/atom/{{your-feed-name}}.xml)

## Usage

open a console in the working dir and type
```bash
node index.js
```
or with nodemon

```bash
nodemon
```
navigate your browser to

```bash
https://localhost:8080
```

## paths
```js
/dashboard // list/load/view/delete atom feeds
/feed // create or update atom feeds
/entry // create atom feed entries
/edit // update or delete individual atom feed entries
```

## files
```js
/atom // contains all atom feed xml files
/admin/config/index.json // server config file
/app/modules/config.mjs // app config file
/app/data/feeds // contains all atom feed json files
/app/data/feed_list.json // contains a list of all atom feeds
```
## note
* all atom feeds should have unique names and id's.
* atom feed files are snake_cased from the feed title.
* all atom feed entries should have unique id's.
* all deletes/updates to a feed/entry are final.
* the default feed entry limit is 50 this can be changed in the app config `max_entries`


If you are unfamiliar with the Atom Syndication Format the following link will be of use to you:
[https://validator.w3.org/feed/docs/rfc4287.html](https://validator.w3.org/feed/docs/rfc4287.html)
