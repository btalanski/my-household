# My Household

My Household allows users to setup a family group and share a shopping list and to do list with all the family members.

This is a sample project to try out Next.js + Pocketbase as backend.

## Running the app locally

### With docker
Requires Docker installed in your env. This will build/run both Pocketbase and NextJS for easy development. A SMTP container is user to handle Pocketbase's email sending functionality. 

```bash
docker compose up -d
```

### Running locally without docker
- You can run the NextJs app as you would run any Next application. Make sure you have NodeJs installed in  your system.
- You need to install the modules and build the Go application in order to execute Pocketbase or you can grab the executable for you OS in Pocketbase's website
