# Easybackup

<p>Easybackup, backups your databases to your s3 cloud easy to use and supports multiple users</p>

- Easily backup your databases to your favoruite s3 cloud
- Simple and user friendly UI
- Automatic backups each 12 hours (cronjob)

## Showcase

<img src="https://cdn.fristroop.com/easybackup.gif">

- Live preview https://easybackup.fristroop.com

## Supported Databases

- MongoDB

## Contributing

If you want support for any other backup, you can pr your `{dbType}Manager | MongoManager` to github!
Please see [backupManager](https://github.com/AydinTheFirst/easybackup/blob/main/server/src/helpers/backupManager.ts)

### What does this project use?

Frontend

- React
- Tailwind
- Flowbite
- Axios

Backend

- ExpressJS for API routing
- MongoDB
- Passport Bearer Tokens
- @aws-sdk/client-s3
- node-cron

### TODO

- Manage user profiles
- Admin priviliges
- Custom cron job
- custom SMTP server
- Webhooks

## Links

- Discord https://discord.gg/9PK29X4tKE
- Github https://github.com/AydinTheFirst/easybackup
