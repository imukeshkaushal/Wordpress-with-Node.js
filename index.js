const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());

const WORDPRESS_REGISTER_ENDPOINT = process.env.WORDPRESS_REGISTER_ENDPOINT;
const WORDPRESS_LOGIN_ENDPOINT = process.env.WORDPRESS_LOGIN_ENDPOINT;
const WORDPRESS_ADMIN_USERNAME = process.env.WORDPRESS_ADMIN_USERNAME;
const WORDPRESS_ADMIN_PASSWORD = process.env.WORDPRESS_ADMIN_PASSWORD;

app.get("/", (req, res) => {
  res.send({ msg: "Home Page" });
});

// Register User
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const authResponse = await axios.post(WORDPRESS_LOGIN_ENDPOINT, {
      username: WORDPRESS_ADMIN_USERNAME,
      password: WORDPRESS_ADMIN_PASSWORD,
    });

    const authToken = authResponse.data.token;

    const response = await axios.post(
      WORDPRESS_REGISTER_ENDPOINT,
      { username, email, password },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    res.send({ message: "User registered successfully", data: response.data });
  } catch (error) {
    console.error("Error registering user:", error.response.data);
    res.send({message : "User Registration Failed", error : error.response.data});
  }
});

// Login User
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const authResponse = await axios.post(WORDPRESS_LOGIN_ENDPOINT, {
      username,
      password,
    });

    const authToken = authResponse.data.token;
    const userdata = authResponse.data;
    res.send({data : userdata});
    
  } catch (error) {
    console.error("Error logging in:", error.response.data);
    res.send({message: "Login failed", error: error.response.data});
  }
});



app.listen(4500, () => {
  console.log("Server is Running on Port 4500");
});
