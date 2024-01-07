# User Controller

## Overview

This user controller handles user-related functionalities such as registration, login, logout, token generation, and profile updates.

## File Structure

- **user.controller.js**: Main file containing user-related controller functions.
- **utils/ApiError.js**: Utility class for creating custom API errors.
- **utils/ApiResponse.js**: Utility class for creating standardized API responses.
- **utils/asyncHandler.js**: Utility function for handling asynchronous functions.
- **utils/cloudinary.js**: Utility functions for handling Cloudinary uploads.
- **models/user.model.js**: User model definition.

## Controller Functions

1. **registerUser**
   - Handles user registration.
   - Validates input fields.
   - Checks for existing users.
   - Uploads avatar and cover image to Cloudinary.
   - Creates a new user in the database.

2. **loginUser**
   - Handles user login.
   - Validates username/email and password.
   - Generates access and refresh tokens.
   - Sets cookies for tokens.

3. **logoutUser**
   - Handles user logout.
   - Clears user's refresh token.

4. **refreshAccessToken**
   - Handles token refresh.
   - Verifies the incoming refresh token.
   - Generates new access and refresh tokens.

5. **changeCurrentPassword**
   - Handles changing the user's password.
   - Verifies the old password and updates it.

6. **getCurrentUser**
   - Retrieves the current logged-in user.

7. **updateAccountDetails**
   - Handles updating user account details (fullname, email).

8. **updateUserAvtar**
   - Handles updating the user's avatar.
   - Uploads the new avatar to Cloudinary.

9. **updateUseCoverImage**
   - Handles updating the user's cover image.
   - Uploads the new cover image to Cloudinary.

10. **getUserChannelProfile**
    - Retrieves a user's channel profile.
    - Includes subscriber count, subscribed channels count, and subscription status.

11. **getWatchHistory**
    - Retrieves the user's watch history.
    - Includes details about watched videos.

## Dependencies

- Express
- Mongoose
- JWT
- Cloudinary

## Usage

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Configure environment variables.
4. Run the application using `npm start`.


## Project Structure

- **src/controllers**: Contains controllers handling various aspects of the application.
- **src/models**: Defines MongoDB models for data storage.
- **src/utils**: Includes utility functions for common tasks.
- **src/server.js**: Entry point for the server.
- **.env**: Configuration file for environment variables.


# User Schema and Methods

## Overview

This Mongoose model defines the schema for the "User" collection in MongoDB. It includes user-related fields such as username, email, fullname, avatar, cover image, watch history, password, and refresh token. Additionally, it implements pre-save middleware for password hashing and methods for password validation, access token generation, and refresh token generation.

## Schema

- **username**: String, required, unique, lowercase, trimmed, and indexed.
- **email**: String, required, unique, lowercase, and trimmed.
- **fullname**: String, required, and trimmed.
- **avatar**: String, representing the Cloudinary URL for the user's avatar.
- **coverImage**: String, representing the Cloudinary URL for the user's cover image.
- **watchHistory**: Array of ObjectIds referencing the "Video" collection.
- **password**: String, required, using bcrypt for hashing.
- **refreshToken**: String, representing the refresh token.

## Middleware

### Password Hashing Middleware (pre-save)

Before saving the user document, this middleware hashes the password using bcrypt.

```javascript
userSchema.pre("save", async function (next) {
    // Hash password only if it's modified
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
```



###   Password Validation Method

```javascript
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

```

###   Access Token Generation Method


```javascript
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};


```


###   Refresh Token Generation Method

```javascript
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
        }
    );
};



```