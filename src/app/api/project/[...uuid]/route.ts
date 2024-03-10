import { getServerSession } from "next-auth/next";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import getUuid from "uuid-by-string";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { authOptions } from "fugue-state-ui/constants/authOptions";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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
// If the user is logged in and a project exists upload the body of the request to an s3 bucket
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session && session.user && session.user.email) {
    let user_uuid = getUuid(session.user.email, 5);
    const request_url_split = request.url.split("/");
    let proj_uuid = request_url_split[request_url_split.length - 1];
    let Body = await request.arrayBuffer();
    console.log("getting repsonse");
    let get_response = await client.send(
      new GetObjectCommand({
        Bucket,
        Key: user_uuid + "/metadata_" + proj_uuid,
      })
    );
    if (get_response.$metadata.httpStatusCode == 200) {
      let response = await client.send(
        new PutObjectCommand({
          Bucket,
          Key: user_uuid + "/" + proj_uuid,
          Body: Body,
          ContentLength: Body.byteLength,
        })
      );
      return NextResponse.json(response);
    } else {
      return NextResponse.json(null, { status: 404, statusText: "No Project" });
    }
  } else {
    return NextResponse.json(null, { status: 401, statusText: "No Session" });
  }
}
