import { getServerSession } from "next-auth/next";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import getUuid from "uuid-by-string";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { authOptions } from "fugue-state-ui/constants/authOptions";

const Bucket = process.env.FUGUE_STATE_BUCKET;
const client = new S3Client({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: "https://nyc3.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.FUGUE_STATE_CDN_ACCESS_ID,
    secretAccessKey: process.env.FUGUE_STATE_CDN_SECRET_KEY,
  },
});

// return all project ids for user
export async function GET(request: NextRequest) {
  const request_url_split = request.url.split("/");
  const session = await getServerSession(authOptions);
  if (session && session.user && session.user.email) {
    let user_uuid = getUuid(session.user.email, 5);
    const url = await getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: Bucket,
        Key: user_uuid + "/" + request_url_split[request_url_split.length - 1],
      }),
      { expiresIn: 259200 }
    );
    return NextResponse.json({ media: url });
  } else {
    return NextResponse.json(null, { status: 401, statusText: "No Session" });
  }
}
