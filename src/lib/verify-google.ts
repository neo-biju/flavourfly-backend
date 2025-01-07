import axios from "axios";

import ApiError from "@/utils/api-error";
import env from "@/config/env";

type GoogleUserData = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  hd?: string;
};

export const verifyGoogleLogin = async (accessToken: string) => {
  try {
    // Verify access token
    const tokenInfoResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );

    if (tokenInfoResponse.data.audience !== env.GOOGLE_CLIENT_ID)
      throw new ApiError("Invalid token audience.");

    // Get user info
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return userInfoResponse.data as GoogleUserData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(error.response?.data?.error || "Google login error");
    } else {
      throw new ApiError("Google login error. Unable to verify token");
    }
  }
};
