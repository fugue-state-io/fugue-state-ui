import { getServerSession } from "next-auth/next";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import getUuid from "uuid-by-string";
import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
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

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const request_url_split = request.url.split("/");
  if (session && session.user && session.user.email) {
    let user_uuid = getUuid(session.user.email, 5);
    let response = await client.send(
      new GetObjectCommand({
        Bucket,
        Key:
          user_uuid +
          "/metadata_" +
          request_url_split[request_url_split.length - 1],
      })
    );
    let meta = JSON.parse(await response.Body.transformToString());
    console.log(meta);
    return NextResponse.json(meta);
  } else {
    return NextResponse.json(null, { status: 401, statusText: "No Session" });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const request_url_split = request.url.split("/");
  if (session && session.user && session.user.email) {
    let user_uuid = getUuid(session.user.email, 5);
    let response = await client.send(
      new GetObjectCommand({
        Bucket,
        Key:
          user_uuid +
          "/metadata_" +
          request_url_split[request_url_split.length - 1],
      })
    );

    let meta = JSON.parse(await response.Body.transformToString());
    let new_meta = JSON.parse(await request.text());
    if (new_meta.name) {
      meta.name = new_meta.name
    }
    await client.send(
      new PutObjectCommand({
        Bucket,
        Key:
          user_uuid +
          "/metadata_" +
          request_url_split[request_url_split.length - 1],
        Body: JSON.stringify(meta),
        ContentLength: JSON.stringify(meta).length,
      })
    );
    return NextResponse.json(new_meta);
  } else {
    return NextResponse.json(null, { status: 401, statusText: "No Session" });
  }
}
