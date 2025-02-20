import { Client, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://localhost:3000/v1")
  .setProject("67b0399f00378d56f443");

const storage = new Storage(client);

export { storage };
